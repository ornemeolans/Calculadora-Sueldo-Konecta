let ESCALAS_SALARIALES = null;
const miformulario = document.getElementById('formulario_sueldo');
const calcularBtn = document.getElementById('calcular');

// Deshabilitar el botón hasta que carguen los datos
calcularBtn.disabled = true;

async function cargarEscalas() {
    try {
        // no-cache: siempre revalida con el servidor, así los cambios de escalas se ven al instante
        const response = await fetch(`escalas.json?t=${Date.now()}`, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        ESCALAS_SALARIALES = await response.json();
        inicializarVisibilidad();
        calcularBtn.disabled = false;
    } catch (error) {
        console.error('❌ Error cargando escalas:', error);
        alert(`Error al cargar datos: ${error.message}. Revisa la consola (F12) y asegúrate de usar un servidor local.`);
        calcularBtn.disabled = false; // habilitar para no bloquear
    }
}

cargarEscalas();

// 2. VALIDACIONES EN TIEMPO REAL
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        if (this.value < 0) this.value = 0;
    });
});

// 3. MODO OSCURO
const btnDark = document.getElementById('toggle-dark-mode');
btnDark.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
});

// 4. FUNCIONES DE CÁLCULO
function remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100, extras100noct, cvacaciones = 0, promVariables = 0) {
    const data = ESCALAS_SALARIALES[mes][contrato];
    const basico_escala = data.basico;
    let acuerdoBaseRem = data.acuerdoRem || 0;

    // Horas mensuales: horas semanales × 4.3 semanas/mes (LCT)
    const horasSemanales = parseInt(contrato) || 36;
    const horasMes = horasSemanales * 4.3;
    const valorHora = basico_escala / horasMes;

    // Básico proporcional (días trabajados = 30 - vacaciones - faltas injustificadas)
    let basico_recibo = (basico_escala / 30) * (30 - cfaltas - cvacaciones);
    let feriados        = basico_escala / 30 * cferiado;
    // Antigüedad: siempre sobre básico escala completo (Art.24 CCT 130/75)
    let antiguedad      = basico_escala * aantiguedad / 100;
    // Adicional hora nocturna ordinaria (0.1311 = 13.11% del valor hora)
    let nocturnasAdicional  = valorHora * 0.1311 * nocturnas;
    // Horas extras: divisor horasMes (horasSemanales × 4.3), factor × 1.5 ó × 2
    let extras50_calc       = valorHora * 1.5  * extras50;
    let extras100_calc      = valorHora * 2    * extras100;
    // Horas extras nocturnas 100%: factor 17/15 sobre la hora diurna (CCT + LCT)
    let extras100noct_calc  = valorHora * 2 * (17 / 15) * extras100noct;

    // Base de cálculo de presentismo y puntualidad:
    // básico proporcional + antigüedad + extras + feriados (SIN vacaciones)
    let base_adicionales = basico_recibo + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc + extras100noct_calc;

    // ── Vacaciones (LCT Art.155 + CCT 130/75) ──────────────────────────────
    // Valor día = remuneración mensual / 25. Remuneración mensual =
    //   básico ESCALA (mes completo) + antigüedad
    //   + promedio de variables (extras, nocturnas, feriados) de los últimos 6 meses (art.155 inc. c)
    //   + puntualidad y presentismo sobre todo lo anterior.
    // Las extras/feriados del mes en curso NO entran: ya se pagan en su propia línea.
    // (Verificado contra recibo Konecta abril 2026: el básico se paga por días
    //  trabajados, la antigüedad se paga completa y además integra el valor día.)
    let base_vac_previa     = basico_escala + antiguedad + promVariables;
    let punt_vac_aprox      = base_vac_previa * 0.005;
    let pres_vac_aprox      = (base_vac_previa + punt_vac_aprox) * 0.10;
    // Base vacaciones = todos los haberes del mes completo
    let base_vacaciones     = base_vac_previa + punt_vac_aprox + pres_vac_aprox + acuerdoBaseRem * (1 + aantiguedad/100 + 0.005 + 0.10);
    let vacaciones_haberes  = (base_vacaciones / 25) * cvacaciones;

    // ── Puntualidad (Art.40 CCT 130/75: 0,5% de la remuneración del mes) ───
    // La remuneración del mes incluye las vacaciones gozadas
    let puntualidad, presentismo, dlicencia, aj2025_PRES, aj2025_ANT, aj2025_PUNT, aj2025_FER;

    if (faltas == 'NO' && tarde == 'NO') {
        // Puntualidad 0.5% sobre base_adicionales + vacaciones (remuneración completa del mes)
        puntualidad  = (base_adicionales + vacaciones_haberes) * 0.005;
        // Presentismo 10% (Art.40: 1/12 remuneración = ~8.33%, pero el CCT usa 10%)
        // Base: base_adicionales + puntualidad (sin vacaciones, que es licencia)
        presentismo  = (base_adicionales + puntualidad) * 0.10;
        dlicencia    = 0;
        aj2025_PRES  = acuerdoBaseRem * 0.10;
        aj2025_ANT   = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT  = acuerdoBaseRem * 0.005;
    } else if (faltas == 'NO' && tarde == 'SI') {
        puntualidad  = 0;
        presentismo  = (base_adicionales) * 0.10;
        dlicencia    = 0;
        aj2025_PRES  = acuerdoBaseRem * 0.10;
        aj2025_ANT   = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT  = 0;
    } else if (faltas == 'SI' && justificadas == 'SI') {
        // Con faltas justificadas: presentismo reducido al 60% (6/10)
        puntualidad  = (tarde == 'NO') ? (base_adicionales + vacaciones_haberes) * 0.005 : 0;
        presentismo  = (base_adicionales + puntualidad) * 0.06;
        dlicencia    = (basico_escala / 30) * cfaltas;
        aj2025_PRES  = acuerdoBaseRem * 0.06;
        aj2025_ANT   = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT  = (puntualidad > 0) ? acuerdoBaseRem * 0.005 : 0;
    } else {
        // Faltas injustificadas: pierde presentismo
        puntualidad  = (tarde == 'NO') ? (base_adicionales + vacaciones_haberes) * 0.005 : 0;
        presentismo  = 0;
        dlicencia    = 0;
        aj2025_PRES  = 0;
        aj2025_ANT   = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT  = (puntualidad > 0) ? acuerdoBaseRem * 0.005 : 0;
    }
    aj2025_FER = acuerdoBaseRem / 30 * cferiado;

    let total_rem = base_adicionales + vacaciones_haberes + puntualidad + presentismo + dlicencia + acuerdoBaseRem + aj2025_PRES + aj2025_ANT + aj2025_PUNT + aj2025_FER;

    // Base CCT 688/14 desde julio 2026 (verificado recibos jul/ago/sep 2026):
    // básico + antigüedad + su puntualidad y presentismo. Se excluyen las variables
    // (feriados, nocturnas, horas extras) junto con la puntualidad/presentismo que generan.
    const pctPunt = (puntualidad > 0) ? 0.005 : 0;
    const pctPres = (base_adicionales + puntualidad) > 0 ? presentismo / (base_adicionales + puntualidad) : 0;
    const variables = feriados + aj2025_FER + nocturnasAdicional + extras50_calc + extras100_calc + extras100noct_calc;
    const base688 = total_rem - variables * (1 + pctPunt) * (1 + pctPres);

    return [basico_recibo, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, extras50_calc, extras100_calc, acuerdoBaseRem, aj2025_PRES, aj2025_ANT, aj2025_PUNT, aj2025_FER, vacaciones_haberes, total_rem, extras100noct_calc, base688];
}

