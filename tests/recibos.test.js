// Tests de regresión: la calculadora contra recibos reales de Konecta (36 hs).
// Ejecutar con: npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { calcular } = require('../js/calculo.js');

const ESCALAS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'escalas.json'), 'utf8'));
const TOLERANCIA = 0.05; // pesos

const base = {
    contrato: '36hs', obraSocial: 'OTRA', faltas: false, faltasJustificadas: false, diasFalta: 0,
    llegadasTarde: false, feriados: 0, nocturnas: 0, extras50: 0, extras100: 0, extras100noct: 0,
    diasVacaciones: 0
};

function cerca(real, esperado, campo) {
    assert.ok(Math.abs(real - esperado) <= TOLERANCIA,
        `${campo}: calculado ${real.toFixed(2)} vs recibo ${esperado.toFixed(2)} (dif ${(real - esperado).toFixed(2)})`);
}

test('Septiembre 2026 — mes normal, 5 años de antigüedad', () => {
    const r = calcular(ESCALAS, { ...base, mes: 'SEPTIEMBRE 2026', antiguedad: 5 });
    cerca(r.haberes.antiguedad, 44612.20, 'antigüedad');
    cerca(r.haberes.presentismo, 94154.05, 'presentismo');
    cerca(r.haberes.puntualidad, 4684.28, 'puntualidad');
    cerca(r.totales.haberes, 1035694.51, 'total haberes');
    cerca(r.totales.noRemunerativo, 157288.75, 'total no remunerativo');
    cerca(r.descuentos.cttFallecimiento, 4461.22, 'CTT S. Fallecimiento');
    cerca(r.descuentos.cct688, 15535.42, 'CCT 688/14');
    cerca(r.totales.descuentos, 196064.70, 'total descuentos');
    cerca(r.totales.neto, 996918.56, 'neto');
});

test('Agosto 2026 — feriado trabajado, sin puntualidad, suma única', () => {
    const r = calcular(ESCALAS, { ...base, mes: 'AGOSTO 2026', antiguedad: 4, feriados: 1, llegadasTarde: true });
    cerca(r.haberes.feriado, 29125.66, 'feriado');
    cerca(r.haberes.presentismo, 93784.63, 'presentismo');
    assert.equal(r.haberes.puntualidad, 0);
    cerca(r.totales.haberes, 1031630.90, 'total haberes');
    cerca(r.totales.noRemunerativo, 178734.11, 'total no remunerativo');
    cerca(r.descuentos.cct688, 14993.89, 'CCT 688/14');
    cerca(r.totales.descuentos, 194740.00, 'total descuentos');
    cerca(r.totales.neto, 1015625.01, 'neto');
});

test('Julio 2026 — liquidado con el básico anterior a la paritaria (salió después)', () => {
    const escalas = JSON.parse(JSON.stringify(ESCALAS));
    escalas['JULIO 2026']['36hs'] = { ...escalas['JUNIO 2026']['36hs'] };
    const r = calcular(escalas, { ...base, mes: 'JULIO 2026', antiguedad: 4, feriados: 1 });
    cerca(r.totales.haberes, 992947.23, 'total haberes');
    cerca(r.totales.noRemunerativo, 160784.04, 'total no remunerativo');
    cerca(r.descuentos.cttFallecimiento, 4184.11, 'CTT S. Fallecimiento');
    cerca(r.descuentos.cct688, 14431.66, 'CCT 688/14');
    cerca(r.totales.descuentos, 187416.80, 'total descuentos');
    cerca(r.totales.neto, 966314.47, 'neto');
});

test('Junio 2026 — 2 feriados (sin las líneas "Retro" del mes anterior)', () => {
    const r = calcular(ESCALAS, { ...base, mes: 'JUNIO 2026', antiguedad: 4, feriados: 2 });
    const retroRem = 27894.05 + 139.47 + 2803.35;
    const retroNR = 4.97 + 99.87 + 7.51 + 150.97 + 7.83 + 157.29 + 993.68 + 1502.16 + 1565.08;
    cerca(r.haberes.presentismo, 93071.28, 'presentismo');
    cerca(r.haberes.puntualidad, 4630.41, 'puntualidad');
    cerca(r.totales.haberes, 1054620.97 - retroRem, 'total haberes');
    cerca(r.totales.noRemunerativo, 170266.67 - retroNR, 'total no remunerativo');
    cerca(r.descuentos.cttFallecimiento, 4184.11, 'CTT S. Fallecimiento');
    cerca(r.descuentos.cct688, 12552.32, 'CCT 688/14');
});

