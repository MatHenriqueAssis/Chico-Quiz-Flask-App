document.addEventListener("DOMContentLoaded", function () {
    const musica = document.getElementById("musica");

    if (musica) {
        musica.volume = 0.2; // Volume inicial (0.0 a 1.0)
        console.log("Volume inicial definido para:", musica.volume);
    }
});

// Função para ajustar volume dinamicamente
function ajustarVolume(novoVolume) {
    const musica = document.getElementById("musica");
    if (musica) {
        musica.volume = parseFloat(novoVolume);
        console.log("Volume ajustado para:", musica.volume);
    }
}