// Promedio mensual ($) de las variables de los 6 meses anteriores, para el valor día de vacaciones
// (LCT art.155 inc. c). El usuario carga CANTIDADES sumadas de los 6 meses; se valorizan con el
// básico promedio de esos meses según escalas.json (o el del mes actual si no hay meses previos).
function promedioVariables(mes, contrato, t) {
    const meses = Object.keys(ESCALAS_SALARIALES);
    const i = meses.indexOf(mes);
    const previos = meses.slice(Math.max(0, i - 6), i).filter(m => ESCALAS_SALARIALES[m][contrato]);
    const basicoProm = previos.length
        ? previos.reduce((s, m) => s + ESCALAS_SALARIALES[m][contrato].basico, 0) / previos.length
        : ESCALAS_SALARIALES[mes][contrato].basico;
    const valorHora = basicoProm / ((parseInt(contrato) || 36) * 4.3);
    const total = basicoProm / 30 * t.feriados
                + valorHora * 0.1311 * t.nocturnas
                + valorHora * 1.5 * t.extras50
                + valorHora * 2 * t.extras100
                + valorHora * 2 * (17 / 15) * t.extras100noct;
    return total / 6;
}

// Adicionales de un acuerdo No Remunerativo (criterio verificado con recibo Konecta abril 2026):
//  - Antigüedad: % sobre el acuerdo
//  - Horas extras: acuerdo / (horas semanales × 4.3) × factor × horas
//  - Vacaciones: acuerdo × días / 150  (= diferencia 1/25 − 1/30 por día, porque el acuerdo se paga entero)
//  - Puntualidad 0,5% sobre acuerdo + antigüedad + extras + feriado + vacaciones
//  - Presentismo sobre lo anterior + puntualidad
function adicionalesNR(monto, p) {
    const valorHoraNR = monto / p.horasMes;
    const ant   = monto * p.aantiguedad / 100;
    const fer   = monto / 30 * p.cferiado;
    const ex50  = valorHoraNR * 1.5 * p.extras50;
    const ex100 = valorHoraNR * 2 * p.extras100;
    const exN   = valorHoraNR * 2 * (17 / 15) * p.extras100noct;
    const vac   = monto * p.cvacaciones / 150;
    const baseP = monto + ant + fer + ex50 + ex100 + exN + vac;
    const punt  = baseP * p.percPunt;
    const pres  = (baseP + punt) * p.percPres;
    return { monto, ant, fer, ex50, ex100, exN, vac, punt, pres, total: baseP + punt + pres };
}

