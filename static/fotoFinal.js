document.addEventListener("DOMContentLoaded", async function () {
    const mensagemTitulo = document.getElementById("mensagemTitulo");
    const mensagem = document.getElementById("mensagem");
    const mensagem2 = document.getElementById("mensagem2");
    const video = document.getElementById("video");
    const fotografia = new Audio("/static/audios/cronometro-foto.mp3");
    let cronometro = 10;
    const captura = new Audio("/static/audios/tirar-foto.wav")
    mensagemTitulo.innerText = "Agora faça Xis que é hora da foto!";
    mensagem.innerHTML = `Faça uma pose bem bonita e se prepare que em <span style="color: red; fontsize: 1.5rem;"> ${cronometro} segundos</span> o Chico irá tirar uma foto sua.`;
    mensagem2.innerText = "Confira a sua foto em https://chico-site.netlify.app/";

    fotografia.play();


    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Aguarde 2 segundos para estabilizar a câmera antes da captura
        setTimeout(() => {
            captureAndUpload(video, stream), captura.play()}, 9000);
    } catch (error) {
        console.error("Erro ao acessar a câmera: ", error);
        alert("Permita o acesso à câmera para capturar imagens.");
    }

    const intervalo = setInterval(() =>{
        cronometro--;
        mensagem.innerHTML = `Faça uma pose bem bonita e se prepare que em <span style="color: red; fontsize: 1.5rem;"> ${cronometro} segundos</span> o Chico irá tirar uma foto sua.`;
        if( intervalo <= 0){
            clearInterval(intervalo)
        }
    }, 1000)

    // Após 3 segundos, registra o log da foto no servidor
    setTimeout(enviarLogFoto, 3000);

    // Após 10 segundos, redireciona o usuário
    setTimeout(() => {
        window.location.href = "/";
    }, 11000);
});

async function captureAndUpload(video, stream) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "captured_image.jpg");

        try {
            const response = await fetch("https://visao.pythonanywhere.com/upload_imagechicosabido", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log("Imagem enviada com sucesso!", data);
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            alert("Erro ao enviar imagem.");
        } finally {
            stream.getTracks().forEach(track => track.stop());
        }
    }, "image/jpeg");
}

async function enviarLogFoto() {
    let id_pessoa = localStorage.getItem("id_pessoa");
    if (!id_pessoa) {
        let ultimoId = localStorage.getItem("ultimo_id_pessoa") || 0;
        id_pessoa = parseInt(ultimoId) + 1;
        localStorage.setItem("id_pessoa", id_pessoa);
        localStorage.setItem("ultimo_id_pessoa", id_pessoa);
    }

    console.log("ID da pessoa recuperado/enviado:", id_pessoa);

    const horario_da_foto = localStorage.getItem("inicioQuiz");
    if (!horario_da_foto) {
        console.log("Horário da foto não encontrado.");
        return;
    }

    const dados = { id_pessoa, horario_da_foto };

    console.log("Dados enviados:", dados);

    try {
        const response = await fetch("/log_foto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);
    } catch (error) {
        console.error("Erro ao enviar log:", error);
    }
}
