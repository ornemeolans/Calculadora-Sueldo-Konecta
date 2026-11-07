# Calculadora de Sueldo Konecta 📊

Esta herramienta es una aplicación web diseñada para ayudar a los colaboradores de Konecta a estimar su salario de manera rápida y sencilla. El proyecto surge de la necesidad de simplificar el cálculo de haberes basándose en las escalas salariales vigentes.

## 🚀 Funcionalidades
- **Cálculo Automático**: Procesa el sueldo neto estimado a partir de datos básicos.
- **Escalas Actualizadas**: Utiliza un archivo JSON (`escalas.json`) para mantener los valores de las categorías y antigüedades al día.
- **Interfaz Intuitiva**: Diseño limpio y fácil de usar, enfocado en la experiencia del usuario.
- **Transparencia**: Ayuda a los compañeros a entender mejor la composición de sus recibos de sueldo.

## 🛠️ Tecnologías Utilizadas
El proyecto fue construido utilizando un stack web estándar para asegurar ligereza y compatibilidad:

- **HTML5**: Estructura semántica de la aplicación.
- **CSS3**: Estilos personalizados para una interfaz moderna y profesional.
- **JavaScript (Vanilla)**: Lógica principal para los cálculos matemáticos y manipulación del DOM.
- **JSON**: Almacenamiento estructurado de las escalas salariales.

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ornemeolans/calculadora-sueldo-konecta.git
   
2. **Navegar al directorio:**
   ```bash
   cd calculadora-sueldo-konecta
   
3. **Ejecución:**

   Abre el archivo index.html en cualquier navegador moderno.

   Nota importante: Debido a que la aplicación realiza una petición fetch para leer el archivo escalas.json, es necesario ejecutarlo a través de un servidor
   local (como Live Server o python -m http.server) para evitar errores de política de CORS.

## 📂 Estructura del Proyecto
```text
/
├── assets/               # Recursos visuales (logo)
├── css/style.css         # Estilos (tokens de color, modo claro/oscuro)
├── js/calculo.js         # Lógica de cálculo, sin DOM (se usa en la página y en los tests)
├── js/script.js          # Interfaz: formulario, validaciones, resultado, PDF y WhatsApp
├── tests/                # Tests de regresión contra recibos reales
├── escalas.json          # Escalas salariales y acuerdos por mes y contrato
└── index.html            # Punto de entrada
```

## ✅ Tests

Los tests comparan la calculadora con recibos reales de Konecta (abril, junio, julio, agosto y
septiembre 2026) y verifican que `escalas.json` sea coherente (35 hs y 30 hs proporcionales a 36 hs).
No requieren instalar dependencias:

```bash
npm test
```

GitHub Actions los ejecuta automáticamente en cada push.

## 🔄 Cómo agregar un mes nuevo

1. Cargá el mes en `escalas.json` (el menú de meses se genera solo a partir de este archivo).
2. Ejecutá `npm test` para verificar que no haya errores de tipeo.
3. Si cambiaste `css/style.css` o algún archivo de `js/`, actualizá el `?v=` en `index.html`
   para que los navegadores descarguen la versión nueva.
