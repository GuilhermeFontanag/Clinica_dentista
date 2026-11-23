/**
 * CLÍNICA ODONTOLÓGICA SORRISO CLARO - CONTROLE DE LOGIN E CADASTRO
 */

document.addEventListener('DOMContentLoaded', () => {
  updateRegisterFormFields();
});

/**
 * Alterna entre abas de Login e Cadastro
 */
function switchAuthTab(tab) {
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const btnLogin = document.getElementById('tab-btn-login');
  const btnRegister = document.getElementById('tab-btn-register');

  if (tab === 'login') {
    loginTab.style.display = 'block';
    registerTab.style.display = 'none';
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
  } else {
    loginTab.style.display = 'none';
    registerTab.style.display = 'block';
    btnLogin.classList.remove('active');
    btnRegister.classList.add('active');
    updateRegisterFormFields();
  }
}

/**
 * Login Sem Validação (conforme requisito)
 * Permite selecionar Paciente, Dentista ou Recepcionista e navegar diretamente
 */
function handleLoginSubmit(event) {
  event.preventDefault();

  const selectedRole = document.querySelector('input[name="login_role"]:checked').value;
  const customName = document.getElementById('login-name').value.trim();

  const session = UserSession.login(selectedRole, customName);

  UI.toast(`Bem-vindo(a), ${session.nome}! Acessando como ${selectedRole.toUpperCase()}...`, 'success', 2500);

  // Redirecionamento suave
  setTimeout(() => {
    switch (selectedRole) {
      case 'paciente':
        window.location.href = 'paciente.html';
        break;
      case 'dentista':
        window.location.href = 'dentista.html';
        break;
      case 'recepcionista':
        window.location.href = 'recepcionista.html';
        break;
      default:
        window.location.href = 'paciente.html';
    }
  }, 400);
}

/**
 * Renderiza os campos dinâmicos de cadastro baseados no perfil selecionado
 */
