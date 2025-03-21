const chico = document.querySelector("#chico")
const boca = document.querySelector('#chico-boca')
const choicer = document.querySelector(".container-choice")

const chico_love = document.querySelector('#chico-coracao')
const chico_thug = document.querySelector("#chico-thug")

const chico_love_button = document.querySelector("#chico_love_button")
const chico_thug_button = document.querySelector("#chico_thug_button")

const baseFunction = () => {
    chico.style.display = 'none';
    boca.style.display = 'none';
    choicer.style.display = 'none';

    setTimeout(() => {
        window.location.href = '/';
    }, 15000);
}

chico_love_button.addEventListener('click', () => {
    chico_love.style.display = 'block';
    baseFunction()
});
chico_thug_button.addEventListener('click', () => {
    chico_thug.style.display = 'block';
    baseFunction()
});

function irParaChicoApaixonado() {
    setTimeout(() => {
        window.location.href = "chicoapaixonado";
    }, 1000)
}

function irParaChicoThuglife() {
    setTimeout(() => {
        window.location.href = "chicothuglife";
    }, 1000)
}

document.addEventListener("keydown", function(event) {
    const opcoesfoto = document.querySelectorAll(".foto");
    
    if (homeopcoes.length === 0) return;
    
    switch(event.key) {
        case "a":
            if (opcoesfoto[0]) opcoesfoto[0].click();
            break;
        case "q":
            if (opcoesfoto[0]) opcoesfoto[0].click();
            break;
        case "w":
            if (opcoesfoto[1]) opcoesfoto[1].click();
            break;
        case "b":
            if (opcoesfoto[1]) opcoesfoto[1].click();
            break;
        case "r":
            irParaHome();
            break;
    }
});
