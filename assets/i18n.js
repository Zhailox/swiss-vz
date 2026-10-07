/**
 * Swiss-VZ Connect - Diccionario de Internacionalización (i18n)
 * Soporta Español (ES) y Alemán estándar suizo (Schweizer Hochdeutsch - DE).
 */

var I18N = (function() {
  var currentLang = localStorage.getItem('SWISSVZ_LANG') || 'es';

  var translations = {
    es: {
      // Navegación Landing
      nav_how: "Cómo Funciona",
      nav_escrow: "Módulo Escrow",
      nav_talent: "Talento Verificado",
      nav_compliance: "Soberanía nLPD",
      nav_enter: "Ingresar al Panel →",

      // Hero
      hero_badge: "Plataforma Verificada · Infraestructura 100% Suiza (Ginebra)",
      hero_title_1: "Conecta con Talento",
      hero_title_gradient: "Verificado.",
      hero_title_2: "Riesgo Financiero Cero.",
      hero_desc: "Marketplace B2B con custodia fintech (Escrow) que une startups suizas con desarrolladores senior venezolanos. Pagos liberados por hitos verificados y total cumplimiento de la nLPD suiza.",
      hero_cta_search: "Explorar Directorio de Talento →",
      hero_cta_demo: "Ver Demostración del Escrow",
      stat_1_val: "CHF 2.4M",
      stat_1_lbl: "Gestionado en Escrow Seguro",
      stat_2_val: "480+",
      stat_2_lbl: "Desarrolladores Evaluados",
      stat_3_val: "92",
      stat_3_lbl: "Startups Suizas Activas",
      stat_4_val: "99.4%",
      stat_4_lbl: "Tasa de Entrega Conforme",

      // Cómo Funciona
      how_tag: "Flujo de Contratación",
      how_title: "Colaboración B2B Transfronteriza en 3 Pasos",
      how_subtitle: "Eliminamos las asimetrías de confianza entre Zúrich, Ginebra y Caracas con un marco legal y financiero blindado.",
      step_1_title: "Publicación & Coincidencia",
      step_1_desc: "La startup define los requisitos técnicos y presupuesto en CHF. El filtro algorítmico selecciona únicamente perfiles de desarrolladores con validación técnica previa.",
      step_2_title: "Depósito en Custodia Escrow",
      step_2_desc: "Los fondos del proyecto se depositan por adelantado en una cuenta custodia neutral suiza (PostFinance AG). El talento inicia el trabajo con el pago 100% garantizado.",
      step_3_title: "Validación & Liberación por Hitos",
      step_3_desc: "A medida que el código se audita y aprueba en cada entrega pactada, el cliente autoriza la liberación del dinero. En caso de discrepancia, aplica arbitraje neutral suizo.",

      // Escrow Diagram
      escrow_tag: "Módulo Fintech",
      escrow_title: "Arquitectura de Custodia y Flujo Financiero",
      escrow_subtitle: "Cada franco suizo permanece resguardado en bóvedas bancarias de Suiza hasta la certificación formal del entregable.",
      node_1_title: "1. Startup Suiza",
      node_1_desc: "Emite orden de depósito en CHF vinculada al contrato legal.",
      node_2_title: "2. Bóveda Escrow Neutral",
      node_2_desc: "Fondos inmovilizados en PostFinance AG. Ninguna de las partes puede retirarlos unilateralmente.",
      node_3_title: "3. Desarrollador",
      node_3_desc: "Recepción de fondos inmediata una vez aprobado cada entregable.",

      // Talento
      talent_tag: "Top 3% Verificado",
      talent_title: "Ingenieros de Software de Alto Impacto",
      talent_subtitle: "Perfiles con validación de identidad, pruebas de codificación en vivo y antecedentes comerciales comprobados.",
      talent_view_profile: "Ver Perfil Completo →",

      // Cumplimiento
      trust_tag: "Marco Institucional",
      trust_title: "Soberanía de Datos & Estándar Suizo",
      trust_subtitle: "Construido específicamente para las exigencias corporativas y regulatorias de la Confederación Suiza.",
      trust_1_title: "Cumplimiento Total nLPD",
      trust_1_desc: "Alineación completa con la Nueva Ley Federal de Protección de Datos de Suiza (DSG). Sin fuga de datos hacia jurisdicciones no reguladas.",
      trust_2_title: "Swiss Hosting Certificado",
      trust_2_desc: "Infraestructura y almacenamiento alojados en centros de datos con certificación ISO 27001 (Infomaniak en Ginebra), neutros en carbono.",
      trust_3_title: "Arbitraje Legal Neutral",
      trust_3_desc: "Contratos de desarrollo con mediación técnica experta para resolver cualquier eventualidad con total neutralidad jurídica.",

      // Final CTA & Footer
      final_cta_title: "¿Listo para Prototipar sin Riesgo Financiero?",
      final_cta_desc: "Comienza a interactuar con el panel operativo, explora los proyectos activos y comprueba la liberación automática del escrow.",
      final_cta_btn: "Acceder al Demo Operativo →",
      footer_desc: "Plataforma B2B para la externalización ética y segura de software de alta calidad hacia talento de ingeniería venezolano.",
      footer_col_platform: "Plataforma",
      footer_col_compliance: "Cumplimiento",
      footer_col_jurisdiction: "Jurisdicción",
      footer_rights: "© 2026 Swiss-VZ Connect. Desarrollado para demostración de arquitectura full-stack B2B. Todos los derechos reservados.",

      // App Shell Topbar & Sidebar
      topbar_role_label: "Vista de Rol:",
      topbar_role_client: "Cliente (Zúrich)",
      topbar_role_dev: "Desarrollador (Caracas)",
      topbar_host: "Host Infomaniak · Ginebra",
      topbar_switch_user: "Simular Usuario",
      sidebar_btn_search: "Buscar Talento",
      sidebar_sec_contracts: "Contratos & Escrow",
      sidebar_nav_project: "Proyecto: PSD2 Banking",
      sidebar_nav_proposals: "Propuestas & Contratos",
      sidebar_nav_audit: "Auditoría de Pagos",
      sidebar_sec_account: "Cuenta Corporativa",
      sidebar_nav_profile: "Ficha del Usuario",
      sidebar_nav_sheets: "Seguridad & Conexión Sheets",

      // App Views
      view_search_title: "Directorio de Talento Verificado",
      view_search_sub: "Desarrolladores venezolanos evaluados con contratos protegidos por Escrow bajo estándares suizos.",
      view_search_placeholder: "Buscar por tecnología, lenguaje o nombre...",
      view_roadmap_title: "Hoja de Ruta & Custodia de Fondos",
      view_roadmap_sub: "Supervisión en tiempo real de hitos pactados, entregables de código y saldo protegido en bóveda.",
      view_audit_title: "Auditoría Financiera & Pistas de Pago",
      view_audit_sub: "Registro inmutable de depósitos iniciales y dispersiones autorizadas a través de PostFinance AG.",
      view_profile_title: "Perfil Corporativo & Cumplimiento",
      view_profile_sub: "Metadatos de la entidad, jurisdicción de datos aplicable y configuración de enlaces.",
      view_proposals_title: "Bandeja de Propuestas & Contratos",
      view_proposals_sub: "Revisa, acepta o gestiona ofertas de proyectos con custodia garantizada en Escrow.",

      // Modales y Acciones Interactivas
      btn_hire: "Contratar en Escrow",
      badge_verified: "Verificado por Swiss-VZ",
      btn_save_settings: "Guardar Cambios",
      btn_close: "Cerrar",
      btn_cancel: "Cancelar",
      btn_authorize: "Autorizar Liberación →",
      btn_accept_contract: "Aceptar Contrato & Activar Escrow →",
      btn_reject: "Rechazar Oferta",

      modal_proposal_title: "Proponer Contrato en Escrow",
      modal_proposal_desc: "Estás por iniciar una oferta formal de desarrollo respaldada por Escrow con",
      modal_proposal_project: "Proyecto vinculado:",
      modal_proposal_escrow_note: "El depósito quedará inmovilizado en custodia suiza (PostFinance AG) tras la aceptación.",
      modal_proposal_confirm: "Enviar Oferta de Contrato →",

      toast_proposal_sent: "Propuesta Enviada",
      toast_proposal_sent_msg: "Se ha notificado a {0}. Los fondos quedarán reservados y se activará el proyecto tras su aceptación.",

      modal_accept_title: "Aceptar Contrato de Escrow",
      modal_accept_desc: "¿Confirmas la aceptación de la propuesta emitida por {0}? Al aceptar, el contrato entrará en vigor inmediatamente y los fondos de {1} quedarán garantizados en Escrow.",

      toast_contract_active: "¡Contrato Activado!",
      toast_contract_active_msg: "Fondos de {0} asegurados en Escrow suizo. El proyecto está ahora activo.",

      milestone_release_title: "Liberación de Fondos en Escrow",
      milestone_release_desc: "¿Deseas certificar la entrega de este entregable y autorizar la liberación inmediata de {0} desde la bóveda de custodia?",
      milestone_selected_label: "Hito seleccionado:",
      milestone_transfer_note: "Transferencia bancaria directa vía PostFinance AG",

      toast_milestone_done: "¡Fondos Transferidos!",
      toast_milestone_done_msg: "Se han liberado {0}. Referencia bancaria: {1}",

      settings_api_title: "Seguridad & Conexión Backend",
      settings_api_desc: "La comunicación con Google Sheets está canalizada a través de un gateway seguro con proxies en Ginebra. La URL del Web App se encuentra enmascarada para proteger la privacidad de tu infraestructura.",
      settings_api_label: "ENDPOINT DE GOOGLE APPS SCRIPT (CIFRADO)",
      settings_api_show: "Mostrar / Modificar URL",
      settings_api_hide: "Ocultar URL",
      settings_status_live: "Conexión Activa con Google Sheets (En Vivo)",
      settings_status_mock: "Modo Mock Local (Sin Servidor)",
      settings_force_seed: "Forzar Seeder"
    },

    de: {
      // Navegación Landing (Schweizer Hochdeutsch)
      nav_how: "Wie es funktioniert",
      nav_escrow: "Escrow-Modul",
      nav_talent: "Geprüfte Talente",
      nav_compliance: "DSG-Konformität",
      nav_enter: "Zum Dashboard →",

      // Hero
      hero_badge: "Verifizierte Plattform · 100% Schweizer Infrastruktur (Genf)",
      hero_title_1: "Verbinden Sie sich mit",
      hero_title_gradient: "geprüften Talenten.",
      hero_title_2: "Null finanzielles Risiko.",
      hero_desc: "B2B-Marktplatz mit Schweizer Escrow-Treuhand, der Schweizer Start-ups mit venezolanischen Senior-Entwicklern verbindet. Meilensteinbasierte Freigaben und vollständige DSG-Konformität.",
      hero_cta_search: "Talentverzeichnis erkunden →",
      hero_cta_demo: "Escrow-Demo ansehen",
      stat_1_val: "CHF 2.4M",
      stat_1_lbl: "Im gesicherten Escrow verwaltet",
      stat_2_val: "480+",
      stat_2_lbl: "Geprüfte Entwickler",
      stat_3_val: "92",
      stat_3_lbl: "Aktive Schweizer Start-ups",
      stat_4_val: "99.4%",
      stat_4_lbl: "Erfolgreiche Lieferquote",

      // Cómo Funciona
      how_tag: "Einstellungsprozess",
      how_title: "Grenzüberschreitende B2B-Zusammenarbeit in 3 Schritten",
      how_subtitle: "Wir beseitigen Vertrauensbarrieren zwischen Zürich, Genf und Caracas mit einem rechtlich und finanziell abgesicherten Rahmenwerk.",
      step_1_title: "Projektausschreibung & Matching",
      step_1_desc: "Das Start-up definiert die technischen Anforderungen und das Budget in CHF. Unser Algorithmus wählt ausschliesslich Entwickler mit nachgewiesener Code-Qualität aus.",
      step_2_title: "Einzahlung auf das Escrow-Treuhandkonto",
      step_2_desc: "Die Projektgelder werden vorab auf einem neutralen Schweizer Treuhandkonto (PostFinance AG) hinterlegt. Die Entwickler starten mit 100% Zahlungsgarantie.",
      step_3_title: "Meilensteinprüfung & Auszahlung",
      step_3_desc: "Sobald der Code geprüft und abgenommen wurde, gibt der Auftraggeber die Zahlung frei. Bei Unstimmigkeiten greift die neutrale Schweizer Schiedsgerichtsbarkeit.",

      // Escrow Diagram
      escrow_tag: "Fintech-Modul",
      escrow_title: "Treuhand-Architektur & Finanzfluss",
      escrow_subtitle: "Jeder Franken bleibt sicher in Schweizer Banktresoren verwahrt, bis die formelle Abnahme des Meilensteins erfolgt.",
      node_1_title: "1. Schweizer Start-up",
      node_1_desc: "Erteilt Einzahlungsauftrag in CHF, gebunden an den rechtlichen Vertrag.",
      node_2_title: "2. Neutrales Escrow-Konto",
      node_2_desc: "Guthaben gesichert bei PostFinance AG. Keine Partei kann Gelder einseitig abziehen.",
      node_3_title: "3. Entwickler",
      node_3_desc: "Sofortige Auszahlung der vereinbarten Vergütung nach Meilenstein-Abnahme.",

      // Talento
      talent_tag: "Top 3% Geprüft",
      talent_title: "Hochqualifizierte Software-Ingenieure",
      talent_subtitle: "Entwicklerprofile mit Identitätsnachweis, Live-Coding-Tests und geprüfter Projekthistorie.",
      talent_view_profile: "Vollständiges Profil ansehen →",

      // Cumplimiento
      trust_tag: "Institutioneller Rahmen",
      trust_title: "Datensouveränität & Schweizer Standard",
      trust_subtitle: "Entwickelt nach den strengen regulatorischen Anforderungen der Schweizerischen Eidgenossenschaft.",
      trust_1_title: "Vollständige DSG-Konformität",
      trust_1_desc: "Vollständige Übereinstimmung mit dem neuen Schweizer Datenschutzgesetz (DSG). Keine Weitergabe persönlicher Daten an unsichere Drittstaaten.",
      trust_2_title: "Zertifiziertes Swiss Hosting",
      trust_2_desc: "Infrastruktur und Datenspeicherung in ISO-27001-zertifizierten Rechenzentren (Infomaniak in Genf) mit 100% erneuerbarer Energie.",
      trust_3_title: "Neutrale Schiedsgerichtsbarkeit",
      trust_3_desc: "Softwareverträge mit technischer Mediation zur unparteiischen Lösung allfälliger Unklarheiten nach Schweizer Rechtsverständnis.",

      // Final CTA & Footer
      final_cta_title: "Bereit für Prototyping ohne finanzielles Risiko?",
      final_cta_desc: "Erkunden Sie jetzt das operative Dashboard, prüfen Sie aktive Projekte und testen Sie die automatische Escrow-Freigabe.",
      final_cta_btn: "Zum operativen Demo-Dashboard →",
      footer_desc: "B2B-Plattform für die ethische und sichere Auslagerung von qualitativ hochwertiger Software an venezolanische Ingenieure.",
      footer_col_platform: "Plattform",
      footer_col_compliance: "Konformität",
      footer_col_jurisdiction: "Gerichtsstand",
      footer_rights: "© 2026 Swiss-VZ Connect. Erstellt als Full-Stack B2B-Architektur-Demonstrator. Alle Rechte vorbehalten.",

      // App Shell Topbar & Sidebar
      topbar_role_label: "Rolle:",
      topbar_role_client: "Auftraggeber (Zürich)",
      topbar_role_dev: "Entwickler (Caracas)",
      topbar_host: "Host Infomaniak · Genf",
      topbar_switch_user: "Benutzer wechseln",
      sidebar_btn_search: "Talente suchen",
      sidebar_sec_contracts: "Verträge & Escrow",
      sidebar_nav_project: "Projekt: PSD2 Banking",
      sidebar_nav_proposals: "Angebote & Verträge",
      sidebar_nav_audit: "Zahlungsprüfung",
      sidebar_sec_account: "Unternehmenskonto",
      sidebar_nav_profile: "Benutzerprofil",
      sidebar_nav_sheets: "Sicherheit & Sheets-Verbindung",

      // App Views
      view_search_title: "Verzeichnis geprüfter Talente",
      view_search_sub: "Geprüfte venezolanische Entwickler mit Escrow-gesicherten Verträgen nach Schweizer Standards.",
      view_search_placeholder: "Nach Technologie, Sprache oder Name suchen...",
      view_roadmap_title: "Roadmap & Treuhandguthaben",
      view_roadmap_sub: "Echtzeit-Überwachung vereinbarter Meilensteine, Code-Lieferungen und gesichertem Guthaben.",
      view_audit_title: "Finanzprüfung & Transaktionsprotokoll",
      view_audit_sub: "Unveränderliches Protokoll der Ersteinzahlungen und autorisierten Auszahlungen über PostFinance AG.",
      view_profile_title: "Unternehmensprofil & Konformität",
      view_profile_sub: "Unternehmensdaten, anwendbarer Gerichtsstand und Schnittstellen-Konfiguration.",
      view_proposals_title: "Posteingang: Angebote & Verträge",
      view_proposals_sub: "Prüfen, akzeptieren oder verwalten Sie Projektangebote mit garantierter Escrow-Treuhand.",

      // Modales y Acciones Interactivas
      btn_hire: "Über Escrow beauftragen",
      badge_verified: "Swiss-VZ Verifiziert",
      btn_save_settings: "Änderungen speichern",
      btn_close: "Schliessen",
      btn_cancel: "Abbrechen",
      btn_authorize: "Auszahlung autorisieren →",
      btn_accept_contract: "Vertrag annehmen & Escrow aktivieren →",
      btn_reject: "Angebot ablehnen",

      modal_proposal_title: "Escrow-Vertragsangebot unterbreiten",
      modal_proposal_desc: "Sie eröffnen ein formelles, durch Schweizer Escrow gesichertes Projektangebot mit",
      modal_proposal_project: "Zugeordnetes Projekt:",
      modal_proposal_escrow_note: "Das Guthaben wird nach Annahme auf dem Schweizer Treuhandkonto (PostFinance AG) gesperrt.",
      modal_proposal_confirm: "Vertragsangebot absenden →",

      toast_proposal_sent: "Angebot gesendet",
      toast_proposal_sent_msg: "{0} wurde benachrichtigt. Die Mittel werden gesichert und das Projekt nach Annahme gestartet.",

      modal_accept_title: "Escrow-Vertrag annehmen",
      modal_accept_desc: "Bestätigen Sie die Annahme des Angebots von {0}? Der Vertrag tritt sofort in Kraft und das Guthaben von {1} wird im Schweizer Escrow gesichert.",

      toast_contract_active: "Vertrag aktiviert!",
      toast_contract_active_msg: "Guthaben von {0} im Schweizer Escrow gesichert. Das Projekt ist nun aktiv.",

      milestone_release_title: "Escrow-Guthaben freigeben",
      milestone_release_desc: "Möchten Sie die Lieferung zertifizieren und die sofortige Auszahlung von {0} aus dem Treuhandkonto autorisieren?",
      milestone_selected_label: "Ausgewählter Meilenstein:",
      milestone_transfer_note: "Direkte Banküberweisung über PostFinance AG",

      toast_milestone_done: "Guthaben freigegeben!",
      toast_milestone_done_msg: "{0} wurden ausgezahlt. Bankreferenz: {1}",

      settings_api_title: "Sicherheit & Backend-Verbindung",
      settings_api_desc: "Die Kommunikation mit Google Sheets erfolgt über ein sicheres Gateway mit Proxys in Genf. Die Web-App-URL wird maskiert, um die Vertraulichkeit Ihrer Infrastruktur zu schützen.",
      settings_api_label: "GOOGLE APPS SCRIPT ENDPUNKT (VERSCHLÜSSELT)",
      settings_api_show: "URL anzeigen / bearbeiten",
      settings_api_hide: "URL verbergen",
      settings_status_live: "Aktive Verbindung mit Google Sheets (Live)",
      settings_status_mock: "Lokaler Mock-Modus (Kein Server)",
      settings_force_seed: "Seeder ausführen"
    }
  };

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (lang === 'es' || lang === 'de') {
      currentLang = lang;
      localStorage.setItem('SWISSVZ_LANG', lang);
      applyTranslations();
      return true;
    }
    return false;
  }

  function t(key, params) {
    var dict = translations[currentLang] || translations.es;
    var str = dict[key] !== undefined ? dict[key] : (translations.es[key] || key);
    if (params && Array.isArray(params)) {
      params.forEach(function(val, idx) {
        str = str.replace(new RegExp('\\{' + idx + '\\}', 'g'), val);
      });
    }
    return str;
  }

  function applyTranslations() {
    // Actualizar todos los elementos con atributo data-i18n
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (key) {
        var translated = t(key);
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', translated);
        } else {
          el.innerHTML = translated;
        }
      }
    });

    // Actualizar botones de switch de idioma
    var esBtn = document.getElementById('langBtnES');
    var deBtn = document.getElementById('langBtnDE');
    if (esBtn && deBtn) {
      esBtn.classList.toggle('active', currentLang === 'es');
      deBtn.classList.toggle('active', currentLang === 'de');
    }
    var topEsBtn = document.getElementById('topLangBtnES');
    var topDeBtn = document.getElementById('topLangBtnDE');
    if (topEsBtn && topDeBtn) {
      topEsBtn.classList.toggle('active', currentLang === 'es');
      topDeBtn.classList.toggle('active', currentLang === 'de');
    }

    // Refrescar vistas dinámicas de la app si están cargadas
    if (window.APP && typeof window.APP.refreshCurrentView === 'function') {
      window.APP.refreshCurrentView();
    }
  }

  return {
    getLang: getLang,
    setLang: setLang,
    t: t,
    applyTranslations: applyTranslations
  };
})();