test('Abril 2026 — 12 días de vacaciones con horas extras', () => {
    // promedioVariables: valor que surge del recibo (no hay recibos previos para derivarlo)
    const r = calcular(ESCALAS, {
        ...base, mes: 'ABRIL 2026', antiguedad: 4, extras100: 3, extras100noct: 1,
        diasVacaciones: 12, promedioVariables: 17553.40
    });
    cerca(r.haberes.sueldo, 502092.88, 'sueldo 18 días');
    cerca(r.haberes.vacaciones, 471127.52, 'pago de vacaciones');
    cerca(r.haberes.presentismo, 58551.04, 'presentismo');
    cerca(r.haberes.puntualidad, 5256.91, 'puntualidad');
    cerca(r.totales.haberes, 1115188.95, 'total haberes');
    cerca(r.noRemunerativo.dic2025.vacaciones + 0, 2384.84 + 3605.19, 'vacaciones NR acuerdo dic (2 líneas)');
    cerca(r.noRemunerativo.abr2026.vacaciones, 2662.15, 'vacaciones NR acuerdo abr');
    cerca(r.totales.noRemunerativo, 140294.69, 'total no remunerativo');
    cerca(r.descuentos.cct688, 18832.25, 'CCT 688/14');
});

test('Octubre 2026 — obra social GEA/OSTACC: aporte 3% sobre el no remunerativo (recibo de otro colaborador)', () => {
    // Liquidado con el básico de septiembre (la paritaria de octubre todavía no estaba aplicada)
    const escalas = JSON.parse(JSON.stringify(ESCALAS));
    escalas['OCTUBRE 2026']['36hs'] = { ...escalas['SEPTIEMBRE 2026']['36hs'] };
    const r = calcular(escalas, { ...base, mes: 'OCTUBRE 2026', antiguedad: 6, feriados: 1, obraSocial: 'GEA' });
    cerca(r.haberes.presentismo, 98039.77, 'presentismo');
    cerca(r.haberes.puntualidad, 4877.60, 'puntualidad');
    cerca(r.totales.haberes, 1078437.46, 'total haberes');
    cerca(r.totales.noRemunerativo, 163780.01, 'total no remunerativo');
    cerca(r.descuentos.obraSocialAcuerdo, 4913.40, 'aporte O.Social Acuerdo');
    cerca(r.descuentos.cct688, 15683.37, 'CCT 688/14');
    cerca(r.totales.descuentos, 208392.35, 'total descuentos');
    cerca(r.totales.neto, 1033825.12, 'neto');
});

test('Sin vacaciones las líneas de vacaciones son cero', () => {
    const r = calcular(ESCALAS, { ...base, mes: 'NOVIEMBRE 2026', antiguedad: 3 });
    assert.equal(r.haberes.vacaciones, 0);
    assert.equal(r.noRemunerativo.abr2026.vacaciones, 0);
});

test('Faltas injustificadas: pierde presentismo; justificadas: 6% y se pagan los días', () => {
    const inj = calcular(ESCALAS, { ...base, mes: 'SEPTIEMBRE 2026', antiguedad: 5, faltas: true, diasFalta: 2 });
    assert.equal(inj.haberes.presentismo, 0);
    assert.equal(inj.haberes.licencia, 0);
    const jus = calcular(ESCALAS, { ...base, mes: 'SEPTIEMBRE 2026', antiguedad: 5, faltas: true, faltasJustificadas: true, diasFalta: 2 });
    assert.ok(jus.haberes.presentismo > 0);
    cerca(jus.haberes.sueldo + jus.haberes.licencia, 892243.98, 'sueldo + licencia = básico');
});

test('escalas.json: 35 hs y 30 hs son proporcionales a 36 hs (detecta errores de tipeo)', () => {
    for (const [mes, contratos] of Object.entries(ESCALAS)) {
        const c36 = contratos['36hs'];
        assert.ok(c36 && contratos['35hs'] && contratos['30hs'], `${mes}: faltan contratos`);
        for (const [contrato, factor] of [['35hs', 35 / 36], ['30hs', 30 / 36]]) {
            for (const [campo, valor36] of Object.entries(c36)) {
                const valor = contratos[contrato][campo];
                assert.equal(typeof valor, 'number', `${mes} ${contrato}: falta ${campo}`);
                const esperado = valor36 * factor;
                assert.ok(Math.abs(valor - esperado) <= Math.max(0.05, esperado * 0.00005),
                    `${mes} ${contrato} ${campo}: ${valor} no es proporcional a 36hs (${valor36} → ${esperado.toFixed(2)})`);
            }
        }
    }
});
