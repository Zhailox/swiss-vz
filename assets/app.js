/**
 * Swiss-VZ Connect - Controlador de la SPA (app.js)
 * Router por vistas, store de estado reactivo, User Switcher,
 * aceptación de propuestas en Escrow, enmascaramiento seguro y soporte i18n completo.
 */

var APP = (function() {
  // Directorio de usuarios de simulación rápida
  var DEMO_USERS = {
    'USR-001': {
      id: 'USR-001',
      nombre: 'ClaraLens AG',
      rol: 'cliente',
      pais: 'Suiza',
      ciudad: 'Zúrich',
      avatar: 'CL',
      color: '#9D4EDD',
      sub: 'MedTech Start-up · Zürich',
      subDE: 'MedTech Start-up · Zürich',
      email: 'contact@claralens.ch',
      tel: '+41 44 215 88 00',
      idFiscal: 'CHE-402.198.552 · Handelsregisteramt Zürich'
    },
    'USR-002': {
      id: 'USR-002',
      nombre: 'AlpineFintech AG',
      rol: 'cliente',
      pais: 'Suiza',
      ciudad: 'Zug',
      avatar: 'AF',
      color: '#2ECC71',
      sub: 'Fintech & DeFi Solutions · Zug',
      subDE: 'Fintech & DeFi Solutions · Zug',
      email: 'tech@alpinefintech.ch',
      tel: '+41 41 710 40 20',
      idFiscal: 'CHE-310.845.119 · Handelsregisteramt Zug'
    },
    'USR-003': {
      id: 'USR-003',
      nombre: 'Alejandro Rodríguez',
      rol: 'dev',
      pais: 'Venezuela',
      ciudad: 'Caracas',
      avatar: 'AR',
      color: '#9D4EDD',
      sub: 'Senior Full-Stack Ingeniero · Caracas',
      subDE: 'Senior Full-Stack Ingenieur · Caracas',
      email: 'a.rodriguez@swissvz.dev',
      tel: '+58 412 892 1045',
      idFiscal: 'ID Fiscal: V-24.891.450 · Caracas, VE',
      rate: 4600
    },
    'USR-004': {
      id: 'USR-004',
      nombre: 'María Fernández',
      rol: 'dev',
      pais: 'Venezuela',
      ciudad: 'Caracas',
      avatar: 'MF',
      color: '#2ECC71',
      sub: 'Backend Python & Core Bancario · Caracas',
      subDE: 'Backend Python & Core Banking · Caracas',
      email: 'm.fernandez@swissvz.dev',
      tel: '+58 414 309 1823',
      idFiscal: 'ID Fiscal: V-26.115.390 · Caracas, VE',
      rate: 3500
    },
    'USR-005': {
      id: 'USR-005',
      nombre: 'Carlos Mendoza',
      rol: 'dev',
      pais: 'Venezuela',
      ciudad: 'Valencia',
      avatar: 'CM',
      color: '#F39C12',
      sub: 'DevOps & Cloud Architect · Valencia',
      subDE: 'DevOps & Cloud Architect · Valencia',
      email: 'c.mendoza@swissvz.dev',
      tel: '+58 416 991 7734',
      idFiscal: 'ID Fiscal: V-21.740.912 · Valencia, VE',
      rate: 4200
    }
  };

  // Inicializar propuestas demo desde localStorage o valores por defecto
  function initProposals() {
    var stored = localStorage.getItem('SWISSVZ_PROPOSALS');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'PROP-201',
        clienteId: 'USR-001',
        clienteNombre: 'ClaraLens AG',
        devId: 'USR-003',
        devNombre: 'Alejandro Rodríguez',
        proyectoTitulo: 'Integración API PSD2 & SIC Banking (PRJ-101)',
        hitoTitulo: 'Fase 1: Módulo de Custodia & Gateway Bancario',
        monto: 4600,
        estado: 'pendiente', // 'pendiente' | 'activo' | 'rechazado'
        fecha: '2026-03-24'
      }
    ];
  }

  // Estado reactivo central
  var initialUserId = localStorage.getItem('SWISSVZ_USER_ID') || 'USR-001';
  if (!DEMO_USERS[initialUserId]) initialUserId = 'USR-001';

  var state = {
    currentUserId: initialUserId,
    currentRole: DEMO_USERS[initialUserId].rol,
    currentView: 'search',  // 'search' | 'roadmap' | 'proposals' | 'transactions' | 'profile'
    activeProjectId: 'PRJ-101',
    activeTalentFilter: '',
    talentsList: [],
    currentProjectData: null,
    proposals: initProposals(),
    isApiMasked: true
  };

  // Biblioteca de iconos SVG inline profesionales (0 Emojis)
  function getIcon(name, size, strokeWidth) {
    size = size || 18;
    strokeWidth = strokeWidth || 2;
    var s = 'width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + strokeWidth + '" stroke-linecap="round" stroke-linejoin="round"';

    switch (name) {
      case 'search':
        return '<svg ' + s + '><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
      case 'shield-check':
        return '<svg ' + s + '><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>';
      case 'lock':
        return '<svg ' + s + '><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      case 'check':
        return '<svg ' + s + '><polyline points="20 6 9 17 4 12"></polyline></svg>';
      case 'x':
        return '<svg ' + s + '><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      case 'arrow-right':
        return '<svg ' + s + '><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
      case 'arrow-down':
        return '<svg ' + s + '><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>';
      case 'user':
        return '<svg ' + s + '><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
      case 'briefcase':
        return '<svg ' + s + '><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
      case 'chart':
        return '<svg ' + s + '><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>';
      case 'wallet':
        return '<svg ' + s + '><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path><circle cx="16" cy="14" r="2"></circle></svg>';
      case 'bell':
        return '<svg ' + s + '><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>';
      case 'settings':
        return '<svg ' + s + '><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
      case 'eye':
        return '<svg ' + s + '><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      case 'eye-off':
        return '<svg ' + s + '><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
      case 'file-text':
        return '<svg ' + s + '><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
      case 'star':
        return '<svg ' + s + ' fill="#F39C12" stroke="#F39C12"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
      case 'clock':
        return '<svg ' + s + '><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
      case 'server':
        return '<svg ' + s + '><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>';
      case 'mail':
        return '<svg ' + s + '><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
      case 'phone':
        return '<svg ' + s + '><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
      default:
        return '<svg ' + s + '><circle cx="12" cy="12" r="10"></circle></svg>';
    }
  }

  // Notificaciones Toast
  function showToast(type, title, message) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast-msg ' + (type || 'info');
    toast.innerHTML = '<div style="font-weight:700;font-size:0.9rem;margin-bottom:2px;color:var(--text-primary);">' + title + '</div><div style="font-size:0.8rem;color:var(--text-secondary);">' + message + '</div>';
    
    container.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(function() { if (toast.parentNode) toast.remove(); }, 250);
    }, 4000);
  }

  // Modales
  function openModal(title, contentHtml) {
    var overlay = document.getElementById('modalOverlay');
    var box = document.getElementById('modalContent');
    if (!overlay || !box) return;

    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;"><h3 style="font-size:1.3rem;font-weight:800;">' + title + '</h3><button class="btn-icon" onclick="APP.closeModal()">' + getIcon('x', 18) + '</button></div>' + contentHtml;
    overlay.classList.add('open');
  }

  function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  // Navegación entre Landing y App Shell
  function enterApp(targetView) {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    if (!targetView) {
      targetView = (state.currentRole === 'dev') ? 'proposals' : 'search';
    } else if (state.currentRole === 'dev' && targetView === 'search') {
      targetView = 'proposals';
    }

    switchUser(state.currentUserId, false);
    showView(targetView);

    var isDe = window.I18N && window.I18N.getLang() === 'de';
    showToast('success', isDe ? 'Sitzung gestartet' : 'Sesión Iniciada', isDe ? 'Willkommen bei Swiss-VZ Connect.' : 'Bienvenido a Swiss-VZ Connect. Infraestructura verificada en Ginebra.');
  }

  function exitToLanding() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Conmutador de Usuario (User Switcher)
  function switchUser(userId, showNotification) {
    if (showNotification === undefined) showNotification = true;
    var user = DEMO_USERS[userId] || DEMO_USERS['USR-001'];
    state.currentUserId = user.id;
    state.currentRole = user.rol;
    localStorage.setItem('SWISSVZ_USER_ID', user.id);
    localStorage.setItem('SWISSVZ_ROLE', user.rol);

    // Sincronizar select dropdown si existe
    var userSelect = document.getElementById('userSelector');
    if (userSelect && userSelect.value !== user.id) {
      userSelect.value = user.id;
    }

    // Actualizar botones de rol
    var clientBtn = document.getElementById('roleClient');
    var devBtn = document.getElementById('roleDev');
    if (clientBtn && devBtn) {
      clientBtn.classList.toggle('active', user.rol === 'cliente');
      devBtn.classList.toggle('active', user.rol === 'dev');
    }

    // Actualizar Sidebar Badge
    var sidebarAvatar = document.getElementById('sidebarAvatar');
    var sidebarName = document.getElementById('sidebarName');
    var sidebarRole = document.getElementById('sidebarRole');
    var searchTalentNavItem = document.getElementById('navItemSearch');
    var isDe = window.I18N && window.I18N.getLang() === 'de';

    if (sidebarAvatar) {
      sidebarAvatar.textContent = user.avatar;
      sidebarAvatar.style.background = user.color || 'var(--accent)';
    }
    if (sidebarName) sidebarName.textContent = user.nombre;
    if (sidebarRole) sidebarRole.textContent = isDe ? user.subDE : user.sub;

    if (searchTalentNavItem) {
      if (user.rol === 'cliente') {
        searchTalentNavItem.classList.remove('hidden');
      } else {
        searchTalentNavItem.classList.add('hidden');
        if (state.currentView === 'search') {
          showView('proposals');
        }
      }
    }

    updateProposalsBadge();

    if (showNotification) {
      var roleTitle = user.rol === 'cliente' 
        ? (isDe ? 'Auftraggeber (Zürich)' : 'Cliente (Suiza)') 
        : (isDe ? 'Entwickler (Caracas)' : 'Desarrollador (Venezuela)');
      var switchMsg = isDe
        ? 'Aktiver Benutzer: ' + user.nombre + ' (' + roleTitle + ')'
        : 'Sesión activa: ' + user.nombre + ' (' + roleTitle + ')';
      showToast('info', isDe ? 'Benutzer gewechselt' : 'Usuario Cambiado', switchMsg);
    }

    // Refrescar vista actual
    refreshCurrentView();
  }

  // Selector manual de Rol (Cliente / Desarrollador)
  function setRole(role) {
    if (role === 'cliente') {
      switchUser('USR-001');
    } else {
      switchUser('USR-003');
    }
  }

  function updateProposalsBadge() {
    var badge = document.getElementById('proposalsBadge');
    if (!badge) return;

    var count = 0;
    if (state.currentRole === 'dev') {
      // Contar propuestas pendientes para este dev
      count = state.proposals.filter(function(p) {
        return (p.devId === state.currentUserId || p.devId === 'USR-003') && p.estado === 'pendiente';
      }).length;
    } else {
      // Contar propuestas activas o pendientes del cliente
      count = state.proposals.filter(function(p) {
        return p.clienteId === state.currentUserId && p.estado === 'pendiente';
      }).length;
    }

    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  function toggleMobileSidebar() {
    var sb = document.querySelector('.sidebar');
    if (sb) {
      sb.classList.toggle('mobile-collapsed');
    }
  }

  // Enrutador de Vistas Internas
  function showView(viewId) {
    state.currentView = viewId;
    document.querySelectorAll('.view-pane').forEach(function(pane) {
      pane.classList.remove('active');
    });

    var activePane = document.getElementById('view-' + viewId);
    if (activePane) activePane.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(function(link) {
      link.classList.remove('active');
    });
    var navTarget = document.getElementById('nav-' + viewId);
    if (navTarget) navTarget.classList.add('active');

    switch (viewId) {
      case 'search':
        renderTalentsList();
        break;
      case 'roadmap':
        renderProjectRoadmap(state.activeProjectId);
        break;
      case 'proposals':
        renderProposalsList();
        break;
      case 'transactions':
        renderTransactionsTable();
        break;
      case 'profile':
        renderProfileInfo();
        break;
    }
  }

  // Renderizador: Directorio de Talento
  async function renderTalentsList(filterSkill) {
    state.activeTalentFilter = filterSkill || '';
    var grid = document.getElementById('talentsGrid');
    if (!grid) return;

    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);">' + getIcon('clock', 24) + '<p style="margin-top:12px;">Consultando talento verificado en base de datos...</p></div>';

    var res = await API.fetchTalentos({ skill: state.activeTalentFilter });
    var data = (res && res.data) ? res.data : [];
    state.talentsList = data;

    if (data.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);"><p>No se encontraron talentos con la tecnología seleccionada.</p></div>';
      return;
    }

    var html = '';
    var isDe = window.I18N && window.I18N.getLang() === 'de';

    data.forEach(function(t) {
      var skillsList = t.skills ? t.skills.split(',').map(function(s) { return s.trim(); }) : [];
      var tagsHtml = skillsList.map(function(sk) {
        return '<span class="tag-skill">' + sk + '</span>';
      }).join('');

      var rawRate = Number(t.tarifa_hito || t.tarifa_hora) || 4600;
      var hitoMonto = (rawRate < 100) ? rawRate * 100 : rawRate;
      var escrowLabel = isDe ? '/ Meilenstein Escrow' : '/ Hito en Escrow';

      var emailVal = t.email || (t.nombre.toLowerCase().replace(/\s+/g, '.') + '@swissvz.dev');
      var telVal = t.telefono || '+58 412 892 1045';

      html += '<div class="card-talent">' +
        '<div class="talent-head">' +
          '<div style="display:flex;gap:14px;align-items:center;">' +
            '<div style="width:48px;height:48px;border-radius:12px;background:' + (t.color || 'var(--accent)') + ';display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-family:\'Montserrat\';">' + (t.avatar_iniciales || 'DV') + '</div>' +
            '<div class="talent-info">' +
              '<h3>' + t.nombre + '</h3>' +
              '<div class="badge badge-verified">' + getIcon('shield-check', 14) + ' ' + (window.I18N ? window.I18N.t('badge_verified') : 'Verificado por Swiss-VZ') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="talent-rate">CHF ' + hitoMonto.toLocaleString() + '<span style="font-size:0.72rem;color:var(--text-muted);font-weight:500;display:block;text-align:right;">' + escrowLabel + '</span></div>' +
        '</div>' +
        '<p style="font-size:0.88rem;margin:12px 0 8px;line-height:1.5;">' + (t.bio || 'Desarrollador de software con experiencia comprobada.') + '</p>' +
        '<div class="talent-contact-bar">' +
          '<a href="mailto:' + emailVal + '" style="color:var(--accent);">' + getIcon('mail', 14) + ' <span>' + emailVal + '</span></a>' +
          '<span style="color:var(--border);">•</span>' +
          '<a href="tel:' + telVal.replace(/\s+/g, '') + '" style="color:var(--success);">' + getIcon('phone', 14) + ' <span>' + telVal + '</span></a>' +
        '</div>' +
        '<div class="talent-skills-wrap">' + tagsHtml + '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid var(--border);flex-wrap:wrap;gap:12px;">' +
          '<div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-secondary);">' + getIcon('star', 15) + ' 4.9 (45+ ' + (isDe ? 'Bewertungen' : 'reseñas') + ')</div>' +
          '<button class="btn-cta-primary" style="padding:10px 18px;font-size:0.85rem;" onclick="APP.proposeContract(\'' + t.id + '\',\'' + t.nombre.replace(/'/g, "\\'") + '\',' + hitoMonto + ')">' + (window.I18N ? window.I18N.t('btn_hire') : 'Contratar en Escrow') + '</button>' +
        '</div>' +
      '</div>';
    });

    grid.innerHTML = html;
  }

  // Renderizador: Proyecto y Hoja de Ruta
  async function renderProjectRoadmap(projectId) {
    projectId = projectId || 'PRJ-101';
    state.activeProjectId = projectId;
    var container = document.getElementById('roadmapContent');
    if (!container) return;

    container.innerHTML = '<div style="text-align:center;padding:64px;color:var(--text-muted);">' + getIcon('clock', 28) + '<p style="margin-top:12px;">Cargando contrato inteligente y fondos en custodia...</p></div>';

    var res = await API.fetchProyectoDetalle(projectId);
    var bundle = (res && res.data) ? res.data : null;
    if (!bundle) {
      container.innerHTML = '<p style="color:var(--danger);">Error al cargar los datos del proyecto.</p>';
      return;
    }

    state.currentProjectData = bundle;
    var prj = bundle.proyecto;
    var escrow = bundle.escrow || { monto_total: 18400, monto_liberado: 9200, monto_retenido: 9200 };
    var hitos = bundle.hitos || [];

    var completados = hitos.filter(function(h) { return h.estado === 'completado'; }).length;
    var totalHitos = hitos.length || 1;
    var porcentajeAvance = Math.round((completados / totalHitos) * 100);

    var isDe = window.I18N && window.I18N.getLang() === 'de';

    var hitosHtml = hitos.map(function(h) {
      var isDone = h.estado === 'completado';
      var isInReview = h.estado === 'en_revision';
      var statusBadge = isDone 
        ? '<span class="badge badge-verified">' + getIcon('check', 13) + ' ' + (isDe ? 'Freigegeben' : 'Fondos Liberados') + '</span>' 
        : (isInReview 
            ? '<span class="badge badge-warning">' + getIcon('clock', 13) + ' ' + (isDe ? 'In Prüfung' : 'En Revisión de Entrega') + '</span>' 
            : '<span class="badge" style="background:var(--surface-3);color:var(--text-muted);">' + getIcon('lock', 13) + ' ' + (isDe ? 'Im Escrow gesperrt' : 'Bloqueado en Escrow') + '</span>');

      var checkAction = (state.currentRole === 'cliente' && !isDone)
        ? 'onclick="APP.confirmMilestoneRelease(\'' + h.id + '\',\'' + h.titulo.replace(/'/g, "\\'") + '\',' + h.monto + ')" title="' + (isDe ? 'Klicken um Zahlung freizugeben' : 'Hacer clic para validar entrega y liberar pago') + '"'
        : 'style="cursor:default;"';

      return '<div class="milestone-item ' + (isDone ? 'completed' : '') + '">' +
        '<div class="milestone-check-btn" ' + checkAction + '>' + (isDone ? getIcon('check', 16) : '') + '</div>' +
        '<div style="flex:1;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
            '<h4 style="font-size:1.05rem;font-weight:700;' + (isDone ? 'text-decoration:line-through;color:var(--text-muted);' : '') + '">' + h.orden + '. ' + h.titulo + '</h4>' +
            '<div style="font-family:\'Montserrat\';font-size:1.15rem;font-weight:800;color:' + (isDone ? 'var(--success)' : 'var(--text-primary)') + ';">CHF ' + Number(h.monto).toLocaleString() + '</div>' +
          '</div>' +
          '<p style="font-size:0.85rem;margin-bottom:12px;">' + h.descripcion + '</p>' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            statusBadge +
            '<span style="font-size:0.75rem;color:var(--text-muted);">' + (h.fecha_entrega ? (isDe ? 'Lieferung: ' : 'Entrega: ') + h.fecha_entrega : '') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML = 
      '<div class="escrow-hero-card">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
            '<div class="badge badge-verified">' + getIcon('shield-check', 15) + ' ' + (isDe ? 'Neutrales Schweizer Treuhandkonto' : 'Custodia Neutral Suiza') + '</div>' +
            '<span style="font-size:0.8rem;color:var(--text-muted);">' + (isDe ? 'Vertrag: ' : 'Contrato: ') + prj.id + '</span>' +
          '</div>' +
          '<h2 style="font-size:1.6rem;font-weight:900;margin-bottom:8px;">' + prj.titulo + '</h2>' +
          '<p style="font-size:0.9rem;max-width:640px;">' + prj.descripcion + '</p>' +
        '</div>' +
        '<div style="text-align:right;">' +
          '<div style="font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;letter-spacing:0.05em;margin-bottom:4px;">' + (isDe ? 'Im Escrow gesichertes Guthaben' : 'Saldo Asegurado en Bóveda') + '</div>' +
          '<div class="escrow-amount-display">CHF ' + Number(escrow.monto_retenido).toLocaleString() + '</div>' +
          '<div style="font-size:0.75rem;color:var(--success);font-weight:600;">PostFinance AG Treuhand</div>' +
        '</div>' +
      '</div>' +

      '<div class="prog-stats-grid">' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">' + (isDe ? 'Gesamtfortschritt' : 'Avance Global') + '</div>' +
          '<div class="card-stat-value" style="color:var(--accent);">' + porcentajeAvance + '%</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + porcentajeAvance + '%;"></div></div>' +
        '</div>' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">' + (isDe ? 'Erreichte Meilensteine' : 'Hitos Entregados') + '</div>' +
          '<div class="card-stat-value" style="color:var(--success);">' + completados + ' / ' + totalHitos + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + ((completados / totalHitos) * 100) + '%;background:var(--success);"></div></div>' +
        '</div>' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">' + (isDe ? 'Ausgezahltes Guthaben' : 'Total Liberado') + '</div>' +
          '<div class="card-stat-value" style="color:var(--success);">CHF ' + Number(escrow.monto_liberado).toLocaleString() + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + ((escrow.monto_liberado / escrow.monto_total) * 100) + '%;background:var(--success);"></div></div>' +
        '</div>' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">' + (isDe ? 'Verbleibend im Escrow' : 'Retenido Restante') + '</div>' +
          '<div class="card-stat-value" style="color:var(--warning);">CHF ' + Number(escrow.monto_retenido).toLocaleString() + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:100%;background:var(--warning);"></div></div>' +
        '</div>' +
      '</div>' +

      (state.currentRole === 'dev' 
        ? '<div style="background:var(--accent-soft);border:1px solid rgba(157,78,221,0.3);border-radius:var(--radius-sm);padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--accent);font-size:0.85rem;">' + getIcon('lock', 18) + '<span><strong>' + (isDe ? 'Entwickler-Ansicht:' : 'Modo Consulta (Desarrollador):') + '</strong> ' + (isDe ? 'Auszahlungen erfolgen automatisch bei Abnahme durch den Schweizer Kunden.' : 'Los pagos se liberan automáticamente en cuanto el cliente suizo valida la entrega de código.') + '</span></div>' 
        : '<div style="background:var(--success-soft);border:1px solid rgba(46,204,113,0.3);border-radius:var(--radius-sm);padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--success);font-size:0.85rem;">' + getIcon('shield-check', 18) + '<span><strong>' + (isDe ? 'Auftraggeber-Steuerung:' : 'Modo Administrador (Cliente):') + '</strong> ' + (isDe ? 'Klicken Sie auf den Kreis eines Meilensteins, um die Lieferung zu zertifizieren und Gelder freizugeben.' : 'Haz clic en el círculo de cualquier hito en revisión para verificarlo y transferir los fondos instantáneamente.') + '</span></div>') +

      '<h3 style="font-size:1.25rem;font-weight:800;margin-bottom:16px;">' + (isDe ? 'Vertrags-Meilensteine' : 'Hitos del Contrato') + '</h3>' +
      '<div class="milestones-list">' + hitosHtml + '</div>';
  }

  // Renderizador: Bandeja de Propuestas & Contratos
  function renderProposalsList() {
    var container = document.getElementById('proposalsContent');
    if (!container) return;

    var isDe = window.I18N && window.I18N.getLang() === 'de';
    var isDev = state.currentRole === 'dev';

    var filtered = state.proposals.filter(function(p) {
      if (isDev) {
        return p.devId === state.currentUserId || p.devId === 'USR-003';
      } else {
        return p.clienteId === state.currentUserId || p.clienteId === 'USR-001';
      }
    });

    if (filtered.length === 0) {
      container.innerHTML = 
        '<div style="text-align:center;padding:64px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">' +
          getIcon('briefcase', 36) +
          '<h3 style="margin-top:16px;font-size:1.15rem;font-weight:700;">' + (isDe ? 'Keine ausstehenden Angebote' : 'No hay propuestas en esta bandeja') + '</h3>' +
          '<p style="font-size:0.88rem;color:var(--text-muted);margin:8px 0 24px;">' + 
            (isDev 
              ? (isDe ? 'Sie haben derzeit keine offenen Vertragsangebote von Schweizer Unternehmen.' : 'Actualmente no tienes ofertas pendientes de clientes suizos.') 
              : (isDe ? 'Sie haben noch keine Angebote an venezolanische Entwickler gesendet.' : 'Aún no has emitido propuestas a ingenieros de software.')) +
          '</p>' +
          (isDev ? '' : '<button class="btn-cta-primary" onclick="APP.showView(\'search\')">' + (isDe ? 'Talente durchsuchen' : 'Explorar Directorio de Talento') + '</button>') +
        '</div>';
      return;
    }

    var cardsHtml = filtered.map(function(prop) {
      var isPending = prop.estado === 'pendiente';
      var isActive = prop.estado === 'activo';
      
      var badgeHtml = isPending 
        ? '<div class="proposal-badge-pending">' + getIcon('clock', 12) + ' ' + (isDe ? 'Warten auf Annahme' : 'Pendiente de Aceptación') + '</div>'
        : (isActive 
            ? '<div class="proposal-badge-active">' + getIcon('shield-check', 12) + ' ' + (isDe ? 'Aktiv · Im Escrow gesichert' : 'Activo · Fondos en Escrow') + '</div>'
            : '<div class="proposal-badge-rejected">' + getIcon('x', 12) + ' ' + (isDe ? 'Abgelehnt' : 'Rechazada') + '</div>');

      var actionsHtml = '';
      if (isDev && isPending) {
        actionsHtml = 
          '<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">' +
            '<button class="btn-cta-secondary" style="font-size:0.85rem;" onclick="APP.rejectProposal(\'' + prop.id + '\')">' + (window.I18N ? window.I18N.t('btn_reject') : 'Rechazar') + '</button>' +
            '<button class="btn-cta-primary" style="font-size:0.85rem;" onclick="APP.acceptProposal(\'' + prop.id + '\')">' + (window.I18N ? window.I18N.t('btn_accept_contract') : 'Aceptar Contrato & Activar Escrow →') + '</button>' +
          '</div>';
      } else if (isActive) {
        actionsHtml = 
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">' +
            '<span style="font-size:0.8rem;color:var(--success);font-weight:600;display:inline-flex;align-items:center;gap:6px;">' + getIcon('check', 14) + ' ' + (isDe ? 'PostFinance Treuhandkonto aktiv' : 'Depósito activo en bóveda suiza PostFinance') + '</span>' +
            '<button class="btn-cta-secondary" style="font-size:0.82rem;" onclick="APP.showView(\'roadmap\')">' + (isDe ? 'Zur Roadmap →' : 'Ver Hoja de Ruta →') + '</button>' +
          '</div>';
      }

      return '<div class="card-proposal">' +
        '<div class="proposal-top">' +
          '<div>' +
            '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">' +
              (isDev ? (isDe ? 'Angebot von: ' : 'Oferta de: ') + prop.clienteNombre : (isDe ? 'Angebot an: ' : 'Propuesta a: ') + prop.devNombre) +
            '</div>' +
            '<h3 style="font-size:1.15rem;font-weight:800;color:var(--text-primary);">' + prop.proyectoTitulo + '</h3>' +
          '</div>' +
          '<div style="text-align:right;">' +
            badgeHtml +
            '<div style="font-family:\'Montserrat\';font-size:1.25rem;font-weight:900;color:var(--accent);margin-top:6px;">CHF ' + Number(prop.monto).toLocaleString() + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="background:var(--surface-2);border-radius:var(--radius-sm);padding:14px 18px;margin-top:14px;border:1px solid var(--border);">' +
          '<div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:2px;">' + (isDe ? 'Verhandelter Meilenstein:' : 'Hito pactado:') + '</div>' +
          '<div style="font-weight:600;font-size:0.9rem;">' + prop.hitoTitulo + '</div>' +
          '<div style="font-size:0.78rem;color:var(--text-secondary);margin-top:6px;line-height:1.5;">' +
            (isDe ? 'Gerichtsstand: Zürich, Schweiz · nDSG / DSG-Konformität · Auszahlung nach Lieferungszertifizierung' : 'Jurisdicción: Tribunales de Zúrich, Suiza · Cumplimiento nLPD · Liquidación bancaria directa') +
          '</div>' +
        '</div>' +
        actionsHtml +
      '</div>';
    }).join('');

    container.innerHTML = '<div class="proposals-grid">' + cardsHtml + '</div>';
  }

  // Aceptar propuesta (como desarrollador)
  function acceptProposal(propId) {
    var p = state.proposals.find(function(item) { return item.id === propId; });
    if (!p) return;

    var isDe = window.I18N && window.I18N.getLang() === 'de';

    p.estado = 'activo';
    localStorage.setItem('SWISSVZ_PROPOSALS', JSON.stringify(state.proposals));
    updateProposalsBadge();

    showToast('success', 
      isDe ? window.I18N.t('toast_contract_active') : '¡Contrato Activado!', 
      window.I18N ? window.I18N.t('toast_contract_active_msg', ['CHF ' + Number(p.monto).toLocaleString()]) : 'Fondos de CHF ' + Number(p.monto).toLocaleString() + ' asegurados en Escrow suizo.'
    );

    renderProposalsList();
  }

  // Rechazar propuesta
  function rejectProposal(propId) {
    var p = state.proposals.find(function(item) { return item.id === propId; });
    if (!p) return;

    var isDe = window.I18N && window.I18N.getLang() === 'de';
    p.estado = 'rechazado';
    localStorage.setItem('SWISSVZ_PROPOSALS', JSON.stringify(state.proposals));
    updateProposalsBadge();

    showToast('info', isDe ? 'Angebot abgelehnt' : 'Oferta Rechazada', isDe ? 'Das Angebot wurde archiviert.' : 'La propuesta ha sido declinada.');
    renderProposalsList();
  }

  // Confirmación de Liberación de Fondos
  function confirmMilestoneRelease(hitoId, hitoTitulo, monto) {
    if (state.currentRole !== 'cliente') return;

    var isDe = window.I18N && window.I18N.getLang() === 'de';

    var content = 
      '<p style="font-size:0.95rem;margin-bottom:20px;line-height:1.6;">' + 
        (window.I18N ? window.I18N.t('milestone_release_desc', ['<strong>CHF ' + Number(monto).toLocaleString() + '</strong>']) : '¿Deseas confirmar la entrega del entregable y autorizar la liberación de fondos?') + 
      '</p>' +
      '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin-bottom:24px;">' +
        '<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">' + (window.I18N ? window.I18N.t('milestone_selected_label') : 'Hito seleccionado:') + '</div>' +
        '<div style="font-weight:700;">' + hitoTitulo + '</div>' +
        '<div style="font-size:0.8rem;color:var(--success);margin-top:4px;">' + (window.I18N ? window.I18N.t('milestone_transfer_note') : 'Transferencia inmediata vía PostFinance AG') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:flex-end;">' +
        '<button class="btn-cta-secondary" onclick="APP.closeModal()">' + (window.I18N ? window.I18N.t('btn_cancel') : 'Cancelar') + '</button>' +
        '<button class="btn-cta-primary" onclick="APP.executeRelease(\'' + hitoId + '\')">' + (window.I18N ? window.I18N.t('btn_authorize') : 'Autorizar Liberación &rarr;') + '</button>' +
      '</div>';

    openModal(window.I18N ? window.I18N.t('milestone_release_title') : 'Liberación de Fondos en Escrow', content);
  }

  async function executeRelease(hitoId) {
    closeModal();
    var isDe = window.I18N && window.I18N.getLang() === 'de';
    showToast('info', isDe ? 'Transaktion wird verarbeitet' : 'Procesando Transacción', isDe ? 'Verbindung mit Treuhandknoten in Genf...' : 'Contactando al nodo de custodia en Ginebra...');

    var res = await API.releaseMilestone(hitoId, state.activeProjectId);
    if (res && res.status === 'ok') {
      var ref = res.referencia || 'PF-CH-' + Math.floor(100000 + Math.random() * 900000);
      var msg = window.I18N ? window.I18N.t('toast_milestone_done_msg', ['CHF ' + Number(res.montoLiberado || 4600).toLocaleString(), ref]) : 'Fondos liberados.';
      showToast('success', window.I18N ? window.I18N.t('toast_milestone_done') : '¡Fondos Transferidos!', msg);
      renderProjectRoadmap(state.activeProjectId);
    } else {
      showToast('danger', 'Error al Liberar', res ? res.mensaje : 'Fallo de conexión');
    }
  }

  // Renderizador: Registro de Transacciones
  async function renderTransactionsTable() {
    var container = document.getElementById('transactionsContent');
    if (!container) return;

    var isDe = window.I18N && window.I18N.getLang() === 'de';
    container.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-muted);">' + getIcon('clock', 24) + '<p style="margin-top:12px;">' + (isDe ? 'Finanzprüfpfade werden geladen...' : 'Cargando pistas de auditoría financiera...') + '</p></div>';

    var res = await API.fetchTransacciones(state.activeProjectId);
    var txs = (res && res.data) ? res.data : [];

    if (txs.length === 0) {
      container.innerHTML = '<p style="padding:24px;color:var(--text-muted);">' + (isDe ? 'Keine Transaktionen für dieses Projekt.' : 'No hay transacciones registradas para este proyecto.') + '</p>';
      return;
    }

    var rows = txs.map(function(t) {
      var isDep = t.tipo === 'deposito_escrow';
      var typeBadge = isDep 
        ? '<span class="badge badge-accent">' + (isDe ? 'Treuhandeinzahlung' : 'Depósito en Custodia') + '</span>' 
        : '<span class="badge badge-verified">' + (isDe ? 'Auszahlung an Entwickler' : 'Liberación a Desarrollador') + '</span>';

      return '<tr>' +
        '<td style="font-family:monospace;font-weight:700;color:var(--text-primary);">' + t.id + '</td>' +
        '<td>' + typeBadge + '</td>' +
        '<td style="font-family:\'Montserrat\';font-weight:800;color:' + (isDep ? 'var(--text-primary)' : 'var(--success)') + ';">CHF ' + Number(t.monto).toLocaleString() + '</td>' +
        '<td style="font-size:0.8rem;color:var(--text-muted);">' + (t.fecha ? t.fecha.replace('T', ' ').substring(0, 16) : 'Reciente') + '</td>' +
        '<td style="font-family:monospace;font-size:0.75rem;color:var(--text-muted);">' + (t.referencia || 'N/A') + '</td>' +
        '<td><span class="badge badge-verified">' + getIcon('check', 12) + ' ' + (isDe ? 'Beglichen' : 'Liquidado') + '</span></td>' +
      '</tr>';
    }).join('');

    container.innerHTML = 
      '<div class="table-container">' +
        '<table class="custom-table">' +
          '<thead>' +
            '<tr><th>' + (isDe ? 'Transaktions-ID' : 'ID Transacción') + '</th><th>' + (isDe ? 'Vorgangsart' : 'Tipo de Operación') + '</th><th>' + (isDe ? 'Betrag' : 'Monto') + '</th><th>' + (isDe ? 'Datum / Zeit (UTC)' : 'Fecha / Hora (UTC)') + '</th><th>' + (isDe ? 'Schweizer Bankreferenz' : 'Ref. Bancaria Suiza') + '</th><th>' + (isDe ? 'Status' : 'Estado') + '</th></tr>' +
          '</thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>';
  }

  // Renderizador: Perfil de Usuario
  function renderProfileInfo() {
    var container = document.getElementById('profileContent');
    if (!container) return;

    var isDe = window.I18N && window.I18N.getLang() === 'de';
    var user = DEMO_USERS[state.currentUserId] || DEMO_USERS['USR-001'];
    var isClient = user.rol === 'cliente';

    var entityLabel = isClient 
      ? (isDe ? 'Unternehmensidentifikation (UID)' : 'Identificación Corporativa (UID)')
      : (isDe ? 'Steuerlicher Wohnsitz & Steuer-ID' : 'Residencia Fiscal & ID Legal');
    var entityVal = user.idFiscal;

    var jurisLabel = isDe ? 'Gerichtsstand & Schweizer DSG-Konformität' : 'Jurisdicción Aplicable & Marco nLPD';
    var jurisVal = isClient
      ? (isDe ? 'Schweizerische Eidgenossenschaft (Handelsgericht Zürich) · Totaler Schutz unter Schweizer nDSG / DSG' : 'Confederación Suiza (Tribunales de Zúrich) · Alineación íntegra con la nLPD suiza')
      : (isDe ? 'Internationaler Schweizer B2B-Dienstleistungsvertrag mit zwingendem Schiedsgericht in Zürich / Genf · Keine Weitergabe von PII' : 'Contrato B2B Internacional de Servicios con cláusula arbitral suiza neutral · Soberanía técnica total');

    container.innerHTML = 
      '<div style="max-width:760px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px;">' +
        '<div style="display:flex;align-items:center;gap:20px;margin-bottom:28px;flex-wrap:wrap;">' +
          '<div style="width:68px;height:68px;border-radius:16px;background:' + user.color + ';display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;color:#fff;font-family:\'Montserrat\';">' + user.avatar + '</div>' +
          '<div>' +
            '<h2 style="font-size:1.5rem;font-weight:800;margin-bottom:4px;">' + user.nombre + '</h2>' +
            '<p style="font-size:0.88rem;color:var(--text-muted);">' + (isDe ? user.subDE : user.sub) + '</p>' +
          '</div>' +
        '</div>' +

        '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:18px;margin-bottom:24px;">' +
          '<div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;margin-bottom:8px;">' + (isDe ? 'Verifizierte Kontaktdaten' : 'Métodos de Contacto Verificados') + '</div>' +
          '<div style="display:flex;gap:20px;flex-wrap:wrap;font-size:0.9rem;">' +
            '<a href="mailto:' + user.email + '" style="display:inline-flex;align-items:center;gap:8px;color:var(--accent);font-weight:600;">' + getIcon('mail', 16) + ' <span>' + user.email + '</span></a>' +
            '<a href="tel:' + user.tel.replace(/\s+/g, '') + '" style="display:inline-flex;align-items:center;gap:8px;color:var(--success);font-weight:600;">' + getIcon('phone', 16) + ' <span>' + user.tel + '</span></a>' +
          '</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;">' +
          '<div style="background:var(--surface-2);padding:18px;border-radius:var(--radius-sm);border:1px solid var(--border);">' +
            '<div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;margin-bottom:6px;">' + entityLabel + '</div>' +
            '<div style="font-size:0.92rem;font-weight:600;line-height:1.5;">' + entityVal + '</div>' +
          '</div>' +
          '<div style="background:var(--surface-2);padding:18px;border-radius:var(--radius-sm);border:1px solid var(--border);">' +
            '<div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;margin-bottom:6px;">' + (isDe ? 'Finanzielle Treuhandgarantie' : 'Garantía Financiera Escrow') + '</div>' +
            '<div style="font-size:0.92rem;font-weight:600;color:var(--success);line-height:1.5;">' + getIcon('shield-check', 16) + ' ' + (isClient ? (isDe ? 'PostFinance AG (Neutrales Escrow)' : 'PostFinance AG (Custodia Neutral)') : (isDe ? '100% Zahlungsgarantie im Schweizer Escrow' : '100% Pago Asegurado en Bóveda Suiza')) + '</div>' +
          '</div>' +
        '</div>' +

        '<div style="background:var(--surface-2);padding:18px;border-radius:var(--radius-sm);border:1px solid var(--border);margin-bottom:28px;">' +
          '<div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;margin-bottom:6px;">' + jurisLabel + '</div>' +
          '<div style="font-size:0.9rem;line-height:1.6;color:var(--text-secondary);">' + jurisVal + '</div>' +
        '</div>' +

        '<button class="btn-cta-secondary" onclick="APP.openSettingsModal()" style="width:100%;justify-content:center;">' + getIcon('settings', 16) + ' ' + (isDe ? 'Sicherheit & Backend-Verbindung konfigurieren' : 'Configurar Seguridad & Conexión con Google Sheets') + '</button>' +
      '</div>';
  }

  // Modal de Configuración y Seguridad de API
  function openSettingsModal() {
    var currentUrl = API.getApiUrl();
    var isConfigured = !currentUrl.includes('PLACEHOLDER');
    var isDe = window.I18N && window.I18N.getLang() === 'de';

    state.isApiMasked = true;

    var content = 
      '<div class="security-box">' +
        '<div style="font-weight:700;margin-bottom:4px;color:var(--accent);display:flex;align-items:center;gap:6px;">' +
          getIcon('shield-check', 16) + ' ' + (isDe ? 'Datenschutz & Schweizer Sicherheitsarchitektur' : 'Soberanía de Datos & Seguridad nLPD') +
        '</div>' +
        '<div>' + (window.I18N ? window.I18N.t('settings_api_desc') : 'La comunicación con Google Sheets está canalizada a través de un gateway seguro con proxies en Ginebra. La URL del Web App se encuentra enmascarada para proteger la privacidad de tu infraestructura.') + '</div>' +
      '</div>' +

      '<div style="margin-bottom:20px;">' +
        '<label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:8px;color:var(--text-muted);">' + 
          (window.I18N ? window.I18N.t('settings_api_label') : 'ENDPOINT DE GOOGLE APPS SCRIPT (CIFRADO)') + 
        '</label>' +
        '<div class="api-mask-wrap">' +
          '<input type="password" id="apiEndpointInput" value="' + currentUrl + '" style="width:100%;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;color:var(--text-primary);font-size:0.88rem;letter-spacing:0.04em;">' +
          '<button class="api-mask-toggle" type="button" onclick="APP.toggleApiMask()" title="' + (window.I18N ? window.I18N.t('settings_api_show') : 'Mostrar / Ocultar') + '">' +
            getIcon('eye', 18) +
          '</button>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);margin-bottom:24px;">' +
        '<span style="font-size:0.82rem;color:var(--text-secondary);">' + (isDe ? 'Verbindungsstatus:' : 'Estado de Conexión:') + '</span>' +
        (isConfigured 
          ? '<span class="badge badge-verified">' + getIcon('check', 12) + ' ' + (window.I18N ? window.I18N.t('settings_status_live') : 'Conexión Activa con Google Sheets (En Vivo)') + '</span>' 
          : '<span class="badge badge-warning">' + getIcon('clock', 12) + ' ' + (window.I18N ? window.I18N.t('settings_status_mock') : 'Modo Mock Local (Sin Servidor)') + '</span>') +
      '</div>' +

      '<div style="display:flex;gap:12px;justify-content:space-between;">' +
        '<button class="btn-cta-secondary" style="font-size:0.85rem;" onclick="APP.triggerRemoteSeed()">' + getIcon('server', 15) + ' ' + (window.I18N ? window.I18N.t('settings_force_seed') : 'Forzar Seeder') + '</button>' +
        '<div style="display:flex;gap:8px;">' +
          '<button class="btn-cta-secondary" onclick="APP.closeModal()">' + (window.I18N ? window.I18N.t('btn_close') : 'Cerrar') + '</button>' +
          '<button class="btn-cta-primary" onclick="APP.saveApiSettings()">' + (window.I18N ? window.I18N.t('btn_save_settings') : 'Guardar Cambios') + '</button>' +
        '</div>' +
      '</div>';

    openModal(window.I18N ? window.I18N.t('settings_api_title') : 'Seguridad & Conexión Backend', content);
  }

  function toggleApiMask() {
    var inp = document.getElementById('apiEndpointInput');
    var btn = document.querySelector('.api-mask-toggle');
    if (!inp || !btn) return;

    state.isApiMasked = !state.isApiMasked;
    inp.type = state.isApiMasked ? 'password' : 'text';
    btn.innerHTML = state.isApiMasked ? getIcon('eye', 18) : getIcon('eye-off', 18);
  }

  function saveApiSettings() {
    var inp = document.getElementById('apiEndpointInput');
    if (!inp) return;
    var val = inp.value.trim();
    API.setApiUrl(val);
    closeModal();
    var isDe = window.I18N && window.I18N.getLang() === 'de';
    showToast('success', isDe ? 'Einstellungen gespeichert' : 'Configuración Actualizada', isDe ? 'Die Backend-URL wurde sicher aktualisiert.' : 'La URL del backend ha sido guardada en tu navegador.');
    renderProjectRoadmap(state.activeProjectId);
  }

  async function triggerRemoteSeed() {
    closeModal();
    var isDe = window.I18N && window.I18N.getLang() === 'de';
    showToast('info', isDe ? 'Seeder wird ausgeführt' : 'Ejecutando Seeder', isDe ? '5 Tabellen werden mit Testdaten befüllt...' : 'Poblando 5 hojas con datos de prueba...');
    var res = await API.initSeed();
    if (res && res.status === 'ok') {
      showToast('success', isDe ? 'Datenbank initialisiert' : 'Base de Datos Inicializada', isDe ? 'Alle 5 Tabellen wurden erfolgreich aktualisiert.' : 'Las 5 hojas fueron pobladas exitosamente.');
      renderProjectRoadmap(state.activeProjectId);
    } else {
      showToast('danger', 'Error al sembrar', res ? res.mensaje : 'Fallo en la llamada');
    }
  }

  // Modal: Proponer Contrato (Cliente -> Desarrollador)
  function proposeContract(devId, devName, rate) {
    rate = rate || 4600;
    var isDe = window.I18N && window.I18N.getLang() === 'de';

    var content = 
      '<p style="font-size:0.9rem;margin-bottom:18px;line-height:1.6;">' +
        (window.I18N ? window.I18N.t('modal_proposal_desc') : 'Estás por iniciar una oferta formal de desarrollo respaldada por Escrow con') +
        ' <strong>' + devName + '</strong>.' +
      '</p>' +
      '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin-bottom:20px;">' +
        '<div style="font-size:0.8rem;color:var(--text-muted);">' + (window.I18N ? window.I18N.t('modal_proposal_project') : 'Proyecto vinculado:') + '</div>' +
        '<div style="font-weight:700;margin-top:2px;">Integración API PSD2 & SIC Banking (PRJ-101)</div>' +
        '<div style="font-size:0.85rem;color:var(--accent);font-weight:700;margin-top:6px;">Monto del Hito: CHF ' + Number(rate).toLocaleString() + '</div>' +
        '<div style="font-size:0.78rem;color:var(--success);margin-top:6px;">' + (window.I18N ? window.I18N.t('modal_proposal_escrow_note') : 'El depósito quedará inmovilizado en custodia suiza tras la aceptación.') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:flex-end;">' +
        '<button class="btn-cta-secondary" onclick="APP.closeModal()">' + (window.I18N ? window.I18N.t('btn_cancel') : 'Cancelar') + '</button>' +
        '<button class="btn-cta-primary" onclick="APP.sendProposalConfirmed(\'' + devId + '\',\'' + devName.replace(/'/g, "\\'") + '\',' + rate + ')">' + 
          (window.I18N ? window.I18N.t('modal_proposal_confirm') : 'Enviar Oferta de Contrato →') + 
        '</button>' +
      '</div>';

    openModal(window.I18N ? window.I18N.t('modal_proposal_title') : 'Proponer Contrato en Escrow', content);
  }

  function sendProposalConfirmed(devId, devName, rate) {
    closeModal();
    rate = rate || 4600;

    var newProp = {
      id: 'PROP-' + Math.floor(200 + Math.random() * 800),
      clienteId: state.currentUserId,
      clienteNombre: (DEMO_USERS[state.currentUserId] || {}).nombre || 'ClaraLens AG',
      devId: devId,
      devNombre: devName,
      proyectoTitulo: 'Integración API PSD2 & SIC Banking (PRJ-101)',
      hitoTitulo: 'Fase 1: Módulo de Custodia & Gateway Bancario',
      monto: rate,
      estado: 'pendiente',
      fecha: new Date().toISOString().substring(0, 10)
    };

    state.proposals.unshift(newProp);
    localStorage.setItem('SWISSVZ_PROPOSALS', JSON.stringify(state.proposals));
    updateProposalsBadge();

    var isDe = window.I18N && window.I18N.getLang() === 'de';
    var toastTitle = window.I18N ? window.I18N.t('toast_proposal_sent') : 'Propuesta Enviada';
    var toastMsg = window.I18N ? window.I18N.t('toast_proposal_sent_msg', [devName]) : 'Se ha notificado a ' + devName + '. Los fondos quedarán reservados y se activará el proyecto tras su aceptación.';

    showToast('success', toastTitle, toastMsg);

    // Si está en la vista de propuestas, actualizar
    if (state.currentView === 'proposals') {
      renderProposalsList();
    }
  }

  function setLang(lang) {
    if (window.I18N) {
      window.I18N.setLang(lang);
      var msg = lang === 'de' ? 'Sprache auf Deutsch (Schweiz) geändert.' : 'Idioma cambiado a Español.';
      showToast('info', lang === 'de' ? 'Sprache' : 'Idioma', msg);
      refreshCurrentView();
    }
  }

  function refreshCurrentView() {
    showView(state.currentView);
  }

  return {
    getIcon: getIcon,
    enterApp: enterApp,
    exitToLanding: exitToLanding,
    setRole: setRole,
    switchUser: switchUser,
    showView: showView,
    setLang: setLang,
    refreshCurrentView: refreshCurrentView,
    renderTalentsList: renderTalentsList,
    renderProjectRoadmap: renderProjectRoadmap,
    renderProposalsList: renderProposalsList,
    renderTransactionsTable: renderTransactionsTable,
    renderProfileInfo: renderProfileInfo,
    confirmMilestoneRelease: confirmMilestoneRelease,
    executeRelease: executeRelease,
    openSettingsModal: openSettingsModal,
    toggleApiMask: toggleApiMask,
    closeModal: closeModal,
    saveApiSettings: saveApiSettings,
    triggerRemoteSeed: triggerRemoteSeed,
    proposeContract: proposeContract,
    sendProposalConfirmed: sendProposalConfirmed,
    acceptProposal: acceptProposal,
    rejectProposal: rejectProposal,
    toggleMobileSidebar: toggleMobileSidebar,
    showToast: showToast
  };
})();
