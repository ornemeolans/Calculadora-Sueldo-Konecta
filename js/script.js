let miformulario = document.getElementById('formulario_sueldo');

// Se añade extras50 a la firma de la función sueldo
function sueldo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50) {
    let tremunerativo = remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50);
    let tnremunerativo = no_remunerativo(contrato, tarde, faltas, justificadas, cferiado, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo, obrasocial);
    let sueldo = tremunerativo[tremunerativo.length - 1] + tnremunerativo[tnremunerativo.length - 1] - tdescuento[tdescuento.length - 1];
    return sueldo.toFixed(2);
}

// Se añade extras50 a la firma de la función remunerativo
function remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50) {
    let basico, feriados, antiguedad, nocturnasAdicional, puntualidad, presentismo, dlicencia, aj2025, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, extras50_calc;

    // Definir el básico según el tipo de contrato
    if (contrato == '36hs' && faltas == 'NO') {
        basico = 813137.85;
        aj2025 = 7894.54; 
    } else if (contrato == '36hs' && faltas == 'SI') {
        basico = (813137.85 / 30) * (30 - cfaltas);
        aj2025 = 7894.54;
    } else if (contrato == '35hs' && faltas == 'NO') {
        basico = 790550.66;
        aj2025 = 7675.25;
    } else if (contrato == '35hs' && faltas == 'SI') {
        basico = (790550.66 / 30) * (30 - cfaltas);
        aj2025 = 7675.25;
    } else if (contrato == '30hs' && faltas == 'NO') {
        basico = 677614.89;
        aj2025 = 6578.79;
    } else if (contrato == '30hs' && faltas == 'SI') {
        basico = (677614.89 / 30) * (30 - cfaltas);
        aj2025 = 6578.79;
    }

    // Calcular feriados, antigüedad y horas nocturnas
    feriados = basico / 30 * cferiado;
    antiguedad = basico * aantiguedad / 100;
    nocturnasAdicional = ((basico / 24) / 6 * 0.1311) * nocturnas;
    // Cálculo de horas extras al 50%
    extras50_calc = (basico / 24 / 6) * 1.5 * extras50; 

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

    // Calcular el total remunerativo: se añade extras50_calc
    let total_remunerativo = basico + feriados + antiguedad + nocturnasAdicional + puntualidad + presentismo + dlicencia + aj2025 + aj2025_PRESENTISMO + aj2025_ANTIGUEDAD + aj2025_PUNTUALIDAD + aj2025_FERIADO + extras50_calc;
    
    // Se añade extras50_calc al array de retorno (posición 7)
    return [basico, feriados, presentismo, antiguedad, puntualidad, dlicencia, nocturnasAdicional, extras50_calc, aj2025, aj2025_PRESENTISMO, aj2025_ANTIGUEDAD, aj2025_PUNTUALIDAD, aj2025_FERIADO, total_remunerativo];
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
    const extras50 = parseInt(document.getElementById('extras50').value) || 0; // Nuevo: Horas Extras 50%
    const obrasocial = document.getElementById('obrasocial').value;

    let justificadas, cfaltas;

    if (faltas === 'SI') {
        justificadas = document.getElementById('justificadas').value;
        cfaltas = parseInt(document.getElementById('cfaltas').value) || 0;
    } else {
        justificadas = 'NO';
        cfaltas = 0;
    }

    // Calcular sueldo (se pasa extras50)
    const tsueldo = sueldo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, obrasocial, extras50);

    // Generar listas de valores (se pasa extras50)
    const tremunerativo = remunerativo(contrato, tarde, faltas, justificadas, cfaltas, cferiado, nocturnas, aantiguedad, extras50);
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
    titulo.innerHTML = "<h3>Octubre</h3>";
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

    // **Nueva lógica para generar la tabla (Omite filas con valor 0)**
    
    // Crear un listado unificado de conceptos y sus valores correspondientes
    // Las posiciones de tremunerativo y tnremunerativo deben coincidir con las funciones.
    const lineItems = [
        // Haberes
        { name: "BASICO", haberes: tremunerativo[0], no_remunerativo: 0, descuentos: 0 },
        { name: "FERIADO", haberes: tremunerativo[1], no_remunerativo: 0, descuentos: 0 },
        { name: "PRESENTISMO", haberes: tremunerativo[2], no_remunerativo: 0, descuentos: 0 },
        { name: "ANTIGUEDAD", haberes: tremunerativo[3], no_remunerativo: 0, descuentos: 0 },
        { name: "PUNTUALIDAD", haberes: tremunerativo[4], no_remunerativo: 0, descuentos: 0 },
        { name: "DIAS DE LICENCIA", haberes: tremunerativo[5], no_remunerativo: 0, descuentos: 0 },
        { name: "ADICIONAL HORA NOCTURNA", haberes: tremunerativo[6], no_remunerativo: 0, descuentos: 0 },
        { name: "HORAS EXTRAS 50%", haberes: tremunerativo[7], no_remunerativo: 0, descuentos: 0 }, // Nuevo concepto (índice 7 en tremunerativo)
        { name: "ACUERDO JUNIO 2025", haberes: tremunerativo[8], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 PRESENTISMO", haberes: tremunerativo[9], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 ANTIGUEDAD", haberes: tremunerativo[10], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 PUNTUALIDAD", haberes: tremunerativo[11], no_remunerativo: 0, descuentos: 0 },
        { name: "ACUERDO JUNIO 2025 FERIADO", haberes: tremunerativo[12], no_remunerativo: 0, descuentos: 0 },

        // No Remunerativos (Nótese que los acuerdos JULIO 2025 son NO REMUNERATIVOS)
        { name: "ACUERDO JULIO 2025", haberes: 0, no_remunerativo: tnremunerativo[0], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 PRESENTISMO", haberes: 0, no_remunerativo: tnremunerativo[1], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 ANTIGUEDAD", haberes: 0, no_remunerativo: tnremunerativo[2], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 PUNTUALIDAD", haberes: 0, no_remunerativo: tnremunerativo[3], descuentos: 0 },
        { name: "ACUERDO JULIO 2025 FERIADO", haberes: 0, no_remunerativo: tnremunerativo[4], descuentos: 0 },

        // Descuentos
        { name: "APORTE SIJP SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[0] },
        { name: "APORTE INSSJP SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[1] },
        { name: "APORTE O. SOC SOBRE SUELDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[2] },
        { name: "CTT S FALLECIMIENTO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[3] },
        { name: "CTT 688/14", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[4] },
        { name: "APORTE O. SOCIAL ACUERDO", haberes: 0, no_remunerativo: 0, descuentos: tdescuentos[5] },
    ];

    // Iteramos sobre el nuevo listado de conceptos
    for (const item of lineItems) {
        // Omite la fila si los tres valores (Haberes, No Remunerativo, Descuentos) son 0
        if (item.haberes === 0 && item.no_remunerativo === 0 && item.descuentos === 0) {
            continue; 
        }

        const fila = document.createElement('tr');

        const celdaConcepto = document.createElement('td');
        celdaConcepto.innerText = item.name;

        const celdaHaberes = document.createElement('td');
        // Muestra el valor o cadena vacía si es 0
        celdaHaberes.innerText = item.haberes > 0 ? item.haberes.toFixed(2) : '';

        const celdaNoRemunerativo = document.createElement('td');
        // Muestra el valor o cadena vacía si es 0
        celdaNoRemunerativo.innerText = item.no_remunerativo > 0 ? item.no_remunerativo.toFixed(2) : '';

        const celdaDescuentos = document.createElement('td');
        // Muestra el valor o cadena vacía si es 0
        celdaDescuentos.innerText = item.descuentos > 0 ? item.descuentos.toFixed(2) : '';

        // Agregar las celdas a la fila
        fila.appendChild(celdaConcepto);
        fila.appendChild(celdaHaberes);
        fila.appendChild(celdaNoRemunerativo);
        fila.appendChild(celdaDescuentos);
        cuerpo.appendChild(fila);
    }

    // Última fila con los totales (usando el último valor de cada lista)
    const filaFinal = document.createElement('tr');
    const celdaFinal1 = document.createElement('td');
    celdaFinal1.innerText = 'TOTALES'; // Concepto
    const celdaFinal2 = document.createElement('td');
    celdaFinal2.innerText = tremunerativo[tremunerativo.length - 1].toFixed(2); // Último valor de Haberes
    const celdaFinal3 = document.createElement('td');
    celdaFinal3.innerText = tnremunerativo[tnremunerativo.length - 1].toFixed(2); // Último valor de No Remunerativo
    const celdaFinal4 = document.createElement('td');
    celdaFinal4.innerText = tdescuentos[tdescuentos.length - 1].toFixed(2); // Último valor de Descuentos

    filaFinal.appendChild(celdaFinal1);
    filaFinal.appendChild(celdaFinal2);
    filaFinal.appendChild(celdaFinal3);
    filaFinal.appendChild(celdaFinal4);
    cuerpo.appendChild(filaFinal);

    // Agregar el cuerpo de la tabla a la tabla
    tabla.appendChild(cuerpo);

    // Agregar tabla al DOM
    mainContainer.appendChild(tabla);

    // Mostrar el total a cobrar
    const contenedorExistente = document.getElementById('resultado-container');
    if (contenedorExistente) {
        contenedorExistente.remove();
    }
    const contenedor = document.createElement("div");
    contenedor.id = "resultado-container";
    // ID específico para este contenedor
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