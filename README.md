#  Clínica Odontológica Sorriso Claro

> Sistema Integrado de Gestão Odontológica — Aplicação Web Multipage conectada à API REST Spring Boot.

---

##  1. História da Clínica Odontológica "Sorriso Claro"

A **Sorriso Claro** nasceu como uma acolhedora clínica odontológica de bairro com o propósito de humanizar o atendimento odontológico, oferecendo tratamentos acessíveis, preventivos e de alta qualidade técnica para a comunidade.

Nos últimos dois anos, a clínica experimentou um crescimento expressivo:
- O corpo clínico expandiu para **três cirurgiões-dentistas especialistas** (Clínica Geral, Ortodontia e Endodontia).
- A recepção passou a contar com **duas recepcionistas dedicadas** para acolhimento e agendamento.
- A base de pacientes ativos saltou de poucas dezenas para centenas de famílias atendidas.

### O Desafio Operacional
Até então, todo o controle da clínica era mantido em **fichas de papel arquivadas em pastas físicas** e em uma **planilha compartilhada**. Esse modelo gerava graves gargalos no dia a dia:
1. **Conflitos de edição:** Recepcionistas e dentistas tentavam atualizar a planilha simultaneamente, gerando perda de registros de consultas.
2. **Duplicidade de cadastros:** Pacientes eram cadastrados mais de uma vez com grafias diferentes.
3. **Perda de histórico clínico:** Ao remarcar procedimentos, os horários anteriores sumiam, impossibilitando o rastreamento da evolução do tratamento.
4. **Risco no atendimento:** Dentistas tinham dificuldade para checar rapidamente alergias a anestésicos locais antes de anestesiar um paciente na cadeira.

### A Transformação Digital
Para solucionar esses desafios, foi desenvolvido este sistema completo: uma **API REST robusta em Spring Boot** integrada a uma **interface web multipage moderna, fluida e intuitiva**, desenvolvida com HTML semântico, CSS  e JavaScript puro para transições e reatividade instantânea.

---

## 🏛️ 2. Arquitetura da Aplicação Multipage

O frontend está localizado diretamente em `src/main/resources/static/`, dividindo as jornadas de uso em **4 páginas especializadas**:

```
├── src/main/resources/static/
│   ├── index.html           # Página 1: Login Sem Validação & Cadastro Multi-Perfil
│   ├── paciente.html        # Página 2: Portal do Paciente (Consultas & Meus Dados)
│   ├── dentista.html        # Página 3: Painel do Dentista (Consultório & Prontuário)
│   ├── recepcionista.html   # Página 4: Recepção & Central de Agendamentos (CRUD Geral)
│   ├── css/
│   │   └── style.css        # Sistema de Design em Tons de Azul, Modais, Skeletons e Toasts
│   └── js/
│       ├── api.js           # Cliente HTTP central e mapeamento dos endpoints da API
│       ├── ui.js            # Utilitários de interface: Toasts, Modais, Skeletons e Formatadores
│       ├── login.js         # Controle da seleção de perfil e cadastro
│       ├── paciente.js      # Lógica e reatividade do portal do paciente
│       ├── dentista.js      # Lógica clínica, agenda do dia e prontuário com alertas
│       └── recepcionista.js # Lógica de agendamento, remarcação e gestão geral
```

### Detalhamento das 4 Páginas:

1. **Página 1: Acesso & Cadastro (`index.html`)**
   - **Login sem validação:** Permite selecionar com um clique se você é **Paciente**, **Dentista** ou **Recepcionista** e entrar imediatamente no sistema.
   - **Criar Novo Usuário:** Formulário dinâmico que permite cadastrar novos usuários para qualquer um dos 3 papéis diretamente no banco de dados da API.
2. **Página 2: Portal do Paciente (`paciente.html`)**
   - Visualização da próxima consulta e histórico completo de atendimentos.
   - Agendamento autônomo de novas consultas com escolha de dentista e procedimento.
   - Cancelamento de horários com liberação em tempo real na clínica.
   - Consulta e atualização dos dados cadastrais (telefone, convênio e queixas clínicas).
3. **Página 3: Painel do Dentista (`dentista.html`)**
   - Grade de atendimentos do dia com horários e procedimentos.
   - **Verificação rápida de alertas clínicos:** Destaque visual imediato para alergias a medicamentos (penicilina, dipirona, anestésicos com vasoconstritor) ou condições como hipertensão.
   - Modal de evolução clínica para registrar o procedimento executado e marcar a consulta como "Concluída".
4. **Página 4: Recepção & Central de Agendamentos (`recepcionista.html`)**
   - **CRUD completo de Consultas:** Agendamento, remarcação de datas, alteração de status e exclusão com diálogo de confirmação.
   - **CRUD completo de Pacientes:** Cadastro de novos pacientes na chegada à clínica, atualização de telefone/convênio e exclusão com proteção.
   - Filtros dinâmicos por status (Agendadas, Concluídas, Canceladas) e busca instantânea por nome ou CPF.

---

## 3. Padrões de Design UI/UX (Tons de Azul Odontológico)

