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
function remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100, extras100noct, cvacaciones = 0) {
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
    // Remuneración diaria = (remuneración mensual completa) / 25
    // La remuneración mensual completa incluye: básico ESCALA (no proporcional) +
    // antigüedad + extras + feriados. Puntualidad y presentismo se calculan primero
    // como valores "completos" (sobre el básico escala, no proporcional) para usarlos
    // como base de vacaciones, y luego se vuelven a calcular sobre los días reales.
    let basico_completo     = basico_escala; // mes completo, sin proporcionar
    let base_vac_previa     = basico_completo + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc + extras100noct_calc;
    // Para vacaciones: puntualidad sobre base_vac + vacaciones estimadas (circular)
    // Aproximación: puntualidad_vac = base_vac_previa * 0.005 (suficientemente preciso)
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

    return [basico_recibo, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, extras50_calc, extras100_calc, acuerdoBaseRem, aj2025_PRES, aj2025_ANT, aj2025_PUNT, aj2025_FER, vacaciones_haberes, total_rem, extras100noct_calc];
}

function no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad, cvacaciones = 0) {
    const data = ESCALAS_SALARIALES[mes][contrato];
    let acuNoRem    = data.acuerdoNoRem    || 0;
    let acuNoRemDic = data.acuerdoNoRemDic || 0;
    let acuNoRemAbr = data.acuerdoNoRemAbr || 0;
    let sumaunicavezCuota1 = data.sumaunicavezCuota1 || 0;
    let sumaunicavezCuota2 = data.sumaunicavezCuota2 || 0;

    let percPres = (faltas == 'NO') ? 0.10 : (justificadas == 'SI' ? 0.06 : 0);
    let percPunt = (tarde == 'NO') ? 0.005 : 0;

    // Acuerdo Julio/Agosto 2025
    let aj_PRES = acuNoRem * percPres, aj_ANT = acuNoRem * aantiguedad / 100;
    let aj_PUNT = acuNoRem * percPunt, aj_FER = acuNoRem / 30 * cferiado;
    // Vacaciones NR: los acuerdos NR computan para vacaciones (texto expreso acuerdo Dic2025 y Abr2026)
    // Fórmula: acuNR / 25 * (cvac * 5/30) = acuNR * cvac / 150
    // (proporción de días hábiles de vacaciones sobre días hábiles del mes)
    let aj_VAC  = acuNoRem    * cvacaciones / 150;

    // Acuerdo Diciembre 2025
    let ad_PRES = acuNoRemDic * percPres, ad_ANT = acuNoRemDic * aantiguedad / 100;
    let ad_PUNT = acuNoRemDic * percPunt, ad_FER = acuNoRemDic / 30 * cferiado;
    let ad_VAC  = acuNoRemDic * cvacaciones / 150;

    // Acuerdo Abril 2026 ($120.000 NR: $100.000 prorrogado + $20.000 nuevo)
    let aa_PRES = acuNoRemAbr * percPres, aa_ANT = acuNoRemAbr * aantiguedad / 100;
    let aa_PUNT = acuNoRemAbr * percPunt, aa_FER = acuNoRemAbr / 30 * cferiado;
    let aa_VAC  = acuNoRemAbr * cvacaciones / 150;

    let total_nr = acuNoRem    + aj_PRES + aj_ANT + aj_PUNT + aj_FER + aj_VAC +
                   acuNoRemDic + ad_PRES + ad_ANT + ad_PUNT + ad_FER + ad_VAC +
                   acuNoRemAbr + aa_PRES + aa_ANT + aa_PUNT + aa_FER + aa_VAC + sumaunicavezCuota1 + sumaunicavezCuota2;

    // índices: 0=acuJul, 1=pres, 2=ant, 3=punt, 4=fer, 5=vac_jul,
    //          6=acuDic, 7=pres, 8=ant, 9=punt, 10=fer, 11=vac_dic,
    //          12=total_nr,
    //          13=acuAbr, 14=pres, 15=ant, 16=punt, 17=fer, 18=vac_abr
    return [acuNoRem, aj_PRES, aj_ANT, aj_PUNT, aj_FER, aj_VAC,
            acuNoRemDic, ad_PRES, ad_ANT, ad_PUNT, ad_FER, ad_VAC,
            total_nr,
            acuNoRemAbr, aa_PRES, aa_ANT, aa_PUNT, aa_FER, aa_VAC, sumaunicavezCuota1, sumaunicavezCuota2];
}

