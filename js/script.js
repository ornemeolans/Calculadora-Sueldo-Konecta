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
        basico = 638121.21;
    } else if (contrato == '36hs' && faltas == 'SI') {
        basico = (638121.21 / 30) * (30 - cfaltas);
    } else if (contrato == '35hs' && faltas == 'NO') {
        basico = 620395.61;
    } else if (contrato == '35hs' && faltas == 'SI') {
        basico = (620395.61 / 30) * (30 - cfaltas);
    } else if (contrato == '30hs' && faltas == 'NO') {
        basico = 531767.69;
    } else if (contrato == '30hs' && faltas == 'SI') {
        basico = (531767.69 / 30) * (30 - cfaltas);
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
    let aj2024, as2024, ae2025;

    // Definir los valores no remunerativos según el tipo de contrato
    if (contrato == '36hs') {
        aj2024 = 48131.99;
        as2024 = 50234.31;
        ae2025 = 12520.29;
    } else if (contrato == '35hs') {
        aj2024 = 47463.49;
        as2024 = 48838.91;
        ae2025 = 12172.5;
    } else if (contrato == '30hs') {
        aj2024 = 40109.99;
        as2024 = 41861.92;
        ae2025 = 10433.57;
    }

    let aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO;
    let as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO;
    let ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO;

    // Calcular los valores no remunerativos según las faltas
    if (faltas == 'NO' && tarde == 'NO') {
        aj2024_PRESENTISMO = aj2024 * 10 / 100;
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100;
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100;
        aj2024_FERIADO = aj2024 / 30 * cferiado;

        as2024_PRESENTISMO = as2024 * 10 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100;
        as2024_FERIADO = as2024 / 30 * cferiado;

        ae2025_PRESENTISMO = ae2025 * 10 / 100;
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100;
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100;
        ae2025_FERIADO = ae2025 / 30 * cferiado;
    } else if (faltas == 'NO' && tarde == 'SI') {
        aj2024_PRESENTISMO = aj2024 * 10 / 100;
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100;
        aj2024_PUNTUALIDAD = 0;
        aj2024_FERIADO = aj2024 / 30 * cferiado;

        as2024_PRESENTISMO = as2024 * 10 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        ae2025_PRESENTISMO = ae2025 * 10 / 100;
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100;
        ae2025_PUNTUALIDAD = 0;
        ae2025_FERIADO = ae2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'NO') {
        aj2024_PRESENTISMO = aj2024 * 6 / 100;
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100;
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100;
        aj2024_FERIADO = aj2024 / 30 * cferiado;

        as2024_PRESENTISMO = as2024 * 6 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100;
        as2024_FERIADO = as2024 / 30 * cferiado;

        ae2025_PRESENTISMO = ae2025 * 6 / 100;
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100;
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100;
        ae2025_FERIADO = ae2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'SI' && tarde == 'SI') {
        aj2024_PRESENTISMO = aj2024 * 6 / 100;
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100;
        aj2024_PUNTUALIDAD = 0;
        aj2024_FERIADO = aj2024 / 30 * cferiado;

        as2024_PRESENTISMO = as2024 * 6 / 100;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        ae2025_PRESENTISMO = ae2025 * 6 / 100;
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100;
        ae2025_PUNTUALIDAD = 0;
        ae2025_FERIADO = ae2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'SI') {
        aj2024_PRESENTISMO = 0;
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100;
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100;
        aj2024_FERIADO = aj2024 / 30 * cferiado;

        as2024_PRESENTISMO = 0;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        ae2025_PRESENTISMO = 0;
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100;
        ae2025_PUNTUALIDAD = 0;
        ae2025_FERIADO = ae2025 / 30 * cferiado;
    } else if (faltas == 'SI' && justificadas == 'NO' && tarde == 'NO') {
        aj2024_PRESENTISMO = 0;
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100;
        aj2024_PUNTUALIDAD = as2024 * 0.5 / 100;
        aj2024_FERIADO = aj2024 / 30 * cferiado;

        as2024_PRESENTISMO = 0;
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100;
        as2024_PUNTUALIDAD = 0;
        as2024_FERIADO = as2024 / 30 * cferiado;

        ae2025_PRESENTISMO = 0;
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100;
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100;
        ae2025_FERIADO = ae2025 / 30 * cferiado;
    }

    // Calcular el total no remunerativo
    let total_noremunerativo = aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO +
        as2024 + as2024_PRESENTISMO + as2024_ANTIGUEDAD + as2024_PUNTUALIDAD + as2024_FERIADO +
        ae2025 + ae2025_PRESENTISMO + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_FERIADO;

    return [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO,
        as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO,
        ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo];
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

    // Depuración: Verificar el estado del contenedor antes de calcular
    console.log('Estado de faltasContainer antes de calcular:', faltasContainer.style.display);

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
    titulo.innerHTML = "<h3>Marzo</h3>";
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
        "ACUERDO JULIO 2024", "ACUERDO JULIO 2024 PRESENTISMO",
        "ACUERDO JULIO 2024 ANTIGUEDAD", "ACUERDO JULIO 2024 PUNTUALIDAD", "ACUERDO JULIO 2024 FERIADO",
        "ACUERDO SEPTIEMBRE 2024", "ACUERDO SEPTIEMBRE 2024 PRESENTISMO",
        "ACUERDO SEPTIEMBRE 2024 ANTIGUEDAD", "ACUERDO SEPTIEMBRE 2024 PUNTUALIDAD",
        "ACUERDO SEPTIEMBRE 2024 FERIADO", "ACUERDO ENERO 2025", "ACUERDO ENERO 2025 PRESENTISMO", "ACUERDO ENERO 2025 ANTIGUEDAD", "ACUERDO ENERO 2025 PUNTUALIDAD", "ACUERDO ENERO 2025 FERIADO", "APORTE SIJP SOBRE SUELDO",
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
    // Depuración: Verificar el estado del contenedor después de calcular
    console.log('Estado de faltasContainer después de calcular:', faltasContainer.style.display);
});

// Get the faltas container
const faltasContainer = document.getElementById('faltas-container');
// Get the faltas select
const faltasSelect = document.getElementById('faltas');

// Función para mostrar u ocultar el contenedor de faltas
function actualizarFaltasContainer() {
    console.log('Valor de faltasSelect:', faltasSelect.value);
    if (faltasSelect.value === 'SI') {
        faltasContainer.style.display = 'flex'; // Mostrar el contenedor
    } else {
        faltasContainer.style.display = 'none'; // Ocultar el contenedor
    }
    console.log('Estado de faltasContainer:', faltasContainer.style.display);
}

// Escuchar cambios en el campo "Tuviste Faltas?"
faltasSelect.addEventListener('change', actualizarFaltasContainer);

// Resetear el formulario y actualizar el contenedor de faltas
document.getElementById('limpiar').addEventListener('click', () => {
    miformulario.reset(); // Resetear el formulario
    console.log('Formulario reseteado');

    // Forzar la actualización del contenedor de faltas
    actualizarFaltasContainer();

    // Depuración adicional: Verificar si el contenedor existe en el DOM
    console.log('¿Existe faltasContainer en el DOM?', !!faltasContainer);

    // Depuración adicional: Verificar el valor de faltasSelect después del reset
    console.log('Valor de faltasSelect después del reset:', faltasSelect.value);
});

// Inicializar el estado del contenedor de faltas al cargar la página
actualizarFaltasContainer();