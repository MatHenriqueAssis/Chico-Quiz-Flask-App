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
    
    if (opcoesfoto.length === 0) return;
    
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
