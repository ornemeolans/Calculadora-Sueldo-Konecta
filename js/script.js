let miformulario = document.getElementById('formulario_sueldo');

// 1. ESTRUCTURA DE DATOS SALARIALES EXTRAÍDA DEL PDF (Valores verificados)
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
    // Nuevos meses del 2026 
    // MODIFICACIÓN: Se suma acuerdoRem al basico y se pone acuerdoRem en 0
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

function sueldo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50, extras100) {
    
    if (!ESCALAS_SALARIALES[mes] || !ESCALAS_SALARIALES[mes][contrato]) {
        console.error(`Error: Data no disponible para Mes: ${mes} y Contrato: ${contrato}`);
        return 0; 
    }
    
    let tremunerativo = remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100);
    let tnremunerativo = no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo, obrasocial);
    
    let tsueldo = tremunerativo[tremunerativo.length - 1] + tnremunerativo[tnremunerativo.length - 1] - tdescuento[tdescuento.length - 1];
    
    return tsueldo = tsueldo.toFixed(2);
}

// Se añade 'mes' y 'extras50' a la firma
function remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100) {
    
    const data = ESCALAS_SALARIALES[mes][contrato];
    
    let basico_base = data.basico;
    let acuerdoBaseRem = data.acuerdoRem; 
    let basico;

    // Calcular el básico con o sin faltas
    if (faltas == 'SI') {
        basico = (basico_base / 30) * (30 - cfaltas);
    } else {
        basico = basico_base;
    }

    // Calcular adicionales
    let feriados = basico / 30 * cferiado;
    let antiguedad = basico * aantiguedad / 100;
    let nocturnasAdicional = ((basico / 24) / 6 * 0.1311) * nocturnas;
    let extras50_calc = (basico / 24 / 6) * 1.5 * extras50; // Cálculo de Horas Extras al 50%
    let extras100_calc = (basico / 24 / 6) * 2 * extras100; // Cálculo de Horas Extras al 100%

    let puntualidad, presentismo, dlicencia;
    let aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO;

    // Lógica de Presentismo y Puntualidad
    if (faltas == 'NO' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc+ puntualidad) * 10 / 100;
        dlicencia = 0;
        aj2025_PRESENTISMO = acuerdoBaseRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc + puntualidad) * 10 / 100;
        dlicencia = 0;
        aj2025_PRESENTISMO = acuerdoBaseRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
        aj2025_PRESENTISMO = acuerdoBaseRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + extras100_calc + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
        aj2025_PRESENTISMO = acuerdoBaseRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = 0;
        dlicencia = 0;
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = 0;
        dlicencia = 0;
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    }
    
    // Total Remunerativo
    let total_remunerativo = basico + feriados + antiguedad + nocturnasAdicional + puntualidad + presentismo + dlicencia + acuerdoBaseRem + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO + extras50_calc + extras100_calc;
    
    return [
        basico, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, extras50_calc, extras100_calc,
        acuerdoBaseRem, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, total_remunerativo
    ];
}

