const emailAdmin = "igor.menezes20111@gmail.com";
function usuarioEhAdmin() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAtual"));

    return usuario && usuario.email.toLowerCase() === emailAdmin.toLowerCase();
}

const botao = document.getElementById("VerReceita");
const fundoModal = document.getElementById("fundoModal");

botao.addEventListener("click", function () {

    fundoModal.style.display = "block";

});

fundoModal.addEventListener("click", function (event) {

    if (event.target === fundoModal) {
        fundoModal.style.display = "none";
    }

});

const publicarReceita = document.getElementById("PublicarReceita");

const areaPublicar = document.getElementById("areaPublicar");

publicarReceita.addEventListener("click", function (event) {

    event.preventDefault();

    const estaLogado = localStorage.getItem("usuarioLogado");

    const usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual"));

    if (estaLogado !== "true" || !usuarioAtual) {

        alert("Você precisa entrar para publicar uma receita!");

        return;
    }

    areaPublicar.style.display = "block";

    areaLogin.style.display = "none";
    

});
const botaoPublicar = document.getElementById("botaoPublicar");

botaoPublicar.addEventListener("click", function () {

    let receitas = JSON.parse(localStorage.getItem("receitas")) || [];

    const nomeReceita = document.getElementById("nomeReceita").value;

    const usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual"));

    usuarioAtual.nome

    const ingredientes = document.getElementById("ingredientes").value;

    const modoPreparo = document.getElementById("modoPreparo").value;

    if (nomeReceita === "" || ingredientes === "" || modoPreparo === "") {

        alert("Preencha todos os campos da receita!");

        return;
    }

    if (nomeReceita.length < 3) {
        alert("O nome da receita precisa ter pelo menos 3 caracteres!");
        return;
    }

    const novaReceita = {
        nome: nomeReceita,
        autor: usuarioAtual.nome,
        ingredientes: ingredientes,
        modoPreparo: modoPreparo
    };

    const fotoInput = document.getElementById("fotoReceita");

    const foto = fotoInput.files[0];

    if (!foto) {

        alert("Escolha uma foto para a receita!");

        return;
    }

    if (!foto.type.startsWith("image/")) {
        alert("Escolha um arquivo de imagem!");
        return;
    }

    if (foto.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2 MB!");
        return;
    }

    receitas.push(novaReceita);

    const leitor = new FileReader();

    leitor.onload = function () {

        novaReceita.foto = leitor.result;

        localStorage.setItem("receitas", JSON.stringify(receitas));

    };

    leitor.readAsDataURL(foto);


    const fotoURL = URL.createObjectURL(foto);

    const novoCard = document.createElement("div");

    novoCard.classList.add("card");

    novoCard.innerHTML = `
    
    <img src="${fotoURL}" alt="${nomeReceita}">
    <h4>${nomeReceita}</h4>
    <p>por ${usuarioAtual.nome}</p>
    <p class="avaliacao">⭐ Ainda não avaliado</p>
    <button class="botaoAvaliar">Avaliar Receita</button>
    <button class="botaoVerReceita">Ver Receita</button>
    
`;

const botaoAvaliarNovo = novoCard.querySelector(".botaoAvaliar");


botaoAvaliarNovo.addEventListener("click", function () {

const nota = prompt("Dê uma nota de 1 a 5 para esta receita:");

if (nota === null) {
    return;
}

if (nota === "") {
    alert("Digite uma nota!");
    return;
}
if (isNaN(nota)) {
    alert("Digite apenas números!");
    return;
}

if (nota < 1 || nota > 5) {
    alert("Digite uma nota entre 1 e 5!");
    return;
}
    const avaliacaoNova = novoCard.querySelector(".avaliacao");

    avaliacaoNova.textContent = "⭐ " + Number(nota).toFixed(1);

    localStorage.setItem("nota_" + nomeReceita, nota);

    });

   const botaoVerNovaReceita = novoCard.querySelector(".botaoVerReceita");

    botaoVerNovaReceita.addEventListener("click", function () {

        document.getElementById("tituloModal").textContent = nomeReceita;

        document.getElementById("autorModal").textContent = "por " + usuarioAtual.nome;

        document.getElementById("ingredientesModal").innerHTML =
            ingredientes.split(",").map(function (ingrediente) {
                return `<li>${ingrediente.trim()}</li>`;
            }).join("");

        document.getElementById("modoPreparoModal").textContent = modoPreparo;

        fundoModal.style.display = "block";

    });
    const grade = document.querySelector(".grade");

    grade.appendChild(novoCard);

    document.getElementById("nomeReceita").value = "";
    document.getElementById("ingredientes").value = "";
    document.getElementById("modoPreparo").value = "";
    document.getElementById("fotoReceita").value = "";

    areaPublicar.style.display = "none";



}
);
const receitasSalvas = localStorage.getItem("receitas");

