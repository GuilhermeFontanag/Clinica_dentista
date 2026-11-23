/**
 * CLÍNICA ODONTOLÓGICA SORRISO CLARO - MÓDULO CENTRAL DE API
 * Comunicação direta com a API REST Spring Boot (localhost:8080)
 */

// Detecção inteligente de baseURL (mesma origem se rodando em localhost:8080 ou apontamento explícito)
const API_BASE_URL = (
  window.location.origin.includes(':8080') || 
  (window.location.protocol === 'http:' && window.location.port === '8080')
) ? '' : 'http://localhost:8080';

/**
 * Utilitário central de requisição HTTP com timeout e tratamento de erros
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  // Se houver body e for objeto, converte para JSON
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Tenta ler como JSON ou texto se não for JSON
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(typeof data === 'string' && data ? data : `Erro ${response.status}: ${response.statusText}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error(`[API Error] Falha na requisição para ${endpoint}:`, error);
    let friendlyMessage = 'Falha de comunicação com o servidor.';
    
    if (error.name === 'AbortError') {
      friendlyMessage = 'Tempo limite de conexão excedido. O servidor demorou para responder.';
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      friendlyMessage = `Não foi possível conectar ao servidor backend em ${API_BASE_URL || 'localhost:8080'}. Verifique se a aplicação Spring Boot está em execução.`;
    } else {
      friendlyMessage = error.message;
    }

    return { success: false, error: friendlyMessage, originalError: error };
  }
}

/**
 * Endpoints e Serviços por Entidade
 */
const ClinicaAPI = {
  // Teste de conexão com o backend
  async testConnection() {
    try {
      const res = await apiRequest('/api/paciente', { method: 'GET' });
      return res.success;
    } catch {
      return false;
    }
  },

  // 1. Pacientes (Nota: mapeado para /api/dentista onde residem os campos de ficha clínica/cpf no backend)
  pacientes: {
    async listar() {
      return await apiRequest('/api/dentista', { method: 'GET' });
    },
    async buscarPorId(id) {
      return await apiRequest(`/api/dentista/${id}`, { method: 'GET' });
    },
    async criar(dados) {
      return await apiRequest('/api/dentista', {
        method: 'POST',
        body: dados
      });
    },
    async atualizar(id, dados) {
      return await apiRequest(`/api/dentista/${id}`, {
        method: 'PUT',
        body: dados
      });
    },
    async deletar(id) {
      return await apiRequest(`/api/dentista/${id}`, { method: 'DELETE' });
    }
  },

  // 2. Dentistas (Nota: mapeado para /api/paciente onde residem os campos de CRO/especialidade no backend)
  dentistas: {
    async listar() {
      return await apiRequest('/api/paciente', { method: 'GET' });
    },
    async buscarPorId(id) {
      return await apiRequest(`/api/paciente/${id}`, { method: 'GET' });
    },
    async criar(dados) {
      return await apiRequest('/api/paciente', {
        method: 'POST',
        body: dados
      });
    },
    async atualizar(id, dados) {
      return await apiRequest(`/api/paciente/${id}`, {
        method: 'PUT',
        body: dados
      });
    },
    async deletar(id) {
      return await apiRequest(`/api/paciente/${id}`, { method: 'DELETE' });
    }
  },

  // 3. Consultas e Recepcionistas (/api/recepcionista)
  consultas: {
    async listar() {
      return await apiRequest('/api/recepcionista', { method: 'GET' });
    },
    async buscarPorId(id) {
      return await apiRequest(`/api/recepcionista/${id}`, { method: 'GET' });
    },
    async criar(dados) {
      return await apiRequest('/api/recepcionista', {
        method: 'POST',
        body: dados
      });
    },
    async atualizar(id, dados) {
      return await apiRequest(`/api/recepcionista/${id}`, {
        method: 'PUT',
        body: dados
      });
    },
    async deletar(id) {
      return await apiRequest(`/api/recepcionista/${id}`, { method: 'DELETE' });
    }
  }
};

/**
 * Gerenciamento de Sessão de Usuário (Simulação sem validação conforme solicitado)
 */
const UserSession = {
  KEY: 'sorriso_claro_active_user',

  login(role, nome = '', identificador = '') {
    const sessionData = {
      role: role.toLowerCase(), // 'paciente', 'dentista', 'recepcionista'
      nome: nome || this.getDefaultName(role),
      identificador: identificador || '001',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(this.KEY, JSON.stringify(sessionData));
    return sessionData;
  },

  get() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(this.KEY);
    window.location.href = 'index.html';
  },

  requireAuth(expectedRole = null) {
    const session = this.get();
    if (!session) {
      window.location.href = 'index.html';
      return null;
    }
    return session;
  },

  getDefaultName(role) {
    switch (role.toLowerCase()) {
      case 'dentista': return 'Dr. Roberto Mendes';
      case 'recepcionista': return 'Ana Beatriz (Recepção)';
      case 'paciente': return 'Mariana Silva';
      default: return 'Usuário Convidado';
    }
  }
};