function no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad) {
    let aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO;
    // NUEVAS VARIABLES PARA DICIEMBRE Y 2026
    let ad2025_PRESENTISMO = 0, ad2025_ANTIGUEDAD = 0, ad2025_PUNTUALIDAD = 0, ad2025_FERIADO = 0;

    // Obtener valores base
    const data = ESCALAS_SALARIALES[mes][contrato];
    let acuerdoBaseNoRem = data.acuerdoNoRem; // Incremento JUNIO 2025
    let acuerdoBaseNoRemDic = data.acuerdoNoRemDic || 0; // Incremento DICIEMBRE

    // Lógica para calcular los valores no remunerativos basados en faltas
    if (faltas == 'NO' && tarde == 'NO') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseNoRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;

        if (acuerdoBaseNoRemDic > 0) {
            ad2025_PRESENTISMO = acuerdoBaseNoRemDic * 10 / 100; // Cálculo de presentismo agregado
            ad2025_ANTIGUEDAD = acuerdoBaseNoRemDic * aantiguedad / 100;
            ad2025_PUNTUALIDAD = acuerdoBaseNoRemDic * 0.5 / 100;
            ad2025_FERIADO = acuerdoBaseNoRemDic / 30 * cferiado;
        }

    } else if (faltas == 'NO' && tarde == 'SI') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;

        if (acuerdoBaseNoRemDic > 0) {
            ad2025_PRESENTISMO = acuerdoBaseNoRemDic * 10 / 100; // Mantiene presentismo
            ad2025_ANTIGUEDAD = acuerdoBaseNoRemDic * aantiguedad / 100;
            ad2025_PUNTUALIDAD = 0;
            ad2025_FERIADO = acuerdoBaseNoRemDic / 30 * cferiado;
        }

    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseNoRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;

        if (acuerdoBaseNoRemDic > 0) {
            ad2025_PRESENTISMO = acuerdoBaseNoRemDic * 6 / 100; // 6% Presentismo
            ad2025_ANTIGUEDAD = acuerdoBaseNoRemDic * aantiguedad / 100;
            ad2025_PUNTUALIDAD = acuerdoBaseNoRemDic * 0.5 / 100;
            ad2025_FERIADO = acuerdoBaseNoRemDic / 30 * cferiado;
        }

    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;

        if (acuerdoBaseNoRemDic > 0) {
            ad2025_PRESENTISMO = acuerdoBaseNoRemDic * 6 / 100;
            ad2025_ANTIGUEDAD = acuerdoBaseNoRemDic * aantiguedad / 100;
            ad2025_PUNTUALIDAD = 0;
            ad2025_FERIADO = acuerdoBaseNoRemDic / 30 * cferiado;
        }

    } else if (faltas == 'SI' && justificadas == 'NO') {
        // En falta injustificada se pierde presentismo
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = (tarde == 'NO') ? acuerdoBaseNoRem * 0.5 / 100 : 0;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;

        if (acuerdoBaseNoRemDic > 0) {
            ad2025_PRESENTISMO = 0; // Pierde presentismo
            ad2025_ANTIGUEDAD = acuerdoBaseNoRemDic * aantiguedad / 100;
            ad2025_PUNTUALIDAD = (tarde == 'NO') ? acuerdoBaseNoRemDic * 0.5 / 100 : 0;
            ad2025_FERIADO = acuerdoBaseNoRemDic / 30 * cferiado;
        }
    }

    // Calcular el total no remunerativo sumando lo nuevo (acuerdoBaseNoRemDic se suma tambien)
    let total_noremunerativo = acuerdoBaseNoRem + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO + 
                            acuerdoBaseNoRemDic + ad2025_PRESENTISMO + ad2025_ANTIGUEDAD + ad2025_PUNTUALIDAD + ad2025_FERIADO;

    // Retornamos array extendido incluyendo el Acuerdo Base Diciembre y su Presentismo
    return [
        acuerdoBaseNoRem, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, 
        acuerdoBaseNoRemDic, ad2025_PRESENTISMO, ad2025_ANTIGUEDAD, ad2025_PUNTUALIDAD, ad2025_FERIADO, 
        total_noremunerativo
    ];
}

function descuentos(tremunerativo, tnremunerativo, obrasocial) {
    let APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO;
    
    const total_remunerativo = tremunerativo[tremunerativo.length - 1];
    const total_noremunerativo = tnremunerativo[tnremunerativo.length - 1]; 

    APORTE_SIJP_SOBRE_SUELDO = total_remunerativo * 11 / 100;
    APORTE_INSSJP_SOBRE_SUELDO = total_remunerativo * 3 / 100;
    APORTE_O_SOC_SOBRE_SUELDO = total_remunerativo * 3 / 100;
    CTT_S_FALLECIMIENTO = total_remunerativo * 0.59 / 100;
    CTT_688_14 = (total_remunerativo + total_noremunerativo) * 1.5 / 100;

    if (obrasocial == 'GEA') {
        APORTE_O_SOC_ACUERDO = total_remunerativo * 1.30 / 100;
    } else {
        APORTE_O_SOC_ACUERDO = 0;
    }

    let total_descuentos = APORTE_SIJP_SOBRE_SUELDO + APORTE_INSSJP_SOBRE_SUELDO + APORTE_O_SOC_SOBRE_SUELDO + CTT_S_FALLECIMIENTO + CTT_688_14 + APORTE_O_SOC_ACUERDO;

    return [APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO, total_descuentos];
}

