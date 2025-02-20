let miformulario = document.getElementById('formulario_sueldo');



function sueldo(contrato, faltas, cferiado, nocturnas, aantiguedad, obrasocial) {
    let tremunerativo = remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad);
    let tnremunerativo = no_remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo, obrasocial);
    let sueldo = tremunerativo[tremunerativo.length-1] + tnremunerativo[tnremunerativo.length-1] - tdescuento[tdescuento.length-1];
    return sueldo.toFixed(2)
}


function remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad) {
    if (contrato == '36hs' && faltas == 'NO') {
        basico = 599254.63
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 24) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 10 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '36hs' && faltas == 'SI') {
        basico = 599254.63
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 24) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 6 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '35hs' && faltas == 'NO') {
        basico = 582608.66
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 7 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 10 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '35hs' && faltas == 'SI') {
        basico = 582608.66
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 7 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 6 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '30hs' && faltas == 'NO') {
        basico = 499378.88
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 10 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else {
        basico = 499378.88
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 6 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
}

function no_remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad) {
    if (contrato == '36hs' && faltas == 'NO') {
        aj2024 = 74687.57
        aj2024_PRESENTISMO = aj2024 * 10 / 100
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100
        aj2024_FERIADO = aj2024 / 30 * cferiado
        as2024 = 50234.31
        as2024_PRESENTISMO = as2024 * 10 / 100
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100
        as2024_FERIADO = as2024 / 30 * cferiado
        ae2025 = 12311
        ae2025_PRESENTISMO = ae2025 * 10 / 100
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100
        ae2025_FERIADO = ae2025 / 30 * cferiado
        total_noremunerativo = (aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD + ae2025 + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_PRESENTISMO + ae2025_FERIADO)
        return tnremunerativo = [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo]
    }
    else if (contrato == '36hs' && faltas == 'SI') {
        aj2024 = 74687.57
        aj2024_PRESENTISMO = aj2024 * 6 / 100
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100
        aj2024_FERIADO = aj2024 / 30 * cferiado
        as2024 = 50234.31
        as2024_PRESENTISMO = as2024 * 6 / 100
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100
        as2024_FERIADO = as2024 / 30 * cferiado
        ae2025 = 12311
        ae2025_PRESENTISMO = ae2025 * 6 / 100
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100
        ae2025_FERIADO = ae2025 / 30 * cferiado
        total_noremunerativo = (aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD + ae2025 + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_PRESENTISMO + ae2025_FERIADO)
        return tnremunerativo = [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo]
    }
    else if (contrato == '35hs' && faltas == 'NO') {
        aj2024 = 72612.91
        aj2024_PRESENTISMO = aj2024 * 10 / 100
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100
        aj2024_FERIADO = aj2024 / 30 * cferiado
        as2024 = 48838.91
        as2024_PRESENTISMO = as2024 * 10 / 100
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100
        as2024_FERIADO = as2024 / 30 * cferiado
        ae2025 = 11969.03
        ae2025_PRESENTISMO = ae2025 * 10 / 100
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100
        ae2025_FERIADO = ae2025 / 30 * cferiado
        total_noremunerativo = (aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD + ae2025 + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_PRESENTISMO + ae2025_FERIADO)
        return tnremunerativo = [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo]
    }
    else if (contrato == '35hs' && faltas == 'SI') {
        aj2024 = 72612.91
        aj2024_PRESENTISMO = aj2024 * 6 / 100
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100
        aj2024_FERIADO = aj2024 / 30 * cferiado
        as2024 = 48838.91
        as2024_PRESENTISMO = as2024 * 6 / 100
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100
        as2024_FERIADO = as2024 / 30 * cferiado
        ae2025 = 11969.03
        ae2025_PRESENTISMO = ae2025 * 6 / 100
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100
        ae2025_FERIADO = ae2025 / 30 * cferiado
        total_noremunerativo = (aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD + ae2025 + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_PRESENTISMO + ae2025_FERIADO)
        return tnremunerativo = [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo]
    }
    else if (contrato == '30hs' && faltas == 'NO') {
        aj2024 = 62239.64
        aj2024_PRESENTISMO = aj2024 * 6 / 100
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100
        aj2024_FERIADO = aj2024 / 30 * cferiado
        as2024 = 41861.92
        as2024_PRESENTISMO = as2024 * 6 / 100
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100
        as2024_FERIADO = as2024 / 30 * cferiado
        ae2025 = 10259.17
        ae2025_PRESENTISMO = ae2025 * 10 / 100
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100
        ae2025_FERIADO = ae2025 / 30 * cferiado
        total_noremunerativo = (aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD + ae2025 + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_PRESENTISMO + ae2025_FERIADO)
        return tnremunerativo = [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo]
    }
    else {
        aj2024 = 62239.64
        aj2024_PRESENTISMO = aj2024 * 6 / 100
        aj2024_ANTIGUEDAD = aj2024 * aantiguedad / 100
        aj2024_PUNTUALIDAD = aj2024 * 0.5 / 100
        aj2024_FERIADO = aj2024 / 30 * cferiado
        as2024 = 41861.92
        as2024_PRESENTISMO = as2024 * 6 / 100
        as2024_ANTIGUEDAD = as2024 * aantiguedad / 100
        as2024_PUNTUALIDAD = as2024 * 0.5 / 100
        as2024_FERIADO = as2024 / 30 * cferiado
        ae2025 = 10259.17
        ae2025_PRESENTISMO = ae2025 * 6 / 100
        ae2025_ANTIGUEDAD = ae2025 * aantiguedad / 100
        ae2025_PUNTUALIDAD = ae2025 * 0.5 / 100
        ae2025_FERIADO = ae2025 / 30 * cferiado
        total_noremunerativo = (aj2024 + aj2024_PRESENTISMO + aj2024_ANTIGUEDAD + aj2024_PUNTUALIDAD + aj2024_FERIADO + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD + ae2025 + ae2025_ANTIGUEDAD + ae2025_PUNTUALIDAD + ae2025_PRESENTISMO + ae2025_FERIADO)
        return tnremunerativo = [aj2024, aj2024_PRESENTISMO, aj2024_ANTIGUEDAD, aj2024_PUNTUALIDAD, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, ae2025, ae2025_PRESENTISMO, ae2025_ANTIGUEDAD, ae2025_PUNTUALIDAD, ae2025_FERIADO, total_noremunerativo]
    }
}

