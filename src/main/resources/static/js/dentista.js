

let listaConsultas = [];
let listaPacientes = [];

document.addEventListener('DOMContentLoaded', async () => {
  UI.setupNavigation('dentista.html');
  const session = UserSession.requireAuth();
  if (!session) return;

  const welcomeEl = document.getElementById('welcome-dentist-name');
  if (welcomeEl) {
    welcomeEl.textContent = `Consultório - ${session.nome}`;
  }

  await carregarDadosDentista();
});

async function carregarDadosDentista() {
  const containerConsultas = document.getElementById('dentista-consultas-container');
  const containerPacientes = document.getElementById('dentista-pacientes-container');

  UI.renderLoading(containerConsultas, 'Carregando agenda de procedimentos clínicos...');
  UI.renderLoading(containerPacientes, 'Carregando fichas de pacientes e histórico de alergias...');

  try {
    const [resConsultas, resPacientes] = await Promise.all([
      ClinicaAPI.consultas.listar(),
      ClinicaAPI.pacientes.listar()
    ]);

    
    if (resConsultas.success) {
      const raw = Array.isArray(resConsultas.data) ? resConsultas.data : [];
      listaConsultas = raw.filter(c => c.procedimento && c.procedimento !== 'Cadastro de Recepção');
      renderGradeConsultas(listaConsultas);
    } else {
      UI.renderError(containerConsultas, {
        message: resConsultas.error,
        retryCallback: carregarDadosDentista
      });
    }

    
    if (resPacientes.success) {
      listaPacientes = Array.isArray(resPacientes.data) ? resPacientes.data : [];
      renderGradePacientes(listaPacientes);
    } else {
      UI.renderError(containerPacientes, {
        message: resPacientes.error,
        retryCallback: carregarDadosDentista
      });
    }

    atualizarEstatisticasDentista();

  } catch (error) {
    console.error('Erro ao carregar dados do dentista:', error);
    UI.renderError(containerConsultas, { message: 'Erro de conexão com o servidor.', retryCallback: carregarDadosDentista });
  }
}

function atualizarEstatisticasDentista() {
  const agendadas = listaConsultas.filter(c => !(c.status || '').toLowerCase().includes('concl') && !(c.status || '').toLowerCase().includes('cancel')).length;
  const concluidas = listaConsultas.filter(c => (c.status || '').toLowerCase().includes('concl')).length;
  const comAlergia = listaPacientes.filter(p => p.observacoes_clinicas && p.observacoes_clinicas.toLowerCase().includes('alergia')).length;

  document.getElementById('stat-atendimentos-pendentes').textContent = agendadas;
  document.getElementById('stat-atendimentos-concluidos').textContent = concluidas;
  document.getElementById('stat-pacientes-alerta').textContent = comAlergia;

  const countBadge = document.getElementById('consultas-count-badge');
  if (countBadge) {
    countBadge.textContent = `${listaConsultas.length} procedimentos registrados`;
  }
}

