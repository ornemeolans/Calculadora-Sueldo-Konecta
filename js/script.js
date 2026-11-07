/* Interfaz de la calculadora. La lógica de cálculo vive en js/calculo.js (window.Calculo). */
(function () {
    'use strict';

    const $ = id => document.getElementById(id);
    const form = $('formulario');
    const btnCalcular = $('calcular');
    const resultado = $('resultado');
    const cajaErrores = $('errores');

    const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO',
        'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const PREFS = ['contrato', 'antiguedad', 'obrasocial'];

    const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const numero = n => n.toLocaleString('es-AR', { maximumFractionDigits: 2 });
    const titulo = s => s.charAt(0) + s.slice(1).toLowerCase();

    let ESCALAS = null;
    let ultimo = null; // último resultado calculado

    // ── Almacenamiento seguro (modo incógnito / bloqueado) ───────────────
    const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };
    const leer = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

    // ── Creación de elementos sin innerHTML ─────────────────────────────
    function el(tag, attrs, ...hijos) {
        const n = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) {
            if (k === 'class') n.className = v; else n.setAttribute(k, v);
        }
        for (const h of hijos) if (h != null) n.append(h);
        return n;
    }

    // ── Tema claro / oscuro ─────────────────────────────────────────────
    const btnTema = $('toggle-tema');
    function actualizarBotonTema() {
        const oscuro = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        btnTema.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    btnTema.addEventListener('click', () => {
        const nuevo = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', nuevo);
        guardar('tema', nuevo);
        actualizarBotonTema();
    });
    actualizarBotonTema();

    // ── Carga de escalas ────────────────────────────────────────────────
    async function cargarEscalas() {
        try {
            const resp = await fetch(`escalas.json?t=${Date.now()}`, { cache: 'no-cache' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            ESCALAS = await resp.json();
            poblarMeses();
            restaurarPreferencias();
            btnCalcular.disabled = false;
        } catch (err) {
            console.error('Error cargando escalas:', err);
            mostrarErrores(['No se pudieron cargar las escalas salariales. Revisá tu conexión y recargá la página.']);
            $('mes').replaceChildren(el('option', { value: '' }, 'No disponible'));
        }
    }

    function mesActualClave() {
        const hoy = new Date();
        return `${MESES[hoy.getMonth()]} ${hoy.getFullYear()}`;
    }

    function poblarMeses() {
        const sel = $('mes');
        const claves = Object.keys(ESCALAS);
        sel.replaceChildren(el('option', { value: '' }, 'Elegí el mes'),
            ...claves.map(k => el('option', { value: k, translate: 'no' }, titulo(k))));
        sel.value = claves.includes(mesActualClave()) ? mesActualClave() : claves[claves.length - 1];
    }

    function restaurarPreferencias() {
        for (const id of PREFS) {
            const v = leer('pref_' + id);
            if (v !== null) $(id).value = v;
        }
    }

    // ── Paneles condicionales ───────────────────────────────────────────
    const valorRadio = nombre => (form.querySelector(`input[name="${nombre}"]:checked`) || {}).value || '';
    function sincronizarPaneles() {
        $('faltas-detalle').hidden = valorRadio('faltas') !== 'SI';
        $('vacaciones-detalle').hidden = !$('vacaciones_check').checked;
    }
    form.addEventListener('change', sincronizarPaneles);

    // ── Lectura y validación ────────────────────────────────────────────
    function leerNumero(id, { entero = false, min = 0, max = Infinity, requerido = false } = {}) {
        const input = $(id);
        if (input.validity.badInput) return { error: true };
        if (input.value.trim() === '') return requerido ? { error: true } : { valor: 0 };
        const v = Number(input.value);
        if (!Number.isFinite(v) || v < min || v > max || (entero && !Number.isInteger(v))) return { error: true };
        return { valor: v };
    }

    function etiquetaDe(id) {
        const l = form.querySelector(`label[for="${id}"]`);
        return l ? l.textContent.trim() : id;
    }

    function limpiarErrores() {
        form.querySelectorAll('.is-invalid').forEach(n => n.classList.remove('is-invalid'));
        cajaErrores.hidden = true;
        cajaErrores.replaceChildren();
    }

    function mostrarErrores(mensajes, ids = []) {
        const lista = el('ul');
        mensajes.forEach((m, i) => {
            const id = ids[i];
            lista.append(el('li', {}, id ? el('a', { href: '#' + id, 'data-foco': id }, m) : m));
        });
        cajaErrores.replaceChildren(
            mensajes.length > 1 ? 'Revisá estos datos:' : 'Revisá este dato:', lista);
        cajaErrores.hidden = false;
    }

    cajaErrores.addEventListener('click', ev => {
        const id = ev.target.getAttribute && ev.target.getAttribute('data-foco');
        if (id) { ev.preventDefault(); $(id).focus(); }
    });

    function leerEntrada() {
        const errores = [];
        const marcar = (id, msg) => {
            const n = $(id);
            (n.closest('.pregunta') || n).classList.add('is-invalid');
            errores.push({ id, msg });
        };
        const feedback = id => form.querySelector(`#${id} ~ .invalid-feedback`)?.textContent || 'Valor inválido.';

        const mes = $('mes').value, contrato = $('contrato').value, obraSocial = $('obrasocial').value;
        if (!mes || !ESCALAS[mes]) marcar('mes', 'Elegí el mes a liquidar.');
        if (!contrato) marcar('contrato', 'Elegí tu contrato.');
        else if (mes && ESCALAS[mes] && !ESCALAS[mes][contrato]) marcar('contrato', `No hay escala de ${contrato} para ${titulo(mes)}.`);
        if (!obraSocial) marcar('obrasocial', 'Elegí tu obra social.');

        const entero = (id, max, requerido = false, min = 0) => {
            const r = leerNumero(id, { entero: true, min, max, requerido });
            if (r.error) { marcar(id, `${etiquetaDe(id)}: ${feedback(id).toLowerCase()}`); return 0; }
            return r.valor;
        };
        const decimal = (id, max) => {
            const r = leerNumero(id, { max });
            if (r.error) { marcar(id, `${etiquetaDe(id)}: ${feedback(id).toLowerCase()}`); return 0; }
            return r.valor;
        };

        const faltas = valorRadio('faltas') === 'SI';
        let faltasJustificadas = false, diasFalta = 0;
        if (faltas) {
            const j = valorRadio('justificadas');
            if (!j) marcar('justificadas-no', 'Indicá si las faltas fueron justificadas.');
            faltasJustificadas = j === 'SI';
            diasFalta = entero('cfaltas', 30, true, 1);
        }

        const conVacaciones = $('vacaciones_check').checked;
        const diasVacaciones = conVacaciones ? entero('cvacaciones', 30, true, 1) : 0;
        const variables6m = conVacaciones ? {
            feriados: entero('v6_feriados', 186),
            nocturnas: decimal('v6_nocturnas', 1800),
            extras50: decimal('v6_extras50', 1200),
            extras100: decimal('v6_extras100', 1200),
            extras100noct: decimal('v6_extras100noct', 1200)
        } : {};

        if (diasFalta + diasVacaciones > 30) {
            marcar('cvacaciones', 'Los días de vacaciones más los días de falta no pueden superar 30.');
        }

        const entrada = {
            mes, contrato, obraSocial,
            antiguedad: entero('antiguedad', 50),
            faltas, faltasJustificadas, diasFalta,
            llegadasTarde: valorRadio('tarde') === 'SI',
            feriados: entero('feriados', 31),
            nocturnas: decimal('nocturnas', 300),
            extras50: decimal('extras50', 200),
            extras100: decimal('extras100', 200),
            extras100noct: decimal('extras100noct', 200),
            diasVacaciones, variables6m
        };
        return { entrada, errores };
    }

    // ── Render del recibo ───────────────────────────────────────────────
    function filas(items) {
        // items: [concepto, importe, esDetalle?]
        return items.filter(([, imp]) => imp > 0).map(([concepto, imp, detalle]) =>
            el('tr', detalle ? { class: 'detalle-linea' } : {}, el('td', {}, concepto), el('td', {}, pesos.format(imp))));
    }

    function seccion(tituloSec, items, total, extraClase) {
        const cuerpo = filas(items);
        if (!cuerpo.length) return null;
        return el('section', { class: 'recibo__seccion' + (extraClase ? ' ' + extraClase : '') },
            el('h3', {}, tituloSec),
            el('table', {},
                el('tbody', {}, ...cuerpo),
                el('tfoot', {}, el('tr', {}, el('td', {}, 'Total'), el('td', {}, pesos.format(total))))));
    }

    function lineasAcuerdoNR(nombre, a) {
        if (!a) return [];
        return [
            [nombre, a.monto],
            ['Antigüedad', a.antiguedad, true],
            ['Feriado', a.feriado, true],
            ['Horas extras 50%', a.extras50, true],
            ['Horas extras 100%', a.extras100, true],
            ['Horas extras nocturnas 100%', a.extras100noct, true],
            ['Vacaciones', a.vacaciones, true],
            ['Puntualidad', a.puntualidad, true],
            ['Presentismo', a.presentismo, true]
        ];
    }

    function armarSecciones(r) {
        const e = r.entrada, h = r.haberes, n = r.noRemunerativo, d = r.descuentos;
        const pctPres = !e.faltas ? 10 : (e.faltasJustificadas ? 6 : 0);
        const diasTrabajados = 30 - e.diasFalta - e.diasVacaciones;
        return [
            {
                titulo: 'Haberes', total: r.totales.haberes, items: [
                    [`Sueldo de convenio (${diasTrabajados} días)`, h.sueldo],
                    [`Pago de vacaciones (${e.diasVacaciones} días)`, h.vacaciones],
                    [`Días de licencia (${e.diasFalta})`, h.licencia],
                    [`Feriado trabajado (${e.feriados})`, h.feriado],
                    [`Adicional por antigüedad (${e.antiguedad}%)`, h.antiguedad],
                    [`Presentismo (${pctPres}%)`, h.presentismo],
                    ['Puntualidad (0,5%)', h.puntualidad],
                    [`Adicional hora nocturna (${numero(e.nocturnas)} h)`, h.nocturnas],
                    [`Horas extras 50% (${numero(e.extras50)} h)`, h.extras50],
                    [`Horas extras 100% (${numero(e.extras100)} h)`, h.extras100],
                    [`Horas extras nocturnas 100% (${numero(e.extras100noct)} h)`, h.extras100noct],
                    ['Acuerdo junio 2025', h.acuerdoRem],
                    ['Presentismo', h.acuerdoRemPresentismo, true],
                    ['Antigüedad', h.acuerdoRemAntiguedad, true],
                    ['Puntualidad', h.acuerdoRemPuntualidad, true],
                    ['Feriado', h.acuerdoRemFeriado, true]
                ]
            },
            {
                titulo: 'No remunerativo', total: r.totales.noRemunerativo, items: [
                    ...lineasAcuerdoNR('Acuerdo julio 2025', n.jul2025),
                    ...lineasAcuerdoNR('Acuerdo diciembre 2025', n.dic2025),
                    ...lineasAcuerdoNR('Acuerdo abril 2026', n.abr2026),
                    ['Suma no remunerativa única vez (cuota 1)', n.cuota1],
                    ['Suma no remunerativa única vez (cuota 2)', n.cuota2]
                ]
            },
            {
                titulo: 'Descuentos', total: r.totales.descuentos, clase: 'recibo__seccion--descuentos', items: [
                    ['Aporte jubilatorio SIJP (11%)', d.sijp],
                    ['Aporte INSSJP (3%)', d.inssjp],
                    ['Aporte obra social (3%)', d.obraSocial],
                    ['Aporte obra social GEA (1,3%)', d.obraSocialGEA],
                    ['CTT S. Fallecimiento', d.cttFallecimiento],
                    ['CCT 688/14 (1,5%)', d.cct688]
                ]
            }
        ];
    }

    function mostrarResultado(r) {
        const contratoTxt = r.entrada.contrato.replace('hs', ' hs');
        $('resultado-titulo').textContent = `${titulo(r.entrada.mes)} · ${contratoTxt}`;
        $('neto').textContent = pesos.format(r.totales.neto);
        $('recibo').replaceChildren(...armarSecciones(r)
            .map(s => seccion(s.titulo, s.items, s.total, s.clase)).filter(Boolean));
        resultado.querySelector('.resultado__desactualizado')?.remove();
        resultado.classList.remove('resultado--viejo', 'entra');
        resultado.hidden = false;
        void resultado.offsetWidth; // reinicia la animación
        resultado.classList.add('entra');
        const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
        resultado.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
    }

    // Si cambian los datos después de calcular, el resultado queda marcado como desactualizado
    form.addEventListener('input', marcarDesactualizado);
    form.addEventListener('change', marcarDesactualizado);
    function marcarDesactualizado() {
        if (resultado.hidden || resultado.classList.contains('resultado--viejo')) return;
        resultado.classList.add('resultado--viejo');
        resultado.querySelector('.resultado__neto').append(
            el('p', { class: 'resultado__desactualizado' }, 'Cambiaste datos: tocá Calcular para actualizar el resultado.'));
    }

    // ── Calcular ────────────────────────────────────────────────────────
    form.addEventListener('submit', ev => {
        ev.preventDefault();
        if (!ESCALAS) return;
        limpiarErrores();
        const { entrada, errores } = leerEntrada();
        if (errores.length) {
            mostrarErrores(errores.map(x => x.msg), errores.map(x => x.id));
            $(errores[0].id).focus();
            return;
        }
        PREFS.forEach(id => guardar('pref_' + id, $(id).value));
        ultimo = window.Calculo.calcular(ESCALAS, entrada);
        mostrarResultado(ultimo);
    });

    // ── Limpiar ─────────────────────────────────────────────────────────
    $('limpiar').addEventListener('click', () => {
        form.reset();
        limpiarErrores();
        if (ESCALAS) { poblarMeses(); restaurarPreferencias(); }
        sincronizarPaneles();
        resultado.hidden = true;
        ultimo = null;
        window.scrollTo({ top: 0, behavior: 'auto' });
        $('mes').focus();
    });

    // ── Compartir ───────────────────────────────────────────────────────
    $('btn-whatsapp').addEventListener('click', () => {
        if (!ultimo) return;
        const texto = `Mi sueldo estimado de ${titulo(ultimo.entrada.mes)} es ${pesos.format(ultimo.totales.neto)}. ` +
            `Calculado con la calculadora de Ornella Meolans: ${location.origin}${location.pathname}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    });

    // jsPDF se carga recién cuando se pide el PDF (≈350 KB), con verificación de integridad
    const LIBS_PDF = [
        ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
            'sha384-JcnsjUPPylna1s1fvi1u12X5qjY5OL56iySh75FdtrwhO/SWXgMjoVqcKyIIWOLk'],
        ['https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
            'sha384-GbQVk5KsTZEMJtvSbtmGpderuiERKpKVVFucxROOKnIXvtg03h3pORjyyGlPD6UO']
    ];
    let cargaPdf = null;
    function cargarScript([src, integrity]) {
        return new Promise((ok, mal) => {
            const s = el('script', { src, integrity, crossorigin: 'anonymous' });
            s.onload = ok;
            s.onerror = () => mal(new Error('No se pudo cargar ' + src));
            document.head.append(s);
        });
    }
    function cargarJsPDF() {
        if (!cargaPdf) {
            cargaPdf = LIBS_PDF.reduce((p, lib) => p.then(() => cargarScript(lib)), Promise.resolve())
                .catch(err => { cargaPdf = null; throw err; });
        }
        return cargaPdf;
    }

    $('btn-pdf').addEventListener('click', async () => {
        if (!ultimo) return;
        const btn = $('btn-pdf');
        const textoOriginal = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Generando PDF…';
        try {
            await cargarJsPDF();
            generarPDF(ultimo);
        } catch (err) {
            console.error(err);
            mostrarErrores(['No se pudo generar el PDF. Revisá tu conexión e intentá de nuevo.']);
        } finally {
            btn.disabled = false;
            btn.textContent = textoOriginal;
        }
    });

    function generarPDF(r) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const mes = titulo(r.entrada.mes);
        const marca = [67, 97, 238];

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...marca);
        doc.text('Recibo de sueldo estimado', 105, 16, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(90);
        doc.text(`${mes} · ${r.entrada.contrato.replace('hs', ' hs')}`, 105, 23, { align: 'center' });

        const body = [];
        for (const s of armarSecciones(r)) {
            const items = s.items.filter(([, imp]) => imp > 0);
            if (!items.length) continue;
            body.push([{ content: s.titulo.toUpperCase(), colSpan: 2, styles: { fontStyle: 'bold', fillColor: [238, 241, 253], textColor: [40, 40, 60] } }]);
            items.forEach(([c, imp, det]) => body.push([(det ? '    ' : '') + c, pesos.format(imp)]));
            body.push([{ content: 'Total', styles: { fontStyle: 'bold' } }, { content: pesos.format(s.total), styles: { fontStyle: 'bold' } }]);
        }

        doc.autoTable({
            startY: 30,
            head: [['Concepto', 'Importe']],
            body,
            theme: 'plain',
            headStyles: { fillColor: marca, textColor: 255, fontSize: 9 },
            styles: { fontSize: 8.5, cellPadding: 1.8 },
            columnStyles: { 1: { halign: 'right', cellWidth: 45 } }
        });

        const y = doc.lastAutoTable.finalY + 10;
        doc.setFillColor(238, 241, 253);
        doc.roundedRect(50, y, 110, 20, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text('Neto estimado a cobrar', 105, y + 7, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...marca);
        doc.text(pesos.format(r.totales.neto), 105, y + 15, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text('Cálculo aproximado: puede haber diferencias con el recibo original.', 105, y + 28, { align: 'center' });

        doc.save(`Sueldo_${r.entrada.mes.replace(/\s+/g, '_')}.pdf`);
    }

    sincronizarPaneles();
    cargarEscalas();
})();
