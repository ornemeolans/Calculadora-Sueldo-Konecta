let miformulario = document.getElementById('formulario_sueldo');


miformulario.addEventListener('submit', darsueldo);

function darsueldo(e) {
    e.preventDefault();
    let formulario = e.target
    console.log(formulario.children[0].value);
    console.log(formulario.children[1].value);
    console.log(formulario.children[3].value);
    console.log(formulario.children[5].value);
    console.log(formulario.children[7].value);
    console.log(generarTabla(sueldo(formulario.children[0].value, formulario.children[1].value, formulario.children[3].value, formulario.children[5].value, formulario.children[7].value)));
}

function sueldo(contrato, faltas, cferiado, nocturnas, aantiguedad) {
    let tremunerativo = remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad);
    let tnremunerativo = no_remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad);
    let tdescuento = descuentos(tremunerativo, tnremunerativo);
    let sueldo = tremunerativo[6] + tnremunerativo[12] - tdescuento[5];
    let fsueldo = tremunerativo.concat(tnremunerativo);
    fsueldo = fsueldo.concat(tdescuento);
    fsueldo = fsueldo.concat(sueldo);
    console.log(fsueldo)
    return sueldo
}


function remunerativo(contrato, faltas, cferiado, nocturnas, aantiguedad) {
    if (contrato == '36hs' && faltas == 'NO') {
        basico = 514987.52
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 24) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 10 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '36hs' && faltas == 'SI') {
        basico = 514987.52
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 24) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 6 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '35hs' && faltas == 'NO') {
        basico = 500682.29
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 7 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 10 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '35hs' && faltas == 'SI') {
        basico = 500682.29
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 7 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 6 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else if (contrato == '30hs' && faltas == 'NO') {
        basico = 429156.28
        feriados = basico / 30 * cferiado
        antiguedad = basico * aantiguedad / 100
        nocturnas = ((basico / 22) / 6 * 0.1311) * nocturnas
        puntualidad = basico * 0.5 / 100
        presentismo = (basico + feriados + antiguedad + nocturnas + puntualidad) * 10 / 100
        total_remunerativo = (basico + feriados + antiguedad + nocturnas + puntualidad + presentismo)
        return tremunerativo = [basico, feriados, presentismo, antiguedad, puntualidad, nocturnas, total_remunerativo]
    }
    else {
        basico = 429156.28
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
        aa2024 = 72161.90
        aa2024_PRESENTISMO = aa2024 * 10 / 100
        aa2024_ANTIGUEDAD = aa2024 * aantiguedad / 100
        aa2024_PUNTUALIDAD = aa2024 * 0.5 / 100
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
        total_noremunerativo = (aa2024 + aa2024_ANTIGUEDAD + aa2024_PRESENTISMO + aa2024_PUNTUALIDAD + aj2024 + aj2024_ANTIGUEDAD + aj2024_FERIADO + aj2024_PRESENTISMO + aj2024_PUNTUALIDAD + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD)
        return tnremunerativo = [aa2024, aa2024_PRESENTISMO, aa2024_ANTIGUEDAD, aa2024_PUNTUALIDAD, aj2024, aj2024_PRESENTISMO, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, total_noremunerativo]
    }
    else if (contrato == '36hs' && faltas == 'SI') {
        aa2024 = 72161.90
        aa2024_PRESENTISMO = aa2024 * 6 / 100
        aa2024_ANTIGUEDAD = aa2024 * aantiguedad / 100
        aa2024_PUNTUALIDAD = aa2024 * 0.5 / 100
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
        total_noremunerativo = (aa2024 + aa2024_ANTIGUEDAD + aa2024_PRESENTISMO + aa2024_PUNTUALIDAD + aj2024 + aj2024_ANTIGUEDAD + aj2024_FERIADO + aj2024_PRESENTISMO + aj2024_PUNTUALIDAD + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD)
        return tnremunerativo = [aa2024, aa2024_PRESENTISMO, aa2024_ANTIGUEDAD, aa2024_PUNTUALIDAD, aj2024, aj2024_PRESENTISMO, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, total_noremunerativo]
    }
    else if (contrato == '35hs' && faltas == 'NO') {
        aa2024 = 70157.40
        aa2024_PRESENTISMO = aa2024 * 10 / 100
        aa2024_ANTIGUEDAD = aa2024 * aantiguedad / 100
        aa2024_PUNTUALIDAD = aa2024 * 0.5 / 100
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
        total_noremunerativo = (aa2024 + aa2024_ANTIGUEDAD + aa2024_PRESENTISMO + aa2024_PUNTUALIDAD + aj2024 + aj2024_ANTIGUEDAD + aj2024_FERIADO + aj2024_PRESENTISMO + aj2024_PUNTUALIDAD + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD)
        return tnremunerativo = [aa2024, aa2024_PRESENTISMO, aa2024_ANTIGUEDAD, aa2024_PUNTUALIDAD, aj2024, aj2024_PRESENTISMO, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, total_noremunerativo]
    }
    else if (contrato == '35hs' && faltas == 'SI') {
        aa2024 = 70157.40
        aa2024_PRESENTISMO = aa2024 * 6 / 100
        aa2024_ANTIGUEDAD = aa2024 * aantiguedad / 100
        aa2024_PUNTUALIDAD = aa2024 * 0.5 / 100
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
        total_noremunerativo = (aa2024 + aa2024_ANTIGUEDAD + aa2024_PRESENTISMO + aa2024_PUNTUALIDAD + aj2024 + aj2024_ANTIGUEDAD + aj2024_FERIADO + aj2024_PRESENTISMO + aj2024_PUNTUALIDAD + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD)
        return tnremunerativo = [aa2024, aa2024_PRESENTISMO, aa2024_ANTIGUEDAD, aa2024_PUNTUALIDAD, aj2024, aj2024_PRESENTISMO, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, total_noremunerativo]
    }
    else if (contrato == '30hs' && faltas == 'NO') {
        aa2024 = 60134.92
        aa2024_PRESENTISMO = aa2024 * 6 / 100
        aa2024_ANTIGUEDAD = aa2024 * aantiguedad / 100
        aa2024_PUNTUALIDAD = aa2024 * 0.5 / 100
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
        total_noremunerativo = (aa2024 + aa2024_ANTIGUEDAD + aa2024_PRESENTISMO + aa2024_PUNTUALIDAD + aj2024 + aj2024_ANTIGUEDAD + aj2024_FERIADO + aj2024_PRESENTISMO + aj2024_PUNTUALIDAD + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD)
        return tnremunerativo = [aa2024, aa2024_PRESENTISMO, aa2024_ANTIGUEDAD, aa2024_PUNTUALIDAD, aj2024, aj2024_PRESENTISMO, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, total_noremunerativo]
    }
    else {
        aa2024 = 60134.92
        aa2024_PRESENTISMO = aa2024 * 6 / 100
        aa2024_ANTIGUEDAD = aa2024 * aantiguedad / 100
        aa2024_PUNTUALIDAD = aa2024 * 0.5 / 100
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
        total_noremunerativo = (aa2024 + aa2024_ANTIGUEDAD + aa2024_PRESENTISMO + aa2024_PUNTUALIDAD + aj2024 + aj2024_ANTIGUEDAD + aj2024_FERIADO + aj2024_PRESENTISMO + aj2024_PUNTUALIDAD + as2024 + as2024_ANTIGUEDAD + as2024_FERIADO + as2024_PRESENTISMO + as2024_PUNTUALIDAD)
        return tnremunerativo = [aa2024, aa2024_PRESENTISMO, aa2024_ANTIGUEDAD, aa2024_PUNTUALIDAD, aj2024, aj2024_PRESENTISMO, aj2024_FERIADO, as2024, as2024_PRESENTISMO, as2024_ANTIGUEDAD, as2024_PUNTUALIDAD, as2024_FERIADO, total_noremunerativo]
    }
}

function descuentos(tremunerativo, tnremunerativo) {
    APORTE_SIJP_SOBRE_SUELDO = tremunerativo[6] * 11 / 100
    APORTE_INSSJP_SOBRE_SUELDO = tremunerativo[6] * 3 / 100
    APORTE_O_SOC_SOBRE_SUELDO = tremunerativo[6] * 3 / 100
    CTT_S_FALLECIMIENTO = tremunerativo[6] * 0.59 / 100
    CTT_688_14 = (tremunerativo[6] + tnremunerativo[12]) * 1.5 / 100
    total_descuentos = (APORTE_INSSJP_SOBRE_SUELDO + APORTE_O_SOC_SOBRE_SUELDO + APORTE_SIJP_SOBRE_SUELDO + CTT_688_14 + CTT_S_FALLECIMIENTO)
    return tdescuentos = [APORTE_SIJP_SOBRE_SUELDO, APORTE_INSSJP_SOBRE_SUELDO, APORTE_O_SOC_SOBRE_SUELDO, CTT_S_FALLECIMIENTO, CTT_688_14, total_descuentos]
}