function no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad, cvacaciones = 0, extras50 = 0, extras100 = 0, extras100noct = 0) {
    const data = ESCALAS_SALARIALES[mes][contrato];
    const p = {
        horasMes: (parseInt(contrato) || 36) * 4.3,
        percPres: (faltas == 'NO') ? 0.10 : (justificadas == 'SI' ? 0.06 : 0),
        percPunt: (tarde == 'NO') ? 0.005 : 0,
        aantiguedad, cferiado, cvacaciones, extras50, extras100, extras100noct
    };

    const jul = adicionalesNR(data.acuerdoNoRem    || 0, p); // Acuerdo Julio/Agosto 2025
    const dic = adicionalesNR(data.acuerdoNoRemDic || 0, p); // Acuerdo Diciembre 2025
    const abr = adicionalesNR(data.acuerdoNoRemAbr || 0, p); // Acuerdo Abril 2026
    const cuota1 = data.sumaunicavezCuota1 || 0;
    const cuota2 = data.sumaunicavezCuota2 || 0;

    return { jul, dic, abr, cuota1, cuota2, total: jul.total + dic.total + abr.total + cuota1 + cuota2 };
}

// Base del CCT 688/14 según el mes (verificado con recibos Konecta 2026):
//   'remNR'      hasta abril 2026: total remunerativo + no remunerativo (recibo abril)
//   'basico'     mayo-junio 2026: solo el básico de escala (recibo junio; mayo sin verificar)
//   'conformado' desde julio 2026: básico + antigüedad + punt./pres. (recibos jul/ago/sep)
function regimenCCT688(mes) {
    const meses = Object.keys(ESCALAS_SALARIALES);
    const i = meses.indexOf(mes);
    if (i >= meses.indexOf('JULIO 2026')) return 'conformado';
    if (i >= meses.indexOf('MAYO 2026')) return 'basico';
    return 'remNR';
}

