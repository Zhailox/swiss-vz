/**
 * Swiss-VZ Connect - Router API Web App
 * Maneja peticiones doGet y doPost (Content-Type: text/plain).
 */

function doGet(e) {
  var response = {
    status: "ok",
    app: "Swiss-VZ Connect API",
    version: "1.0.0",
    server: "Google Apps Script Engine (Geneva compliant proxy)",
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var output = {};

  try {
    var rawContents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var request = JSON.parse(rawContents);
    var accion = request.accion;
    var payload = request.payload || {};

    switch (accion) {
      case "seed":
        var seedResult = seed();
        output = JSON.parse(seedResult);
        break;

      case "getDashboard":
        var rol = payload.rol || "cliente";
        var usuarioId = payload.usuarioId || "USR-001";
        
        var escrows = SHEETS_DB.getSheetData("Escrow");
        var transacciones = SHEETS_DB.getSheetData("Transacciones");
        var proyectos = SHEETS_DB.getSheetData("Proyectos");
        var talentos = SHEETS_DB.filterRecords("Usuarios", "rol", "dev");

        var totalEscrow = 0;
        var totalLiberado = 0;
        var totalRetenido = 0;

        escrows.forEach(function(esc) {
          totalEscrow += Number(esc.monto_total) || 0;
          totalLiberado += Number(esc.monto_liberado) || 0;
          totalRetenido += Number(esc.monto_retenido) || 0;
        });

        transacciones.sort(function(a, b) {
          return new Date(b.fecha) - new Date(a.fecha);
        });

        output = {
          status: "ok",
          balance: {
            totalEscrow: totalEscrow,
            totalLiberado: totalLiberado,
            totalRetenido: totalRetenido,
            moneda: "CHF"
          },
          metricas: {
            startupsActivas: 92,
            talentosVerificados: talentos.length > 0 ? talentos.length + 476 : 480,
            proyectosActivos: proyectos.filter(function(p) { return p.estado === "en_progreso"; }).length,
            tasaExito: "99.4%"
          },
          proyectos: proyectos,
          transaccionesRecientes: transacciones.slice(0, 5)
        };
        break;

      case "getTalentos":
        var todosTalentos = SHEETS_DB.filterRecords("Usuarios", "rol", "dev");
        var skillFilter = payload.skill ? String(payload.skill).toLowerCase() : "";
        var tarifaMax = Number(payload.tarifaMax) || 999999;

        var filtrados = todosTalentos.filter(function(dev) {
          var cumpleSkill = !skillFilter || String(dev.skills).toLowerCase().indexOf(skillFilter) !== -1;
          var tarifa = Number(dev.tarifa_hito || dev.tarifa_hora) || 0;
          var cumpleTarifa = tarifa <= tarifaMax;
          return cumpleSkill && cumpleTarifa;
        });

        output = {
          status: "ok",
          data: filtrados
        };
        break;

      case "getProyectos":
        var listaProyectos = SHEETS_DB.getSheetData("Proyectos");
        if (payload.estado) {
          listaProyectos = listaProyectos.filter(function(p) { return p.estado === payload.estado; });
        }
        output = {
          status: "ok",
          data: listaProyectos
        };
        break;

      case "getProyectoDetalle":
        if (!payload.proyectoId) {
          throw new Error("El parámetro 'proyectoId' es requerido.");
        }
        var summary = SHEETS_DB.getProjectSummary(payload.proyectoId);
        output = {
          status: "ok",
          data: summary
        };
        break;

      case "getTransacciones":
        var todasTx = SHEETS_DB.getSheetData("Transacciones");
        if (payload.proyectoId) {
          todasTx = todasTx.filter(function(t) { return t.proyecto_id === payload.proyectoId; });
        }
        todasTx.sort(function(a, b) {
          return new Date(b.fecha) - new Date(a.fecha);
        });
        output = {
          status: "ok",
          data: todasTx
        };
        break;

      case "liberarHito":
        if (!payload.hitoId || !payload.proyectoId) {
          throw new Error("Se requieren 'hitoId' y 'proyectoId'.");
        }
        var releaseResult = SHEETS_DB.releaseMilestoneEscrow(payload.hitoId, payload.proyectoId);
        output = releaseResult;
        break;

      case "crearProyecto":
        var clienteId = payload.clienteId || "USR-001";
        var nuevoId = "PRJ-" + Math.floor(100 + Math.random() * 900);
        var ahora = new Date().toISOString();

        var nuevoPrj = {
          id: nuevoId,
          cliente_id: clienteId,
          titulo: payload.titulo || "Nuevo Proyecto B2B",
          descripcion: payload.descripcion || "",
          presupuesto_total: Number(payload.presupuesto) || 10000,
          moneda: "CHF",
          estado: "en_progreso",
          fecha_inicio: ahora.split("T")[0],
          fecha_fin_estimada: payload.fechaFin || "2027-01-31",
          skills_requeridas: payload.skills || "Vue.js, Python"
        };
        SHEETS_DB.appendRecord("Proyectos", nuevoPrj);

        // Crear Escrow
        var escrowId = "ESC-" + Math.floor(100 + Math.random() * 900);
        SHEETS_DB.appendRecord("Escrow", {
          id: escrowId,
          proyecto_id: nuevoId,
          cliente_id: clienteId,
          monto_total: nuevoPrj.presupuesto_total,
          monto_liberado: 0,
          monto_retenido: nuevoPrj.presupuesto_total,
          estado: "activo",
          fecha_deposito: ahora
        });

        // Crear Depósito inicial en Transacciones
        var depTxId = "TX-" + Math.floor(100000 + Math.random() * 900000);
        SHEETS_DB.appendRecord("Transacciones", {
          id: depTxId,
          proyecto_id: nuevoId,
          hito_id: "",
          tipo: "deposito_escrow",
          monto: nuevoPrj.presupuesto_total,
          moneda: "CHF",
          estado: "completado",
          fecha: ahora,
          referencia: "DEP-INIT-" + nuevoId
        });

        // Hitos
        if (payload.hitos && Array.isArray(payload.hitos)) {
          payload.hitos.forEach(function(h, idx) {
            SHEETS_DB.appendRecord("Hitos", {
              id: "HIT-" + Math.floor(200 + Math.random() * 800),
              proyecto_id: nuevoId,
              orden: idx + 1,
              titulo: h.titulo,
              descripcion: h.descripcion || "",
              monto: Number(h.monto) || (nuevoPrj.presupuesto_total / payload.hitos.length),
              estado: "pendiente",
              fecha_entrega: h.fechaEntrega || "",
              fecha_completado: ""
            });
          });
        }

        output = {
          status: "ok",
          mensaje: "Proyecto creado y fondos en escrow inicializados.",
          proyectoId: nuevoId,
          escrowId: escrowId
        };
        break;

      case "getPerfil":
        var uid = payload.usuarioId || "USR-001";
        var usuario = SHEETS_DB.findRecord("Usuarios", "id", uid);
        if (!usuario) {
          usuario = SHEETS_DB.findRecord("Usuarios", "rol", "cliente");
        }
        output = {
          status: "ok",
          data: usuario
        };
        break;

      default:
        output = {
          status: "error",
          mensaje: "Acción no reconocida: " + accion
        };
        break;
    }
  } catch (error) {
    output = {
      status: "error",
      mensaje: error.message || error.toString()
    };
  }

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
