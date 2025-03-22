document.addEventListener("DOMContentLoaded", function () {
    // Recupera a pontuação do localStorage
    const pontuacao = parseInt(localStorage.getItem("pontos")) || 0;
    console.log("Pontuação recuperada:", pontuacao); // 🔍 Log para verificar a pontuação
    const mensagem = document.getElementById("mensagem");
    const mensagem2 = document.getElementById("mensagem2")
    const mensagemTitulo = document.getElementById("mensagemTitulo");
    const gif = document.getElementById("gifResultado");
    const parabens = new Audio("/static/audios/Parabens-acertou.mp3");

    // Define mensagens e GIFs baseados na pontuação
    if (pontuacao === 100) {
        mensagemTitulo.innerText = `Parabéns, você fez ${pontuacao} pontos!`
        mensagemTitulo.classList.add('linear-green')
        mensagem.innerText = "O chico ficou apaixonado pelo seu desempenho! S2";
        mensagem2.innerText = "Espero que você tenha se divertido <3"
        gif.src = "/static/gifs/grandes/CoracaoGrande.gif";
        parabens.play();
    } else if (pontuacao > 40 && pontuacao <= 80) {
        mensagemTitulo.innerText = `Muito bem, você fez ${pontuacao} pontos!`
        mensagemTitulo.classList.add('linear-orange')
        mensagem.innerText = "O chico está feliz, mas ele está torcendo para você acertar todas da próxima vez";
        mensagem2.innerText = "Espero que você tenha se divertido"
        gif.src = "/static/gifs/grandes/ThugLifeGrande.gif";
        parabens.play();
    } else{
        mensagemTitulo.innerText = `Que pena, você fez ${pontuacao}`;
        mensagemTitulo.classList.add('linear-red')
        mensagem.innerText = "O Chico está triste, mas ele acredita no seu potencial!"
        mensagem2.innerText = "Vamos jogar novamente :D";
        gif.src = "/static/gifs/grandes/DeBobeiraGrande.gif";
        parabens.play();
    }

    setTimeout(() => {
        enviarLogJogo();
    }, 500);

    setTimeout(() => {
        window.location.href = "/fotofinal";
    }, 10000);
})

function enviarLogJogo() {
       let id_pessoa = localStorage.getItem("id_pessoa");
       if (!id_pessoa) {
        let ultimoId = localStorage.getItem("ultimo_id_pessoa") || 0;
        id_pessoa = parseInt(ultimoId) + 1;
        localStorage.setItem("id_pessoa", id_pessoa);
        localStorage.setItem("ultimo_id_pessoa", id_pessoa);
    }

    console.log("ID da pessoa recuperado/enviado:", id_pessoa);

       const horario_inicio_jogo = localStorage.getItem("inicioQuiz");
       if(!horario_inicio_jogo) {console.log("horario de jogo não encontrado"); return;}
       const horario_fim_jogo = new Date().toISOString();
       const horario_total =  calcularTempoTotal(horario_inicio_jogo, horario_fim_jogo);
       if(horario_total === null) {console.log("Erro tempo total do jogo"); return;}
       const respostas_acertadas = parseInt(localStorage.getItem("acertosconsecutivos")) || 0;
       const respostas_skip = parseInt(localStorage.getItem("respostas_skip")) || 0;
       const respostas_erradas = parseInt(localStorage.getItem("errosconsecutivos")) || 0;
       const pontuacao_final = parseInt(localStorage.getItem("pontos")) || 0;
    
       if (horario_total === null) {
        console.error("Erro ao calcular tempo total do jogo. Envio abortado.");
        return;
    }

    const dados = {
        id_pessoa,
        horario_inicio_jogo,
        horario_fim_jogo,
        horario_total,
        respostas_acertadas,
        respostas_skip,
        respostas_erradas,
        pontuacao_final
    };

    console.log("Dados enviados:", dados); // Verificar os dados antes do envio 

    fetch("/log_jogo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta do servidor:", data);
    })
    .catch(error => {
        console.error("Erro ao enviar log:", error);
    });
}

function calcularTempoTotal(horario_inicio, horario_fim_jogo) {
    if (!horario_inicio) {
        console.error("Erro: horário de início do jogo não encontrado no localStorage.");
        return null;
    }
    const inicioDate = new Date(horario_inicio);
    const fim = new Date(horario_fim_jogo); // Captura o horário atual como fim do jogo
    const tempoTotalMs = fim - inicioDate; // Diferença em milissegundos
    const tempoTotalSegundos = Math.floor(tempoTotalMs / 1000); // Converte para segundos

    return tempoTotalSegundos;
}