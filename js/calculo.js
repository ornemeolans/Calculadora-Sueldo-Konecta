/*
 * Lógica de cálculo del recibo — sin DOM.
 * Funciona en el navegador (window.Calculo) y en Node (require) para los tests.
 *
 * Criterios verificados contra recibos reales de Konecta (abril, junio, julio,
 * agosto y septiembre 2026). Ver tests/recibos.test.js.
 */
(function (root) {
    'use strict';

    const PCT = {
        PUNTUALIDAD: 0.005,
        PRESENTISMO: 0.10,
        PRESENTISMO_FALTA_JUSTIFICADA: 0.06,
        ANTIGUEDAD_POR_ANIO: 0.01,
        ADICIONAL_NOCTURNO: 0.1311,
        EXTRA_50: 1.5,
        EXTRA_100: 2,
        FACTOR_NOCTURNO: 1.1333, // hora nocturna = 1h 8min (17/15), Konecta lo redondea a 4 decimales
        SEMANAS_POR_MES: 4.3,
        DIVISOR_VACACIONES: 25,
        SIJP: 0.11,
        INSSJP: 0.03,
        OBRA_SOCIAL: 0.03,
        OBRA_SOCIAL_GEA: 0.013,
        CTT_FALLECIMIENTO: 0.005,
        CCT_688: 0.015
    };

    // Konecta liquida cada línea redondeada a centavos y suma las líneas redondeadas.
    const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
    const suma = lista => r2(lista.reduce((s, x) => s + x, 0));

    function horasMes(contrato) {
        return (parseInt(contrato, 10) || 36) * PCT.SEMANAS_POR_MES;
    }

    // Base del CCT 688/14 según el mes:
    //   'remNR'      hasta abril 2026: remunerativo + no remunerativo
    //   'basico'     mayo-junio 2026: solo el básico de escala (mayo sin verificar)
    //   'conformado' desde julio 2026: básico + antigüedad + puntualidad/presentismo
    function regimenCCT688(escalas, mes) {
        const meses = Object.keys(escalas);
        const i = meses.indexOf(mes);
        if (i >= meses.indexOf('JULIO 2026')) return 'conformado';
        if (i >= meses.indexOf('MAYO 2026')) return 'basico';
        return 'remNR';
    }

    // Promedio mensual ($) de las variables de los 6 meses anteriores (LCT art.155 inc. c).
    // Recibe CANTIDADES sumadas de los 6 meses y las valoriza con el básico promedio de esos meses.
    function promedioVariables(escalas, mes, contrato, t) {
        const meses = Object.keys(escalas);
        const i = meses.indexOf(mes);
        const previos = meses.slice(Math.max(0, i - 6), i).filter(m => escalas[m][contrato]);
        const basicoProm = previos.length
            ? previos.reduce((s, m) => s + escalas[m][contrato].basico, 0) / previos.length
            : escalas[mes][contrato].basico;
        const valorHora = basicoProm / horasMes(contrato);
        const total = basicoProm / 30 * (t.feriados || 0)
            + valorHora * PCT.ADICIONAL_NOCTURNO * (t.nocturnas || 0)
            + valorHora * PCT.EXTRA_50 * (t.extras50 || 0)
            + valorHora * PCT.EXTRA_100 * (t.extras100 || 0)
            + valorHora * PCT.EXTRA_100 * PCT.FACTOR_NOCTURNO * (t.extras100noct || 0);
        return total / 6;
    }

    // Adicionales de un acuerdo No Remunerativo:
    //  antigüedad % · horas extras con valor hora del acuerdo · vacaciones = acuerdo × días / 150
    //  (diferencia 1/25 − 1/30 por día) · puntualidad sobre todo lo anterior · presentismo sobre lo anterior + puntualidad
    function acuerdoNR(monto, p) {
        if (!monto) return null;
        const vh = monto / p.horasMes;
        const l = {
            monto,
            antiguedad: r2(monto * p.pctAntiguedad),
            feriado: r2(monto / 30 * p.feriados),
            extras50: r2(vh * PCT.EXTRA_50 * p.extras50),
            extras100: r2(vh * PCT.EXTRA_100 * p.extras100),
            extras100noct: r2(vh * PCT.EXTRA_100 * PCT.FACTOR_NOCTURNO * p.extras100noct),
            vacaciones: r2(monto * p.diasVacaciones / 150)
        };
        const base = suma([l.monto, l.antiguedad, l.feriado, l.extras50, l.extras100, l.extras100noct, l.vacaciones]);
        l.puntualidad = r2(base * p.pctPuntualidad);
        l.presentismo = r2((base + l.puntualidad) * p.pctPresentismo);
        l.total = suma([base, l.puntualidad, l.presentismo]);
        return l;
    }

    /**
     * entrada = {
     *   mes, contrato, antiguedad, obraSocial: 'GEA'|'OTRA',
     *   faltas: bool, faltasJustificadas: bool, diasFalta, llegadasTarde: bool,
     *   feriados, nocturnas, extras50, extras100, extras100noct,
     *   diasVacaciones, variables6m: {feriados, nocturnas, extras50, extras100, extras100noct},
     *   promedioVariables (opcional, $: reemplaza a variables6m — usado en tests)
     * }
     */
    function calcular(escalas, e) {
        const data = escalas[e.mes][e.contrato];
        const basico = data.basico;
        const acuerdoRem = data.acuerdoRem || 0;
        const hm = horasMes(e.contrato);
        const valorHora = basico / hm;

        const diasFalta = e.faltas ? (e.diasFalta || 0) : 0;
        const diasVac = e.diasVacaciones || 0;
        const pctAntiguedad = (e.antiguedad || 0) * PCT.ANTIGUEDAD_POR_ANIO;
        const pctPuntualidad = e.llegadasTarde ? 0 : PCT.PUNTUALIDAD;
        const pctPresentismo = !e.faltas ? PCT.PRESENTISMO
            : (e.faltasJustificadas ? PCT.PRESENTISMO_FALTA_JUSTIFICADA : 0);

        // ── Remunerativo ────────────────────────────────────────────────
        const h = {
            sueldo: r2(basico / 30 * (30 - diasFalta - diasVac)),
            licencia: (e.faltas && e.faltasJustificadas) ? r2(basico / 30 * diasFalta) : 0,
            feriado: r2(basico / 30 * (e.feriados || 0)),
            antiguedad: r2(basico * pctAntiguedad),
            nocturnas: r2(valorHora * PCT.ADICIONAL_NOCTURNO * (e.nocturnas || 0)),
            extras50: r2(valorHora * PCT.EXTRA_50 * (e.extras50 || 0)),
            extras100: r2(valorHora * PCT.EXTRA_100 * (e.extras100 || 0)),
            extras100noct: r2(valorHora * PCT.EXTRA_100 * PCT.FACTOR_NOCTURNO * (e.extras100noct || 0))
        };

        // Vacaciones (LCT art.155): valor día = (básico + antigüedad + promedio de variables
        // de los 6 meses anteriores, con puntualidad y presentismo) / 25
        const promVar = diasVac
            ? (e.promedioVariables != null ? e.promedioVariables : promedioVariables(escalas, e.mes, e.contrato, e.variables6m || {}))
            : 0;
        const baseVac = basico + basico * pctAntiguedad + promVar;
        const puntVac = baseVac * PCT.PUNTUALIDAD;
        const presVac = (baseVac + puntVac) * PCT.PRESENTISMO;
        const acuerdoRemVac = acuerdoRem * (1 + pctAntiguedad + PCT.PUNTUALIDAD + PCT.PRESENTISMO);
        h.vacaciones = r2((baseVac + puntVac + presVac + acuerdoRemVac) / PCT.DIVISOR_VACACIONES * diasVac);

        // Puntualidad: sobre lo devengado + vacaciones. Presentismo: sobre lo devengado + puntualidad (sin vacaciones).
        const baseAdicionales = suma([h.sueldo, h.feriado, h.antiguedad, h.nocturnas, h.extras50, h.extras100, h.extras100noct]);
        h.puntualidad = r2((baseAdicionales + h.vacaciones) * pctPuntualidad);
        h.presentismo = r2((baseAdicionales + h.puntualidad) * pctPresentismo);

        // Acuerdo remunerativo junio 2025 (solo meses de 2025)
        h.acuerdoRem = acuerdoRem;
        h.acuerdoRemPresentismo = r2(acuerdoRem * pctPresentismo);
        h.acuerdoRemAntiguedad = r2(acuerdoRem * pctAntiguedad);
        h.acuerdoRemPuntualidad = r2(acuerdoRem * pctPuntualidad);
        h.acuerdoRemFeriado = r2(acuerdoRem / 30 * (e.feriados || 0));

        const totalRem = suma(Object.values(h));

        // ── No remunerativo ─────────────────────────────────────────────
        const p = {
            horasMes: hm, pctAntiguedad, pctPuntualidad, pctPresentismo,
            feriados: e.feriados || 0, diasVacaciones: diasVac,
            extras50: e.extras50 || 0, extras100: e.extras100 || 0, extras100noct: e.extras100noct || 0
        };
        const nr = {
            jul2025: acuerdoNR(data.acuerdoNoRem || 0, p),
            dic2025: acuerdoNR(data.acuerdoNoRemDic || 0, p),
            abr2026: acuerdoNR(data.acuerdoNoRemAbr || 0, p),
            cuota1: data.sumaunicavezCuota1 || 0,
            cuota2: data.sumaunicavezCuota2 || 0
        };
        const totalNR = suma([
            nr.jul2025 ? nr.jul2025.total : 0, nr.dic2025 ? nr.dic2025.total : 0,
            nr.abr2026 ? nr.abr2026.total : 0, nr.cuota1, nr.cuota2
        ]);

        // ── Descuentos ──────────────────────────────────────────────────
        // Base 688 "conformado": remunerativo sin variables (feriados, nocturnas, extras) ni la
        // puntualidad/presentismo que generan.
        const variables = h.feriado + h.acuerdoRemFeriado + h.nocturnas + h.extras50 + h.extras100 + h.extras100noct;
        const base688Conformado = totalRem - variables * (1 + pctPuntualidad) * (1 + pctPresentismo);
        const regimen688 = regimenCCT688(escalas, e.mes);
        const base688 = regimen688 === 'conformado' ? base688Conformado
            : regimen688 === 'basico' ? basico
            : totalRem + totalNR;

        const d = {
            sijp: r2(totalRem * PCT.SIJP),
            inssjp: r2(totalRem * PCT.INSSJP),
            obraSocial: r2(totalRem * PCT.OBRA_SOCIAL),
            cttFallecimiento: r2(basico * PCT.CTT_FALLECIMIENTO),
            cct688: r2(base688 * PCT.CCT_688),
            obraSocialGEA: e.obraSocial === 'GEA' ? r2(totalRem * PCT.OBRA_SOCIAL_GEA) : 0
        };
        const totalDesc = suma(Object.values(d));

        return {
            entrada: e,
            basico,
            haberes: h,
            noRemunerativo: nr,
            descuentos: d,
            totales: {
                haberes: totalRem,
                noRemunerativo: totalNR,
                descuentos: totalDesc,
                neto: r2(totalRem + totalNR - totalDesc)
            }
        };
    }

    const api = { PCT, calcular, promedioVariables, regimenCCT688, r2 };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.Calculo = api;
})(typeof window !== 'undefined' ? window : globalThis);
