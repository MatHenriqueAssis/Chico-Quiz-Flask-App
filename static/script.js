let tempoRestante = 30; // Tempo por pergunta (em segundos)
let timer; // Variável para armazenar o temporizador
let indexPergunta = 0; // Índice da pergunta atual
const CIRCUNFERENCIA = 2 * Math.PI * 40; // Circunferência do círculo (r=40)
let perguntas = []; // 🔹 Armazena as perguntas globalmente
const gifCache = {}; // Guarda os objetos no cache pré-carregados.
let pontos = 0;


const irParaQuiz = async (categoria) => {

    localStorage.setItem("categoriaSelecionada", categoria);
    window.location.href = "quiz"

    await loadQuestion(categoria)
}

function irParaCategoria () {
    window.location.href = "categoria"

}

function irParaHome() {
    console.log("Botão de reinício clicado!"); // Para debug
    window.location.href = "/"; // Confirme se isso funciona no console do navegador
}


async function carregarPerguntas() {
    const categoria = localStorage.getItem("categoriaSelecionada");
    const urls = [
        "jogodochico.pythonanywhere.com",
        "http://127.0.0.1:5000/perguntas"
    ]

    try {
        const response = await fetch(`${urls}/${categoria}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar as perguntas");
        }
        const perguntas = await response.json();
        return perguntas;
    } catch (error) {
        console.error("Erro ao buscar perguntas:", error);
        return [];
    }

}

async function exibirPergunta(index = 0) {
    if (!perguntas.length) {
        perguntas = await carregarPerguntas();
    }

    if (index >= perguntas.length) {
        document.getElementById("quiz").innerHTML = "<h2>Quiz Finalizado</h2>";
        return;
    }

    const perguntaAtual = perguntas[index];
    document.getElementById("pergunta").textContent = perguntaAtual.Pergunta;

    const optionList = document.getElementById("options-response");
    optionList.innerHTML = ""; // Limpa as opções anteriores

    const opcoes = ["OpcaoA", "OpcaoB", "OpcaoC", "OpcaoD"];

    opcoes.forEach(opcao => {
        let button = document.createElement("button");
        button.classList.add("quiz-option");
        button.dataset.resposta = perguntaAtual[opcao]; // Armazena a resposta no dataset
        button.textContent = perguntaAtual[opcao];
        optionList.appendChild(button);
    });

    // Inicia o temporizador para a pergunta
    iniciarTemporizador();
}


function iniciarTemporizador() {
    let timerCircle = document.getElementById("timer-circle");
    let timerText = document.getElementById("timer-text");

    
    clearInterval(timer);
    tempoRestante = 30; // Reinicia o tempo
    timerCircle.style.strokeDasharray = CIRCUNFERENCIA;
    timerCircle.style.strokeDashoffset = "0";
    timerText.textContent = tempoRestante; // Atualiza o valor inicial na interface

    timer = setInterval(() => {
        if(tempoRestante <= 0) {
            clearInterval(timer);
            passarParaProximaPergunta();
            return
        }
        
    
        if(tempoRestante === 30) {
            changeFace("FalandoGif");
        }

        if(tempoRestante <= 20){
            changeFace("AnsiedadeGif")
        }

    let tempoTotal = tempoRestante;
        tempoRestante--;
        timerText.textContent = tempoRestante;

        let progresso = (tempoRestante / 30) * CIRCUNFERENCIA;
        timerCircle.style.strokeDashoffset = CIRCUNFERENCIA - progresso;

        atualizarCorFundo(tempoRestante, tempoTotal)
    }, 1000);
}

function verificarResposta(opcaoSelecionada, respostaCorreta,index) {
    const opcoes = document.querySelectorAll("#options-response button");

    
    opcoes.forEach(opcao => {
        opcao.disabled = true;
        if (opcao.innerText === respostaCorreta) {
            opcao.classList.add("correct"); // Destaca a resposta correta
        } 
        
        if (opcao.innerText === opcaoSelecionada && opcaoSelecionada !== respostaCorreta) {
            opcao.classList.add("wrong");
        }
    });

    // Adiciona pontos apenas se o usuário acertar
    if (opcaoSelecionada === respostaCorreta) {
        pontos = Math.min(pontos + 20, 100);
    }

    atualizarPontuacao();

    // Remove os efeitos após 1 segundo e carrega a próxima pergunta
    setTimeout(() => {
        opcoes.forEach(opcao => {
            opcao.classList.remove("correct", "wrong");
            opcao.disabled = false;
        });
        passarParaProximaPergunta();
    }, 1000);   
}

function tempoEsgotado() {
    passarParaProximaPergunta();
}

function atualizarPontuacao() {
    document.getElementById("pontuacao").textContent = `Pontos: ${pontos}`;
}

async function passarParaProximaPergunta() {
    clearInterval(timer)
    indexPergunta++;


    if (indexPergunta < perguntas.length) {
        exibirPergunta(indexPergunta);
    } else {
        document.getElementById("quiz").innerHTML = "<h2>Quiz Finalizado!</h2>";

        const restartButton = document.getElementById("restart");
        restartButton.style.display = "block";
    }
}

function atualizarCorFundo(tempoRestante) {
    let fundo = document.body;

    // Reseta a cor para verde quando inicia uma nova pergunta
    if (tempoRestante > 20) {
        fundo.style.backgroundColor = "rgb(43, 117, 26)"; // Verde inicial
        return;
    }

    let inicio = [43, 117, 26];  // Verde (#2b751a)
    let fim = [150, 20, 58];     // Vermelho escuro (#96143A)

    let progresso = (20 - tempoRestante) / 20; // De 0 a 1 nos últimos 10s

    let r = Math.floor(inicio[0] + (fim[0] - inicio[0]) * progresso);
    let g = Math.floor(inicio[1] + (fim[1] - inicio[1]) * progresso);
    let b = Math.floor(inicio[2] + (fim[2] - inicio[2]) * progresso);

    fundo.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function preloadGif(expression, callback) {
    if(typeof callback !== "function") callback = () => {}
    if(!gifCache[expression]) {
            callback();
        }
    const img = new Image();
    img.src = `../static/gifs/${expression}.gif`;
    img.onload = () => {
        gifCache[expression] = img;
        callback();
    }        
}

function changeFace(expression) {
    const chico = document.getElementById("Character");
    if (!chico) {
        console.error("Elemento #Character não encontrado!");
        return;
    }

    if(gifCache[expression]) {
        chico.src = gifCache[expression].src;
    } else {
        console.warn(`GIF ${expression} ainda não carregado!`);
        chico.src = `../static/gifs/${expression}.gif`;
    }
}

const gifList = ["FalandoGif", "AnsiedadeGif", "CoraçãoGif", "ThuglifeGif"];

// Pré-carregar todos os GIFs
gifList.forEach(expression => preloadGif(expression));


// Evento de clique nos botões (Event Delegation)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#options-response").addEventListener("click", function (event) {
        const botaoSelecionado = event.target.closest("button"); // Garante que pegamos um botão
        if (!botaoSelecionado) return;

        const perguntaAtual = perguntas[indexPergunta];
        verificarResposta(botaoSelecionado.textContent, perguntaAtual.RespostaCorreta);
    });
});

//DomContentLoaded para encontrar o chico e renderizar o gif
document.addEventListener("DOMContentLoaded", () => {
    const chico = document.getElementById("Character");

    if(chico) {
        const img = new Image();
        img.src = "./gifs/InicioGif.gif";
        img.onload = () => {
            chico.src = img.src
        }
    }
})


//DomContentLoaded para preload
document.addEventListener("DOMContentLoaded", async () => {
    
    try {
        await Promise.all(gifList.map(expression =>{
            return new Promise(resolve => preloadGif(expression, resolve));
        }));
        console.log("Todos os gifs carregados");
        exibirPergunta();
    } catch (error) {
        console.log("Os gifs não foram carregados corretamente.", error)    
    }
    
});

document.addEventListener("DOMContentLoaded", function () {
    const restartButton = document.getElementById("restart");

    if(restartButton) {
        restartButton.addEventListener("click", irParaHome);
    }
    else{
        console.log("ERROOOOOOOOO")
    }
})

document.addEventListener("keydown", function(event) {
    const quizopcoes = document.querySelectorAll("#options-response button");
    const categoriaopcoes = document.querySelectorAll(".option-response");

    const opcoes = [...quizopcoes, ...categoriaopcoes];
    
    if(!opcoes.length) return;
    
    const keyoptions = ["a", "b", "c", "d", "r"];
    const index = keyoptions.indexOf(event.key);

    if(index !== -1 && opcoes[index]) {
        opcoes[index].click();
    }

    if(event.key === "r") {
        irParaHome();
    }
})