let ESCALAS_SALARIALES = null;
const miformulario = document.getElementById('formulario_sueldo');

// 1. CARGA DE DATOS EXTERNOS
async function cargarEscalas() {
    try {
        const response = await fetch('escalas.json');
        if (!response.ok) throw new Error("Archivo no encontrado");
        ESCALAS_SALARIALES = await response.json();
        console.log("Escalas cargadas correctamente");
        inicializarVisibilidad();
    } catch (error) {
        console.error("Error crítico al cargar escalas:", error);
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
function remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100, cvacaciones = 0) {
    const data = ESCALAS_SALARIALES[mes][contrato];
    const basico_escala = data.basico;
    let acuerdoBaseRem = data.acuerdoRem || 0;

    let vacaciones_haberes = (basico_escala / 25) * cvacaciones;
    let basico_recibo = (basico_escala / 30) * (30 - cfaltas - cvacaciones);
    let feriados = basico_escala / 30 * cferiado;
    let antiguedad = basico_escala * aantiguedad / 100;
    let nocturnasAdicional = ((basico_escala / 24) / 6 * 0.1311) * nocturnas;
    let extras50_calc = (basico_escala / 24 / 6) * 1.5 * extras50;
    let extras100_calc = (basico_escala / 24 / 6) * 2 * extras100;

    let base_presentismo = basico_recibo + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc;
    let puntualidad, presentismo, dlicencia, aj2025_PRES, aj2025_ANT, aj2025_PUNT, aj2025_FER;

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
    let acuNoRem = data.acuerdoNoRem || 0;
    let acuNoRemDic = data.acuerdoNoRemDic || 0;
    let acuNoRemAbr = data.acuerdoNoRemAbr || 0; // Nuevo concepto para Abril/Mayo/Junio

    let percPres = (faltas == 'NO') ? 0.10 : (justificadas == 'SI' ? 0.06 : 0);
    
    // Cálculos para Acuerdo Julio/Agosto 2025
    let aj_PRES = acuNoRem * percPres, aj_ANT = acuNoRem * aantiguedad / 100, aj_PUNT = (tarde == 'NO') ? acuNoRem * 0.5 / 100 : 0, aj_FER = acuNoRem / 30 * cferiado;
    
    // Cálculos para Acuerdo Diciembre 2025
    let ad_PRES = acuNoRemDic * percPres, ad_ANT = acuNoRemDic * aantiguedad / 100, ad_PUNT = (tarde == 'NO') ? acuNoRemDic * 0.5 / 100 : 0, ad_FER = acuNoRemDic / 30 * cferiado;

    // Cálculos para Acuerdo Abril 2026
    let aa_PRES = acuNoRemAbr * percPres, aa_ANT = acuNoRemAbr * aantiguedad / 100, aa_PUNT = (tarde == 'NO') ? acuNoRemAbr * 0.5 / 100 : 0, aa_FER = acuNoRemAbr / 30 * cferiado;

    let total_nr = acuNoRem + aj_PRES + aj_ANT + aj_PUNT + aj_FER + 
                   acuNoRemDic + ad_PRES + ad_ANT + ad_PUNT + ad_FER +
                   acuNoRemAbr + aa_PRES + aa_ANT + aa_PUNT + aa_FER;

    return [acuNoRem, aj_PRES, aj_ANT, aj_PUNT, aj_FER, acuNoRemDic, ad_PRES, ad_ANT, ad_PUNT, ad_FER, total_nr, acuNoRemAbr, aa_PRES, aa_ANT, aa_PUNT, aa_FER];
}

function descuentos(trem, tnrem, obrasocial) {
    const t_rem = trem[trem.length - 1], t_nr = tnrem[10]; // El total NR está en el índice 10
    let s = t_rem * 0.11, i = t_rem * 0.03, o = t_rem * 0.03, f = t_rem * 0.59 / 100, c = (t_rem + t_nr) * 1.5 / 100, oa = (obrasocial == 'GEA') ? t_rem * 1.30 / 100 : 0;
    let total_desc = s + i + o + f + c + oa;
    return [s, i, o, f, c, oa, total_desc];
}

// 5. EVENTO CALCULAR Y RENDERIZADO DE TABLA
document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();
    if (!ESCALAS_SALARIALES) { alert("Cargando datos..."); return; }

    const mes = document.getElementById('mes').value, contrato = document.getElementById('contrato').value;
    if (mes.includes("Selecciona") || contrato.includes("Contrato")) { alert("Completa Mes y Contrato"); return; }

    const faltas = document.getElementById('faltas').value, tarde = document.getElementById('tarde').value, obrasocial = document.getElementById('obrasocial').value;
    const cvac = document.getElementById('vacaciones_check').checked ? parseInt(document.getElementById('cvacaciones').value) || 0 : 0;
    const cf = (faltas === 'SI') ? parseInt(document.getElementById('cfaltas').value) || 0 : 0;
    const jus = (faltas === 'SI') ? document.getElementById('justificadas').value : 'NO';

    const trem = remunerativo(mes, contrato, tarde, faltas, jus, cf, parseInt(document.getElementById('feriados').value) || 0, parseInt(document.getElementById('nocturnas').value) || 0, parseInt(document.getElementById('antiguedad').value) || 0, parseInt(document.getElementById('extras50').value) || 0, parseInt(document.getElementById('extras100').value) || 0, cvac);
    const tnr = no_remunerativo(mes, contrato, tarde, faltas, jus, parseInt(document.getElementById('feriados').value) || 0, parseInt(document.getElementById('antiguedad').value) || 0);
    const td = descuentos(trem, tnr, obrasocial);
    const tsueldo = (trem[15] + tnr[10] - td[6]).toFixed(2);

    const main = document.querySelector('main');
    document.querySelectorAll('table, .table-responsive-wrapper, p.mes-titulo, #resultado-container').forEach(el => el.remove());

    const titulo = document.createElement("p"); titulo.className = "mes-titulo"; titulo.innerHTML = `<h3>${mes}</h3>`; main.append(titulo);
    
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive-wrapper";
    
    const tab = document.createElement('table'); tab.className = 'table table-bordered';
    tab.innerHTML = `<thead><tr><th>Conceptos</th><th>Haberes</th><th>No Remunerativo</th><th>Descuentos</th></tr></thead>`;
    const b = document.createElement('tbody');

    const lineItems = [
        { name: "BASICO", haberes: trem[0] }, { name: "VACACIONES GOZADAS", haberes: trem[14] },
        { name: "FERIADO", haberes: trem[1] }, { name: "PRESENTISMO", haberes: trem[2] },
        { name: "ANTIGUEDAD", haberes: trem[3] }, { name: "PUNTUALIDAD", haberes: trem[4] },
        { name: "DIAS DE LICENCIA", haberes: trem[5] }, { name: "ADICIONAL HORA NOCTURNA", haberes: trem[6] },
        { name: "HORAS EXTRAS 50%", haberes: trem[7] }, { name: "HORAS EXTRAS 100%", haberes: trem[8] },
        { name: "ACUERDO JUNIO 2025", haberes: trem[9] }, { name: "ACUERDO JUNIO 2025 PRESENTISMO", haberes: trem[10] },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD", haberes: trem[11] }, { name: "ACUERDO JUNIO 2025 PUNTUALIDAD", haberes: trem[12] },
        { name: "ACUERDO JUNIO 2025 FERIADO", haberes: trem[13] },
        // Acuerdos No Remunerativos
        { name: "ACUERDO JULIO 2025", no_remunerativo: tnr[0] }, { name: "ACUERDO JULIO 2025 PRESENTISMO", no_remunerativo: tnr[1] },
        { name: "ACUERDO JULIO 2025 ANTIGUEDAD", no_remunerativo: tnr[2] }, { name: "ACUERDO JULIO 2025 PUNTUALIDAD", no_remunerativo: tnr[3] },
        { name: "ACUERDO JULIO 2025 FERIADO", no_remunerativo: tnr[4] },
        { name: "ACUERDO DICIEMBRE 2025", no_remunerativo: tnr[5] }, { name: "ACUERDO DICIEMBRE 2025 PRESENTISMO", no_remunerativo: tnr[6] },
        { name: "ACUERDO DICIEMBRE 2025 ANTIGUEDAD", no_remunerativo: tnr[7] }, { name: "ACUERDO DICIEMBRE 2025 PUNTUALIDAD", no_remunerativo: tnr[8] },
        { name: "ACUERDO DICIEMBRE 2025 FERIADO", no_remunerativo: tnr[9] },
        { name: "ACUERDO ABRIL 2026", no_remunerativo: tnr[11] }, { name: "ACUERDO ABRIL 2026 PRESENTISMO", no_remunerativo: tnr[12] },
        { name: "ACUERDO ABRIL 2026 ANTIGUEDAD", no_remunerativo: tnr[13] }, { name: "ACUERDO ABRIL 2026 PUNTUALIDAD", no_remunerativo: tnr[14] },
        { name: "ACUERDO ABRIL 2026 FERIADO", no_remunerativo: tnr[15] },
        // Descuentos
        { name: "APORTE SIJP SOBRE SUELDO", descuentos: td[0] }, { name: "APORTE INSSJP SOBRE SUELDO", descuentos: td[1] },
        { name: "APORTE O. SOC SOBRE SUELDO", descuentos: td[2] }, { name: "CTT S FALLECIMIENTO", descuentos: td[3] },
        { name: "CTT 688/14", descuentos: td[4] }, { name: "APORTE O. SOCIAL ACUERDO", descuentos: td[5] }
    ];

    lineItems.forEach(i => {
        if ((i.haberes || 0) + (i.no_remunerativo || 0) + (i.descuentos || 0) > 0) {
            b.innerHTML += `<tr><td>${i.name}</td><td>${i.haberes ? i.haberes.toFixed(2) : ''}</td><td>${i.no_remunerativo ? i.no_remunerativo.toFixed(2) : ''}</td><td>${i.descuentos ? i.descuentos.toFixed(2) : ''}</td></tr>`;
        }
    });
    b.innerHTML += `<tr style="font-weight:bold;"><td>TOTALES</td><td>${trem[15].toFixed(2)}</td><td>${tnr[10].toFixed(2)}</td><td>${td[6].toFixed(2)}</td></tr>`;
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