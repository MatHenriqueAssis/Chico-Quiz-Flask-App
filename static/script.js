let tempoRestante = 30; // Tempo por pergunta (em segundos)
let timer; // Variável para armazenar o temporizador
let indexPergunta = 0; // Índice da pergunta atual
const CIRCUNFERENCIA = 2 * Math.PI * 60; // Circunferência do círculo (r=60)
let perguntas = []; // 🔹 Armazena as perguntas globalmente
const gifCache = {}; // Guarda os objetos no cache pré-carregados.
let pontos = 0;
let tempoTotal = 30;


const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000/perguntas"
    : "https://jogodochico.pythonanywhere.com/perguntas";


const irParaQuiz = async (categoria) => {

    localStorage.setItem("categoriaSelecionada", categoria);
    window.location.href = "quiz"
    

    await loadQuestion(categoria)
}

function irParaCategoria () {
    window.location.href = "categoria"

}

function irParaHome() {
    console.log("Botão de reinício clicado!"); 
    window.location.href = "/"; 
}


async function carregarPerguntas() {
    const categoria = localStorage.getItem("categoriaSelecionada");
       try {
            const response = await fetch(`${API_BASE_URL}/${categoria}`);
            if (!response.ok) {
                throw new Error("Erro ao carregar as perguntas");
            }
              return await response.json();
            
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
    const letras = ["A", "B", "C", "D"];

    opcoes.forEach((opcao, i) => {
        let button = document.createElement("button");
        button.classList.add("quiz-option");
        button.dataset.resposta = perguntaAtual[opcao]; // Armazena a resposta no dataset
        button.textContent = `${letras[i]}. ${perguntaAtual[opcao]}`;
        optionList.appendChild(button);
    });

    // Inicia o temporizador para a pergunta
    iniciarTemporizador();
}


function iniciarTemporizador() {
    let timerCircle = document.getElementById("timer-circle");
    let timerText = document.getElementById("timer-text");

    
    clearInterval(timer);
    tempoRestante = tempoTotal // Reinicia o tempo
    timerCircle.setAttribute("stroke-dasharray", CIRCUNFERENCIA);
    timerCircle.setAttribute("stroke-dashoffset", CIRCUNFERENCIA); 

    timerText.textContent = tempoRestante; // Atualiza o valor inicial na interface

    timer = setInterval(() => {
        if(tempoRestante <= 0) {
            clearInterval(timer);
            passarParaProximaPergunta();
            return
        }
        
    
        if(tempoRestante === 30) {
            changeFace("FalandoPequeno");
        }

        if(tempoRestante <= 10){
            changeFace("NervosoPequeno")
        }

        let progresso =  CIRCUNFERENCIA * (tempoRestante / tempoTotal);
        requestAnimationFrame(() => {
            timerCircle.style.strokeDashoffset = progresso.toFixed(2);
        });

        timerText.textContent = tempoRestante;
        tempoRestante--;
        atualizarCorFundo(tempoRestante, tempoTotal)
    }, 1000);
}

function verificarResposta(opcaoSelecionada, respostaCorreta,index) {
    const opcoes = document.querySelectorAll("#options-response button");



    opcoes.forEach(opcao => {
        opcao.disabled = true;

        // Se a opção selecionada for errada, apenas ela será destacada
        if (opcao.innerText === opcaoSelecionada) {
            if (opcaoSelecionada === respostaCorreta) {
                opcao.classList.add("correct");
                changeFace("FelizPequeno");
            } else {
                opcao.classList.add("wrong");
                changeFace("choroPequeno");
            }
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
    }, 2000);   
}

function tempoEsgotado() {
    passarParaProximaPergunta();
}

function atualizarPontuacao() {
    document.getElementById("pontuacao").textContent = `Pontos: ${pontos}/100`;
}

async function passarParaProximaPergunta() {
    clearInterval(timer)
    indexPergunta++;


    if (indexPergunta < perguntas.length) {
        exibirPergunta(indexPergunta);
    } else {
        document.getElementById("quiz").innerHTML = "<h2>Quiz Finalizado!</h2>";
        
        window.location.href = "/final_quiz";
        const restartButton = document.getElementById("restart");
        telafinal();
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
    img.src = `../static/gifs/pequenos${expression}.gif`;
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
        chico.src = `../static/gifs/pequenos/${expression}.gif`;
    }
}

function telafinal() {
    // Esconder qualquer GIF anterior
    document.getElementById("chico-img").style.display = "none";

    // Mostrar apenas o GIF final correspondente à pontuação
    setTimeout(() => {
        document.getElementById("chico-img").style.display = "block";
        if (pontos <= 40) {
            changeFace("ChoroPequeno");
        } else if (pontos <= 80) {
            changeFace("BobeiraPequeno");
        } else if (pontos === 100) {
            changeFace("FelizPequeno");
        }
    }, 100); // Pequeno delay para garantir a atualização
}
const gifList = ["FelizPequeno", "FalandoPequeno", "ChoroPequeno", "BobeiraPequeno"];

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
        img.src = "./gifs/pequenos/BobeiraPequeno.gif.gif";
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

document.addEventListener("DOMContentLoaded", function () 
{
    const restartButton = document.getElementById("restart");
    let timerCircle = document.getElementById("timer-circle")

    if(restartButton) {
        restartButton.addEventListener("click", irParaHome);
        document.addEventListener("keydown", function (event) {
            switch (event.key) {
                case "r":
                    irParaHome();
                    break
            }
        })
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
    
    switch (event.key.toLowerCase()) {
        case "a":
            if (opcoes[0]) opcoes[0].click();
            break;
        case "q":
            if (opcoes[0]) opcoes[0].click();
            break;
        case "b":
            if (opcoes[1]) opcoes[1].click();
            break;
        case "w":
            if (opcoes[1]) opcoes[1].click();
            break;
        case "c":
            if (opcoes[2]) opcoes[2].click();
            break;
        case "e":
            if (opcoes[2]) opcoes[2].click();
            break;
        case "d":
            if (opcoes[3]) opcoes[3].click();
            break;
        case "t":
            if (opcoes[3]) opcoes[3].click();
            break;
        case "r":
            irParaHome();
            break;
        default:
            break;
    }
});