function renderGradeConsultas(consultas) {
  const container = document.getElementById('dentista-consultas-container');

  if (!consultas || consultas.length === 0) {
    UI.renderEmpty(container, {
      title: 'Nenhum atendimento na agenda',
      message: 'Não há consultas marcadas no momento. Novos agendamentos realizados pela recepção aparecerão aqui em tempo real.'
    });
    return;
  }

  const rows = consultas.map(c => {
    
    const pac = listaPacientes.find(p => p.id === c.id_paciente || (p.nome && p.nome === c.nome)) || null;
    const temAlergia = pac && pac.observacoes_clinicas && pac.observacoes_clinicas.toLowerCase().includes('alergia');

    return `
      <tr id="dentista-consulta-${c.id}">
        <td><strong>#${c.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--primary-900);">${c.nome || 'Paciente Sorriso Claro'}</div>
          ${temAlergia ? `
            <span class="badge badge-alerta" style="margin-top:2px;">
              ⚠ Alerta de Alergia Registrada
            </span>
          ` : ''}
        </td>
        <td>
          <span style="font-weight:600; color:var(--primary-800);">${c.procedimento || 'Procedimento Clínico'}</span>
        </td>
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
            <button class="btn btn-secondary btn-sm" onclick="abrirModalAtendimento(${c.id})" title="Registrar atendimento e evolução clínica">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Evoluir
            </button>
            <button class="btn btn-outline btn-sm" onclick="abrirProntuarioRapido(${c.id_paciente || 0}, '${c.nome || ''}')" title="Ver ficha completa">
              Ficha
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
            <th>Data</th>
            <th>Status</th>
            <th>Ações Clínicas</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderGradePacientes(pacientes) {
  const container = document.getElementById('dentista-pacientes-container');

  if (!pacientes || pacientes.length === 0) {
    UI.renderEmpty(container, {
      title: 'Nenhum paciente cadastrado',
      message: 'Assim que novos pacientes forem cadastrados na recepção ou no login, suas fichas estarão disponíveis aqui.'
    });
    return;
  }

  const rows = pacientes.map(p => {
    const temAlergia = p.observacoes_clinicas && p.observacoes_clinicas.toLowerCase().includes('alergia');

    return `
      <div class="card" style="padding:1.2rem; border-left: 4px solid ${temAlergia ? 'var(--warning)' : 'var(--primary-400)'};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem;">
          <div>
            <h3 style="font-size:1.1rem; color:var(--primary-900);">${p.nome}</h3>
            <span style="font-size:0.85rem; color:var(--text-muted);">CPF: ${p.cpf || 'Não informado'} | Tel: ${UI.formatPhone(p.telefone)}</span>
          </div>
          <span class="badge badge-convenio">${p.convenio || 'Particular'}</span>
        </div>

        <div style="background:${temAlergia ? 'var(--warning-bg)' : 'var(--primary-50)'}; border:1px solid ${temAlergia ? 'var(--warning-border)' : 'var(--primary-100)'}; padding:0.65rem 0.85rem; border-radius:var(--radius-md); font-size:0.88rem; margin-top:0.4rem;">
          <strong style="color:${temAlergia ? 'var(--warning)' : 'var(--primary-800)'};">
            ${temAlergia ? '⚠ ALERTA CLÍNICO / RESTRIÇÃO:' : 'Observações Clínicas:'}
          </strong>
          <span style="color:var(--text-main); margin-left:4px;">
            ${p.observacoes_clinicas || 'Nenhuma alergia ou histórico de complicação declarado.'}
          </span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1rem;">
      ${rows}
    </div>
  `;
}

function filtrarPacientes(termo) {
  const busca = (termo || '').toLowerCase().trim();
  if (!busca) {
    renderGradePacientes(listaPacientes);
    return;
  }

  const filtrados = listaPacientes.filter(p => 
    (p.nome && p.nome.toLowerCase().includes(busca)) ||
    (p.cpf && p.cpf.toLowerCase().includes(busca)) ||
    (p.observacoes_clinicas && p.observacoes_clinicas.toLowerCase().includes(busca))
  );

  renderGradePacientes(filtrados);
}

function abrirModalAtendimento(consultaId) {
  const c = listaConsultas.find(item => item.id === consultaId);
  if (!c) return;

  document.getElementById('atendimento-consulta-id').value = c.id;
  document.getElementById('atendimento-paciente-nome').textContent = c.nome || 'Paciente';
  document.getElementById('atendimento-procedimento-nome').textContent = c.procedimento || 'Procedimento';
  document.getElementById('atendimento-status').value = c.status || 'Concluída';
  document.getElementById('atendimento-observacao').value = c.observação || '';

  UI.openModal('modal-atendimento');
}

async function handleSalvarAtendimento(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById('atendimento-consulta-id').value);
  const novoStatus = document.getElementById('atendimento-status').value;
  const novaObservacao = document.getElementById('atendimento-observacao').value;

  const btn = document.getElementById('btn-salvar-atendimento');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Salvando...`;

  const consulta = listaConsultas.find(item => item.id === id);

  const payload = {
    id: id,
    nome: consulta ? consulta.nome : 'Paciente',
    matricula: consulta ? consulta.matricula : 'REC-1',
    turno: consulta ? consulta.turno : 'Manhã',
    id_dentista: consulta ? consulta.id_dentista : 1,
    id_paciente: consulta ? consulta.id_paciente : 1,
    data: consulta ? consulta.data : new Date().toISOString().split('T')[0],
    procedimento: consulta ? consulta.procedimento : 'Procedimento Odontológico',
    status: novoStatus,
    observação: novaObservacao
  };

  try {
    const res = await ClinicaAPI.consultas.atualizar(id, payload);

    if (res.success) {
      UI.closeModal('modal-atendimento');
      UI.toast(`Atendimento #${id} atualizado com sucesso!`, 'success');

      
      if (consulta) {
        consulta.status = novoStatus;
        consulta.observação = novaObservacao;
      }
      renderGradeConsultas(listaConsultas);
      atualizarEstatisticasDentista();
    } else {
      UI.toast(`Falha ao salvar atendimento: ${res.error}`, 'danger');
    }
  } catch (err) {
    UI.toast(`Erro: ${err.message}`, 'danger');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

function abrirProntuarioRapido(pacienteId, pacienteNome) {
  const p = listaPacientes.find(item => item.id === pacienteId || (item.nome && item.nome === pacienteNome)) || {
    nome: pacienteNome || 'Paciente',
    cpf: 'Não informado',
    telefone: 'Não informado',
    convenio: 'Particular',
    data_nascimento: 'Não informada',
    observacoes_clinicas: 'Nenhuma observação clínica específica registrada.'
  };

  const temAlergia = p.observacoes_clinicas && p.observacoes_clinicas.toLowerCase().includes('alergia');

  const body = document.getElementById('prontuario-detalhe-body');
  body.innerHTML = `
    <div style="margin-bottom:1.2rem;">
      <h3 style="font-size:1.3rem; color:var(--primary-900); margin-bottom:0.2rem;">${p.nome}</h3>
      <span class="badge badge-convenio">${p.convenio || 'Particular'}</span>
    </div>

    <div class="form-row" style="margin-bottom:1.2rem;">
      <div>
        <span class="form-label" style="font-size:0.8rem; color:var(--text-muted);">CPF</span>
        <p style="font-weight:600;">${p.cpf || '-'}</p>
      </div>
      <div>
        <span class="form-label" style="font-size:0.8rem; color:var(--text-muted);">TELEFONE</span>
        <p style="font-weight:600;">${UI.formatPhone(p.telefone)}</p>
      </div>
      <div>
        <span class="form-label" style="font-size:0.8rem; color:var(--text-muted);">DATA DE NASCIMENTO</span>
        <p style="font-weight:600;">${UI.formatDate(p.data_nascimento)}</p>
      </div>
    </div>

    <div style="background:${temAlergia ? 'var(--warning-bg)' : 'var(--primary-50)'}; border:2px solid ${temAlergia ? 'var(--warning)' : 'var(--primary-200)'}; padding:1rem 1.25rem; border-radius:var(--radius-md);">
      <h4 style="color:${temAlergia ? '#92400e' : 'var(--primary-900)'}; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
        ${temAlergia ? `
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          ALERTA DE SEGURANÇA DO PACIENTE
        ` : 'Histórico Clínico & Alergias'}
      </h4>
      <p style="color:var(--text-main); font-size:0.95rem; line-height:1.5;">
        ${p.observacoes_clinicas || 'Sem restrições declaradas para anestésicos locais ou procedimentos comuns.'}
      </p>
    </div>
  `;

  UI.openModal('modal-prontuario-detalhe');
}
