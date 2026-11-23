/**
 * CLÍNICA ODONTOLÓGICA SORRISO CLARO - CONTROLE DO PORTAL DO PACIENTE
 */

let currentPatient = null;
let patientConsultas = [];

document.addEventListener('DOMContentLoaded', async () => {
  UI.setupNavigation('paciente.html');
  const session = UserSession.requireAuth();
  if (!session) return;

  const welcomeEl = document.getElementById('welcome-patient-name');
  if (welcomeEl) {
    welcomeEl.textContent = `Olá, ${session.nome}!`;
  }

  // Define data mínima para hoje no agendamento
  const inputData = document.getElementById('input-data-consulta');
  if (inputData) {
    inputData.min = new Date().toISOString().split('T')[0];
    inputData.value = new Date().toISOString().split('T')[0];
  }

  await carregarCorpoClinico();
  await carregarPerfilPaciente(session);
  await carregarConsultasPaciente();
});

/**
 * Carrega lista de dentistas da API para alimentar o <select> do agendamento
 */
async function carregarCorpoClinico() {
  const select = document.getElementById('select-dentista-agendamento');
  if (!select) return;

  try {
    const res = await ClinicaAPI.dentistas.listar();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      select.innerHTML = res.data.map(d => `
        <option value="${d.id}">${d.nome} - ${d.especialidade || 'Odontologia'} (${d.cro || 'CRO Ativo'})</option>
      `).join('');
    }
  } catch (e) {
    console.warn('Usando lista de dentistas padrão:', e);
  }
}

/**
 * Carrega ou simula os dados cadastrais do paciente atual
 */
async function carregarPerfilPaciente(session) {
  try {
    const res = await ClinicaAPI.pacientes.listar();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      // Tenta encontrar por nome ou usa o primeiro registro
      const found = res.data.find(p => p.nome && p.nome.toLowerCase().includes(session.nome.toLowerCase())) || res.data[0];
      currentPatient = found;
    } else {
      currentPatient = {
        id: 1,
        nome: session.nome || 'Mariana Silva',
        cpf: '321.654.987-00',
        telefone: '(11) 98765-4321',
        email: 'mariana.silva@exemplo.com',
        convenio: 'Particular',
        observacoes_clinicas: 'Sensibilidade nos dentes anteriores. Nenhuma alergia medicamentosa severa declarada.'
      };
    }
  } catch {
    currentPatient = {
      id: 1,
      nome: session.nome || 'Mariana Silva',
      cpf: '321.654.987-00',
      telefone: '(11) 98765-4321',
      email: 'mariana.silva@exemplo.com',
      convenio: 'Particular',
      observacoes_clinicas: 'Sensibilidade leve. Sem alergias conhecidas.'
    };
  }

  renderPerfilPacienteUI();
}

function renderPerfilPacienteUI() {
  if (!currentPatient) return;
  document.getElementById('profile-nome').textContent = currentPatient.nome || '-';
  document.getElementById('profile-cpf').textContent = currentPatient.cpf || '-';
  document.getElementById('profile-telefone').textContent = UI.formatPhone(currentPatient.telefone);
  document.getElementById('profile-convenio').textContent = currentPatient.convenio || 'Particular';
  document.getElementById('profile-observacoes').textContent = currentPatient.observacoes_clinicas || 'Nenhuma alergia ou restrição registrada.';

  document.getElementById('stat-convenio').textContent = currentPatient.convenio || 'Particular';
  const obs = currentPatient.observacoes_clinicas || '';
  document.getElementById('stat-alergias').textContent = obs.toLowerCase().includes('alergia') ? 'Alergia Registrada' : 'Sem Restrições';
}

/**
 * Carrega a lista de consultas da API
 */
async function carregarConsultasPaciente() {
  const container = document.getElementById('consultas-container');
  UI.renderLoading(container, 'Consultando agendamentos na clínica...');

  const res = await ClinicaAPI.consultas.listar();

  if (!res.success) {
    UI.renderError(container, {
      message: res.error,
      retryCallback: carregarConsultasPaciente
    });
    return;
  }

  const rawList = Array.isArray(res.data) ? res.data : [];
  
  // Filtra consultas ou exibe todas
  patientConsultas = rawList.filter(c => c.procedimento && c.procedimento !== 'Cadastro de Recepção');

  document.getElementById('stat-total-consultas').textContent = patientConsultas.length;

  if (patientConsultas.length === 0) {
    UI.renderEmpty(container, {
      title: 'Você ainda não possui consultas agendadas',
      message: 'Agende sua avaliação ou limpeza odontológica em poucos segundos.',
      actionText: 'Agendar Minha Primeira Consulta',
      actionCallback: openAgendarModal
    });
    return;
  }

  // Renderiza a tabela de consultas
  renderTabelaConsultas(patientConsultas);
}

