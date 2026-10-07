/**
 * Swiss-VZ Connect - Data Access Layer (DAL)
 * Helpers CRUD y transacciones sobre las 5 hojas de Google Sheets.
 */

var SHEETS_DB = {
  getSpreadsheet: function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error("Spreadsheet no encontrado.");
    }
    return ss;
  },

  getSheetData: function(sheetName) {
    var ss = this.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("La hoja '" + sheetName + "' no existe en el documento.");
    }
    var range = sheet.getDataRange();
    var values = range.getValues();
    if (values.length <= 1) {
      return [];
    }
    var headers = values[0];
    var records = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      records.push(obj);
    }
    return records;
  },

  findRecord: function(sheetName, fieldName, value) {
    var records = this.getSheetData(sheetName);
    for (var i = 0; i < records.length; i++) {
      if (String(records[i][fieldName]).toLowerCase() === String(value).toLowerCase()) {
        return records[i];
      }
    }
    return null;
  },

  filterRecords: function(sheetName, fieldName, value) {
    var records = this.getSheetData(sheetName);
    return records.filter(function(item) {
      return String(item[fieldName]).toLowerCase() === String(value).toLowerCase();
    });
  },

  appendRecord: function(sheetName, recordObject) {
    var ss = this.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("La hoja '" + sheetName + "' no existe.");
    }
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var newRow = [];
    for (var i = 0; i < headers.length; i++) {
      var h = headers[i];
      newRow.push(recordObject[h] !== undefined ? recordObject[h] : "");
    }
    sheet.appendRow(newRow);
    return recordObject;
  },

  updateRecord: function(sheetName, idField, idValue, updateObject) {
    var ss = this.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("La hoja '" + sheetName + "' no existe.");
    }
    var range = sheet.getDataRange();
    var values = range.getValues();
    if (values.length <= 1) return null;
    var headers = values[0];
    var idColIndex = headers.indexOf(idField);
    if (idColIndex === -1) {
      throw new Error("El campo ID '" + idField + "' no existe en '" + sheetName + "'.");
    }

    var rowIndex = -1;
    for (var r = 1; r < values.length; r++) {
      if (String(values[r][idColIndex]) === String(idValue)) {
        rowIndex = r + 1; // 1-based index in Sheet
        break;
      }
    }

    if (rowIndex === -1) {
      return null;
    }

    for (var key in updateObject) {
      if (updateObject.hasOwnProperty(key)) {
        var colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(rowIndex, colIndex + 1).setValue(updateObject[key]);
        }
      }
    }
    return this.findRecord(sheetName, idField, idValue);
  },

  getProjectSummary: function(proyectoId) {
    var proyecto = this.findRecord("Proyectos", "id", proyectoId);
    if (!proyecto) {
      throw new Error("Proyecto no encontrado: " + proyectoId);
    }
    var cliente = this.findRecord("Usuarios", "id", proyecto.cliente_id);
    var hitos = this.filterRecords("Hitos", "proyecto_id", proyectoId);
    hitos.sort(function(a, b) { return Number(a.orden) - Number(b.orden); });

    var escrow = this.findRecord("Escrow", "proyecto_id", proyectoId);
    var transacciones = this.filterRecords("Transacciones", "proyecto_id", proyectoId);
    transacciones.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });

    return {
      proyecto: proyecto,
      cliente: cliente,
      escrow: escrow,
      hitos: hitos,
      transacciones: transacciones
    };
  },

  releaseMilestoneEscrow: function(hitoId, proyectoId) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000); // 10 segundos timeout
    } catch (e) {
      throw new Error("El servidor está ocupado procesando otra transacción. Intente de nuevo.");
    }

    try {
      var hito = this.findRecord("Hitos", "id", hitoId);
      if (!hito) {
        throw new Error("Hito " + hitoId + " no existe.");
      }
      if (hito.estado === "completado") {
        throw new Error("Este hito ya fue completado y sus fondos fueron previamente liberados.");
      }

      var escrow = this.findRecord("Escrow", "proyecto_id", proyectoId);
      if (!escrow) {
        throw new Error("No hay registro de Escrow para el proyecto " + proyectoId);
      }

      var montoHito = Number(hito.monto) || 0;
      var montoLiberadoActual = Number(escrow.monto_liberado) || 0;
      var montoRetenidoActual = Number(escrow.monto_retenido) || 0;

      if (montoRetenidoActual < montoHito) {
        throw new Error("Saldo en custodia insuficiente para liberar este hito.");
      }

      var nuevoLiberado = montoLiberadoActual + montoHito;
      var nuevoRetenido = montoRetenidoActual - montoHito;
      var nuevoEstadoEscrow = (nuevoRetenido <= 0) ? "liquidado" : "activo";
      var ahora = new Date().toISOString();

      // 1. Actualizar Hito
      this.updateRecord("Hitos", "id", hitoId, {
        estado: "completado",
        fecha_completado: ahora
      });

      // 2. Actualizar Escrow
      this.updateRecord("Escrow", "id", escrow.id, {
        monto_liberado: nuevoLiberado,
        monto_retenido: nuevoRetenido,
        estado: nuevoEstadoEscrow
      });

      // 3. Crear Transacción de Auditoría
      var txId = "TX-" + Math.floor(100000 + Math.random() * 900000);
      var txRef = "POSTFINANCE-REL-" + Date.now().toString(36).toUpperCase();
      this.appendRecord("Transacciones", {
        id: txId,
        proyecto_id: proyectoId,
        hito_id: hitoId,
        tipo: "liberacion_hito",
        monto: montoHito,
        moneda: "CHF",
        estado: "completado",
        fecha: ahora,
        referencia: txRef
      });

      return {
        status: "ok",
        mensaje: "Hito liberado exitosamente. Fondos transferidos.",
        montoLiberado: montoHito,
        nuevoLiberadoTotal: nuevoLiberado,
        nuevoRetenido: nuevoRetenido,
        transaccionId: txId,
        referencia: txRef
      };
    } finally {
      lock.releaseLock();
    }
  }
};