function updateRegisterFormFields() {
  const container = document.getElementById('dynamic-register-fields');
  const selectedRole = document.querySelector('input[name="register_role"]:checked').value;
  const feedback = document.getElementById('register-feedback');
  if (feedback) feedback.innerHTML = '';

  if (selectedRole === 'paciente') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome Completo <span class="required">*</span></label>
        <input type="text" name="nome" class="form-control" placeholder="Ex: Mariana Silva Santos" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">CPF <span class="required">*</span></label>
          <input type="text" name="cpf" class="form-control" placeholder="000.000.000-00" required>
        </div>
        <div class="form-group">
          <label class="form-label">Telefone / WhatsApp <span class="required">*</span></label>
          <input type="tel" name="telefone" class="form-control" placeholder="(11) 98765-4321" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Data de Nascimento <span class="required">*</span></label>
          <input type="date" name="data_nascimento" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input type="email" name="email" class="form-control" placeholder="paciente@exemplo.com">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Convênio Odontológico <span class="required">*</span></label>
        <select name="convenio" class="form-control" required>
          <option value="Particular">Particular (Sem convênio)</option>
          <option value="Unimed Odonto">Unimed Odonto</option>
          <option value="Bradesco Dental">Bradesco Dental</option>
          <option value="Amil Dental">Amil Dental</option>
          <option value="SulAmérica Odonto">SulAmérica Odonto</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Observações Clínicas / Alergias</label>
        <textarea name="observacoes_clinicas" class="form-control" placeholder="Ex: Alergia a penicilina, anestésicos com vasoconstritor, hipertensão..."></textarea>
      </div>
    `;
  } else if (selectedRole === 'dentista') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome Completo do Dentista <span class="required">*</span></label>
        <input type="text" name="nome" class="form-control" placeholder="Ex: Dr. Roberto Mendes" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Registro CRO <span class="required">*</span></label>
          <input type="text" name="cro" class="form-control" placeholder="Ex: CRO-SP 12345" required>
        </div>
        <div class="form-group">
          <label class="form-label">Especialidade Principal <span class="required">*</span></label>
          <select name="especialidade" class="form-control" required>
            <option value="Clínica Geral">Clínica Geral</option>
            <option value="Ortodontia">Ortodontia</option>
            <option value="Endodontia (Canal)">Endodontia (Canal)</option>
            <option value="Periodontia">Periodontia</option>
            <option value="Odontopediatria">Odontopediatria</option>
            <option value="Implantodontia">Implantodontia</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Telefone de Contato</label>
          <input type="tel" name="telefone" class="form-control" placeholder="(11) 99888-7766">
        </div>
        <div class="form-group">
          <label class="form-label">Status no Corpo Clínico</label>
          <select name="ativo" class="form-control">
            <option value="Sim">Ativo</option>
            <option value="Não">Inativo</option>
          </select>
        </div>
      </div>
    `;
  } else if (selectedRole === 'recepcionista') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome da Recepcionista <span class="required">*</span></label>
        <input type="text" name="nome" class="form-control" placeholder="Ex: Ana Beatriz Silva" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Matrícula Funcional <span class="required">*</span></label>
          <input type="text" name="matricula" class="form-control" placeholder="Ex: REC-2024" required>
        </div>
        <div class="form-group">
          <label class="form-label">Turno de Trabalho <span class="required">*</span></label>
          <select name="turno" class="form-control" required>
            <option value="Manhã (07h às 13h)">Manhã (07h às 13h)</option>
            <option value="Tarde (13h às 19h)">Tarde (13h às 19h)</option>
            <option value="Integral (08h às 18h)">Integral (08h às 18h)</option>
          </select>
        </div>
      </div>
    `;
  }
}

/**
 * Envia o cadastro para a API Spring Boot
 */
async function handleRegisterSubmit(event) {
  event.preventDefault();

  const selectedRole = document.querySelector('input[name="register_role"]:checked').value;
  const form = document.getElementById('form-register');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const btnSubmit = document.getElementById('btn-submit-register');
  const originalBtnHtml = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<span class="loading-spinner" style="width:18px;height:18px;border-width:2px;vertical-align:middle;"></span> Cadastrando na API...`;

  const feedback = document.getElementById('register-feedback');
  feedback.innerHTML = '';

  try {
    let result;

    if (selectedRole === 'paciente') {
      result = await ClinicaAPI.pacientes.criar(data);
    } else if (selectedRole === 'dentista') {
      result = await ClinicaAPI.dentistas.criar(data);
    } else if (selectedRole === 'recepcionista') {
      // Recepcionista no backend
      const payload = {
        nome: data.nome,
        matricula: data.matricula,
        turno: data.turno,
        id_dentista: 1,
        id_paciente: 1,
        data: new Date().toISOString().split('T')[0],
        procedimento: 'Cadastro de Recepção',
        status: 'Ativo',
        observação: 'Usuário de recepção cadastrado'
      };
      result = await ClinicaAPI.consultas.criar(payload);
    }

    if (result.success) {
      UI.toast(`Novo ${selectedRole} cadastrado com sucesso!`, 'success');
      feedback.innerHTML = `
        <div class="alert alert-success">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <strong>Cadastro realizado na API!</strong>
            <p style="margin-top:2px;">O registro de <strong>${data.nome}</strong> foi salvo no banco de dados.</p>
          </div>
        </div>
      `;
      form.reset();

      // Pergunta se deseja já entrar com o usuário cadastrado
      setTimeout(() => {
        UserSession.login(selectedRole, data.nome);
        UI.toast(`Redirecionando para o painel do ${selectedRole}...`, 'info', 2000);
        setTimeout(() => {
          if (selectedRole === 'paciente') window.location.href = 'paciente.html';
          else if (selectedRole === 'dentista') window.location.href = 'dentista.html';
          else window.location.href = 'recepcionista.html';
        }, 800);
      }, 1500);

    } else {
      feedback.innerHTML = `
        <div class="alert alert-danger">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong>Falha ao cadastrar na API</strong>
            <p style="margin-top:2px;">${result.error}</p>
          </div>
        </div>
      `;
      UI.toast('Erro ao cadastrar usuário na API. Verifique a conexão.', 'danger');
    }
  } catch (err) {
    feedback.innerHTML = `
      <div class="alert alert-danger">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <strong>Erro inesperado:</strong> ${err.message}
        </div>
      </div>
    `;
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = originalBtnHtml;
  }
}
