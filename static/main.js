const telaInicial = document.querySelector('.initial')
const chico = document.querySelector('#chico')
const boca = document.querySelector('#chico-boca')
const categorias = document.querySelector('.categories')
const tituloCategoria = document.querySelector('.categories h3')
const playButton = document.querySelector("#play")


const start = () => {
    telaInicial.style.display = 'block'

    chico.style.maxWidth = '35%'
    chico.style.top = '35%'

    boca.style.maxWidth = '17%'
    boca.style.top = '55%'
}

window.onload = function() {
    setTimeout(() => {
        start();
    }, 2000);
};


playButton.addEventListener('click', () => {
    categorias.style.display = 'block'
    telaInicial.style.display = 'none'
})