function descuentos(tremunerativo, tnremunerativo, obrasocial) {
    if (obrasocial == 'OTRA'){
    APORTE_SIJP_SOBRE_SUELDO = tremunerativo[tremunerativo.length-1] * 11 / 100
    APORTE_INSSJP_SOBRE_SUELDO = tremunerativo[tremunerativo.length-1] * 3 / 100
    APORTE_O_SOC_SOBRE_SUELDO = tremunerativo[tremunerativo.length-1] * 3 / 100
    CTT_S_FALLECIMIENTO = tremunerativo[tremunerativo.length-1] * 0.59 / 100
    CTT_688_14 = (tremunerativo[tremunerativo.length-1] + tnremunerativo[tnremunerativo.length-1]) * 1.5 / 100
    APORTE_O_SOC_ACUERDO = 0
    total_descuentos = (APORTE_INSSJP_SOBRE_SUELDO + APORTE_O_SOC_SOBRE_SUELDO + APORTE_SIJP_SOBRE_SUELDO + CTT_688_14 + CTT_S_FALLECIMIENTO + APORTE_O_SOC_ACUERDO)
    return tdescuentos = [APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO, total_descuentos]
}
else{
    APORTE_SIJP_SOBRE_SUELDO = tremunerativo[tremunerativo.length-1] * 11 / 100
    APORTE_INSSJP_SOBRE_SUELDO = tremunerativo[tremunerativo.length-1] * 3 / 100
    APORTE_O_SOC_SOBRE_SUELDO = tremunerativo[tremunerativo.length-1] * 3 / 100
    CTT_S_FALLECIMIENTO = tremunerativo[tremunerativo.length-1] * 0.59 / 100
    CTT_688_14 = (tremunerativo[tremunerativo.length-1] + tnremunerativo[tnremunerativo.length-1]) * 1.5 / 100
    APORTE_O_SOC_ACUERDO = tremunerativo[tremunerativo.length-1] * 1.30 / 100
    total_descuentos = (APORTE_INSSJP_SOBRE_SUELDO + APORTE_O_SOC_SOBRE_SUELDO + APORTE_SIJP_SOBRE_SUELDO + CTT_688_14 + CTT_S_FALLECIMIENTO + APORTE_O_SOC_ACUERDO)
    return tdescuentos = [APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, APORTE_O_SOC_ACUERDO, total_descuentos]
}
}
document.getElementById('calcular').addEventListener('click', (e) => {
    e.preventDefault();

    // Recuperar valores del formulario
    const contrato = document.getElementById('contrato').value;
    const faltas = document.getElementById('faltas').value;
    const cferiado = parseInt(document.getElementById('feriados').value) || 0;
    const nocturnas = parseInt(document.getElementById('nocturnas').value) || 0;
    const aantiguedad = parseInt(document.getElementById('antiguedad').value) || 0;
    const obrasocial = document.getElementById('obrasocial').value;

    // Listas de conceptos
    const conceptos = [
        "BASICO", "FERIADO", "PRESENTISMO", "ANTIGUEDAD", "PUNTUALIDAD", "ADICIONAL HORA NOCTURNA",
        "ACUERDO JULIO 2024", "ACUERDO JULIO 2024 PRESENTISMO",
        "ACUERDO JULIO 2024 ANTIGUEDAD", "ACUERDO JULIO 2024 PUNTUALIDAD", "ACUERDO JULIO 2024 FERIADO",
        "ACUERDO SEPTIEMBRE 2024", "ACUERDO SEPTIEMBRE 2024 PRESENTISMO",
        "ACUERDO SEPTIEMBRE 2024 ANTIGUEDAD", "ACUERDO SEPTIEMBRE 2024 PUNTUALIDAD",
        "ACUERDO SEPTIEMBRE 2024 FERIADO","ACUERDO ENERO 2025", "ACUERDO ENERO 2025 PRESENTISMO", "ACUERDO ENERO 2025 ANTIGUEDAD",
        "ACUERDO ENERO 2025 PUNTUALIDAD", "ACUERDO ENERO 2025 FERIADO", "APORTE SIJP SOBRE SUELDO",
        "APORTE INSSJP SOBRE SUELDO", "APORTE O. SOC SOBRE SUELDO", "CTT S FALLECIMIENTO", "CTT 688/14", "APORTE O. SOCIAL ACUERDO"
    ];

    // Generar listas de valores
    const tremunerativo = remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad);
    const tnremunerativo = no_remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad);
    const tdescuentos = descuentos(tremunerativo, tnremunerativo, obrasocial);

    const mainContainer = document.querySelector('main');

    // Eliminar tabla anterior si existe
    const tablaExistente = document.querySelector('table');
    if (tablaExistente) {
        tablaExistente.remove();
    }

    //Crear Titulo
    const tituloExistente = document.querySelector('p');
    if (tituloExistente) {
        tituloExistente.remove();
    }

    const titulo = document.createElement("p");
    titulo.innerHTML = "<h3>Febrero</h3>";
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

    // Índices para cada lista
    let idxRem = 0, idxNoRem = 0, idxDesc = 0;

    // Iteramos sobre los conceptos
    for (let i = 0; i < conceptos.length; i++) {
        const fila = document.createElement('tr');

        const celda2 = document.createElement('td'); // Conceptos
        celda2.innerText = conceptos[i];

        const celda3 = document.createElement('td'); // Haberes
        const celda4 = document.createElement('td'); // Remunerativo
        const celda5 = document.createElement('td'); // Descuentos

        // Completar columna "Haberes" (columna 3)
        if (idxRem < tremunerativo.length - 1) {
            const valor = tremunerativo[idxRem++];
            celda3.innerText = valor.toFixed(2);
        } else {
            celda3.innerText = ''; // Dejar la celda vacía
        }

        // Completar columna "Remunerativo" (columna 4) comenzando en la fila 7
        if (i >= 6 && idxNoRem < tnremunerativo.length - 1) { // Aseguramos que comience desde la fila 7
            const valor = tnremunerativo[idxNoRem++];
            celda4.innerText = valor.toFixed(2);
        } else {
            celda4.innerText = ''; // Dejar la celda vacía
        }

        // Completar columna "Descuentos" (columna 5) comenzando en la fila 22
        if (i >= 21 && idxDesc < tdescuentos.length - 1) { // Aseguramos que comience desde la fila 22
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
    celdaFinal4.innerText = tnremunerativo[tnremunerativo.length - 1].toFixed(2); // Último valor de Remunerativo
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

    //Agregar total
    const contenedorExistente = document.querySelector('div');
    if (contenedorExistente) {
        contenedorExistente.remove();
    }
    const tsueldo = sueldo(contrato,faltas,cferiado,nocturnas,aantiguedad,obrasocial);
    const contenedor = document.createElement("div")
    contenedor.innerHTML = `<h3>Total a cobrar:</h3>
                            <p>${tsueldo}</p> 
                            <p>Aclaración: Este valor no es exacto, es una aproximación</p>`;
    mainContainer.appendChild(contenedor);
});