function descuentos(trem, tnrem, obrasocial, basicoEscala, regimen688) {
    const t_rem = trem[15], t_nr = tnrem.total;
    // CTT S. Fallecimiento: 0,5% del básico de escala (verificado recibos jun/jul/ago/sep 2026)
    const base688 = regimen688 === 'conformado' ? trem[17]
                  : regimen688 === 'basico'     ? basicoEscala
                  : t_rem + t_nr;
    let s = t_rem * 0.11, i = t_rem * 0.03, o = t_rem * 0.03, f = basicoEscala * 0.005, c = base688 * 1.5 / 100, oa = (obrasocial == 'GEA') ? t_rem * 1.30 / 100 : 0;
    let total_desc = s + i + o + f + c + oa;
    return [s, i, o, f, c, oa, total_desc];
}

// 5. EVENTO CALCULAR Y RENDERIZADO DE TABLA
document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();

    // Verificar que los datos estén cargados
    if (!ESCALAS_SALARIALES) {
        alert("Los datos de escalas aún no se han cargado. Intenta nuevamente.");
        return;
    }

    const mes = document.getElementById('mes').value.trim();
    const contrato = document.getElementById('contrato').value.trim();

    // Validaciones
    if (!mes || mes === "Selecciona el Mes") {
        alert("Por favor, selecciona un mes válido.");
        return;
    }
    if (!contrato || contrato === "Contrato de Trabajo") {
        alert("Por favor, selecciona un contrato válido.");
        return;
    }

    // Verificar que el mes y contrato existan en el JSON
    if (!ESCALAS_SALARIALES[mes]) {
        alert(`El mes "${mes}" no está disponible en las escalas.`);
        return;
    }
    if (!ESCALAS_SALARIALES[mes][contrato]) {
        alert(`El contrato "${contrato}" no existe para el mes "${mes}".`);
        return;
    }

    // Obtener otros valores
    const faltas = document.getElementById('faltas').value;
    const tarde = document.getElementById('tarde').value;
    const obrasocial = document.getElementById('obrasocial').value;
    const conVacaciones = document.getElementById('vacaciones_check').checked;
    const cvac = conVacaciones ? parseInt(document.getElementById('cvacaciones').value) || 0 : 0;
    const num = id => parseFloat(document.getElementById(id).value) || 0;
    const promVar = conVacaciones ? promedioVariables(mes, contrato, {
        feriados: num('v6_feriados'), nocturnas: num('v6_nocturnas'),
        extras50: num('v6_extras50'), extras100: num('v6_extras100'), extras100noct: num('v6_extras100noct')
    }) : 0;
    const cf = (faltas === 'SI') ? parseInt(document.getElementById('cfaltas').value) || 0 : 0;

    if (cvac + cf > 30) {
        alert("Los días de vacaciones más los días de falta no pueden superar 30.");
        return;
    }
    const jus = (faltas === 'SI') ? document.getElementById('justificadas').value : 'NO';

    const feriados = parseInt(document.getElementById('feriados').value) || 0;
    const nocturnas = parseInt(document.getElementById('nocturnas').value) || 0;
    const antiguedad = parseInt(document.getElementById('antiguedad').value) || 0;
    const extras50 = parseInt(document.getElementById('extras50').value) || 0;
    const extras100 = parseInt(document.getElementById('extras100').value) || 0;
    const extras100noct = parseInt(document.getElementById('extras100noct').value) || 0;

    // Cálculos
    const trem = remunerativo(mes, contrato, tarde, faltas, jus, cf, feriados, nocturnas, antiguedad, extras50, extras100, extras100noct, cvac, promVar);
    const tnr = no_remunerativo(mes, contrato, tarde, faltas, jus, feriados, antiguedad, cvac, extras50, extras100, extras100noct);
    const td = descuentos(trem, tnr, obrasocial, ESCALAS_SALARIALES[mes][contrato].basico, regimenCCT688(mes));
    const tsueldo = (trem[15] + tnr.total - td[6]).toFixed(2);

    const lineasNR = (nombre, a) => [
        { name: nombre, no_remunerativo: a.monto },
        { name: `${nombre} PRESENTISMO`, no_remunerativo: a.pres },
        { name: `${nombre} ANTIGUEDAD`, no_remunerativo: a.ant },
        { name: `${nombre} PUNTUALIDAD`, no_remunerativo: a.punt },
        { name: `${nombre} FERIADO`, no_remunerativo: a.fer },
        { name: `${nombre} HS. EXTRAS 50%`, no_remunerativo: a.ex50 },
        { name: `${nombre} HS. EXTRAS 100%`, no_remunerativo: a.ex100 },
        { name: `${nombre} HS. EXTRAS NOCT. 100%`, no_remunerativo: a.exN },
        { name: `${nombre} VACACIONES`, no_remunerativo: a.vac }
    ];

    // Renderizar resultados (igual que antes)
    const main = document.querySelector('main');
    document.querySelectorAll('table, .table-responsive-wrapper, p.mes-titulo, #resultado-container').forEach(el => el.remove());

    const titulo = document.createElement("p");
    titulo.className = "mes-titulo";
    titulo.innerHTML = `<h3>${mes}</h3>`;
    main.append(titulo);

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive-wrapper";

    const tab = document.createElement('table');
    tab.className = 'table table-bordered';
    tab.innerHTML = `<thead><tr><th>Conceptos</th><th>Haberes</th><th>No Remunerativo</th><th>Descuentos</th></tr></thead>`;
    const b = document.createElement('tbody');

    const lineItems = [
        { name: "BASICO", haberes: trem[0] },
        { name: "VACACIONES GOZADAS", haberes: trem[14] },
        { name: "FERIADO", haberes: trem[1] },
        { name: "PRESENTISMO", haberes: trem[2] },
        { name: "ANTIGUEDAD", haberes: trem[3] },
        { name: "PUNTUALIDAD", haberes: trem[4] },
        { name: "DIAS DE LICENCIA", haberes: trem[5] },
        { name: "ADICIONAL HORA NOCTURNA", haberes: trem[6] },
        { name: "HORAS EXTRAS 50%", haberes: trem[7] },
        { name: "HORAS EXTRAS 100%", haberes: trem[8] },
        { name: "HS. EXTRAS NOCTURNAS 100%", haberes: trem[16] },
        { name: "ACUERDO JUNIO 2025", haberes: trem[9] },
        { name: "ACUERDO JUNIO 2025 PRESENTISMO", haberes: trem[10] },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD", haberes: trem[11] },
        { name: "ACUERDO JUNIO 2025 PUNTUALIDAD", haberes: trem[12] },
        { name: "ACUERDO JUNIO 2025 FERIADO", haberes: trem[13] },
        // Acuerdos No Remunerativos
        ...lineasNR("ACUERDO JULIO 2025", tnr.jul),
        ...lineasNR("ACUERDO DICIEMBRE 2025", tnr.dic),
        ...lineasNR("ACUERDO ABRIL 2026", tnr.abr),
        // Sumas únicas
        { name: "ACUERDO SUMA ÚNICA CUOTA 1", no_remunerativo: tnr.cuota1 },
        { name: "ACUERDO SUMA ÚNICA CUOTA 2", no_remunerativo: tnr.cuota2 },
        // Descuentos
        { name: "APORTE SIJP SOBRE SUELDO", descuentos: td[0] },
        { name: "APORTE INSSJP SOBRE SUELDO", descuentos: td[1] },
        { name: "APORTE O. SOC SOBRE SUELDO", descuentos: td[2] },
        { name: "CTT S FALLECIMIENTO", descuentos: td[3] },
        { name: "CTT 688/14", descuentos: td[4] },
        { name: "APORTE O. SOCIAL ACUERDO", descuentos: td[5] }
    ];

    lineItems.forEach(i => {
        if ((i.haberes || 0) + (i.no_remunerativo || 0) + (i.descuentos || 0) > 0) {
            b.innerHTML += `<tr><td>${i.name}</td><td>${i.haberes ? i.haberes.toFixed(2) : ''}</td><td>${i.no_remunerativo ? i.no_remunerativo.toFixed(2) : ''}</td><td>${i.descuentos ? i.descuentos.toFixed(2) : ''}</td></tr>`;
        }
    });

    b.innerHTML += `<tr style="font-weight:bold;"><td>TOTALES</td><td>${trem[15].toFixed(2)}</td><td>${tnr.total.toFixed(2)}</td><td>${td[6].toFixed(2)}</td></tr>`;
    tab.appendChild(b);
    tableWrapper.appendChild(tab);
    main.appendChild(tableWrapper);

    const res = document.createElement("div");
    res.id = "resultado-container";
    res.innerHTML = `
        <h3>Total a cobrar:</h3>
        <p>$ ${tsueldo}</p>
        <p style="color: #ff0000; font-weight: bold; font-size: 0.9rem; margin-top: 10px;">
            ACLARACIÓN: Esto es un cálculo aproximado, puede haber diferencias con el original.
        </p>
    `;
    main.append(res);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// 6. EXPORTACIÓN (PDF Y WHATSAPP)