A identidade visual foi construída com foco na **tranquilidade, limpeza, confiança e acessibilidade**:
- **Azul Clínico Profissional (`#0369a1` / `#0284c7`):** Transmite estabilidade, higiene e seriedade médica.
- **Azul Celeste Suave (`#e0f2fe` / `#f0f9ff`):** Fundos arejados e confortáveis para leitura prolongada.
- **Slate Escuro (`#0f172a` / `#1e293b`):** Tipografia de alto contraste sem cansar a visão.
- **Alertas de Segurança:** Âmbar suave (`#d97706`) para alergias do paciente e Esmeralda (`#059669`) para confirmações de sucesso.
- **Zero Roxo:** Regra de design estrita aplicada (sem tons violetas/púrpuras).

---


##  4. Mapeamento com a API Spring Boot

A camada de serviço (`src/main/resources/static/js/api.js`) mapeia as rotas REST dos controllers em `src/main`:

| Funcionalidade | Método HTTP | Rota API | Entidade Backend |
|---|---|---|---|
| Listar Pacientes / Fichas | `GET` | `/api/dentista` | `Dentista.java` (campos: CPF, Convênio, Alergias) |
| Cadastrar Paciente | `POST` | `/api/dentista` | `Dentista.java` |
| Atualizar Paciente | `PUT` | `/api/dentista/{id}` | `Dentista.java` |
| Excluir Paciente | `DELETE` | `/api/dentista/{id}` | `Dentista.java` |
| Listar Dentistas | `GET` | `/api/paciente` | `Paciente.java` (campos: CRO, Especialidade) |
| Cadastrar Dentista | `POST` | `/api/paciente` | `Paciente.java` |
| Listar Consultas / Recepção | `GET` | `/api/recepcionista` | `Recepcionista.java` |
| Agendar Consulta | `POST` | `/api/recepcionista` | `Recepcionista.java` |
| Atualizar / Evoluir Consulta | `PUT` | `/api/recepcionista/{id}` | `Recepcionista.java` |
| Excluir Consulta | `DELETE` | `/api/recepcionista/{id}` | `Recepcionista.java` |

---

##  6. Como Instalar e Rodar no Computador

### Pré-requisitos
- **Java JDK:** Versão 17, 21 ou 25 instalada no sistema (`java -version`).
- **MySQL Server:** Em execução na porta padrão `3306`.
- **Navegador Web:** Google Chrome, Microsoft Edge, Mozilla Firefox ou Safari.

---

### Passo 1: Configurar o Banco de Dados MySQL
Abra o seu terminal MySQL ou ferramenta gráfica (MySQL Workbench / DBeaver) e crie o banco de dados:

```sql
CREATE DATABASE Dentista;
```

> **Nota de Configuração:**
> O arquivo `src/main/resources/application.properties` está configurado com:
> ```properties
> spring.datasource.url=jdbc:mysql://localhost:3306/Dentista
> spring.datasource.username=example_user
> spring.datasource.password=password
> spring.jpa.hibernate.ddl-auto=update
> ```
> Caso seu MySQL local utilize outro usuário ou senha (por exemplo, `root`), ajuste essas linhas no `application.properties`.

---

### Passo 2: Executar o Backend Spring Boot
No diretório raiz do projeto (`senai`), execute o Maven Wrapper:

**No Linux **
```bash
./mvnw clean spring-boot:run
```

**No Windows :**
```cmd
mvnw.cmd clean spring-boot:run
```

O Spring Boot inicializará o servidor na porta **8080**. As tabelas serão criadas automaticamente no MySQL pelo Hibernate (`ddl-auto=update`).

---

### Passo 3: Acessar o Frontend

Graças à integração com os recursos estáticos do Spring Boot (`src/main/resources/static/`), você pode acessar:

#### Forma 1 (Recomendada):
Com o Spring Boot rodando, abra o seu navegador e acesse diretamente:
```
http://localhost:8080
```
*(ou `http://localhost:8080/index.html`)*


---

## 🧪 7. Roteiro Rápido de Testes

1. **Acesso e Seleção de Perfil:**
   - Acesse `http://localhost:8080`.
   - Escolha o perfil **Recepção** e clique em **Entrar no Sistema**.
2. **Cadastro de Novo Paciente:**
   - Na página da recepção, clique no botão **+ Cadastrar Paciente**.
   - Preencha o nome (ex: *"Carlos Eduardo"*), CPF, telefone e adicione uma observação clínica (ex: *"Alergia severa a penicilina"*).
   - Clique em salvar e confirme o toast de sucesso.
3. **Agendamento de Consulta:**
   - Clique em **+ Agendar Consulta** ou clique no botão **Agendar** na linha do paciente cadastrado.
   - Selecione o dentista, o procedimento (*"Limpeza / Profilaxia"*) e a data.
   - Salve e veja o novo agendamento surgir instantaneamente na tabela sem recarregar a tela.
4. **Visão do Dentista:**
   - Acesse o link **Painel do Dentista** no menu superior.
   - Localize o atendimento na grade do dia. Observe o badge em destaque **⚠ Alerta de Alergia Registrada**.
   - Clique em **Ficha** para visualizar o prontuário rápido.
   - Clique em **Evoluir**, adicione as anotações do procedimento, altere para **Concluída** e salve.
5. **Visão do Paciente:**
   - Acesse **Área do Paciente** no menu superior.
   - Visualize a sua consulta, agende novas visitas ou atualize seus dados de telefone e convênio.

---

## 👥 Equipe e Créditos

