let miformulario = document.getElementById('formulario_sueldo');

function sueldo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial) {
    let tremunerativo = remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad);
    let tnremunerativo = no_remunerativo(contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo, obrasocial);
    let sueldo = tremunerativo[tremunerativo.length - 1] + tnremunerativo[tnremunerativo.length - 1] - tdescuento[tdescuento.length - 1];
    return sueldo.toFixed(2);
}

function remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad) {
    let basico, feriados, antiguedad, nocturnasAdicional, puntualidad, presentismo, dlicencia;

    // Definir el básico según el tipo de contrato
    if (contrato == '36hs' && faltas == 'NO') {
        basico = 698773.49;
    } else if (contrato == '36hs' && faltas == 'SI') {
        basico = (698773.49 / 30) * (30 - cfaltas);
    } else if (contrato == '35hs' && faltas == 'NO') {
        basico = 679363.1;
    } else if (contrato == '35hs' && faltas == 'SI') {
        basico = (679363.1 / 30) * (30 - cfaltas);
    } else if (contrato == '30hs' && faltas == 'NO') {
        basico = 582311.26;
    } else if (contrato == '30hs' && faltas == 'SI') {
        basico = (582311.26 / 30) * (30 - cfaltas);
    }

    // Calcular feriados, antigüedad y horas nocturnas
    feriados = basico / 30 * cferiado;
    antiguedad = basico * aantiguedad / 100;
    nocturnasAdicional = ((basico / 24) / 6 * 0.1311) * nocturnas;

    // Calcular puntualidad y presentismo según las faltas
    if (faltas == 'NO' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 10 / 100;
        dlicencia = 0;
    } else if (faltas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 10 / 100;
        dlicencia = 0;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = 0;
        dlicencia = 0;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = 0;
        dlicencia = 0;
    }

    // Calcular el total remunerativo
    let total_remunerativo = basico + feriados + antiguedad + nocturnasAdicional + puntualidad + presentismo + dlicencia;
    return [basico, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, total_remunerativo];
}