function descuentos(trem, tnrem, obrasocial) {
    const t_rem = trem[trem.length - 2], t_nr = tnrem[12]; // total_rem en [15], total_nr en [12]
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

    const trem = remunerativo(mes, contrato, tarde, faltas, jus, cf, parseInt(document.getElementById('feriados').value) || 0, parseInt(document.getElementById('nocturnas').value) || 0, parseInt(document.getElementById('antiguedad').value) || 0, parseInt(document.getElementById('extras50').value) || 0, parseInt(document.getElementById('extras100').value) || 0, parseInt(document.getElementById('extras100noct').value) || 0, cvac);
    const tnr = no_remunerativo(mes, contrato, tarde, faltas, jus, parseInt(document.getElementById('feriados').value) || 0, parseInt(document.getElementById('antiguedad').value) || 0, cvac);
    const td = descuentos(trem, tnr, obrasocial);
    const tsueldo = (trem[15] + tnr[12] - td[6]).toFixed(2);

    const main = document.querySelector('main');
    document.querySelectorAll('table, .table-responsive-wrapper, p.mes-titulo, #resultado-container').forEach(el => el.remove());

    const titulo = document.createElement("p"); titulo.className = "mes-titulo"; titulo.innerHTML = `<h3>${mes}</h3>`; main.append(titulo);
    
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive-wrapper";
    
    const tab = document.createElement('table'); tab.className = 'table table-bordered';
    tab.innerHTML = `<thead><tr><th>Conceptos</th><th>Haberes</th><th>No Remunerativo</th><th>Descuentos</th></tr></thead>`;
    const b = document.createElement('tbody');

    const lineItems = [
        { name: "BASICO",                              haberes: trem[0]  },
        { name: "VACACIONES GOZADAS",                  haberes: trem[14] },
        { name: "FERIADO",                             haberes: trem[1]  },
        { name: "PRESENTISMO",                         haberes: trem[2]  },
        { name: "ANTIGUEDAD",                          haberes: trem[3]  },
        { name: "PUNTUALIDAD",                         haberes: trem[4]  },
        { name: "DIAS DE LICENCIA",                    haberes: trem[5]  },
        { name: "ADICIONAL HORA NOCTURNA",             haberes: trem[6]  },
        { name: "HORAS EXTRAS 50%",                    haberes: trem[7]  },
        { name: "HORAS EXTRAS 100%",                   haberes: trem[8]  },
        { name: "HS. EXTRAS NOCTURNAS 100%",           haberes: trem[16] },
        { name: "ACUERDO JUNIO 2025",                  haberes: trem[9]  },
        { name: "ACUERDO JUNIO 2025 PRESENTISMO",      haberes: trem[10] },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD",       haberes: trem[11] },
        { name: "ACUERDO JUNIO 2025 PUNTUALIDAD",      haberes: trem[12] },
        { name: "ACUERDO JUNIO 2025 FERIADO",          haberes: trem[13] },
        // Acuerdos No Remunerativos — Julio 2025
        { name: "ACUERDO JULIO 2025",                  no_remunerativo: tnr[0]  },
        { name: "ACUERDO JULIO 2025 PRESENTISMO",      no_remunerativo: tnr[1]  },
        { name: "ACUERDO JULIO 2025 ANTIGUEDAD",       no_remunerativo: tnr[2]  },
        { name: "ACUERDO JULIO 2025 PUNTUALIDAD",      no_remunerativo: tnr[3]  },
        { name: "ACUERDO JULIO 2025 FERIADO",          no_remunerativo: tnr[4]  },
        { name: "ACUERDO JULIO 2025 VACACIONES",       no_remunerativo: tnr[5]  },
        // Acuerdos No Remunerativos — Diciembre 2025
        { name: "ACUERDO DICIEMBRE 2025",              no_remunerativo: tnr[6]  },
        { name: "ACUERDO DICIEMBRE 2025 PRESENTISMO",  no_remunerativo: tnr[7]  },
        { name: "ACUERDO DICIEMBRE 2025 ANTIGUEDAD",   no_remunerativo: tnr[8]  },
        { name: "ACUERDO DICIEMBRE 2025 PUNTUALIDAD",  no_remunerativo: tnr[9]  },
        { name: "ACUERDO DICIEMBRE 2025 FERIADO",      no_remunerativo: tnr[10] },
        { name: "ACUERDO DICIEMBRE 2025 VACACIONES",   no_remunerativo: tnr[11] },
        // Acuerdos No Remunerativos — Abril 2026 ($120.000: $100.000 prorrogado + $20.000 nuevo)
        { name: "ACUERDO ABRIL 2026",                  no_remunerativo: tnr[13] },
        { name: "ACUERDO ABRIL 2026 PRESENTISMO",      no_remunerativo: tnr[14] },
        { name: "ACUERDO ABRIL 2026 ANTIGUEDAD",       no_remunerativo: tnr[15] },
        { name: "ACUERDO ABRIL 2026 PUNTUALIDAD",      no_remunerativo: tnr[16] },
        { name: "ACUERDO ABRIL 2026 FERIADO",          no_remunerativo: tnr[17] },
        { name: "ACUERDO ABRIL 2026 VACACIONES",       no_remunerativo: tnr[18] },
        // Acuerdos No Remunerativos — Suma única (2 cuotas)
        { name: "ACUERDO SUMA ÚNICA CUOTA 1",          no_remunerativo: sumaunicavezCuota1 },
        { name: "ACUERDO SUMA ÚNICA CUOTA 2",          no_remunerativo: sumaunicavezCuota2 },
        // Descuentos
        { name: "APORTE SIJP SOBRE SUELDO",  descuentos: td[0] },
        { name: "APORTE INSSJP SOBRE SUELDO",descuentos: td[1] },
        { name: "APORTE O. SOC SOBRE SUELDO",descuentos: td[2] },
        { name: "CTT S FALLECIMIENTO",        descuentos: td[3] },
        { name: "CTT 688/14",                 descuentos: td[4] },
        { name: "APORTE O. SOCIAL ACUERDO",   descuentos: td[5] }
    ];

    lineItems.forEach(i => {
        if ((i.haberes || 0) + (i.no_remunerativo || 0) + (i.descuentos || 0) > 0) {
            b.innerHTML += `<tr><td>${i.name}</td><td>${i.haberes ? i.haberes.toFixed(2) : ''}</td><td>${i.no_remunerativo ? i.no_remunerativo.toFixed(2) : ''}</td><td>${i.descuentos ? i.descuentos.toFixed(2) : ''}</td></tr>`;
        }
    });
    b.innerHTML += `<tr style="font-weight:bold;"><td>TOTALES</td><td>${trem[15].toFixed(2)}</td><td>${tnr[12].toFixed(2)}</td><td>${td[6].toFixed(2)}</td></tr>`;
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