function renderTabelaConsultas(consultas) {
  const container = document.getElementById('consultas-container');
  
  let rowsHtml = consultas.map(item => {
    const isCancelada = (item.status || '').toLowerCase().includes('cancel');
    const isConcluida = (item.status || '').toLowerCase().includes('concl');
    
    return `
      <tr id="consulta-row-${item.id}">
        <td><strong>#${item.id}</strong></td>
        <td>
          <div style="font-weight:600; color:var(--primary-900);">${item.procedimento || 'Consulta Odontológica'}</div>
          <small style="color:var(--text-muted);">${item.observação || 'Sem observações adicionais'}</small>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color:var(--primary-600);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${UI.formatDate(item.data)}
          </div>
        </td>
        <td>
          <span style="font-size:0.9rem;">Dr(a). Responsável (#${item.id_dentista || 'Corpo Clínico'})</span>
        </td>
        <td>${UI.formatStatusBadge(item.status)}</td>
        <td>
          ${(!isCancelada && !isConcluida) ? `
            <button class="btn btn-outline btn-sm" style="color:var(--danger); border-color:#fca5a5;" onclick="solicitarCancelamento(${item.id})">
              Cancelar
            </button>
          ` : `
            <span style="color:var(--text-light); font-size:0.85rem;">-</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Procedimento</th>
            <th>Data Agendada</th>
            <th>Profissional</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Abertura e manipulação do modal de agendamento
 */
function openAgendarModal() {
  UI.openModal('modal-agendar');
}

async function handleSalvarAgendamento(event) {
  event.preventDefault();
  const form = document.getElementById('form-agendar');
  const formData = new FormData(form);
  
  const btn = document.getElementById('btn-submit-agendar');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Agendando...`;

  const payload = {
    nome: currentPatient ? currentPatient.nome : 'Paciente Portal',
    matricula: 'WEB-PACIENTE',
    turno: 'Integral',
    id_dentista: parseInt(formData.get('id_dentista')) || 1,
    id_paciente: currentPatient ? currentPatient.id : 1,
    data: formData.get('data'),
    procedimento: formData.get('procedimento'),
    status: 'Agendada',
    observação: formData.get('observacao') || 'Agendamento solicitado pelo portal do paciente'
  };

  try {
    const res = await ClinicaAPI.consultas.criar(payload);
    if (res.success) {
      UI.closeModal('modal-agendar');
      form.reset();
      UI.toast('Consulta agendada com sucesso na Sorriso Claro!', 'success');
      
      // Atualização imediata sem F5
      await carregarConsultasPaciente();
    } else {
      UI.toast(`Não foi possível agendar: ${res.error}`, 'danger');
    }
  } catch (err) {
    UI.toast(`Erro inesperado: ${err.message}`, 'danger');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

/**
 * Cancelamento de consulta com confirmação e exclusão ou atualização
 */
function solicitarCancelamento(consultaId) {
  UI.confirm({
    title: 'Cancelar Agendamento',
    message: `Tem certeza que deseja cancelar a consulta #${consultaId}? O horário será liberado na clínica.`,
    onConfirm: async () => {
      UI.toast('Cancelando consulta na API...', 'info', 2000);
      const res = await ClinicaAPI.consultas.deletar(consultaId);
      
      if (res.success) {
        UI.toast('Consulta cancelada e removida com sucesso!', 'success');
        
        // Remove dinamicamente da lista local sem reload
        patientConsultas = patientConsultas.filter(c => c.id !== consultaId);
        document.getElementById('stat-total-consultas').textContent = patientConsultas.length;

        const row = document.getElementById(`consulta-row-${consultaId}`);
        if (row) {
          row.style.transition = 'all 0.3s ease';
          row.style.opacity = '0';
          row.style.transform = 'translateX(20px)';
          setTimeout(() => {
            row.remove();
            if (patientConsultas.length === 0) {
              carregarConsultasPaciente();
            }
          }, 300);
        } else {
          carregarConsultasPaciente();
        }
      } else {
        UI.toast(`Falha ao cancelar: ${res.error}`, 'danger');
      }
    }
  });
}

/**
 * Edição dos dados cadastrais do paciente
 */
function openEditarDadosModal() {
  if (!currentPatient) return;
  document.getElementById('edit-patient-id').value = currentPatient.id || '';
  document.getElementById('edit-nome').value = currentPatient.nome || '';
  document.getElementById('edit-telefone').value = currentPatient.telefone || '';
  document.getElementById('edit-convenio').value = currentPatient.convenio || 'Particular';
  document.getElementById('edit-observacoes').value = currentPatient.observacoes_clinicas || '';
  UI.openModal('modal-editar-dados');
}

async function handleSalvarDadosPaciente(event) {
  event.preventDefault();
  const form = document.getElementById('form-editar-dados');
  const formData = new FormData(form);
  
  const id = formData.get('id') || (currentPatient ? currentPatient.id : 1);
  const payload = {
    id: parseInt(id),
    nome: formData.get('nome'),
    telefone: formData.get('telefone'),
    convenio: formData.get('convenio'),
    observacoes_clinicas: formData.get('observacoes_clinicas'),
    cpf: currentPatient ? currentPatient.cpf : '',
    email: currentPatient ? currentPatient.email : '',
    data_nascimento: currentPatient ? currentPatient.data_nascimento : '1995-05-15'
  };

  UI.toast('Salvando alterações cadastrais...', 'info', 2000);

  const res = await ClinicaAPI.pacientes.atualizar(id, payload);
  if (res.success) {
    currentPatient = { ...currentPatient, ...payload };
    renderPerfilPacienteUI();
    UI.closeModal('modal-editar-dados');
    UI.toast('Seus dados foram atualizados com sucesso!', 'success');
  } else {
    UI.toast(`Erro ao atualizar dados: ${res.error}`, 'danger');
  }
}