document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();

    const mes = document.getElementById('mes').value;
    const contrato = document.getElementById('contrato').value;
    
    if (mes === 'Selecciona el Mes' || contrato === 'Contrato de Trabajo') {
        alert('Por favor, selecciona el Mes y el Contrato de Trabajo.');
        return;
    }
    
    if (!ESCALAS_SALARIALES[mes] || !ESCALAS_SALARIALES[mes][contrato]) {
        alert(`Error: No se encontró data salarial para Mes: ${mes} y Contrato: ${contrato}.`);
        return;
    }

    const faltas = document.getElementById('faltas').value;
    const tarde = document.getElementById('tarde').value;
    const cferiado = parseInt(document.getElementById('feriados').value) || 0;
    const nocturnas = parseInt(document.getElementById('nocturnas').value) || 0;
    const extras50 = parseInt(document.getElementById('extras50').value) || 0; // Horas Extras 50%
    const aantiguedad = parseInt(document.getElementById('antiguedad').value) || 0;
    const obrasocial = document.getElementById('obrasocial').value;

    let justificadas, cfaltas;

    if (faltas === 'SI') {
        justificadas = document.getElementById('justificadas').value;
        cfaltas = parseInt(document.getElementById('cfaltas').value) || 0;
        if (justificadas === 'Fueron Justificadas?') {
            alert('Por favor, selecciona si las faltas fueron justificadas.');
            return;
        }
    } else {
        justificadas = 'NO';
        cfaltas = 0;
    }

    // Calcular sueldo (se pasan mes y extras50)
    const tsueldo = sueldo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50, extras100);

    // Generar listas de valores (se pasan mes y extras50)
    const tremunerativo = remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50, extras100);
    const tnremunerativo = no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    const tdescuentos = descuentos(tremunerativo, tnremunerativo, obrasocial);

    const mainContainer = document.querySelector('main');

    const tablaExistente = document.querySelector('table');
    if (tablaExistente) { tablaExistente.remove(); }
    const tituloExistente = document.querySelector('p');
    if (tituloExistente) { tituloExistente.remove(); }
    const contenedorExistente = document.getElementById('resultado-container');
    if (contenedorExistente) { contenedorExistente.remove(); }

    const titulo = document.createElement("p");
    titulo.innerHTML = `<h3>${mes}</h3>`;
    mainContainer.append(titulo);

    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered';
    const encabezado = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');
    ['Conceptos', 'Haberes', 'No Remunerativo', 'Descuentos'].forEach(texto => {
        const th = document.createElement('th');
        th.innerText = texto;
        filaEncabezado.appendChild(th);
    });
    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);
    const cuerpo = document.createElement('tbody');

    // Definir los conceptos.
    const lineItems = [
        // Haberes
        { name: "BASICO", haberes: tremunerativo[0], no_remunerativo: 0, descuentos: 0 },
        { name: "FERIADO", haberes: tremunerativo[1], no_remunerativo: 0, descuentos: 0 },
        { name: "PRESENTISMO", haberes: tremunerativo[2], no_remunerativo: 0, descuentos: 0 },
        { name: "ANTIGUEDAD", haberes: tremunerativo[3], no_remunerativo: 0, descuentos: 0 },
        { name: "PUNTUALIDAD", haberes: tremunerativo[4], no_remunerativo: 0, descuentos: 0 },
        { name: "DIAS DE LICENCIA", haberes: tremunerativo[5], no_remunerativo: 0, descuentos: 0 },
        { name: "ADICIONAL HORA NOCTURNA", haberes: tremunerativo[6], no_remunerativo: 0, descuentos: 0 },
        { name: "HORAS EXTRAS 50%", haberes: tremunerativo[7], no_remunerativo: 0, descuentos: 0 },
        { name: "HORAS EXTRAS 100%", haberes: tremunerativo[8], no_remunerativo: 0, descuentos: 0},
        { name: "ACUERDO JUNIO 2025", haberes: tremunerativo[9], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 PRESENTISMO", haberes: tremunerativo[10], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD", haberes: tremunerativo[11], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 PUNTUALIDAD", haberes: tremunerativo[12], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 FERIADO", haberes: tremunerativo[13], no_remunerativo: 0, descuentos: 0 },

        // No Remunerativos
        { name: "ACUERDO JULIO 2025", haberes: 0, no_remunerativo: tnremunerativo[0], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 PRESENTISMO", haberes: 0, no_remunerativo: tnremunerativo[1], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 ANTIGUEDAD", haberes: 0, no_remunerativo: tnremunerativo[2], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 PUNTUALIDAD", haberes: 0, no_remunerativo: tnremunerativo[3], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 FERIADO", haberes: 0, no_remunerativo: tnremunerativo[4], descuentos: 0 },
        
        // NUEVOS ITEMS ACUERDO DICIEMBRE (Indices actualizados con base y presentismo)
        { name: "ACUERDO DIC 2025", haberes: 0, no_remunerativo: tnremunerativo[5], descuentos: 0 },
        { name: "ACUERDO DIC 2025 PRESENTISMO", haberes: 0, no_remunerativo: tnremunerativo[6], descuentos: 0 },
        { name: "ACUERDO DIC 2025 ANTIGUEDAD", haberes: 0, no_remunerativo: tnremunerativo[7], descuentos: 0 },
        { name: "ACUERDO DIC 2025 PUNTUALIDAD", haberes: 0, no_remunerativo: tnremunerativo[8], descuentos: 0 },
        { name: "ACUERDO DIC 2025 FERIADO", haberes: 0, no_remunerativo: tnremunerativo[9], descuentos: 0 },

        // Descuentos
        { name: "APORTE SIJP SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[0] },
        { name: "APORTE INSSJP SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[1] },
        { name: "APORTE O. SOC SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[2] },
        { name: "CTT S FALLECIMIENTO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[3] },
        { name: "CTT 688/14", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[4] },
        { name: "APORTE O. SOCIAL ACUERDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[5] },
    ];

    for (const item of lineItems) {
        if (item.haberes === 0 && item.no_remunerativo === 0 && item.descuentos === 0) {
            continue; 
        }

        const fila = document.createElement('tr');
        const celdaConcepto = document.createElement('td');
        celdaConcepto.innerText = item.name;
        const celdaHaberes = document.createElement('td');
        celdaHaberes.innerText = item.haberes > 0 ? item.haberes.toFixed(2) : '';
        const celdaNoRemunerativo = document.createElement('td');
        celdaNoRemunerativo.innerText = item.no_remunerativo > 0 ? item.no_remunerativo.toFixed(2) : '';
        const celdaDescuentos = document.createElement('td');
        celdaDescuentos.innerText = item.descuentos > 0 ? item.descuentos.toFixed(2) : '';

        fila.appendChild(celdaConcepto);
        fila.appendChild(celdaHaberes);
        fila.appendChild(celdaNoRemunerativo);
        fila.appendChild(celdaDescuentos);
        cuerpo.appendChild(fila);
    }
    
    const filaFinal = document.createElement('tr');
    const celdaFinal1 = document.createElement('td');
    celdaFinal1.innerText = 'TOTALES'; 
    const celdaFinal2 = document.createElement('td');
    celdaFinal2.innerText = tremunerativo[tremunerativo.length - 1].toFixed(2); 
    const celdaFinal3 = document.createElement('td');
    celdaFinal3.innerText = tnremunerativo[tnremunerativo.length - 1].toFixed(2); 
    const celdaFinal4 = document.createElement('td');
    celdaFinal4.innerText = tdescuentos[tdescuentos.length - 1].toFixed(2); 

    filaFinal.appendChild(celdaFinal1);
    filaFinal.appendChild(celdaFinal2);
    filaFinal.appendChild(celdaFinal3);
    filaFinal.appendChild(celdaFinal4);
    cuerpo.appendChild(filaFinal);

    tabla.appendChild(cuerpo);
    mainContainer.appendChild(tabla);

    const contenedor = document.createElement("div");
    contenedor.id = "resultado-container";
    contenedor.innerHTML = `<h3>Total a cobrar:</h3>
                            <p>${tsueldo}</p> 
                            <p>Aclaración: Este valor no es exacto, es una aproximación</p>`;
    mainContainer.appendChild(contenedor);
});

const faltasContainer = document.getElementById('faltas-container');
const faltasSelect = document.getElementById('faltas');

function actualizarFaltasContainer() {
    if (faltasSelect.value === 'SI') {
        faltasContainer.style.display = 'flex'; 
    } else {
        faltasContainer.style.display = 'none'; 
    }
}

faltasSelect.addEventListener('change', actualizarFaltasContainer);

document.getElementById('limpiar').addEventListener('click', () => {
    miformulario.reset(); 
    actualizarFaltasContainer();
});

actualizarFaltasContainer();