const receitas = JSON.parse(receitasSalvas) || [];

console.log(receitas.map(receita => receita.nome));

receitas.forEach(function (receita) {

    const cardSalvo = document.createElement("div");

    cardSalvo.classList.add("card");

    cardSalvo.innerHTML = `
        <img src="${receita.foto}" alt="${receita.nome}">
        <h4>${receita.nome}</h4>
        <p>por ${receita.autor || "Autor não informado"}</p>
        <p class="avaliacao">⭐ Ainda não avaliado</p>
        <button class="botaoAvaliar">Avaliar Receita</button>
       <button class="botaoVerReceita">Ver Receita</button>
    `;

    if (usuarioEhAdmin()) {
    const botaoExcluir = document.createElement("button");

    botaoExcluir.textContent = "Excluir Receita";
    botaoExcluir.classList.add("botaoExcluir");

    cardSalvo.appendChild(botaoExcluir);

    botaoExcluir.addEventListener("click", function () {

    const confirmar = confirm("Tem certeza que deseja excluir esta receita?");

    if (!confirmar) {
        return;
    }

    let receitas = JSON.parse(localStorage.getItem("receitas")) || [];

receitas = receitas.filter(function(item) {
    return item.nome !== receita.nome;
});

localStorage.setItem("receitas", JSON.stringify(receitas));

cardSalvo.remove();

});

}

    const botaoCardSalvo = cardSalvo.querySelector(".botaoVerReceita");

    const botaoAvaliarSalvo = cardSalvo.querySelector(".botaoAvaliar");

    botaoAvaliarSalvo.addEventListener("click", function () {

        const nota = prompt("Dê uma nota de 1 a 5 para esta receita:");

        if (nota === null) {
    return;
}
if (nota === "") {
    alert("Digite uma nota!");
    return;
}
if (isNaN(nota)) {
    alert("Digite apenas números!");
    return;
}
if (nota < 1 || nota > 5) {
    alert("Digite uma nota entre 1 e 5!");
    return;
}
const avaliacaoSalva = cardSalvo.querySelector(".avaliacao");

avaliacaoSalva.textContent = "⭐ " + Number(nota).toFixed(1);

localStorage.setItem("nota_" + receita.nome, nota);

});

    botaoCardSalvo.addEventListener("click", function () {

        document.getElementById("tituloModal").textContent = receita.nome;

        document.getElementById("autorModal").textContent =
            "por " + (receita.autor || "Autor não informado");

        document.getElementById("ingredientesModal").innerHTML =
            receita.ingredientes.split(",").map(function (ingrediente) {
                return `<li>${ingrediente.trim()}</li>`;
            }).join("");

        document.getElementById("modoPreparoModal").textContent = receita.modoPreparo;

        fundoModal.style.display = "block";

    });

    const gradeSalva = document.querySelector(".grade");

    gradeSalva.appendChild(cardSalvo);

});

const campoPesquisa = document.getElementById("campoPesquisa");

const botaoPesquisa = document.getElementById("botaoPesquisa");

