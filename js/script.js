let miformulario = document.getElementById('formulario_sueldo');

const ESCALAS_SALARIALES = {
    "JULIO 2025": {
        "36hs": { basico: 789454.22, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 767524.91, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 657878.54, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "AGOSTO 2025": {
        "36hs": { basico: 797348.77, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 775200.16, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 664457.32, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "SEPTIEMBRE 2025": {
        "36hs": { basico: 805243.31, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 782875.41, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 671036.10, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "OCTUBRE 2025": {
        "36hs": { basico: 813137.85, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 790550.66, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 677614.89, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "NOVIEMBRE 2025": {
        "36hs": { basico: 821032.39, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 798225.91, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 684193.68, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "DICIEMBRE 2025": {
        "36hs": { basico: 828926.93, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51, acuerdoNoRemDic: 45064.86 },
        "35hs": { basico: 805901.16, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44, acuerdoNoRemDic: 43813.06 },
        "30hs": { basico: 690772.47, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09, acuerdoNoRemDic: 37554.05 } 
    },
    "ENERO 2026": {
        "36hs": { basico: 836821.47, acuerdoRem: 0, acuerdoNoRem: 29810.51, acuerdoNoRemDic: 45064.86 },
        "35hs": { basico: 813576.41, acuerdoRem: 0, acuerdoNoRem: 28982.44, acuerdoNoRemDic: 43813.06 },
        "30hs": { basico: 697351.26, acuerdoRem: 0, acuerdoNoRem: 24842.09, acuerdoNoRemDic: 37554.05 }
    },
    "FEBRERO 2026": {
        "36hs": { basico: 836821.47, acuerdoRem: 0, acuerdoNoRem: 29810.51, acuerdoNoRemDic: 45064.86 },
        "35hs": { basico: 813576.41, acuerdoRem: 0, acuerdoNoRem: 28982.44, acuerdoNoRemDic: 43813.06 },
        "30hs": { basico: 697351.26, acuerdoRem: 0, acuerdoNoRem: 24842.09, acuerdoNoRemDic: 37554.05 }
    },
    "MARZO 2026": {
        "36hs": { basico: 836821.47, acuerdoRem: 0, acuerdoNoRem: 29810.51, acuerdoNoRemDic: 45064.86 },
        "35hs": { basico: 813576.41, acuerdoRem: 0, acuerdoNoRem: 28982.44, acuerdoNoRemDic: 43813.06 },
        "30hs": { basico: 697351.26, acuerdoRem: 0, acuerdoNoRem: 24842.09, acuerdoNoRemDic: 37554.05 }
    }
};

function sueldo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50, extras100, cvacaciones) {
    if (!ESCALAS_SALARIALES[mes] || !ESCALAS_SALARIALES[mes][contrato]) return 0;
    let trem = remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100, cvacaciones);
    let tnrem = no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    let tdesc = descuentos(trem, tnrem, obrasocial);
    let total = trem[trem.length - 1] + tnrem[tnrem.length - 1] - tdesc[tdesc.length - 1];
    return total.toFixed(2);
}

function remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100, cvacaciones = 0) {
    const data = ESCALAS_SALARIALES[mes][contrato];
    const basico_escala = data.basico;
    let acuerdoBaseRem = data.acuerdoRem; 

    // Cálculo Vacaciones y Básico Ajustado
    let vacaciones_haberes = (basico_escala / 25) * cvacaciones;
    let basico_recibo = (basico_escala / 30) * (30 - cfaltas - cvacaciones);

    // Adicionales sobre el básico de escala (sin descuentos)
    let feriados = basico_escala / 30 * cferiado;
    let antiguedad = basico_escala * aantiguedad / 100;
    let nocturnasAdicional = ((basico_escala / 24) / 6 * 0.1311) * nocturnas;
    let extras50_calc = (basico_escala / 24 / 6) * 1.5 * extras50;
    let extras100_calc = (basico_escala / 24 / 6) * 2 * extras100;

    // Base Presentismo excluye monto de vacaciones gozadas
    let base_presentismo = basico_recibo + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc;

    let puntualidad, presentismo, dlicencia;
    let aj2025_PRES, aj2025_ANT, aj2025_PUNT, aj2025_FER;

    if (faltas == 'NO' && tarde == 'NO') {
        puntualidad = base_presentismo * 0.5 / 100;
        presentismo = (base_presentismo + puntualidad) * 10 / 100;
        dlicencia = 0;
        aj2025_PRES = acuerdoBaseRem * 10 / 100;
        aj2025_ANT = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT = acuerdoBaseRem * 0.5 / 100;
    } else if (faltas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = base_presentismo * 10 / 100;
        dlicencia = 0;
        aj2025_PRES = acuerdoBaseRem * 10 / 100;
        aj2025_ANT = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT = 0;
    } else if (faltas == 'SI' && justificadas == 'SI') {
        puntualidad = (tarde == 'NO') ? base_presentismo * 0.5 / 100 : 0;
        presentismo = (base_presentismo + puntualidad) * 6 / 100;
        dlicencia = (basico_escala / 30) * cfaltas;
        aj2025_PRES = acuerdoBaseRem * 6 / 100;
        aj2025_ANT = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT = (puntualidad > 0) ? acuerdoBaseRem * 0.5 / 100 : 0;
    } else {
        puntualidad = (tarde == 'NO') ? base_presentismo * 0.5 / 100 : 0;
        presentismo = 0;
        dlicencia = 0;
        aj2025_PRES = 0;
        aj2025_ANT = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNT = (puntualidad > 0) ? acuerdoBaseRem * 0.5 / 100 : 0;
    }
    aj2025_FER = acuerdoBaseRem / 30 * cferiado;
    
    let total_rem = base_presentismo + vacaciones_haberes + puntualidad + presentismo + dlicencia + acuerdoBaseRem + aj2025_PRES + aj2025_ANT + aj2025_PUNT + aj2025_FER;
    
    return [basico_recibo, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, extras50_calc, extras100_calc, acuerdoBaseRem, aj2025_PRES, aj2025_ANT, aj2025_PUNT, aj2025_FER, vacaciones_haberes, total_rem];
}

function no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad) {
    const data = ESCALAS_SALARIALES[mes][contrato];
    let acuNoRem = data.acuerdoNoRem, acuNoRemDic = data.acuerdoNoRemDic || 0;
    let percPres = (faltas == 'NO') ? 0.10 : (justificadas == 'SI' ? 0.06 : 0);
    let aj_PRES = acuNoRem * percPres, aj_ANT = acuNoRem * aantiguedad / 100, aj_PUNT = (tarde == 'NO') ? acuNoRem * 0.5 / 100 : 0, aj_FER = acuNoRem / 30 * cferiado;
    let ad_PRES = acuNoRemDic * percPres, ad_ANT = acuNoRemDic * aantiguedad / 100, ad_PUNT = (tarde == 'NO') ? acuNoRemDic * 0.5 / 100 : 0, ad_FER = acuNoRemDic / 30 * cferiado;
    let total_nr = acuNoRem + aj_PRES + aj_ANT + aj_PUNT + aj_FER + acuNoRemDic + ad_PRES + ad_ANT + ad_PUNT + ad_FER;
    return [acuNoRem, aj_PRES, aj_ANT, aj_PUNT, aj_FER, acuNoRemDic, ad_PRES, ad_ANT, ad_PUNT, ad_FER, total_nr];
}

function descuentos(trem, tnrem, obrasocial) {
    const t_rem = trem[trem.length - 1], t_nr = tnrem[tnrem.length - 1]; 
    let s = t_rem * 0.11, i = t_rem * 0.03, o = t_rem * 0.03, f = t_rem * 0.0059, c = (t_rem + t_nr) * 1.5 / 100, oa = (obrasocial == 'GEA') ? t_rem * 1.30 / 100 : 0;
    return [s, i, o, f, c, oa, s+i+o+f+c+oa];
}

document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();
    const mes = document.getElementById('mes').value, contrato = document.getElementById('contrato').value;
    if (mes.includes('Selecciona') || contrato.includes('Contrato')) { alert('Selecciona Mes y Contrato'); return; }

    const faltas = document.getElementById('faltas').value, tarde = document.getElementById('tarde').value, obrasocial = document.getElementById('obrasocial').value;
    const cvac = document.getElementById('vacaciones_check').checked ? parseInt(document.getElementById('cvacaciones').value) || 0 : 0;
    const cf = (faltas === 'SI') ? parseInt(document.getElementById('cfaltas').value) || 0 : 0;
    const jus = (faltas === 'SI') ? document.getElementById('justificadas').value : 'NO';

    const trem = remunerativo(mes, contrato, tarde, faltas, jus, cf, parseInt(document.getElementById('feriados').value)||0, parseInt(document.getElementById('nocturnas').value)||0, parseInt(document.getElementById('antiguedad').value)||0, parseInt(document.getElementById('extras50').value)||0, parseInt(document.getElementById('extras100').value)||0, cvac);
    const tnr = no_remunerativo(mes, contrato, tarde, faltas, jus, parseInt(document.getElementById('feriados').value)||0, parseInt(document.getElementById('antiguedad').value)||0);
    const td = descuentos(trem, tnr, obrasocial);

    const main = document.querySelector('main');
    document.querySelectorAll('table, p.mes-titulo, #resultado-container').forEach(el => el.remove());

    const t = document.createElement("p"); t.className = "mes-titulo"; t.innerHTML = `<h3>${mes}</h3>`; main.append(t);
    const tab = document.createElement('table'); tab.className = 'table table-bordered';
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
        { name: "ACUERDO JUNIO 2025", haberes: trem[9] },
        { name: "ACUERDO JUNIO 2025 PRESENTISMO", haberes: trem[10] },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD", haberes: trem[11] },
        { name: "ACUERDO JUNIO 2025 PUNTUALIDAD", haberes: trem[12] },
        { name: "ACUERDO JUNIO 2025 FERIADO", haberes: trem[13] },
        { name: "ACUERDO JULIO 2025", no_remunerativo: tnr[0] },
        { name: "ACUERDO JULIO 2025 PRESENTISMO", no_remunerativo: tnr[1] },
        { name: "ACUERDO JULIO 2025 ANTIGUEDAD", no_remunerativo: tnr[2] },
        { name: "ACUERDO JULIO 2025 PUNTUALIDAD", no_remunerativo: tnr[3] },
        { name: "ACUERDO JULIO 2025 FERIADO", no_remunerativo: tnr[4] },
        { name: "ACUERDO DICIEMBRE 2025", no_remunerativo: tnr[5] },
        { name: "ACUERDO DICIEMBRE 2025 PRESENTISMO", no_remunerativo: tnr[6] },
        { name: "ACUERDO DICIEMBRE 2025 ANTIGUEDAD", no_remunerativo: tnr[7] },
        { name: "ACUERDO DICIEMBRE 2025 PUNTUALIDAD", no_remunerativo: tnr[8] },
        { name: "ACUERDO DICIEMBRE 2025 FERIADO", no_remunerativo: tnr[9] },
        { name: "APORTE SIJP SOBRE SUELDO", descuentos: td[0] },
        { name: "APORTE INSSJP SOBRE SUELDO", descuentos: td[1] },
        { name: "APORTE O. SOC SOBRE SUELDO", descuentos: td[2] },
        { name: "CTT S FALLECIMIENTO", descuentos: td[3] },
        { name: "CTT 688/14", descuentos: td[4] },
        { name: "APORTE O. SOCIAL ACUERDO", descuentos: td[5] }
    ];

    lineItems.forEach(i => {
        if ((i.haberes||0) + (i.no_remunerativo||0) + (i.descuentos||0) > 0) {
            b.innerHTML += `<tr><td>${i.name}</td><td>${i.haberes ? i.haberes.toFixed(2) : ''}</td><td>${i.no_remunerativo ? i.no_remunerativo.toFixed(2) : ''}</td><td>${i.descuentos ? i.descuentos.toFixed(2) : ''}</td></tr>`;
        }
    });
    b.innerHTML += `<tr style="font-weight:bold;"><td>TOTALES</td><td>${trem[15].toFixed(2)}</td><td>${tnr[10].toFixed(2)}</td><td>${td[6].toFixed(2)}</td></tr>`;
    tab.appendChild(b); main.appendChild(tab);
    const res = document.createElement("div"); res.id = "resultado-container";
    res.innerHTML = `<h3>Total a cobrar:</h3><p>${(trem[15]+tnr[10]-td[6]).toFixed(2)}</p>`;
    main.append(res);
});

const faltasContainer = document.getElementById('faltas-container'), faltasSelect = document.getElementById('faltas');
function actualizarFaltasContainer() { faltasContainer.style.display = (faltasSelect.value === 'SI') ? 'block' : 'none'; }
faltasSelect.addEventListener('change', actualizarFaltasContainer);
document.getElementById('vacaciones_check').addEventListener('change', function() { document.getElementById('vacaciones-container').style.display = this.checked ? 'block' : 'none'; });
document.getElementById('limpiar').addEventListener('click', () => { miformulario.reset(); actualizarFaltasContainer(); document.getElementById('vacaciones-container').style.display = 'none'; });
actualizarFaltasContainer();