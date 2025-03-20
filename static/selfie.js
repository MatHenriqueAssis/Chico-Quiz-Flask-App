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
        window.location.href = 'index';
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