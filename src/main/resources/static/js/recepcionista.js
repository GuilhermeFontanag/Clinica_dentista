

let listaConsultasRecepcao = [];
let listaPacientesRecepcao = [];
let listaDentistasRecepcao = [];

document.addEventListener('DOMContentLoaded', async () => {
  UI.setupNavigation('recepcionista.html');
  const session = UserSession.requireAuth();
  if (!session) return;

  const titleEl = document.getElementById('welcome-recepcao-title');
  if (titleEl) {
    titleEl.textContent = `Central de Atendimento - ${session.nome}`;
  }

  await carregarDadosRecepcao();
});


async function carregarDadosRecepcao() {
  const containerConsultas = document.getElementById('recepcao-consultas-container');
  const containerPacientes = document.getElementById('recepcao-pacientes-container');

  UI.renderLoading(containerConsultas, 'Carregando agendamentos da clínica...');
  UI.renderLoading(containerPacientes, 'Carregando cadastro de pacientes...');

  try {
    const [resConsultas, resPacientes, resDentistas] = await Promise.all([
      ClinicaAPI.consultas.listar(),
      ClinicaAPI.pacientes.listar(),
      ClinicaAPI.dentistas.listar()
    ]);

    if (resConsultas.success) {
      const raw = Array.isArray(resConsultas.data) ? resConsultas.data : [];
      listaConsultasRecepcao = raw.filter(c => c.procedimento && c.procedimento !== 'Cadastro de Recepção');
      renderTabelaConsultasRecepcao(listaConsultasRecepcao);
    } else {
      UI.renderError(containerConsultas, {
        message: resConsultas.error,
        retryCallback: carregarDadosRecepcao
      });
    }

    if (resPacientes.success) {
      listaPacientesRecepcao = Array.isArray(resPacientes.data) ? resPacientes.data : [];
      renderTabelaPacientesRecepcao(listaPacientesRecepcao);
    } else {
      UI.renderError(containerPacientes, {
        message: resPacientes.error,
        retryCallback: carregarDadosRecepcao
      });
    }

    if (resDentistas.success) {
      listaDentistasRecepcao = Array.isArray(resDentistas.data) ? resDentistas.data : [];
      if (listaDentistasRecepcao.length === 0) {
        listaDentistasRecepcao = [
          { id: 1, nome: 'Dr. Roberto Mendes', especialidade: 'Clínica Geral' },
          { id: 2, nome: 'Dra. Camila Duarte', especialidade: 'Ortodontia' },
          { id: 3, nome: 'Dr. Fernando Souza', especialidade: 'Endodontia' }
        ];
      }
    }

    atualizarEstatisticasRecepcao();
    atualizarSelectsFormularios();

  } catch (error) {
    console.error('Erro na recepção:', error);
    UI.renderError(containerConsultas, { message: 'Erro de comunicação.', retryCallback: carregarDadosRecepcao });
  }
}

function atualizarEstatisticasRecepcao() {
  document.getElementById('stat-total-pacientes').textContent = listaPacientesRecepcao.length;
  document.getElementById('stat-total-agendamentos').textContent = listaConsultasRecepcao.length;
  document.getElementById('stat-total-dentistas').textContent = listaDentistasRecepcao.length || 3;
}


function atualizarSelectsFormularios() {
  const selectPac = document.getElementById('consulta-paciente-select');
  if (selectPac) {
    if (listaPacientesRecepcao.length > 0) {
      selectPac.innerHTML = listaPacientesRecepcao.map(p => `
        <option value="${p.id}" data-nome="${p.nome}">${p.nome} (CPF: ${p.cpf || 'Sem CPF'})</option>
      `).join('');
    } else {
      selectPac.innerHTML = `<option value="1" data-nome="Mariana Silva">Mariana Silva (Exemplo Padrão)</option>`;
    }
  }

  const selectDent = document.getElementById('consulta-dentista-select');
  if (selectDent) {
    selectDent.innerHTML = listaDentistasRecepcao.map(d => `
      <option value="${d.id}">${d.nome} - ${d.especialidade || 'Dentista'}</option>
    `).join('');
  }
}


