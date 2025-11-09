let miformulario = document.getElementById('formulario_sueldo');

// 1. ESTRUCTURA DE DATOS SALARIALES EXTRAÍDA DEL PDF
const ESCALAS_SALARIALES = {
    "JULIO": {
        "36hs": { basico: 789454.22, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 767524.91, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 657878.54, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "AGOSTO": {
        "36hs": { basico: 797348.77, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 775200.16, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 664457.32, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "SEPTIEMBRE": {
        "36hs": { basico: 805243.31, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 782875.41, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 671036.10, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "OCTUBRE": {
        "36hs": { basico: 813137.85, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 790550.66, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 677614.89, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "NOVIEMBRE": {
        "36hs": { basico: 821032.39, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 798225.91, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 684193.68, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    },
    "DICIEMBRE": {
        "36hs": { basico: 828926.93, acuerdoRem: 7894.54, acuerdoNoRem: 29810.51 },
        "35hs": { basico: 805901.16, acuerdoRem: 7675.25, acuerdoNoRem: 28982.44 },
        "30hs": { basico: 690772.47, acuerdoRem: 6578.79, acuerdoNoRem: 24842.09 }
    }
};

// Se añade 'mes' y 'extras50' a la firma
function sueldo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50) {
    let tremunerativo = remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50);
    let tnremunerativo = no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo, obrasocial);
    let sueldo = tremunerativo[tremunerativo.length - 1] + tnremunerativo[tnremunerativo.length - 1] - tdescuento[tdescuento.length - 1];
    return sueldo.toFixed(2);
}

// Se añade 'mes' y 'extras50' a la firma
function remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50) {
    let feriados, antiguedad, nocturnasAdicional, puntualidad, presentismo, dlicencia, extras50_calc;
    let aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO;

    // Obtener los valores base según el mes y contrato
    const data = ESCALAS_SALARIALES[mes][contrato];
    let basico_base = data.basico;
    let acuerdoBaseRem = data.acuerdoRem; // Corresponde al INCREMENTO REM [MES] 2025
    let basico;

    // Calcular el básico con o sin faltas
    if (faltas == 'SI') {
        basico = (basico_base / 30) * (30 - cfaltas);
    } else {
        basico = basico_base;
    }

    // Calcular adicionales
    feriados = basico / 30 * cferiado;
    antiguedad = basico * aantiguedad / 100;
    nocturnasAdicional = ((basico / 24) / 6 * 0.1311) * nocturnas;
    extras50_calc = (basico / 24 / 6) * 1.5 * extras50; // Cálculo de Horas Extras al 50%

    // Lógica de Presentismo y Puntualidad, incluyendo la parte del Acuerdo Remunerativo
    if (faltas == 'NO' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + puntualidad) * 10 / 100;
        dlicencia = 0;
        aj2025_PRESENTISMO = acuerdoBaseRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + puntualidad) * 10 / 100;
        dlicencia = 0;
        aj2025_PRESENTISMO = acuerdoBaseRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
        aj2025_PRESENTISMO = acuerdoBaseRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + extras50_calc + puntualidad) * 6 / 100;
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
    let total_remunerativo = basico + feriados + antiguedad + nocturnasAdicional + puntualidad + presentismo + dlicencia + acuerdoBaseRem + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO + extras50_calc;
    
    // El orden de retorno es crucial para la generación de la tabla
    return [
        basico, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, extras50_calc, 
        acuerdoBaseRem, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, total_remunerativo
    ];
}

// Se añade 'mes' a la firma
function no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad) {
    let aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO;

    // Obtener el valor base del Acuerdo No Remunerativo
    const data = ESCALAS_SALARIALES[mes][contrato];
    let acuerdoBaseNoRem = data.acuerdoNoRem; // Corresponde al INCREMENTO NO REM JUNIO 2025

    // Lógica para calcular los valores no remunerativos basados en faltas
    if (faltas == 'NO' && tarde == 'NO') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseNoRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 10 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseNoRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        aj2025_PRESENTISMO = acuerdoBaseNoRem * 6 / 100;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseNoRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = acuerdoBaseNoRem * aantiguedad / 100;
        aj2025_PUNTUALIDAD = acuerdoBaseNoRem * 0.5 / 100;
        aj2025_FERIADO = acuerdoBaseNoRem / 30 * cferiado;
    }

    // Calcular el total no remunerativo
    let total_noremunerativo = acuerdoBaseNoRem + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO;

    // El orden de retorno es crucial para la generación de la tabla
    return [acuerdoBaseNoRem, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, total_noremunerativo];
}

function descuentos(tremunerativo, tnremunerativo, obrasocial) {
    let APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO;
    
    // El total remunerativo y no remunerativo se obtienen del último elemento de los arrays
    const total_remunerativo = tremunerativo[tremunerativo.length - 1];
    const total_noremunerativo = tnremunerativo[tnremunerativo.length - 1];

    // Calcular los descuentos
    APORTE_SIJP_SOBRE_SUELDO = total_remunerativo * 11 / 100;
    APORTE_INSSJP_SOBRE_SUELDO = total_remunerativo * 3 / 100;
    APORTE_O_SOC_SOBRE_SUELDO = total_remunerativo * 3 / 100;
    CTT_S_FALLECIMIENTO = total_remunerativo * 0.59 / 100;
    // CTT 688/14 se calcula sobre el total REM + NO REM
    CTT_688_14 = (total_remunerativo + total_noremunerativo) * 1.5 / 100;

    // Calcular el aporte de obra social según la opción seleccionada
    if (obrasocial == 'GEA') {
        APORTE_O_SOC_ACUERDO = total_remunerativo * 1.30 / 100;
    } else {
        APORTE_O_SOC_ACUERDO = 0;
    }

    // Calcular el total de descuentos
    let total_descuentos = APORTE_SIJP_SOBRE_SUELDO + APORTE_INSSJP_SOBRE_SUELDO + APORTE_O_SOC_SOBRE_SUELDO + CTT_S_FALLECIMIENTO + CTT_688_14 + APORTE_O_SOC_ACUERDO;

    return [APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO, total_descuentos];
}

document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();

    // Validar selección de mes y contrato
    const mes = document.getElementById('mes').value;
    const contrato = document.getElementById('contrato').value;
    
    if (mes === 'Selecciona el Mes' || contrato === 'Contrato de Trabajo') {
        alert('Por favor, selecciona el Mes y el Contrato de Trabajo.');
        return;
    }

    // Recuperar valores del formulario
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
    const tsueldo = sueldo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50);

    // Generar listas de valores (se pasan mes y extras50)
    const tremunerativo = remunerativo(mes, contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50);
    const tnremunerativo = no_remunerativo(mes, contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    const tdescuentos = descuentos(tremunerativo, tnremunerativo, obrasocial);

    const mainContainer = document.querySelector('main');

    // Limpiar tabla y título anteriores
    const tablaExistente = document.querySelector('table');
    if (tablaExistente) {
        tablaExistente.remove();
    }
    const tituloExistente = document.querySelector('p');
    if (tituloExistente) {
        tituloExistente.remove();
    }
    const contenedorExistente = document.getElementById('resultado-container');
    if (contenedorExistente) {
        contenedorExistente.remove();
    }

    // Crear título dinámico
    const titulo = document.createElement("p");
    titulo.innerHTML = `<h3>${mes}</h3>`;
    mainContainer.append(titulo);

    // Crear tabla y encabezado (misma lógica que antes)
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

    // **Lógica de conceptos unificada para omitir filas en cero**
    
    // Definir los conceptos con los valores calculados
    const lineItems = [
        // Haberes (Tremunerativo)
        { name: "BASICO", haberes: tremunerativo[0], no_remunerativo: 0, descuentos: 0 },
        { name: "FERIADO", haberes: tremunerativo[1], no_remunerativo: 0, descuentos: 0 },
        { name: "PRESENTISMO", haberes: tremunerativo[2], no_remunerativo: 0, descuentos: 0 },
        { name: "ANTIGUEDAD", haberes: tremunerativo[3], no_remunerativo: 0, descuentos: 0 },
        { name: "PUNTUALIDAD", haberes: tremunerativo[4], no_remunerativo: 0, descuentos: 0 },
        { name: "DIAS DE LICENCIA", haberes: tremunerativo[5], no_remunerativo: 0, descuentos: 0 },
        { name: "ADICIONAL HORA NOCTURNA", haberes: tremunerativo[6], no_remunerativo: 0, descuentos: 0 },
        { name: "HORAS EXTRAS 50%", haberes: tremunerativo[7], no_remunerativo: 0, descuentos: 0 }, 
        { name: "ACUERDO JUNIO 2025", haberes: tremunerativo[8], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 PRESENTISMO", haberes: tremunerativo[9], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD", haberes: tremunerativo[10], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 PUNTUALIDAD", haberes: tremunerativo[11], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 FERIADO", haberes: tremunerativo[12], no_remunerativo: 0, descuentos: 0 },

        // No Remunerativos (Tnremunerativo)
        { name: "ACUERDO JULIO 2025", haberes: 0, no_remunerativo: tnremunerativo[0], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 PRESENTISMO", haberes: 0, no_remunerativo: tnremunerativo[1], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 ANTIGUEDAD", haberes: 0, no_remunerativo: tnremunerativo[2], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 PUNTUALIDAD", haberes: 0, no_remunerativo: tnremunerativo[3], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 FERIADO", haberes: 0, no_remunerativo: tnremunerativo[4], descuentos: 0 },

        // Descuentos (Tdescuentos)
        { name: "APORTE SIJP SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[0] },
        { name: "APORTE INSSJP SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[1] },
        { name: "APORTE O. SOC SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[2] },
        { name: "CTT S FALLECIMIENTO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[3] },
        { name: "CTT 688/14", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[4] },
        { name: "APORTE O. SOCIAL ACUERDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[5] },
    ];

    // Iteramos y omitimos las filas en cero
    for (const item of lineItems) {
        // Omite la fila si los tres valores son 0
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

        // Agregar las celdas a la fila
        fila.appendChild(celdaConcepto);
        fila.appendChild(celdaHaberes);
        fila.appendChild(celdaNoRemunerativo);
        fila.appendChild(celdaDescuentos);
        cuerpo.appendChild(fila);
    }
    
    // Fila de totales
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

    // Mostrar el total a cobrar
    const contenedor = document.createElement("div");
    contenedor.id = "resultado-container";
    contenedor.innerHTML = `<h3>Total a cobrar:</h3>
                            <p>${tsueldo}</p> 
                            <p>Aclaración: Este valor no es exacto, es una aproximación</p>`;
    mainContainer.appendChild(contenedor);
});

// Lógica de Faltas y Reset (se mantiene igual)
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