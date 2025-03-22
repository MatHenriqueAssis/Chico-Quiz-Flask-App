document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM carregado!");

    let standbyTimeOut;
    let gifInterval;
    const standbyScreen = document.getElementById("standby");
    const standbyGif = document.getElementById("standbygif");

    if (!standbyScreen || !standbyGif) {
        console.error("⚠️ Elementos não encontrados no DOM!");
        return;
    }

    const gifs = [
        "../static/gifs/grandes/dormindo.gif",
        "../static/gifs/grandes/TristeGrande.gif"
    ];

    let currentgifIndex = 0;

    function randomizacao(excludeIndex) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * gifs.length)
        } while (randomIndex === excludeIndex);
        return randomIndex
    }

    function startStandbyTimer() {
        clearTimeout(standbyTimeOut);
        standbyTimeOut = setTimeout(() => {
            standbyScreen.classList.remove("hidden");
            
            currentgifIndex = randomizacao(-1)
            standbyGif.src = gifs[currentgifIndex];
            console.log("🔄 Primeiro GIF:", standbyGif.src);

            startGifLoop();
        }, 5000);
    }

    function startGifLoop() {
        if (gifInterval) clearInterval(gifInterval);
        console.log("🔄 Iniciando troca de GIFs...");

        gifInterval = setInterval(() => {
            currentgifIndex = randomizacao(currentgifIndex);
            standbyGif.src = gifs[currentgifIndex];
            console.log("➡️ Novo GIF:", standbyGif.src);
        }, 5000);
    }

    function resetStandby() {
        if (gifInterval) clearInterval(gifInterval);
        standbyScreen.classList.add("hidden");
        startStandbyTimer();
    }

    function returnQuiz() {
        window.location.href = "/";
    }

    document.addEventListener("mousemove", returnQuiz);
    document.addEventListener("keydown", returnQuiz);
    document.addEventListener("click", returnQuiz);

    // Inicia o timer ao carregar
    startStandbyTimer();
});