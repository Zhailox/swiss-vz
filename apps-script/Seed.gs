/**
 * Swiss-VZ Connect - Seeder de Base de Datos
 * Inicializa y puebla 5 hojas relacionales en Google Sheets con datos demo del MVP.
 */

function seed() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("No se detectó un Spreadsheet activo. Asegúrate de ejecutar este script vinculado a una hoja de Google Sheets.");
  }

  var sheetsDef = [
    {
      name: "Usuarios",
      headers: ["id", "nombre", "email", "telefono", "rol", "pais", "avatar_iniciales", "color", "verificado", "tarifa_hito", "skills", "bio", "created_at"],
      data: [
        [
          "USR-001",
          "ClaraLens AG",
          "contact@claralens.ch",
          "+41 44 215 88 00",
          "cliente",
          "CH",
          "CL",
          "#9D4EDD",
          true,
          0,
          "MedTech, Computer Vision, AI, Cloud",
          "Startup MedTech basada en Zúrich especializada en software diagnóstico de retina impulsado por IA.",
          "2026-09-01T08:00:00Z"
        ],
        [
          "USR-002",
          "AlpineFintech Sàrl",
          "founders@alpinefintech.ch",
          "+41 22 710 45 20",
          "cliente",
          "CH",
          "AF",
          "#3498DB",
          true,
          0,
          "Fintech, Open Banking, PSD2, SIC",
          "Neobanco suizo con sede en Ginebra desarrollando microservicios de pasarela de pago y Open Banking transfronterizo.",
          "2026-09-10T09:30:00Z"
        ],
        [
          "USR-003",
          "Alejandro Rodríguez",
          "a.rodriguez@swissvz.dev",
          "+58 412 892 1045",
          "dev",
          "VE",
          "AR",
          "#9D4EDD",
          true,
          4600,
          "Vue.js, Python, FastAPI, PostgreSQL, Docker",
          "Arquitecto Full-Stack con 7+ años de experiencia. Especialista en APIs de alta concurrencia y SPAs reactivas.",
          "2026-09-12T10:00:00Z"
        ],
        [
          "USR-004",
          "María Fernández",
          "m.fernandez@swissvz.dev",
          "+58 414 309 1823",
          "dev",
          "VE",
          "MF",
          "#2ECC71",
          true,
          3500,
          "Python, Django, REST APIs, Redis, Vue.js",
          "Ingeniera backend con experiencia en arquitecturas bancarias, optimización de base de datos e integración con pasarelas de pago.",
          "2026-09-14T11:15:00Z"
        ],
        [
          "USR-005",
          "Carlos Mendoza",
          "c.mendoza@swissvz.dev",
          "+58 424 551 9087",
          "dev",
          "VE",
          "CM",
          "#F39C12",
          true,
          4200,
          "DevOps, Kubernetes, AWS, CI/CD, Python",
          "Especialista en infraestructura en la nube soberana, pipelines de despliegue continuo y cumplimiento de seguridad ISO 27001.",
          "2026-09-15T14:20:00Z"
        ],
        [
          "USR-006",
          "Valentina Torres",
          "v.torres@swissvz.dev",
          "+58 416 772 3410",
          "dev",
          "VE",
          "VT",
          "#E74C3C",
          true,
          4000,
          "Python, Data Science, TensorFlow, Pandas, Spark",
          "Científica de datos con maestría en modelado predictivo, pipelines ETL masivos y algoritmos de visión por computadora.",
          "2026-09-18T16:00:00Z"
        ]
      ]
    },
    {
      name: "Proyectos",
      headers: ["id", "cliente_id", "titulo", "descripcion", "presupuesto_total", "moneda", "estado", "fecha_inicio", "fecha_fin_estimada", "skills_requeridas"],
      data: [
        [
          "PRJ-101",
          "USR-002",
          "Integración API PSD2 & SIC Banking",
          "Construcción de microservicios RESTful en FastAPI e interfaces en Vue.js 3 para conectar el sistema bancario SIC con Open Banking europeo.",
          18400,
          "CHF",
          "en_progreso",
          "2026-10-01",
          "2027-01-31",
          "Python, FastAPI, Vue.js, PostgreSQL, Docker"
        ],
        [
          "PRJ-102",
          "USR-001",
          "Pipeline de Segmentación Retinal con IA",
          "Desarrollo del backend computacional y contenedores Docker para procesar imágenes oftalmológicas de alta resolución con cumplimiento nLPD.",
          14000,
          "CHF",
          "en_progreso",
          "2026-10-10",
          "2026-12-20",
          "Python, TensorFlow, Docker, Linux, FastAPI"
        ],
        [
          "PRJ-103",
          "USR-002",
          "Portal Corporativo de Tesorería B2B",
          "Dashboard administrativo multi-tenant con reporting financiero exportable, reconciliación automática de cuentas e informes de auditoría.",
          9600,
          "CHF",
          "abierto",
          "2026-11-01",
          "2027-02-15",
          "Vue.js, TypeScript, Python, PostgreSQL"
        ]
      ]
    },
    {
      name: "Hitos",
      headers: ["id", "proyecto_id", "orden", "titulo", "descripcion", "monto", "estado", "fecha_entrega", "fecha_completado"],
      data: [
        [
          "HIT-201",
          "PRJ-101",
          1,
          "Arquitectura Base & Pipeline CI/CD",
          "Setup del repositorio, esquemas PostgreSQL, contenedores Docker y pipeline de despliegue automatizado en servidores Infomaniak.",
          4600,
          "completado",
          "2026-10-15",
          "2026-10-14T18:00:00Z"
        ],
        [
          "HIT-202",
          "PRJ-101",
          2,
          "Integración Core API PSD2 & OAuth2",
          "Autenticación bancaria segura, endpoints de consulta de saldos y sincronización de transacciones con estándares suizos.",
          4600,
          "completado",
          "2026-11-05",
          "2026-11-04T16:30:00Z"
        ],
        [
          "HIT-203",
          "PRJ-101",
          3,
          "Panel Vue.js Admin & Métricas en Vivo",
          "Interfaz de usuario en Vue.js 3 para monitoreo de operaciones, alertas de dispersión y gestión de firmas autorizadas.",
          4600,
          "en_revision",
          "2026-11-25",
          ""
        ],
        [
          "HIT-204",
          "PRJ-101",
          4,
          "QA, Auditoría de Seguridad & Despliegue",
          "Pruebas de estrés, auditoría de cumplimiento nLPD/RGPD, penetración básica y entrega final en producción.",
          4600,
          "pendiente",
          "2026-12-15",
          ""
        ],
        [
          "HIT-205",
          "PRJ-102",
          1,
          "Ingesta de Imágenes & Normalización DICOM",
          "Microservicio para recepción y anonimización de placas médicas conforme a normativas de privacidad suizas.",
          3500,
          "completado",
          "2026-10-25",
          "2026-10-24T19:45:00Z"
        ],
        [
          "HIT-206",
          "PRJ-102",
          2,
          "Modelo de Inferencia y Segmentación AI",
          "Implementación del modelo convolucional en TensorFlow optimizado con aceleración CUDA.",
          4500,
          "en_revision",
          "2026-11-15",
          ""
        ],
        [
          "HIT-207",
          "PRJ-102",
          3,
          "Generador de Reportes Diagnósticos PDF",
          "Generación asíncrona de reportes clínicos certificados con firma digital.",
          3000,
          "pendiente",
          "2026-12-05",
          ""
        ],
        [
          "HIT-208",
          "PRJ-102",
          4,
          "Pruebas Clínicas & Despliegue en Host Suizo",
          "Validación clínica con datasets de control y puesta a punto en VPS certificado ISO 27001.",
          3000,
          "pendiente",
          "2026-12-20",
          ""
        ]
      ]
    },
    {
      name: "Escrow",
      headers: ["id", "proyecto_id", "cliente_id", "monto_total", "monto_liberado", "monto_retenido", "estado", "fecha_deposito"],
      data: [
        [
          "ESC-301",
          "PRJ-101",
          "USR-002",
          18400,
          9200,
          9200,
          "activo",
          "2026-10-01T09:00:00Z"
        ],
        [
          "ESC-302",
          "PRJ-102",
          "USR-001",
          14000,
          3500,
          10500,
          "activo",
          "2026-10-10T11:00:00Z"
        ],
        [
          "ESC-303",
          "PRJ-103",
          "USR-002",
          9600,
          0,
          9600,
          "activo",
          "2026-10-28T15:30:00Z"
        ]
      ]
    },
    {
      name: "Transacciones",
      headers: ["id", "proyecto_id", "hito_id", "tipo", "monto", "moneda", "estado", "fecha", "referencia"],
      data: [
        [
          "TX-401",
          "PRJ-101",
          "",
          "deposito_escrow",
          18400,
          "CHF",
          "completado",
          "2026-10-01T09:05:00Z",
          "POSTFINANCE-DEP-00912"
        ],
        [
          "TX-402",
          "PRJ-101",
          "HIT-201",
          "liberacion_hito",
          4600,
          "CHF",
          "completado",
          "2026-10-14T18:05:00Z",
          "POSTFINANCE-REL-01452"
        ],
        [
          "TX-403",
          "PRJ-101",
          "HIT-202",
          "liberacion_hito",
          4600,
          "CHF",
          "completado",
          "2026-11-04T16:35:00Z",
          "POSTFINANCE-REL-02091"
        ],
        [
          "TX-404",
          "PRJ-102",
          "",
          "deposito_escrow",
          14000,
          "CHF",
          "completado",
          "2026-10-10T11:05:00Z",
          "UBS-SWISS-DEP-55821"
        ],
        [
          "TX-405",
          "PRJ-102",
          "HIT-205",
          "liberacion_hito",
          3500,
          "CHF",
          "completado",
          "2026-10-24T19:50:00Z",
          "UBS-SWISS-REL-58902"
        ],
        [
          "TX-406",
          "PRJ-103",
          "",
          "deposito_escrow",
          9600,
          "CHF",
          "completado",
          "2026-10-28T15:35:00Z",
          "CREDIT-SUISSE-DEP-88410"
        ]
      ]
    }
  ];

  var resultadoConteo = {};

  sheetsDef.forEach(function(item) {
    var sheet = ss.getSheetByName(item.name);
    if (sheet) {
      sheet.clear();
    } else {
      sheet = ss.insertSheet(item.name);
    }

    // Insertar encabezados
    sheet.appendRow(item.headers);
    var headerRange = sheet.getRange(1, 1, 1, item.headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#252530");
    headerRange.setFontColor("#F0F0F8");
    sheet.setFrozenRows(1);

    // Insertar filas
    if (item.data && item.data.length > 0) {
      sheet.getRange(2, 1, item.data.length, item.headers.length).setValues(item.data);
    }

    sheet.autoResizeColumns(1, item.headers.length);
    resultadoConteo[item.name] = item.data.length;
  });

  // Eliminar la "Hoja 1" o "Sheet1" inicial por defecto si existe y tenemos las nuestras
  var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("Hoja 1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {
      // Ignorar si no se puede eliminar
    }
  }

  return JSON.stringify({
    status: "ok",
    message: "Base de datos de Swiss-VZ Connect sembrada exitosamente.",
    registros: resultadoConteo
  });
}