document.getElementById('btn-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const tabla = document.querySelector('table');
    const resultado = document.getElementById('resultado-container');
    const mes = document.getElementById('mes').value;

    if (!tabla || !resultado) {
        alert("Primero debes calcular el sueldo.");
        return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(67, 97, 238);
    doc.text("Recibo de Sueldo Estimado", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Liquidación: ${mes}`, 105, 22, { align: "center" });

    doc.autoTable({
        html: 'table',
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [67, 97, 238], textColor: 255, fontSize: 8, halign: 'center' },
        styles: { fontSize: 7.5, cellPadding: 2 },
        columnStyles: { 0: { halign: 'left', cellWidth: 80 }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' } }
    });

    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(240, 244, 255);
    doc.rect(55, finalY, 100, 18, 'FD'); 
    doc.setFontSize(11);
    doc.text("TOTAL NETO A COBRAR:", 105, finalY + 7, { align: "center" });
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(resultado.querySelector('p').innerText, 105, finalY + 14, { align: "center" });

    doc.save(`Sueldo_${mes.replace(" ", "_")}.pdf`);
});

document.getElementById('btn-whatsapp').addEventListener('click', () => {
    const totalElement = document.querySelector('#resultado-container p');
    if (!totalElement) { alert("Realiza el cálculo primero."); return; }
    const texto = `Mi estimación de sueldo para ${document.getElementById('mes').value} es de ${totalElement.innerText}. Calculado con la App de Ornella Meolans.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
});

// 7. LÓGICA DE VISIBILIDAD
function inicializarVisibilidad() {
    const selFaltas = document.getElementById('faltas');
    const contFaltas = document.getElementById('faltas-container');
    const checkVacas = document.getElementById('vacaciones_check');
    const contVacas = document.getElementById('vacaciones-container');

    selFaltas.addEventListener('change', () => contFaltas.style.display = (selFaltas.value === 'SI' ? 'block' : 'none'));
    checkVacas.addEventListener('change', () => contVacas.style.display = (checkVacas.checked ? 'block' : 'none'));

    document.getElementById('limpiar').addEventListener('click', () => {
        miformulario.reset();
        contFaltas.style.display = 'none';
        contVacas.style.display = 'none';
        document.querySelectorAll('table, .table-responsive-wrapper, p.mes-titulo, #resultado-container').forEach(el => el.remove());
    });
}