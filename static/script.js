let tempoRestante = 30; // Tempo por pergunta (em segundos)
let timer; // Variável para armazenar o temporizador
let indexPergunta = 0; // Índice da pergunta atual
const CIRCUNFERENCIA = 2 * Math.PI * 60; // Circunferência do círculo (r=60)
let perguntas = []; // 🔹 Armazena as perguntas globalmente
const gifCache = {}; // Guarda os objetos no cache pré-carregados.
let pontos = 0;
let tempoTotal = 30;

let acertos = parseInt(localStorage.getItem("acertosconsecutivos")) || 0;
let erros = parseInt(localStorage.getItem("errosconsecutivos")) || 0;
let skips = parseInt(localStorage.getItem("respostas_skip")) || 0;

const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000/perguntas"
    : "https://jogodochico.pythonanywhere.com/perguntas";



const gerarIdPessoa = () => {
    let idPessoa = localStorage.getItem("id_pessoa");

    if (!idPessoa) {
        let ultimoId = localStorage.getItem("ultimo_id_pessoa") || 0;
        idPessoa = parseInt(ultimoId) + 1;
        localStorage.setItem("id_pessoa", idPessoa);
        localStorage.setItem("ultimo_id_pessoa", idPessoa);
        console.log("Novo ID gerado:", idPessoa);
    } else {
        console.log("ID já existente:", idPessoa);
    }

    return idPessoa;
};

const irParaQuiz = async (categoria) => {
    try {
        const response = await fetch(`/perguntas/${categoria}`);
        const data = await response.json();

        if (data.erro) {
            console.error("Erro ao carregar perguntas:", data.erro);
            return;
        }  

        localStorage.setItem("perguntas", JSON.stringify(data)); // Salva as perguntas para uso no quiz
        localStorage.setItem("categoriaSelecionada", categoria);

        const selecaoMenu = new Audio("/static/audios/confirmou-opcao.mp3");
        selecaoMenu.play();

        setTimeout(() => {
            window.location.href = "quiz"; // Redireciona para a página do quiz
        }, 2000);
        
    } catch (error) {
        console.error("Erro na requisição de perguntas:", error);
    }
};

function irParaCategoria () {
    const selecionarjogar = new Audio('/static/audios/selecionou-jogar.mp3');
    selecionarjogar.playbackRate = 1
    selecionarjogar.play();
    setTimeout(() => {
        window.location.href = "categoria";
    }, 1000)
    

    
    

}

function irParaSelfie () {
    window.location.href = "selfie"

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
            let perguntasCarregadas = await response.json();
            console.log("Perguntas carregadas antes da randomização:", perguntasCarregadas);

            perguntasCarregadas = perguntasCarregadas.sort(() => Math.random() - 0.5);
            console.log("Perguntas embaralhadas:", perguntasCarregadas);
            return perguntasCarregadas;
            
        } catch (error) {
            console.error("Erro ao buscar perguntas:", error);
            return [];
        } 
}

async function exibirPergunta(index = 0) {
    if (!perguntas.length) {
        perguntas = await carregarPerguntas();
    }

    const perguntaAtual = perguntas[index];
    document.getElementById("perguntas").textContent = perguntaAtual.Pergunta;

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

    const timerpergunta = new Audio('/static/audios/cronometro-perguntas.mp3')
    timerpergunta.playbackRate = 0.5
    
    clearInterval(timer);
    tempoRestante = tempoTotal // Reinicia o tempo
    timerCircle.setAttribute("stroke-dasharray", CIRCUNFERENCIA);
    timerCircle.setAttribute("stroke-dashoffset", CIRCUNFERENCIA); 

    timerText.textContent = tempoRestante; // Atualiza o valor inicial na interface

    timer = setInterval(() => {
        if(tempoRestante <= 0) {
            clearInterval(timer);
            skips++
            localStorage.setItem("respostas_skip", skips);
            passarParaProximaPergunta();
            return
        }
        
    
        if(tempoRestante === 30) {
            changeFace("FalandoPequeno");
        }

        if(tempoRestante <= 10){
            changeFace("NervosoPequeno")
            timerpergunta.play();
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

function verificarResposta(opcaoSelecionada, respostaCorreta, index) {
    const opcoes = document.querySelectorAll("#options-response button");

    //sons
    const somcorrect = new Audio("/static/audios/opcao-correta.mp3");
    const somwrong = new Audio('/static/audios/opcao-incorreta.mp3')

    opcoes.forEach(opcao => {
        opcao.disabled = true;

        if (opcao.innerText === opcaoSelecionada) {
            if (opcaoSelecionada.slice(3) === respostaCorreta) {
                opcao.classList.add("correct");
                changeFace("FelizPequeno");
                acertos++;
                localStorage.setItem("acertosconsecutivos", acertos);

                somcorrect.play();
            } else {
                opcao.classList.add("wrong");
                changeFace("ChoroPequeno");
                erros++;
                localStorage.setItem("errosconsecutivos", erros);
                
                somwrong.play();
            }
        }
    });

    if (opcaoSelecionada.slice(3) === respostaCorreta) {
        pontos = Math.min(pontos + 20, 100);
    }

    localStorage.setItem("pontos", pontos);
    atualizarPontuacao();

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
        window.location.href = "/final_quiz";
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
    img.src = `/static/gifs/pequenos/${expression}.gif`;
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
        chico.src = `/static/gifs/pequenos/${expression}`;
    }
}

function finalizarQuiz() {
    salvarLog();
    localStorage.setItem("pontos", pontos); // Salva a pontuação
    window.location.href = "/final_quiz"; // Redireciona para a tela final
}

function salvarLog() {
    const idPessoa = localStorage.getItem("id_pessoa");
    let logs = JSON.parse(localStorage.getItem("logs")) || {};
    
    logs[idPessoa] = {
        acertos,
        erros,
        skips,
        horario: new Date().toISOString()
    };
    
    localStorage.setItem("logs", JSON.stringify(logs));
    console.log("Log atualizado:", logs);
}

const iniciarNovoJogo = () => {
    localStorage.removeItem("id_pessoa"); // Garante um novo jogador
    const idPessoa = gerarIdPessoa();

    acertos = 0;
    erros = 0;
    skips = 0;


    localStorage.setItem("acertosconsecutivos", acertos);
    localStorage.setItem("errosconsecutivos", erros);
    localStorage.setItem("respostas_skip", skips);
    
    console.log("Novo jogo iniciado para ID:", idPessoa);
    exibirPergunta();
};

function salvarfotosLog() {
    const idPessoa = localStorage.getItem("id_pessoa");
    let logs = JSON.parse(localStorage.getItem("logs")) || {};
    
    logs[idPessoa] = {
        horario: new Date().toISOString()
    };
    
    localStorage.setItem("logs", JSON.stringify(logs));
    console.log("Log atualizado:", logs);
}


const gifList = ["FelizPequeno", "FalandoPequeno", "ChoroPequeno", "BobeiraPequeno", "NervosoPequeno"];

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
        img.src = "/static/gifs/pequenos/BobeiraPequeno.gif";
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

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("telafinal.html")) {
        setTimeout(() => {
            window.location.href = "/";
        }, 15000); // 15 segundos
    }
});

window.addEventListener("beforeunload", () => {
    salvarLog();
});

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
