/**
 * Swiss-VZ Connect - Controlador de la SPA (app.js)
 * Router por vistas, store de estado reactivo, biblioteca de iconos SVG y renders dinámicos.
 */

var APP = (function() {
  // Estado reactivo central
  var state = {
    currentRole: 'cliente', // 'cliente' | 'dev'
    currentView: 'search',  // 'search' | 'roadmap' | 'transactions' | 'profile'
    activeProjectId: 'PRJ-101',
    activeTalentFilter: '',
    talentsList: [],
    currentProjectData: null
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
      case 'help':
        return '<svg ' + s + '><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      case 'star':
        return '<svg ' + s + ' fill="#F39C12" stroke="#F39C12"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
      case 'clock':
        return '<svg ' + s + '><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
      case 'server':
        return '<svg ' + s + '><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>';
      case 'chevron-right':
        return '<svg ' + s + '><polyline points="9 18 15 12 9 6"></polyline></svg>';
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
    }, 3800);
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
    showView(targetView || 'search');
    showToast('success', 'Sesión Iniciada', 'Bienvenido a Swiss-VZ Connect. Infraestructura verificada en Ginebra.');
  }

  function exitToLanding() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Selector de Rol
  function setRole(role) {
    state.currentRole = role;
    var clientBtn = document.getElementById('roleClient');
    var devBtn = document.getElementById('roleDev');
    if (clientBtn && devBtn) {
      clientBtn.classList.toggle('active', role === 'cliente');
      devBtn.classList.toggle('active', role === 'dev');
    }

    var sidebarAvatar = document.getElementById('sidebarAvatar');
    var sidebarName = document.getElementById('sidebarName');
    var sidebarRole = document.getElementById('sidebarRole');
    var searchTalentNavItem = document.getElementById('navItemSearch');

    if (role === 'cliente') {
      if (sidebarAvatar) sidebarAvatar.textContent = 'CL';
      if (sidebarName) sidebarName.textContent = 'ClaraLens AG';
      if (sidebarRole) sidebarRole.textContent = 'Startup Médica · Zúrich';
      if (searchTalentNavItem) searchTalentNavItem.classList.remove('hidden');
      showToast('info', 'Modo Cliente Activado', 'Operando como ClaraLens AG (Zúrich). Puedes liberar hitos y contratar.');
    } else {
      if (sidebarAvatar) sidebarAvatar.textContent = 'AR';
      if (sidebarName) sidebarName.textContent = 'Alejandro Rodríguez';
      if (sidebarRole) sidebarRole.textContent = 'Dev Full-Stack · Caracas';
      if (searchTalentNavItem) searchTalentNavItem.classList.add('hidden');
      if (state.currentView === 'search') showView('roadmap');
      showToast('info', 'Modo Desarrollador Activado', 'Operando como Alejandro Rodríguez. Vista de custodia y hoja de ruta.');
    }

    // Refrescar vista activa
    if (state.currentView === 'roadmap') {
      renderProjectRoadmap(state.activeProjectId);
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
    data.forEach(function(t) {
      var skillsList = t.skills ? t.skills.split(',').map(function(s) { return s.trim(); }) : [];
      var tagsHtml = skillsList.map(function(sk) {
        return '<span class="tag-skill">' + sk + '</span>';
      }).join('');

      html += '<div class="card-talent">' +
        '<div class="talent-head">' +
          '<div style="display:flex;gap:14px;align-items:center;">' +
            '<div style="width:48px;height:48px;border-radius:12px;background:' + (t.color || 'var(--accent)') + ';display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-family:\'Montserrat\';">' + (t.avatar_iniciales || 'DV') + '</div>' +
            '<div class="talent-info">' +
              '<h3>' + t.nombre + '</h3>' +
              '<div class="badge badge-verified">' + getIcon('shield-check', 14) + ' Verificado por Swiss-VZ</div>' +
            '</div>' +
          '</div>' +
          '<div class="talent-rate">$' + t.tarifa_hora + '<span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">/hr</span></div>' +
        '</div>' +
        '<p style="font-size:0.88rem;margin:12px 0;line-height:1.5;">' + (t.bio || 'Desarrollador de software con experiencia comprobada.') + '</p>' +
        '<div class="talent-skills-wrap">' + tagsHtml + '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid var(--border);">' +
          '<div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-secondary);">' + getIcon('star', 15) + ' 4.9 (45+ reseñas)</div>' +
          '<button class="btn-cta-primary" style="padding:10px 18px;font-size:0.85rem;" onclick="APP.proposeContract(\'' + t.id + '\',\'' + t.nombre + '\')">Contratar en Escrow</button>' +
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

    var hitosHtml = hitos.map(function(h) {
      var isDone = h.estado === 'completado';
      var isInReview = h.estado === 'en_revision';
      var statusBadge = isDone 
        ? '<span class="badge badge-verified">' + getIcon('check', 13) + ' Fondos Liberados</span>' 
        : (isInReview 
            ? '<span class="badge badge-warning">' + getIcon('clock', 13) + ' En Revisión de Entrega</span>' 
            : '<span class="badge" style="background:var(--surface-3);color:var(--text-muted);">' + getIcon('lock', 13) + ' Bloqueado en Escrow</span>');

      var checkAction = (state.currentRole === 'cliente' && !isDone)
        ? 'onclick="APP.confirmMilestoneRelease(\'' + h.id + '\',\'' + h.titulo + '\',' + h.monto + ')" title="Hacer clic para validar entrega y liberar pago"'
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
            '<span style="font-size:0.75rem;color:var(--text-muted);">' + (h.fecha_entrega ? 'Entrega: ' + h.fecha_entrega : '') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML = 
      '<div class="escrow-hero-card">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
            '<div class="badge badge-verified">' + getIcon('shield-check', 15) + ' Custodia Neutral Suiza</div>' +
            '<span style="font-size:0.8rem;color:var(--text-muted);">Contrato: ' + prj.id + '</span>' +
          '</div>' +
          '<h2 style="font-size:1.6rem;font-weight:900;margin-bottom:8px;">' + prj.titulo + '</h2>' +
          '<p style="font-size:0.9rem;max-width:640px;">' + prj.descripcion + '</p>' +
        '</div>' +
        '<div style="text-align:right;">' +
          '<div style="font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;letter-spacing:0.05em;margin-bottom:4px;">Saldo Asegurado en Bóveda</div>' +
          '<div class="escrow-amount-display">CHF ' + Number(escrow.monto_retenido).toLocaleString() + '</div>' +
          '<div style="font-size:0.75rem;color:var(--success);font-weight:600;">Custodiado por PostFinance AG</div>' +
        '</div>' +
      '</div>' +

      '<div class="prog-stats-grid">' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">Avance Global</div>' +
          '<div class="card-stat-value" style="color:var(--accent);">' + porcentajeAvance + '%</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + porcentajeAvance + '%;"></div></div>' +
        '</div>' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">Hitos Entregados</div>' +
          '<div class="card-stat-value" style="color:var(--success);">' + completados + ' / ' + totalHitos + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + ((completados / totalHitos) * 100) + '%;background:var(--success);"></div></div>' +
        '</div>' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">Total Liberado</div>' +
          '<div class="card-stat-value" style="color:var(--success);">CHF ' + Number(escrow.monto_liberado).toLocaleString() + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + ((escrow.monto_liberado / escrow.monto_total) * 100) + '%;background:var(--success);"></div></div>' +
        '</div>' +
        '<div class="card-stat">' +
          '<div class="card-stat-label">Retenido Restante</div>' +
          '<div class="card-stat-value" style="color:var(--warning);">CHF ' + Number(escrow.monto_retenido).toLocaleString() + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:100%;background:var(--warning);"></div></div>' +
        '</div>' +
      '</div>' +

      (state.currentRole === 'dev' 
        ? '<div style="background:var(--accent-soft);border:1px solid rgba(157,78,221,0.3);border-radius:var(--radius-sm);padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--accent);font-size:0.85rem;">' + getIcon('lock', 18) + '<span><strong>Modo Consulta (Desarrollador):</strong> Los pagos se liberan automáticamente en cuanto el cliente suizo valida la entrega de código.</span></div>' 
        : '<div style="background:var(--success-soft);border:1px solid rgba(46,204,113,0.3);border-radius:var(--radius-sm);padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--success);font-size:0.85rem;">' + getIcon('shield-check', 18) + '<span><strong>Modo Administrador (Cliente):</strong> Haz clic en el círculo de cualquier hito en revisión para verificarlo y transferir los fondos instantáneamente.</span></div>') +

      '<h3 style="font-size:1.25rem;font-weight:800;margin-bottom:16px;">Hitos del Contrato</h3>' +
      '<div class="milestones-list">' + hitosHtml + '</div>';
  }

  // Confirmación de Liberación de Fondos
  function confirmMilestoneRelease(hitoId, hitoTitulo, monto) {
    if (state.currentRole !== 'cliente') return;

    var content = 
      '<p style="font-size:0.95rem;margin-bottom:20px;line-height:1.6;">¿Deseas confirmar la entrega del entregable y autorizar la liberación de <strong>CHF ' + Number(monto).toLocaleString() + '</strong> desde la cuenta de custodia?</p>' +
      '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin-bottom:24px;">' +
        '<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Hito seleccionado:</div>' +
        '<div style="font-weight:700;">' + hitoTitulo + '</div>' +
        '<div style="font-size:0.8rem;color:var(--success);margin-top:4px;">Transferencia inmediata vía PostFinance CH</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:flex-end;">' +
        '<button class="btn-cta-secondary" onclick="APP.closeModal()">Cancelar</button>' +
        '<button class="btn-cta-primary" onclick="APP.executeRelease(\'' + hitoId + '\')">Autorizar Liberación &rarr;</button>' +
      '</div>';

    openModal('Liberación de Fondos en Escrow', content);
  }

  async function executeRelease(hitoId) {
    closeModal();
    showToast('info', 'Procesando Transacción', 'Contactando al nodo de custodia en Ginebra...');

    var res = await API.releaseMilestone(hitoId, state.activeProjectId);
    if (res && res.status === 'ok') {
      showToast('success', '¡Fondos Transferidos!', 'Se han liberado CHF ' + Number(res.montoLiberado).toLocaleString() + '. Referencia: ' + (res.referencia || 'PF-OK'));
      renderProjectRoadmap(state.activeProjectId);
    } else {
      showToast('danger', 'Error al Liberar', res ? res.mensaje : 'Fallo de conexión');
    }
  }

  // Renderizador: Registro de Transacciones
  async function renderTransactionsTable() {
    var container = document.getElementById('transactionsContent');
    if (!container) return;

    container.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-muted);">' + getIcon('clock', 24) + '<p style="margin-top:12px;">Cargando pistas de auditoría financiera...</p></div>';

    var res = await API.fetchTransacciones(state.activeProjectId);
    var txs = (res && res.data) ? res.data : [];

    if (txs.length === 0) {
      container.innerHTML = '<p style="padding:24px;color:var(--text-muted);">No hay transacciones registradas para este proyecto.</p>';
      return;
    }

    var rows = txs.map(function(t) {
      var isDep = t.tipo === 'deposito_escrow';
      var typeBadge = isDep 
        ? '<span class="badge badge-accent">Depósito en Custodia</span>' 
        : '<span class="badge badge-verified">Liberación a Desarrollador</span>';

      return '<tr>' +
        '<td style="font-family:monospace;font-weight:700;color:var(--text-primary);">' + t.id + '</td>' +
        '<td>' + typeBadge + '</td>' +
        '<td style="font-family:\'Montserrat\';font-weight:800;color:' + (isDep ? 'var(--text-primary)' : 'var(--success)') + ';">CHF ' + Number(t.monto).toLocaleString() + '</td>' +
        '<td style="font-size:0.8rem;color:var(--text-muted);">' + (t.fecha ? t.fecha.replace('T', ' ').substring(0, 16) : 'Reciente') + '</td>' +
        '<td style="font-family:monospace;font-size:0.75rem;color:var(--text-muted);">' + (t.referencia || 'N/A') + '</td>' +
        '<td><span class="badge badge-verified">' + getIcon('check', 12) + ' Liquidado</span></td>' +
      '</tr>';
    }).join('');

    container.innerHTML = 
      '<div class="table-container">' +
        '<table class="custom-table">' +
          '<thead>' +
            '<tr><th>ID Transacción</th><th>Tipo de Operación</th><th>Monto</th><th>Fecha / Hora (UTC)</th><th>Ref. Bancaria Suiza</th><th>Estado</th></tr>' +
          '</thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>';
  }

  // Renderizador: Perfil de Usuario
  function renderProfileInfo() {
    var container = document.getElementById('profileContent');
    if (!container) return;

    var isClient = state.currentRole === 'cliente';
    container.innerHTML = 
      '<div style="max-width:700px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px;">' +
        '<div style="display:flex;align-items:center;gap:20px;margin-bottom:28px;">' +
          '<div style="width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,var(--accent),#6E2BD9);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#fff;font-family:\'Montserrat\';">' + (isClient ? 'CL' : 'AR') + '</div>' +
          '<div>' +
            '<h2 style="font-size:1.4rem;font-weight:800;margin-bottom:4px;">' + (isClient ? 'ClaraLens AG' : 'Alejandro Rodríguez') + '</h2>' +
            '<p style="font-size:0.85rem;color:var(--text-muted);">' + (isClient ? 'Empresa Registrada en Zúrich · UID CHE-402.198.552' : 'Ingeniero de Software Senior · Caracas, VE') + '</p>' +
          '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;">' +
          '<div style="background:var(--surface-2);padding:16px;border-radius:var(--radius-sm);border:1px solid var(--border);">' +
            '<div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;margin-bottom:4px;">Jurisdicción & Privacidad</div>' +
            '<div style="font-size:0.95rem;font-weight:600;">Sujeto a nLPD Suiza</div>' +
          '</div>' +
          '<div style="background:var(--surface-2);padding:16px;border-radius:var(--radius-sm);border:1px solid var(--border);">' +
            '<div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;margin-bottom:4px;">Estado de Verificación</div>' +
            '<div style="font-size:0.95rem;font-weight:600;color:var(--success);">' + getIcon('shield-check', 16) + ' Verificado Grado A</div>' +
          '</div>' +
        '</div>' +
        '<button class="btn-cta-secondary" onclick="APP.openSettingsModal()" style="width:100%;justify-content:center;">' + getIcon('settings', 16) + ' Configurar Conexión con Google Sheets</button>' +
      '</div>';
  }

  // Modal de Configuración de API
  function openSettingsModal() {
    var currentUrl = API.getApiUrl();
    var isConfigured = !currentUrl.includes('PLACEHOLDER');

    var content = 
      '<p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:20px;line-height:1.6;">Ingresa la URL de la Web App desplegada desde Google Apps Script para sincronizar las lecturas y mutaciones con tu hoja de cálculo real.</p>' +
      '<div style="margin-bottom:20px;">' +
        '<label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:8px;color:var(--text-muted);">URL DE GOOGLE APPS SCRIPT WEB APP</label>' +
        '<input type="text" id="apiEndpointInput" value="' + currentUrl + '" style="width:100%;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;color:var(--text-primary);font-size:0.88rem;">' +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);margin-bottom:24px;">' +
        '<span style="font-size:0.82rem;color:var(--text-secondary);">Estado de Conexión:</span>' +
        (isConfigured 
          ? '<span class="badge badge-verified">' + getIcon('check', 12) + ' URL Personalizada Guardada</span>' 
          : '<span class="badge badge-warning">' + getIcon('clock', 12) + ' Modo Mock Local (Sin Servidor)</span>') +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:space-between;">' +
        '<button class="btn-cta-secondary" style="font-size:0.85rem;" onclick="APP.triggerRemoteSeed()">' + getIcon('server', 15) + ' Forzar Seed</button>' +
        '<div style="display:flex;gap:8px;">' +
          '<button class="btn-cta-secondary" onclick="APP.closeModal()">Cerrar</button>' +
          '<button class="btn-cta-primary" onclick="APP.saveApiSettings()">Guardar Cambios</button>' +
        '</div>' +
      '</div>';

    openModal('Configuración del Backend', content);
  }

  function saveApiSettings() {
    var inp = document.getElementById('apiEndpointInput');
    if (!inp) return;
    var val = inp.value.trim();
    API.setApiUrl(val);
    closeModal();
    showToast('success', 'Configuración Actualizada', 'La URL del backend ha sido guardada en tu navegador.');
    renderProjectRoadmap(state.activeProjectId);
  }

  async function triggerRemoteSeed() {
    closeModal();
    showToast('info', 'Ejecutando Seeder', 'Poblando 5 hojas con datos de prueba...');
    var res = await API.initSeed();
    if (res && res.status === 'ok') {
      showToast('success', 'Base de Datos Inicializada', 'Las 5 hojas fueron pobladas exitosamente.');
      renderProjectRoadmap(state.activeProjectId);
    } else {
      showToast('danger', 'Error al sembrar', res ? res.mensaje : 'Fallo en la llamada');
    }
  }

  function proposeContract(devId, devName) {
    var content = 
      '<p style="font-size:0.9rem;margin-bottom:18px;">Estás por iniciar un contrato protegido por Escrow con <strong>' + devName + '</strong>.</p>' +
      '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin-bottom:20px;">' +
        '<div style="font-size:0.8rem;color:var(--text-muted);">Proyecto a vincular:</div>' +
        '<div style="font-weight:700;margin-top:2px;">Integración API PSD2 & SIC Banking (PRJ-101)</div>' +
        '<div style="font-size:0.8rem;color:var(--accent);margin-top:6px;">Depósito en custodia resguardado en PostFinance AG</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:flex-end;">' +
        '<button class="btn-cta-secondary" onclick="APP.closeModal()">Cancelar</button>' +
        '<button class="btn-cta-primary" onclick="APP.sendProposalConfirmed(\'' + devName + '\')">Confirmar Propuesta &rarr;</button>' +
      '</div>';

    openModal('Proponer Contrato', content);
  }

  function sendProposalConfirmed(devName) {
    closeModal();
    showToast('success', 'Propuesta Enviada', 'Se ha notificado a ' + devName + '. Los fondos quedarán reservados tras la firma.');
  }

  return {
    getIcon: getIcon,
    enterApp: enterApp,
    exitToLanding: exitToLanding,
    setRole: setRole,
    showView: showView,
    renderTalentsList: renderTalentsList,
    renderProjectRoadmap: renderProjectRoadmap,
    renderTransactionsTable: renderTransactionsTable,
    renderProfileInfo: renderProfileInfo,
    confirmMilestoneRelease: confirmMilestoneRelease,
    executeRelease: executeRelease,
    openSettingsModal: openSettingsModal,
    closeModal: closeModal,
    saveApiSettings: saveApiSettings,
    triggerRemoteSeed: triggerRemoteSeed,
    proposeContract: proposeContract,
    sendProposalConfirmed: sendProposalConfirmed,
    showToast: showToast
  };
})();