botaoPesquisa.addEventListener("click", function () {

    const textoPesquisa = campoPesquisa.value;

    const cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {

        const nomeCard = card.querySelector("h4").textContent;

        const autorCard = card.querySelector("p").textContent;

        if (
            nomeCard.toLowerCase().includes(textoPesquisa.toLowerCase()) ||
            autorCard.toLowerCase().includes(textoPesquisa.toLowerCase())
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

const botaoEntrar = document.getElementById("botaoEntrar");

const areaLogin = document.getElementById("areaLogin");

botaoEntrar.addEventListener("click", function (event) {

    event.preventDefault();

    areaLogin.style.display = "block";

    areaPublicar.style.display = "none";

    areaLogin.scrollIntoView({ behavior: "smooth" });

});
const entrarLogin = document.getElementById("entrarLogin");

entrarLogin.addEventListener("click", function () {

    const email = document.getElementById("emailLogin").value.toLowerCase();

    const senha = document.getElementById("senhaLogin").value;

    if (email === "" || senha === "") {

        alert("Preencha o email e a senha!");

        return;

    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioSalvo = usuarios.find(function (usuario) {
        return usuario.email.toLowerCase() === email;
    });

    if (usuarioSalvo && usuarioSalvo.senha === senha) {

        alert("Login realizado com sucesso!");

        areaLogin.style.display = "none";

        const nomeUsuario = usuarioSalvo.nome;

        localStorage.setItem("usuarioLogado", "true");

        localStorage.setItem("usuarioAtual", JSON.stringify(usuarioSalvo));

        document.getElementById("usuarioLogado").textContent = "Olá, " + nomeUsuario + " 👋";

        document.getElementById("botaoSair").style.display = "block";

        botaoEntrar.style.display = "none";

        document.getElementById("emailLogin").value = "";

        document.getElementById("senhaLogin").value = "";

    }



    else {

        alert("Email ou senha incorretos!");

    }

});

const botaoCadastro = document.getElementById("botaoCadastro");

const areaCadastro = document.getElementById("areaCadastro");

botaoCadastro.addEventListener("click", function () {

    areaCadastro.style.display = "block";

    areaLogin.style.display = "none";

    areaPublicar.style.display = "none";

});

const criarConta = document.getElementById("criarConta");

criarConta.addEventListener("click", function () {

    const nome = document.getElementById("nomeCadastro").value;

    const emailCadastro = document.getElementById("emailCadastro").value.toLowerCase();

    const senhaCadastro = document.getElementById("senhaCadastro").value;

    if (nome === "" || emailCadastro === "" || senhaCadastro === "") {

        alert("Preencha todos os campos do cadastro!");

        return;


    }

    if (nome.length < 3) {
        alert("O nome precisa ter pelo menos 3 caracteres!");
        return;
    }

    if (senhaCadastro.length < 6) {
        alert("A senha precisa ter pelo menos 6 caracteres!");
        return;
    }

    if (!emailCadastro.includes("@")) {
        alert("Digite um email válido!");
        return;
    }

    const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioExistente = usuariosCadastrados.find(function (usuario) {
        return usuario.email.toLowerCase() === emailCadastro;
    });

    if (usuarioExistente) {

        alert("Este email já está cadastrado!");

        return;
    }

    const usuario = {
        nome: nome,
        email: emailCadastro,
        senha: senhaCadastro
    };

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Conta criada com sucesso!");

    areaCadastro.style.display = "none";

    areaLogin.style.display = "block";

    document.getElementById("nomeCadastro").value = "";

    document.getElementById("emailCadastro").value = "";

    document.getElementById("senhaCadastro").value = "";

});


const loginSalvo = localStorage.getItem("usuarioLogado");

const usuarioSalvoPagina = JSON.parse(localStorage.getItem("usuarioAtual"));

if (loginSalvo === "true" && usuarioSalvoPagina) {


    document.getElementById("usuarioLogado").textContent =
        "Olá, " + usuarioSalvoPagina.nome + " 👋";

    document.getElementById("botaoSair").style.display = "block";

    botaoEntrar.style.display = "none";

}

const botaoSair = document.getElementById("botaoSair");

botaoSair.addEventListener("click", function () {

    localStorage.setItem("usuarioLogado", "false");

    localStorage.removeItem("usuarioAtual");

    document.getElementById("usuarioLogado").textContent = "";

    botaoSair.style.display = "none";

    botaoEntrar.style.display = "block";


});

const fecharPublicar = document.getElementById("fecharPublicar");

fecharPublicar.addEventListener("click", function () {

    areaPublicar.style.display = "none";

});

campoPesquisa.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        botaoPesquisa.click();

    }

});

const botoesAvaliar = document.querySelectorAll(".botaoAvaliar");

botoesAvaliar.forEach(function (botaoAvaliar) {

    const card = botaoAvaliar.closest(".card");
    const avaliacao = card.querySelector(".avaliacao");
    const nomeReceita = card.querySelector("h4").textContent;
    const notaSalva = localStorage.getItem("nota_" + nomeReceita);

    if (notaSalva) {
        avaliacao.textContent = "⭐ " + Number(notaSalva).toFixed(1);
    }

});