function no_remunerativo(contrato, tarde, faltas, justificadas, cferiado, aantiguedad) {
    let aa2025, as2024, am2025;

    // Definir los valores no remunerativos según el tipo de contrato
    if (contrato == '36hs') {
        as2024 = 50234.31;
        aa2025 = 40446.42;
        am2025 = 17601.68;
    } else if (contrato == '35hs') {
        as2024 = 48838.91;
        aa2025 = 39322.91;
        am2025 = 17122.75;
    } else if (contrato == '30hs') {
        as2024 = 41861.92;
        aa2025 = 33705.35;
        am2025 = 14668.07;
    }

    let aa2025_PRESENTISMO, aa2025_ANTIGUEDAD, aa2025_PUNTUALIDAD, aa2025_FERIADO;
    let as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO;
    let am2025_PRESENTISMO, am2025_ANTIGUEDAD, am2025_PUNTUALIDAD, am2025_FERIADO;

    // Calcular los valores no remunerativos según las faltas
    if (faltas == 'NO' && tarde == 'NO') {
        as2024_PRESENTISMO = as2024 * 10 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100;
        as2024_FERIADO = as2024 / 30 * cferiado;

        aa2025_PRESENTISMO = aa2025 * 10 / 100;
        aa2025_ANTIGUEDAD = aa2025 * aantiguedad / 100;
        aa2025_PUNTUALIDAD = aa2025 * 0.5 / 100;
        aa2025_FERIADO = aa2025 / 30 * cferiado;

        am2025_PRESENTISMO = am2025 * 10 / 100;
        am2025_ANTIGUEDAD = am2025 * aantiguedad / 100;
        am2025_PUNTUALIDAD = am2025 * 0.5 / 100;
        am2025_FERIADO = am2025 / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        as2024_PRESENTISMO = as2024 * 10 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        aa2025_PRESENTISMO = aa2025 * 10 / 100;
        aa2025_ANTIGUEDAD = aa2025 * aantiguedad / 100;
        aa2025_PUNTUALIDAD = 0;
        aa2025_FERIADO = aa2025 / 30 * cferiado;

        am2025_PRESENTISMO = aj2025 * 10 / 100;
        am2025_ANTIGUEDAD = am2025 * aantiguedad / 100;
        am2025_PUNTUALIDAD = 0;
        am2025_FERIADO = am2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {      
        as2024_PRESENTISMO = as2024 * 6 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100;
        as2024_FERIADO = as2024 / 30 * cferiado;

        aa2025_PRESENTISMO = aa2025 * 6 / 100;
        aa2025_ANTIGUEDAD = aa2025 * aantiguedad / 100;
        aa2025_PUNTUALIDAD = aa2025 * 0.5 / 100;
        aa2025_FERIADO = aa2025 / 30 * cferiado;

        am2025_PRESENTISMO = am2025 * 6 / 100;
        am2025_ANTIGUEDAD = am2025 * aantiguedad / 100;
        am2025_PUNTUALIDAD = am2025 * 0.5 / 100;
        am2025_FERIADO = am2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        as2024_PRESENTISMO = as2024 * 6 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        aa2025_PRESENTISMO = aa2025 * 6 / 100;
        aa2025_ANTIGUEDAD = aa2025 * aantiguedad / 100;
        aa2025_PUNTUALIDAD = 0;
        aa2025_FERIADO = aa2025 / 30 * cferiado;

        am2025_PRESENTISMO = am2025 * 6 / 100;
        am2025_ANTIGUEDAD = am2025 * aantiguedad / 100;
        am2025_PUNTUALIDAD = 0;
        am2025_FERIADO = am2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        as2024_PRESENTISMO = 0;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        aa2025_PRESENTISMO = 0;
        aa2025_ANTIGUEDAD = aa2025 * aantiguedad / 100;
        aa2025_PUNTUALIDAD = 0;
        aa2025_FERIADO = aa2025 / 30 * cferiado;

        am2025_PRESENTISMO = 0;
        am2025_ANTIGUEDAD = am2025 * aantiguedad / 100;
        am2025_PUNTUALIDAD = am2025 * 0.5 / 100;
        am2025_FERIADO = am2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        as2024_PRESENTISMO = 0;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        aa2025_PRESENTISMO = 0;
        aa2025_ANTIGUEDAD = aa2025 * aantiguedad / 100;
        aa2025_PUNTUALIDAD = aa2025 * 0.5 / 100;
        aa2025_FERIADO = aa2025 / 30 * cferiado;

        am2025_PRESENTISMO = 0;
        am2025_ANTIGUEDAD = am2025 * aantiguedad / 100;
        am2025_PUNTUALIDAD = am2025 * 0.5 / 100;
        am2025_FERIADO = am2025 / 30 * cferiado;
    }

    // Calcular el total no remunerativo
    let total_noremunerativo = aa2025 + aa2025_PRESENTISMO + aa2025_ANTIGUEDAD + aa2025_PUNTUALIDAD + aa2025_FERIADO +
        as2024 + as2024_PRESENTISMO + as2024_ANTIGUEDAD + as2024_PUNTUALIDAD + as2024_FERIADO +
        am2025 + am2025_PRESENTISMO + am2025_ANTIGUEDAD + am2025_PUNTUALIDAD + am2025_FERIADO;

    return [as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO,
        aa2025, am2025_PRESENTISMO, aa2025_ANTIGUEDAD, aa2025_PUNTUALIDAD, aa2025_FERIADO, 
        am2025, am2025_PRESENTISMO, am2025_ANTIGUEDAD, am2025_PUNTUALIDAD, am2025_FERIADO, total_noremunerativo];
}

function descuentos(tremunerativo, tnremunerativo, obrasocial) {
    let APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO;

    // Calcular los descuentos
    APORTE_SIJP_SOBRE_SUELDO = tremunerativo[tremunerativo.length - 1] * 11 / 100;
    APORTE_INSSJP_SOBRE_SUELDO = tremunerativo[tremunerativo.length - 1] * 3 / 100;
    APORTE_O_SOC_SOBRE_SUELDO = tremunerativo[tremunerativo.length - 1] * 3 / 100;
    CTT_S_FALLECIMIENTO = tremunerativo[tremunerativo.length - 1] * 0.59 / 100;
    CTT_688_14 = (tremunerativo[tremunerativo.length - 1] + tnremunerativo[tnremunerativo.length - 1]) * 1.5 / 100;

    // Calcular el aporte de obra social según la opción seleccionada
    if (obrasocial == 'GEA') {
        APORTE_O_SOC_ACUERDO = tremunerativo[tremunerativo.length - 1] * 1.30 / 100;
    } else {
        APORTE_O_SOC_ACUERDO = 0;
    }

    // Calcular el total de descuentos
    let total_descuentos = APORTE_SIJP_SOBRE_SUELDO + APORTE_INSSJP_SOBRE_SUELDO + APORTE_O_SOC_SOBRE_SUELDO + CTT_S_FALLECIMIENTO + CTT_688_14 + APORTE_O_SOC_ACUERDO;

    return [APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO, total_descuentos];
}

document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();


    // Recuperar valores del formulario
    const contrato = document.getElementById('contrato').value;
    const faltas = document.getElementById('faltas').value;
    const tarde = document.getElementById('tarde').value;
    const cferiado = parseInt(document.getElementById('feriados').value) || 0;
    const nocturnas = parseInt(document.getElementById('nocturnas').value) || 0;
    const aantiguedad = parseInt(document.getElementById('antiguedad').value) || 0;
    const obrasocial = document.getElementById('obrasocial').value;

    let justificadas, cfaltas;

    if (faltas === 'SI') {
        justificadas = document.getElementById('justificadas').value;
        cfaltas = parseInt(document.getElementById('cfaltas').value) || 0;
    } else {
        justificadas = 'NO';
        cfaltas = 0;
    }

    // Calcular sueldo
    const tsueldo = sueldo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial);

    // Generar listas de valores
    const tremunerativo = remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad);
    const tnremunerativo = no_remunerativo(contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    const tdescuentos = descuentos(tremunerativo, tnremunerativo, obrasocial);

    const mainContainer = document.querySelector('main');

    // Eliminar tabla anterior si existe
    const tablaExistente = document.querySelector('table');
    if (tablaExistente) {
        tablaExistente.remove();
    }

    // Eliminar título anterior si existe
    const tituloExistente = document.querySelector('p');
    if (tituloExistente) {
        tituloExistente.remove();
    }

    // Crear título
    const titulo = document.createElement("p");
    titulo.innerHTML = "<h3>Mayo</h3>";
    mainContainer.append(titulo);

    // Crear tabla
    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered';

    // Crear encabezado
    const encabezado = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');
    ['Conceptos', 'Haberes', 'No Remunerativo', 'Descuentos'].forEach(texto => {
        const th = document.createElement('th');
        th.innerText = texto;
        filaEncabezado.appendChild(th);
    });
    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);

    // Crear cuerpo de la tabla
    const cuerpo = document.createElement('tbody');

    // Lista de conceptos
    const conceptos = [
        "BASICO", "FERIADO", "PRESENTISMO", "ANTIGUEDAD", "PUNTUALIDAD", "DIAS DE LICENCIA", "ADICIONAL HORA NOCTURNA",
        "ACUERDO SEPTIEMBRE 2024", "ACUERDO SEPTIEMBRE 2024 PRESENTISMO",
        "ACUERDO SEPTIEMBRE 2024 ANTIGUEDAD", "ACUERDO SEPTIEMBRE 2024 PUNTUALIDAD",
        "ACUERDO SEPTIEMBRE 2024 FERIADO", "ACUERDO ABRIL 2025", "ACUERDO ABRIL 2025 PRESENTISMO", "ACUERDO ABRIL 2025 ANTIGUEDAD", "ACUERDO ABRIL 2025 PUNTUALIDAD", "ACUERDO ABRIL 2025 FERIADO", "ACUERDO MAYO 2025", "ACUERDO MAYO 2025 PRESENTISMO",
        "ACUERDO MAYO 2025 ANTIGUEDAD", "ACUERDO MAYO 2025 PUNTUALIDAD", "ACUERDO MAYO 2025 FERIADO", "APORTE SIJP SOBRE SUELDO",
        "APORTE INSSJP SOBRE SUELDO", "APORTE O. SOC SOBRE SUELDO", "CTT S FALLECIMIENTO", "CTT 688/14", "APORTE O. SOCIAL ACUERDO"
    ];

    // Índices para cada lista
    let idxRem = 0, idxNoRem = 0, idxDesc = 0;

    // Iteramos sobre los conceptos
    for (let i = 0; i < conceptos.length; i++) {
        const fila = document.createElement('tr');

        const celda2 = document.createElement('td'); // Conceptos
        celda2.innerText = conceptos[i];

        const celda3 = document.createElement('td'); // Haberes
        const celda4 = document.createElement('td'); // No Remunerativo
        const celda5 = document.createElement('td'); // Descuentos

        // Completar columna "Haberes" (columna 3)
        if (idxRem < tremunerativo.length - 1) {
            const valor = tremunerativo[idxRem++];
            celda3.innerText = valor.toFixed(2);
        } else {
            celda3.innerText = ''; // Dejar la celda vacía
        }

        // Completar columna "No Remunerativo" (columna 4) comenzando en la fila 8
        if (i >= 7 && idxNoRem < tnremunerativo.length - 1) {
            const valor = tnremunerativo[idxNoRem++];
            celda4.innerText = valor.toFixed(2);
        } else {
            celda4.innerText = ''; // Dejar la celda vacía
        }

        // Completar columna "Descuentos" (columna 5) comenzando en la fila 23
        if (i >= 22 && idxDesc < tdescuentos.length - 1) {
            const valor = tdescuentos[idxDesc++];
            celda5.innerText = valor.toFixed(2);
        } else {
            celda5.innerText = ''; // Dejar la celda vacía
        }

        // Agregar la fila a la tabla
        fila.appendChild(celda2);
        fila.appendChild(celda3);
        fila.appendChild(celda4);
        fila.appendChild(celda5);
        cuerpo.appendChild(fila);
    }

    // Última fila con los totales (usando el último valor de cada lista)
    const filaFinal = document.createElement('tr');
    const celdaFinal2 = document.createElement('td');
    const celdaFinal3 = document.createElement('td');
    celdaFinal3.innerText = tremunerativo[tremunerativo.length - 1].toFixed(2); // Último valor de Haberes
    const celdaFinal4 = document.createElement('td');
    celdaFinal4.innerText = tnremunerativo[tnremunerativo.length - 1].toFixed(2); // Último valor de No Remunerativo
    const celdaFinal5 = document.createElement('td');
    celdaFinal5.innerText = tdescuentos[tdescuentos.length - 1].toFixed(2); // Último valor de Descuentos

    filaFinal.appendChild(celdaFinal2);
    filaFinal.appendChild(celdaFinal3);
    filaFinal.appendChild(celdaFinal4);
    filaFinal.appendChild(celdaFinal5);
    cuerpo.appendChild(filaFinal);

    // Agregar el cuerpo de la tabla a la tabla
    tabla.appendChild(cuerpo);

    // Agregar tabla al DOM
    mainContainer.appendChild(tabla);

    // Mostrar el total a cobrar
    const contenedorExistente = document.querySelector('div');
    if (contenedorExistente) {
        contenedorExistente.remove();
    }
    const contenedor = document.createElement("div");
    contenedor.innerHTML = `<h3>Total a cobrar:</h3>
                            <p>${tsueldo}</p> 
                            <p>Aclaración: Este valor no es exacto, es una aproximación</p>`;
    mainContainer.appendChild(contenedor);
});

// Get the faltas container
const faltasContainer = document.getElementById('faltas-container');
// Get the faltas select
const faltasSelect = document.getElementById('faltas');

// Función para mostrar u ocultar el contenedor de faltas
function actualizarFaltasContainer() {
    if (faltasSelect.value === 'SI') {
        faltasContainer.style.display = 'flex'; // Mostrar el contenedor
    } else {
        faltasContainer.style.display = 'none'; // Ocultar el contenedor
    }
}

// Escuchar cambios en el campo "Tuviste Faltas?"
faltasSelect.addEventListener('change', actualizarFaltasContainer);

// Resetear el formulario y actualizar el contenedor de faltas
document.getElementById('limpiar').addEventListener('click', () => {
    miformulario.reset(); // Resetear el formulario

    // Forzar la actualización del contenedor de faltas
    actualizarFaltasContainer();
});

// Inicializar el estado del contenedor de faltas al cargar la página
actualizarFaltasContainer();
