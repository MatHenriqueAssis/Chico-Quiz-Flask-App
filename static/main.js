document.addEventListener("DOMContentLoaded", function () {
    const telaInicial = document.querySelector('.initial');
    const chico = document.querySelector('#chico');
    const boca = document.querySelector('#chico-boca');
    const categorias = document.querySelector('.categories');
    const tituloCategoria = document.querySelector('.categories h3');
    const playButton = document.querySelector("#play");
    let standbyTimeout;

    function start() {
        telaInicial.style.display = 'block';

        if (chico) {
            chico.style.maxWidth = '35%';
            chico.style.top = '35%';
        }

        if (boca) {
            boca.style.maxWidth = '17%';
            boca.style.top = '55%';
        }
    }

    setTimeout(start, 2000);

    if (playButton) {
        playButton.addEventListener('click', () => {
            if (categorias) {
                categorias.style.display = 'block';
            }
            telaInicial.style.display = 'none';
            localStorage.setItem("inicioQuiz", new Date().toISOString());
            console.log("⏳ Horário de início do quiz salvo:", localStorage.getItem("inicioQuiz"));
        });
    }

    function startStandbyTimer() {
        clearTimeout(standbyTimeout);
        standbyTimeout = setTimeout(() => {
            window.location.href = "standby";
        }, 10000);
    }

    function resetStandby() {
        startStandbyTimer();
    }

    document.addEventListener("mousemove", resetStandby);
    document.addEventListener("keydown", resetStandby);
    document.addEventListener("click", resetStandby);

    startStandbyTimer();

    // Evento para pressionamento de teclas
    document.addEventListener("keydown", function(event) {
        const homeopcoes = document.querySelectorAll(".player");
        
        if (homeopcoes.length === 0) return;
        
        switch(event.key) {
            case "r":
                if (homeopcoes[0]) homeopcoes[0].click();
                break;
            case "q":
            case "w":
            case "e":
            case "t":
                if (homeopcoes[1]) homeopcoes[1].click();
                break;
            case "a":
            case "b":
            case "c":
            case "d":    
                if (homeopcoes[1]) homeopcoes[1].click();
                break;
        }
    });
});

