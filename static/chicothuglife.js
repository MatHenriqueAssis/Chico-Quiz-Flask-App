document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() =>{
        window.location.href = "/"
    }, 10000)
})
if (window.SharedWorker) {
    const worker = new SharedWorker("/static/musicaWorker.js");
    worker.port.start();

    // Se a música ainda não estiver tocando, inicia
    if (!localStorage.getItem("musicaTocando")) {
        worker.port.postMessage("play_music");
        localStorage.setItem("musicaTocando", "true");
    }

    // Se o usuário interagir, garante que a música inicie
    document.body.addEventListener("click", () => {
        worker.port.postMessage("play_music");
    }, { once: true });

    // Quando o usuário fecha a aba, para a música
    window.addEventListener("beforeunload", () => {
        worker.port.postMessage("stop_music");
    });
}
