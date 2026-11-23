

const UI = {
  
  toast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`;
    }

    toastEl.innerHTML = `
      ${iconSvg}
      <div style="flex:1;">${message}</div>
      <button type="button" style="background:none; border:none; color:var(--text-light); cursor:pointer; font-size:1.1rem; padding:0 4px;" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.classList.add('toast-closing');
      setTimeout(() => toastEl.remove(), 250);
    }, duration);
  },

  
  renderLoading(targetElement, message = 'Carregando registros da clínica...') {
    if (typeof targetElement === 'string') targetElement = document.querySelector(targetElement);
    if (!targetElement) return;

    targetElement.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p style="font-size:0.95rem; font-weight:500;">${message}</p>
      </div>
    `;
  },

  
  renderEmpty(targetElement, { title = 'Nenhum registro encontrado', message = 'Não há itens cadastrados nesta seção no momento.', actionText = null, actionCallback = null } = {}) {
    if (typeof targetElement === 'string') targetElement = document.querySelector(targetElement);
    if (!targetElement) return;

    const actionButtonHtml = actionText ? `
      <button class="btn btn-primary btn-sm empty-action-btn">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        ${actionText}
      </button>
    ` : '';

    targetElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3>${title}</h3>
        <p>${message}</p>
        ${actionButtonHtml}
      </div>
    `;

    if (actionText && typeof actionCallback === 'function') {
      const btn = targetElement.querySelector('.empty-action-btn');
      if (btn) btn.addEventListener('click', actionCallback);
    }
  },

  
  renderError(targetElement, { message = 'Falha de conexão com a API', retryCallback = null } = {}) {
    if (typeof targetElement === 'string') targetElement = document.querySelector(targetElement);
    if (!targetElement) return;

    targetElement.innerHTML = `
      <div class="alert alert-danger" style="margin: 1.5rem 0;">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div style="flex:1;">
          <h4 style="color:#991b1b; margin-bottom:0.25rem;">Problema de Comunicação</h4>
          <p style="color:#7f1d1d; font-size:0.9rem;">${message}</p>
          ${retryCallback ? `
            <div class="alert-actions">
              <button class="btn btn-outline btn-sm retry-btn" style="background:#fff; border-color:#fca5a5; color:#991b1b;">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar Novamente
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    if (retryCallback) {
      const btn = targetElement.querySelector('.retry-btn');
      if (btn) btn.addEventListener('click', retryCallback);
    }
  },

  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  },

  
  confirm({ title = 'Confirmar Ação', message = 'Tem certeza que deseja continuar?', onConfirm = () => {} }) {
    let confirmModal = document.getElementById('global-confirm-modal');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'global-confirm-modal';
      confirmModal.className = 'modal-backdrop';
      confirmModal.innerHTML = `
        <div class="modal-dialog" style="max-width:440px;">
          <div class="modal-header">
            <h3 class="modal-title" id="confirm-modal-title">Confirmar</h3>
            <button class="modal-close" onclick="UI.closeModal('global-confirm-modal')">✕</button>
          </div>
          <div class="modal-body">
            <p id="confirm-modal-msg" style="color:var(--text-main); font-size:0.95rem;"></p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline btn-sm" onclick="UI.closeModal('global-confirm-modal')">Cancelar</button>
            <button class="btn btn-danger btn-sm" id="confirm-modal-btn">Confirmar Exclusão</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);
    }

    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-msg').textContent = message;

    const confirmBtn = document.getElementById('confirm-modal-btn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
      UI.closeModal('global-confirm-modal');
      onConfirm();
    });

    UI.openModal('global-confirm-modal');
  },

  
  formatDate(dateString) {
    if (!dateString) return '-';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  },

  formatPhone(phone) {
    if (!phone) return '-';
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0,2)}) ${cleaned.substring(2,7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.substring(0,2)}) ${cleaned.substring(2,6)}-${cleaned.substring(6)}`;
    }
    return phone;
  },

  formatStatusBadge(status) {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('concl')) {
      return `<span class="badge badge-concluida"><span style="width:6px;height:6px;background:var(--success);border-radius:50%;"></span>Concluída</span>`;
    } else if (s.includes('cancel')) {
      return `<span class="badge badge-cancelada"><span style="width:6px;height:6px;background:var(--danger);border-radius:50%;"></span>Cancelada</span>`;
    } else {
      return `<span class="badge badge-agendada"><span style="width:6px;height:6px;background:var(--primary-600);border-radius:50%;"></span>Agendada</span>`;
    }
  },

  
  setupNavigation(currentPage) {
    const session = UserSession.get();
    const badgeContainer = document.querySelector('.user-badge-container');
    
    if (badgeContainer && session) {
      const roleLabel = {
        'paciente': 'Paciente',
        'dentista': 'Dentista',
        'recepcionista': 'Recepcionista'
      }[session.role] || 'Usuário';

      badgeContainer.innerHTML = `
        <div class="user-role-badge">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          ${roleLabel}: ${session.nome}
        </div>
        <button class="btn-logout" title="Trocar perfil ou sair" onclick="UserSession.logout()">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      `;
    }

    
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
};
