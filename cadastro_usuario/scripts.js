// Seleciona o formulário e os campos
const form = document.getElementById("cadastroForm");
const cepInput = document.getElementById("cep");
const ruaInput = document.getElementById("rua");
const bairroInput = document.getElementById("bairro");
const cidadeInput = document.getElementById("cidade");
const estadoInput = document.getElementById("estado");

// Função para buscar endereço pelo CEP usando ViaCEP
async function buscarEndereco(cep) {
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!resposta.ok) throw new Error("Erro ao buscar o CEP");

    const dados = await resposta.json();
    if (dados.erro) {
      alert("CEP não encontrado!");
      return;
    }

    // Preenche os campos com os dados do ViaCEP
    ruaInput.value = dados.logradouro || "";
    bairroInput.value = dados.bairro || "";
    cidadeInput.value = dados.localidade || "";
    estadoInput.value = dados.uf || "";

    salvarDados(); // já salva os dados
  } catch (erro) {
    console.error("Erro:", erro);
  }
}

// Evento: quando o usuário digitar o CEP (saindo do campo)
cepInput.addEventListener("blur", () => {
  const cep = cepInput.value.replace(/\D/g, ""); // remove não números
  if (cep.length === 8) {
    buscarEndereco(cep);
  } else {
    alert("CEP inválido!");
  }
});

// Função para salvar dados no localStorage
function salvarDados() {
  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    cep: cepInput.value,
    rua: ruaInput.value,
    bairro: bairroInput.value,
    cidade: cidadeInput.value,
    estado: estadoInput.value,
  };

  localStorage.setItem("formCadastro", JSON.stringify(dados));
}

// Função para restaurar os dados do localStorage
function restaurarDados() {
  const dadosSalvos = localStorage.getItem("formCadastro");
  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos);
    document.getElementById("nome").value = dados.nome || "";
    document.getElementById("email").value = dados.email || "";
    cepInput.value = dados.cep || "";
    ruaInput.value = dados.rua || "";
    bairroInput.value = dados.bairro || "";
    cidadeInput.value = dados.cidade || "";
    estadoInput.value = dados.estado || "";
  }
}

// Evento: salvar os dados sempre que algo for digitado
form.addEventListener("input", salvarDados);

// Evento: restaurar dados ao carregar a página
window.addEventListener("DOMContentLoaded", restaurarDados);

// Evento: submit só confirma (os dados já estão salvos)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Dados salvos com sucesso!");
});