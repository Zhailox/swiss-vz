/**
 * Swiss-VZ Connect - Cliente de API HTTP
 * Gestiona la comunicación con Google Apps Script y provee fallback offline transparente.
 */

var API = (function() {
  var DEFAULT_URL = "https://script.google.com/macros/s/AKfycbzyKvWsOM1Asxzdjdh0OAKbxzojKfUx29uywObF2ZqLFNqkVfdWVh4U6D6j0LFk605M/exec";
  var memoryCache = new Map();

  function getApiUrl() {
    var stored = localStorage.getItem("SWISSVZ_API_URL");
    if (stored && stored.includes("PLACEHOLDER")) {
      localStorage.removeItem("SWISSVZ_API_URL");
      return DEFAULT_URL;
    }
    return stored || DEFAULT_URL;
  }

  function setApiUrl(newUrl) {
    if (newUrl && newUrl.trim()) {
      localStorage.setItem("SWISSVZ_API_URL", newUrl.trim());
      memoryCache.clear();
      return true;
    }
    return false;
  }

  // Base de datos de respaldo offline sincronizada con Seed.gs
  var mockDatabase = {
    talentos: [
      {
        id: "USR-003",
        nombre: "Alejandro Rodríguez",
        email: "a.rodriguez@swissvz.dev",
        telefono: "+58 412 892 1045",
        pais: "VE",
        avatar_iniciales: "AR",
        color: "#9D4EDD",
        tarifa_hito: 4600,
        tarifa_hora: 4600,
        verificado: true,
        skills: "Vue.js, Python, FastAPI, PostgreSQL, Docker",
        bio: "Arquitecto Full-Stack con 7+ años de experiencia. Especialista en APIs de alta concurrencia y SPAs reactivas.",
        rating: "4.9 (47 reseñas)",
        disponibilidad: "Inmediata"
      },
      {
        id: "USR-004",
        nombre: "María Fernández",
        email: "m.fernandez@swissvz.dev",
        telefono: "+58 414 309 1823",
        pais: "VE",
        avatar_iniciales: "MF",
        color: "#2ECC71",
        tarifa_hito: 3500,
        tarifa_hora: 3500,
        verificado: true,
        skills: "Python, Django, REST APIs, Redis, Vue.js",
        bio: "Ingeniera backend con experiencia en arquitecturas bancarias, optimización de base de datos e integración con pasarelas de pago.",
        rating: "5.0 (31 reseñas)",
        disponibilidad: "Inmediata"
      },
      {
        id: "USR-005",
        nombre: "Carlos Mendoza",
        email: "c.mendoza@swissvz.dev",
        telefono: "+58 424 551 9087",
        pais: "VE",
        avatar_iniciales: "CM",
        color: "#F39C12",
        tarifa_hito: 4200,
        tarifa_hora: 4200,
        verificado: true,
        skills: "DevOps, Kubernetes, AWS, CI/CD, Python",
        bio: "Especialista en infraestructura en la nube soberana, pipelines de despliegue continuo y cumplimiento de seguridad ISO 27001.",
        rating: "4.8 (29 reseñas)",
        disponibilidad: "Parcial (20h/sem)"
      },
      {
        id: "USR-006",
        nombre: "Valentina Torres",
        email: "v.torres@swissvz.dev",
        telefono: "+58 416 772 3410",
        pais: "VE",
        avatar_iniciales: "VT",
        color: "#E74C3C",
        tarifa_hito: 4000,
        tarifa_hora: 4000,
        verificado: true,
        skills: "Python, Data Science, TensorFlow, Pandas, Spark",
        bio: "Científica de datos con maestría en modelado predictivo, pipelines ETL masivos y algoritmos de visión por computadora.",
        rating: "4.9 (53 reseñas)",
        disponibilidad: "Inmediata"
      }
    ],
    proyectos: [
      {
        id: "PRJ-101",
        cliente_id: "USR-002",
        titulo: "Integración API PSD2 & SIC Banking",
        descripcion: "Construcción de microservicios RESTful en FastAPI e interfaces en Vue.js 3 para conectar el sistema bancario SIC con Open Banking europeo.",
        presupuesto_total: 18400,
        moneda: "CHF",
        estado: "en_progreso",
        cliente_nombre: "AlpineFintech Sàrl",
        hitosCount: 4
      },
      {
        id: "PRJ-102",
        cliente_id: "USR-001",
        titulo: "Pipeline de Segmentación Retinal con IA",
        descripcion: "Desarrollo del backend computacional y contenedores Docker para procesar imágenes oftalmológicas de alta resolución con cumplimiento nLPD.",
        presupuesto_total: 14000,
        moneda: "CHF",
        estado: "en_progreso",
        cliente_nombre: "ClaraLens AG",
        hitosCount: 4
      },
      {
        id: "PRJ-103",
        cliente_id: "USR-002",
        titulo: "Portal Corporativo de Tesorería B2B",
        descripcion: "Dashboard administrativo multi-tenant con reporting financiero exportable, reconciliación automática de cuentas e informes de auditoría.",
        presupuesto_total: 9600,
        moneda: "CHF",
        estado: "abierto",
        cliente_nombre: "AlpineFintech Sàrl",
        hitosCount: 3
      }
    ],
    escrow: {
      "PRJ-101": { id: "ESC-301", proyecto_id: "PRJ-101", monto_total: 18400, monto_liberado: 9200, monto_retenido: 9200, estado: "activo" },
      "PRJ-102": { id: "ESC-302", proyecto_id: "PRJ-102", monto_total: 14000, monto_liberado: 3500, monto_retenido: 10500, estado: "activo" }
    },
    hitos: {
      "PRJ-101": [
        { id: "HIT-201", proyecto_id: "PRJ-101", orden: 1, titulo: "Arquitectura Base & Pipeline CI/CD", descripcion: "Setup del repositorio, esquemas PostgreSQL, Docker y despliegue automatizado.", monto: 4600, estado: "completado", fecha_entrega: "2026-10-15", fecha_completado: "2026-10-14" },
        { id: "HIT-202", proyecto_id: "PRJ-101", orden: 2, titulo: "Integración Core API PSD2 & OAuth2", descripcion: "Autenticación bancaria segura y sincronización de transacciones.", monto: 4600, estado: "completado", fecha_entrega: "2026-11-05", fecha_completado: "2026-11-04" },
        { id: "HIT-203", proyecto_id: "PRJ-101", orden: 3, titulo: "Panel Vue.js Admin & Métricas en Vivo", descripcion: "Interfaz de usuario para monitoreo de operaciones bancarias y reportes.", monto: 4600, estado: "en_revision", fecha_entrega: "2026-11-25", fecha_completado: "" },
        { id: "HIT-204", proyecto_id: "PRJ-101", orden: 4, titulo: "QA, Auditoría de Seguridad & Despliegue", descripcion: "Pruebas de estrés y entrega final en servidor suizo Infomaniak.", monto: 4600, estado: "pendiente", fecha_entrega: "2026-12-15", fecha_completado: "" }
      ]
    },
    transacciones: [
      { id: "TX-401", proyecto_id: "PRJ-101", hito_id: "", tipo: "deposito_escrow", monto: 18400, moneda: "CHF", estado: "completado", fecha: "2026-10-01T09:05:00Z", referencia: "POSTFINANCE-DEP-00912" },
      { id: "TX-402", proyecto_id: "PRJ-101", hito_id: "HIT-201", tipo: "liberacion_hito", monto: 4600, moneda: "CHF", estado: "completado", fecha: "2026-10-14T18:05:00Z", referencia: "POSTFINANCE-REL-01452" },
      { id: "TX-403", proyecto_id: "PRJ-101", hito_id: "HIT-202", tipo: "liberacion_hito", monto: 4600, moneda: "CHF", estado: "completado", fecha: "2026-11-04T16:35:00Z", referencia: "POSTFINANCE-REL-02091" }
    ]
  };

  async function callApi(accion, payload) {
    payload = payload || {};
    var url = getApiUrl();
    var isLiveUrl = url && !url.includes("PLACEHOLDER");

    // Retornar caché en lecturas si existe
    var cacheKey = accion + "_" + JSON.stringify(payload);
    var isMutation = (accion === "liberarHito" || accion === "crearProyecto" || accion === "seed");
    if (!isMutation && memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey);
    }

    if (isLiveUrl) {
      try {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 12000);

        var response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({ accion: accion, payload: payload }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("HTTP Status " + response.status);
        }

        var json = await response.json();
        if (json.status === "error") {
          throw new Error(json.mensaje || "Error en el servidor");
        }

        if (!isMutation) {
          memoryCache.set(cacheKey, json);
        } else {
          memoryCache.clear();
        }
        return json;
      } catch (err) {
        console.warn("Fallo de red hacia Google Apps Script (" + err.message + "). Utilizando motor local de simulación.");
      }
    }

    // SIMULADOR OFFLINE / MOCK
    return handleOfflineMock(accion, payload);
  }

  function handleOfflineMock(accion, payload) {
    switch (accion) {
      case "seed":
        return { status: "ok", message: "Datos de prueba reiniciados localmente." };

      case "getDashboard":
        var totalEscrow = 0;
        var totalLiberado = 0;
        var totalRetenido = 0;
        Object.keys(mockDatabase.escrow).forEach(function(k) {
          var esc = mockDatabase.escrow[k];
          totalEscrow += esc.monto_total;
          totalLiberado += esc.monto_liberado;
          totalRetenido += esc.monto_retenido;
        });
        return {
          status: "ok",
          balance: { totalEscrow: totalEscrow, totalLiberado: totalLiberado, totalRetenido: totalRetenido, moneda: "CHF" },
          metricas: { startupsActivas: 92, talentosVerificados: 480, proyectosActivos: 2, tasaExito: "99.4%" },
          proyectos: mockDatabase.proyectos,
          transaccionesRecientes: mockDatabase.transacciones.slice(0, 5)
        };

      case "getTalentos":
        var skillFilter = payload.skill ? payload.skill.toLowerCase() : "";
        var max = Number(payload.tarifaMax) || 9999;
        var devs = mockDatabase.talentos.filter(function(d) {
          var matchS = !skillFilter || d.skills.toLowerCase().includes(skillFilter);
          var matchT = d.tarifa_hora <= max;
          return matchS && matchT;
        });
        return { status: "ok", data: devs };

      case "getProyectos":
        return { status: "ok", data: mockDatabase.proyectos };

      case "getProyectoDetalle":
        var pid = payload.proyectoId || "PRJ-101";
        var prj = mockDatabase.proyectos.find(function(p) { return p.id === pid; }) || mockDatabase.proyectos[0];
        var hitos = mockDatabase.hitos[pid] || mockDatabase.hitos["PRJ-101"];
        var esc = mockDatabase.escrow[pid] || mockDatabase.escrow["PRJ-101"];
        var txs = mockDatabase.transacciones.filter(function(t) { return t.proyecto_id === pid; });
        return {
          status: "ok",
          data: {
            proyecto: prj,
            cliente: { id: "USR-002", nombre: prj.cliente_nombre || "AlpineFintech Sàrl", pais: "CH" },
            escrow: esc,
            hitos: hitos,
            transacciones: txs
          }
        };

      case "getTransacciones":
        return { status: "ok", data: mockDatabase.transacciones };

      case "liberarHito":
        var hid = payload.hitoId;
        var prjId = payload.proyectoId || "PRJ-101";
        var hitosList = mockDatabase.hitos[prjId];
        var hito = hitosList ? hitosList.find(function(h) { return h.id === hid; }) : null;
        if (hito) {
          hito.estado = "completado";
          hito.fecha_completado = new Date().toISOString().split("T")[0];
          var escEntry = mockDatabase.escrow[prjId];
          if (escEntry) {
            escEntry.monto_liberado += hito.monto;
            escEntry.monto_retenido -= hito.monto;
          }
          var newTx = {
            id: "TX-" + Math.floor(100000 + Math.random() * 900000),
            proyecto_id: prjId,
            hito_id: hid,
            tipo: "liberacion_hito",
            monto: hito.monto,
            moneda: "CHF",
            estado: "completado",
            fecha: new Date().toISOString(),
            referencia: "POSTFINANCE-REL-" + Date.now().toString(36).toUpperCase()
          };
          mockDatabase.transacciones.unshift(newTx);
          return {
            status: "ok",
            montoLiberado: hito.monto,
            nuevoRetenido: escEntry ? escEntry.monto_retenido : 0,
            nuevoLiberadoTotal: escEntry ? escEntry.monto_liberado : 0,
            transaccionId: newTx.id,
            referencia: newTx.referencia
          };
        }
        return { status: "error", mensaje: "Hito no encontrado en simulación" };

      case "getPerfil":
        var rol = payload.rol || "cliente";
        return {
          status: "ok",
          data: {
            nombre: rol === "cliente" ? "ClaraLens AG" : "Alejandro Rodríguez",
            rol: rol,
            pais: rol === "cliente" ? "CH" : "VE",
            email: rol === "cliente" ? "contact@claralens.ch" : "a.rodriguez@swissvz.dev",
            avatar_iniciales: rol === "cliente" ? "CL" : "AR"
          }
        };

      default:
        return { status: "ok", data: [] };
    }
  }

  return {
    getApiUrl: getApiUrl,
    setApiUrl: setApiUrl,
    initSeed: function() { return callApi("seed"); },
    fetchDashboard: function(rol, usuarioId) { return callApi("getDashboard", { rol: rol, usuarioId: usuarioId }); },
    fetchTalentos: function(filtros) { return callApi("getTalentos", filtros); },
    fetchProyectos: function(filtros) { return callApi("getProyectos", filtros); },
    fetchProyectoDetalle: function(proyectoId) { return callApi("getProyectoDetalle", { proyectoId: proyectoId }); },
    fetchTransacciones: function(proyectoId) { return callApi("getTransacciones", { proyectoId: proyectoId }); },
    releaseMilestone: function(hitoId, proyectoId) { return callApi("liberarHito", { hitoId: hitoId, proyectoId: proyectoId }); },
    createProject: function(data) { return callApi("crearProyecto", data); },
    fetchPerfil: function(usuarioId) { return callApi("getPerfil", { usuarioId: usuarioId }); }
  };
})();