function renderTabelaConsultasRecepcao(consultas) {
  const container = document.getElementById('recepcao-consultas-container');

  if (!consultas || consultas.length === 0) {
    UI.renderEmpty(container, {
      title: 'Nenhuma consulta encontrada',
      message: 'Não há agendamentos para o filtro selecionado.',
      actionText: 'Agendar Nova Consulta',
      actionCallback: openModalNovaConsulta
    });
    return;
  }

  const rows = consultas.map(c => {
    const isCancelada = (c.status || '').toLowerCase().includes('cancel');

    return `
      <tr id="rec-consulta-row-${c.id}">
        <td><strong>#${c.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--primary-900);">${c.nome || 'Paciente'}</div>
          <small style="color:var(--text-muted);">${c.observação || 'Sem notas'}</small>
        </td>
        <td>
          <span style="font-weight:600; color:var(--primary-800);">${c.procedimento || 'Consulta'}</span>
        </td>
        <td>Dr(a). Responsável (#${c.id_dentista || '1'})</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.35rem;">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color:var(--primary-600);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${UI.formatDate(c.data)}
          </div>
        </td>
        <td>${UI.formatStatusBadge(c.status)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-outline btn-sm" onclick="abrirModalEditarConsulta(${c.id})" title="Remarcar ou alterar consulta">
              Editar
            </button>
            <button class="btn btn-outline btn-sm" style="color:var(--danger); border-color:#fca5a5;" onclick="excluirConsultaRecepcao(${c.id})" title="Remover consulta">
              Excluir
            </button>
          </div>
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
            <th>Paciente</th>
            <th>Procedimento</th>
            <th>Profissional</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/**
 * Filtro de Consultas por Status
 */
function filtrarConsultas() {
  const statusFiltro = document.getElementById('filtro-status-consulta').value;
  if (!statusFiltro) {
    renderTabelaConsultasRecepcao(listaConsultasRecepcao);
    return;
  }

  const filtradas = listaConsultasRecepcao.filter(c => (c.status || '').toLowerCase().includes(statusFiltro.toLowerCase()));
  renderTabelaConsultasRecepcao(filtradas);
}

/**
 * Renderiza Tabela de Pacientes
 */
function renderTabelaPacientesRecepcao(pacientes) {
  const container = document.getElementById('recepcao-pacientes-container');

  if (!pacientes || pacientes.length === 0) {
    UI.renderEmpty(container, {
      title: 'Nenhum paciente cadastrado',
      message: 'Cadastre o primeiro paciente para começar a agendar procedimentos.',
      actionText: 'Cadastrar Novo Paciente',
      actionCallback: openModalNovoPaciente
    });
    return;
  }

  const rows = pacientes.map(p => {
    const temAlergia = p.observacoes_clinicas && p.observacoes_clinicas.toLowerCase().includes('alergia');

    return `
      <tr id="rec-paciente-row-${p.id}">
        <td><strong>#${p.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--primary-900);">${p.nome}</div>
          ${temAlergia ? `
            <span class="badge badge-alerta" style="margin-top:2px;">⚠ Alergia Declarada</span>
          ` : ''}
        </td>
        <td>${p.cpf || '-'}</td>
        <td>${UI.formatPhone(p.telefone)}</td>
        <td><span class="badge badge-convenio">${p.convenio || 'Particular'}</span></td>
        <td>
          <span style="font-size:0.85rem; color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
            ${p.observacoes_clinicas || 'Sem restrições'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm" onclick="agendarParaPaciente(${p.id}, '${p.nome}')" title="Agendar nova consulta para este paciente">
              Agendar
            </button>
            <button class="btn btn-outline btn-sm" onclick="abrirModalEditarPaciente(${p.id})" title="Atualizar telefone, convênio ou alertas">
              Editar
            </button>
            <button class="btn btn-outline btn-sm" style="color:var(--danger); border-color:#fca5a5;" onclick="excluirPacienteRecepcao(${p.id}, '${p.nome}')" title="Remover paciente">
              Excluir
            </button>
          </div>
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
            <th>Paciente</th>
            <th>CPF</th>
            <th>Telefone / WhatsApp</th>
            <th>Convênio</th>
            <th>Observações Clínicas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/**
 * Filtragem de Pacientes na Recepção
 */
function filtrarPacientesRecepcao(termo) {
  const busca = (termo || '').toLowerCase().trim();
  if (!busca) {
    renderTabelaPacientesRecepcao(listaPacientesRecepcao);
    return;
  }

  const filtrados = listaPacientesRecepcao.filter(p =>
    (p.nome && p.nome.toLowerCase().includes(busca)) ||
    (p.cpf && p.cpf.toLowerCase().includes(busca))
  );

  renderTabelaPacientesRecepcao(filtrados);
}

/**
 * Modal Novo Paciente (POST /api/dentista)
 */
function openModalNovoPaciente() {
  document.getElementById('form-novo-paciente').reset();
  UI.openModal('modal-novo-paciente');
}

async function handleCadastrarPaciente(event) {
  event.preventDefault();
  const form = document.getElementById('form-novo-paciente');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const btn = document.getElementById('btn-submit-novo-paciente');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Salvando...`;

  try {
    const res = await ClinicaAPI.pacientes.criar(data);
    if (res.success) {
      UI.closeModal('modal-novo-paciente');
      UI.toast(`Paciente "${data.nome}" cadastrado com sucesso!`, 'success');
      form.reset();

      // Recarrega lista e atualiza em tempo real
      await carregarDadosRecepcao();

      // Pergunta se deseja já agendar a primeira consulta para o novo paciente
      setTimeout(() => {
        UI.confirm({
          title: 'Agendar Primeira Consulta?',
          message: `Deseja agendar a avaliação inicial para ${data.nome} agora?`,
          onConfirm: () => {
            const pac = listaPacientesRecepcao.find(p => p.cpf === data.cpf) || { id: 1, nome: data.nome };
            agendarParaPaciente(pac.id, pac.nome);
          }
        });
      }, 500);

    } else {
      UI.toast(`Falha ao cadastrar: ${res.error}`, 'danger');
    }
  } catch (err) {
    UI.toast(`Erro: ${err.message}`, 'danger');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

/**
 * Modal de Consulta (Agendar / Remarcar)
 */
function openModalNovaConsulta() {
  document.getElementById('modal-consulta-title').textContent = 'Agendar Nova Consulta';
  document.getElementById('consulta-id').value = '';
  document.getElementById('consulta-data').min = new Date().toISOString().split('T')[0];
  document.getElementById('consulta-data').value = new Date().toISOString().split('T')[0];
  document.getElementById('consulta-status').value = 'Agendada';
  document.getElementById('consulta-observacao').value = '';

  atualizarSelectsFormularios();
  UI.openModal('modal-consulta');
}

function agendarParaPaciente(pacienteId, pacienteNome) {
  openModalNovaConsulta();
  const select = document.getElementById('consulta-paciente-select');
  if (select) {
    select.value = pacienteId;
  }
}

function abrirModalEditarConsulta(consultaId) {
  const c = listaConsultasRecepcao.find(item => item.id === consultaId);
  if (!c) return;

  document.getElementById('modal-consulta-title').textContent = `Remarcar / Editar Consulta #${c.id}`;
  document.getElementById('consulta-id').value = c.id;
  document.getElementById('consulta-data').value = c.data || '';
  document.getElementById('consulta-procedimento').value = c.procedimento || 'Avaliação Inicial';
  document.getElementById('consulta-status').value = c.status || 'Agendada';
  document.getElementById('consulta-observacao').value = c.observação || '';
  document.getElementById('consulta-dentista-select').value = c.id_dentista || 1;

  const selectPac = document.getElementById('consulta-paciente-select');
  if (selectPac) selectPac.value = c.id_paciente || 1;

  UI.openModal('modal-consulta');
}

async function handleSalvarConsulta(event) {
  event.preventDefault();
  const form = document.getElementById('form-consulta');
  const formData = new FormData(form);

  const id = formData.get('id');
  const selectPac = document.getElementById('consulta-paciente-select');
  const nomePaciente = selectPac.options[selectPac.selectedIndex]?.getAttribute('data-nome') || selectPac.options[selectPac.selectedIndex]?.text.split(' (')[0] || 'Paciente';

  const payload = {
    nome: nomePaciente,
    matricula: 'REC-01',
    turno: 'Manhã',
    id_dentista: parseInt(formData.get('id_dentista')) || 1,
    id_paciente: parseInt(formData.get('paciente_selecao')) || 1,
    data: formData.get('data'),
    procedimento: formData.get('procedimento'),
    status: formData.get('status'),
    observação: formData.get('observacao')
  };

  const btn = document.getElementById('btn-submit-consulta');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Salvando...`;

  try {
    let res;
    if (id) {
      payload.id = parseInt(id);
      res = await ClinicaAPI.consultas.atualizar(id, payload);
    } else {
      res = await ClinicaAPI.consultas.criar(payload);
    }

    if (res.success) {
      UI.closeModal('modal-consulta');
      UI.toast(id ? 'Consulta remarcada/atualizada com sucesso!' : 'Consulta agendada com sucesso!', 'success');
      await carregarDadosRecepcao();
    } else {
      UI.toast(`Falha ao salvar consulta: ${res.error}`, 'danger');
    }
  } catch (err) {
    UI.toast(`Erro: ${err.message}`, 'danger');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

/**
 * Exclusão de Consulta (DELETE /api/recepcionista/{id})
 */
function excluirConsultaRecepcao(consultaId) {
  UI.confirm({
    title: 'Excluir Agendamento',
    message: `Tem certeza que deseja remover permanentemente o agendamento #${consultaId}?`,
    onConfirm: async () => {
      UI.toast('Removendo consulta da API...', 'info', 2000);
      const res = await ClinicaAPI.consultas.deletar(consultaId);

      if (res.success) {
        UI.toast('Consulta removida com sucesso!', 'success');
        listaConsultasRecepcao = listaConsultasRecepcao.filter(c => c.id !== consultaId);
        atualizarEstatisticasRecepcao();

        const row = document.getElementById(`rec-consulta-row-${consultaId}`);
        if (row) {
          row.style.transition = 'all 0.3s ease';
          row.style.opacity = '0';
          setTimeout(() => {
            row.remove();
            if (listaConsultasRecepcao.length === 0) renderTabelaConsultasRecepcao([]);
          }, 300);
        } else {
          renderTabelaConsultasRecepcao(listaConsultasRecepcao);
        }
      } else {
        UI.toast(`Erro ao remover: ${res.error}`, 'danger');
      }
    }
  });
}

/**
 * Edição de Paciente (PUT /api/dentista/{id})
 */
function abrirModalEditarPaciente(pacienteId) {
  const p = listaPacientesRecepcao.find(item => item.id === pacienteId);
  if (!p) return;

  document.getElementById('edit-rec-paciente-id').value = p.id;
  document.getElementById('edit-rec-paciente-nome').value = p.nome || '';
  document.getElementById('edit-rec-paciente-telefone').value = p.telefone || '';
  document.getElementById('edit-rec-paciente-convenio').value = p.convenio || 'Particular';
  document.getElementById('edit-rec-paciente-observacoes').value = p.observacoes_clinicas || '';

  UI.openModal('modal-editar-paciente-recepcao');
}

async function handleSalvarEdicaoPaciente(event) {
  event.preventDefault();
  const form = document.getElementById('form-editar-paciente-recepcao');
  const formData = new FormData(form);

  const id = parseInt(formData.get('id'));
  const pOriginal = listaPacientesRecepcao.find(item => item.id === id);

  const payload = {
    id: id,
    nome: formData.get('nome'),
    telefone: formData.get('telefone'),
    convenio: formData.get('convenio'),
    observacoes_clinicas: formData.get('observacoes_clinicas'),
    cpf: pOriginal ? pOriginal.cpf : '',
    email: pOriginal ? pOriginal.email : '',
    data_nascimento: pOriginal ? pOriginal.data_nascimento : '1995-01-01'
  };

  UI.toast('Atualizando dados do paciente na API...', 'info', 2000);

  const res = await ClinicaAPI.pacientes.atualizar(id, payload);
  if (res.success) {
    UI.closeModal('modal-editar-paciente-recepcao');
    UI.toast('Dados do paciente atualizados com sucesso!', 'success');
    await carregarDadosRecepcao();
  } else {
    UI.toast(`Falha ao atualizar paciente: ${res.error}`, 'danger');
  }
}

/**
 * Exclusão de Paciente (DELETE /api/dentista/{id})
 */
function excluirPacienteRecepcao(pacienteId, pacienteNome) {
  UI.confirm({
    title: 'Excluir Cadastro de Paciente',
    message: `Tem certeza que deseja excluir o cadastro de "${pacienteNome}" (#${pacienteId})? Esta ação não pode ser desfeita.`,
    onConfirm: async () => {
      UI.toast('Excluindo paciente da API...', 'info', 2000);
      const res = await ClinicaAPI.pacientes.deletar(pacienteId);

      if (res.success) {
        UI.toast(`Paciente "${pacienteNome}" excluído com sucesso!`, 'success');
        listaPacientesRecepcao = listaPacientesRecepcao.filter(p => p.id !== pacienteId);
        atualizarEstatisticasRecepcao();

        const row = document.getElementById(`rec-paciente-row-${pacienteId}`);
        if (row) {
          row.style.transition = 'all 0.3s ease';
          row.style.opacity = '0';
          setTimeout(() => {
            row.remove();
            if (listaPacientesRecepcao.length === 0) renderTabelaPacientesRecepcao([]);
          }, 300);
        } else {
          renderTabelaPacientesRecepcao(listaPacientesRecepcao);
        }
      } else {
        UI.toast(`Falha ao excluir paciente: ${res.error}`, 'danger');
      }
    }
  });
}
