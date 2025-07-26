let miformulario = document.getElementById('formulario_sueldo');

function sueldo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial) {
    let tremunerativo = remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad);
    let tnremunerativo = no_remunerativo(contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo, obrasocial);
    let sueldo = tremunerativo[tremunerativo.length - 1] + tnremunerativo[tnremunerativo.length - 1] - tdescuento[tdescuento.length - 1];
    return sueldo.toFixed(2);
}

function remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad) {
    let basico, feriados, antiguedad, nocturnasAdicional, puntualidad, presentismo, dlicencia, aj2025, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO;

    // Definir el básico según el tipo de contrato
    if (contrato == '36hs' && faltas == 'NO') {
        basico = 789454.22;
        aj2025 = 7894.54; 
    } else if (contrato == '36hs' && faltas == 'SI') {
        basico = (789454.22 / 30) * (30 - cfaltas);
        aj2025 = 7894.54;
    } else if (contrato == '35hs' && faltas == 'NO') {
        basico = 767524.91;
        aj2025 = 7675.25;
    } else if (contrato == '35hs' && faltas == 'SI') {
        basico = (767524.91 / 30) * (30 - cfaltas);
        aj2025 = 7675.25;
    } else if (contrato == '30hs' && faltas == 'NO') {
        basico = 657878.54;
        aj2025 = 6578.79;
    } else if (contrato == '30hs' && faltas == 'SI') {
        basico = (657878.54 / 30) * (30 - cfaltas);
        aj2025 = 6578.79;
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
        aj2025_PRESENTISMO = aj2025 * 10 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 10 / 100;
        dlicencia = 0;
        aj2025_PRESENTISMO = aj2025 * 10 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
        aj2025_PRESENTISMO = aj2025 * 6 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = (basico + feriados + antiguedad + nocturnasAdicional + puntualidad) * 6 / 100;
        dlicencia = basico / 30 * cfaltas;
        aj2025_PRESENTISMO = aj2025 * 6 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        puntualidad = basico * 0.5 / 100;
        presentismo = 0;
        dlicencia = 0;
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        puntualidad = 0;
        presentismo = 0;
        dlicencia = 0;
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    }

    // Calcular el total remunerativo
    let total_remunerativo = basico + feriados + antiguedad + nocturnasAdicional + puntualidad + presentismo + dlicencia + aj2025 + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO;
    return [basico, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, aj2025, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, total_remunerativo];
}

function no_remunerativo(contrato, tarde, faltas, justificadas, cferiado, aantiguedad) {
    let aj2025;

    // Definir los valores no remunerativos según el tipo de contrato
    if (contrato == '36hs') {
        aj2025 = 29810.51;
    } else if (contrato == '35hs') {
        aj2025 = 28982.44;
    } else if (contrato == '30hs') {
        aj2025 = 24842.09;
    }

    let aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO;

    // Calcular los valores no remunerativos según las faltas
    if (faltas == 'NO' && tarde == 'NO') {
        aj2025_PRESENTISMO = aj2025 * 10 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        aj2025_PRESENTISMO = aj2025 * 10 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        aj2025_PRESENTISMO = aj2025 * 6 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        aj2025_PRESENTISMO = aj2025 * 6 / 100;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = 0;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        aj2025_PRESENTISMO = 0;
        aj2025_ANTIGUEDAD = aj2025 * aantiguedad / 100;
        aj2025_PUNTUALIDAD = aj2025 * 0.5 / 100;
        aj2025_FERIADO = aj2025 / 30 * cferiado;
    }

    // Calcular el total no remunerativo
    let total_noremunerativo = aj2025 + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO;

    return [aj2025, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, total_noremunerativo];
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
    titulo.innerHTML = "<h3>Julio</h3>";
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
        "ACUERDO JUNIO 2025", "ACUERDO JUNIO 2025 PRESENTISMO",
        "ACUERDO JUNIO 2025 ANTIGUEDAD", "ACUERDO JUNIO 2025 PUNTUALIDAD", "ACUERDO JUNIO 2025 FERIADO",
        "ACUERDO JULIO 2025", "ACUERDO JULIO 2025 PRESENTISMO",
        "ACUERDO JULIO 2025 ANTIGUEDAD", "ACUERDO JULIO 2025 PUNTUALIDAD", "ACUERDO JULIO 2025 FERIADO", "APORTE SIJP SOBRE SUELDO",
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

        // Completar columna "No Remunerativo" (columna 4) comenzando en la fila 13
        if (i >= 12 && idxNoRem < tnremunerativo.length - 1) {
            const valor = tnremunerativo[idxNoRem++];
            celda4.innerText = valor.toFixed(2);
        } else {
            celda4.innerText = ''; // Dejar la celda vacía
        }

        // Completar columna "Descuentos" (columna 5) comenzando en la fila 17
        if (i >= 16 && idxDesc < tdescuentos.length - 1) {
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
