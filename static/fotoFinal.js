document.addEventListener("DOMContentLoaded", function () {
    const mensagem = document.getElementById("mensagem");
    const mensagemTitulo = document.getElementById("mensagemTitulo");
    const mensagem2 = document.getElementById("mensagem2");
    const fotografia = new Audio("/static/audios/cronometro-foto.mp3")

    mensagemTitulo.innerText = `Agora faça Xis que é hora da foto!`
    mensagem.innerText = "Faça uma pose bem bonita e se prepare que em alguns segundos o chico irá tirar uma foto sua ";
    mensagem2.innerText = "confira a sua foto em [Site]"
    
    fotografia.play();
    
    enviarLogFoto();

    setTimeout(() => {
        window.location.href = "/";
    }, 10000);
})

function enviarLogFoto() {
    let id_pessoa = localStorage.getItem("id_pessoa");
    if (!id_pessoa) {
     let ultimoId = localStorage.getItem("ultimo_id_pessoa") || 0;
     id_pessoa = parseInt(ultimoId) + 1;
     localStorage.setItem("id_pessoa", id_pessoa);
     localStorage.setItem("ultimo_id_pessoa", id_pessoa);
 }

 console.log("ID da pessoa recuperado/enviado:", id_pessoa);

    const horario_da_foto = localStorage.getItem("inicioQuiz");
    if(!horario_da_foto) {console.log("horario da foto não encontrado"); return;}
 

 const dados = {
    id_pessoa,
    horario_da_foto
 };

 console.log("Dados enviados:", dados); // Verificar os dados antes do envio 

 fetch("/log_foto", {
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