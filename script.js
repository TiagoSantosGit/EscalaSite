// Carrega a imagem da escala pegando mês atual e próximo mês
let imgAtu = document.getElementById("escAtu");
let imgPro = document.getElementById("escPro");
const btnEscPro = document.getElementById("btnEscPro");
let data = new Date();
let mes = data.getMonth() + 1;
let ano = data.getFullYear() - 2000;
imgAtu.src = `Escala_${mes}-${ano}.png`;
mes++;
if (mes == 13) { mes = 1; ano++; }
imgPro.src = `Escala_${mes}-${ano}.png`;
imgAtu.onerror = () => { imgAtu.setAttribute("hidden", "true"); console.log("Escala mês atual indisponível, entre em contato com o administrador!"); }
imgPro.onerror = () => { console.log("Escala próximo mês indisponível, entre em contato com o administrador!"); }
imgPro.onload = () => { btnEscPro.style.display = "block"; }

/*Mostra conteúdo de cada posto*/
function postoContent(element, elementId) {
    const divContent = document.getElementById(elementId);
    if (divContent.style.display == "block") {
        divContent.style.display = "none";
        if (element != null) {
            element.style.borderBottomColor = "#000000";
        }
    } else {
        this.noneContentPosto();
        divContent.style.display = "block";
        if (element != null) {
            element.style.borderBottomColor = "#ffffff";
        }
    }
}

/*Oculta todas as tags com a classe content*/
function noneContentPosto() {
    const contentClass = document.getElementsByClassName("content");
    const borderColorClass = document.getElementsByClassName("borderColor");
    var i;
    for (i = 0; i < contentClass.length; i++) {
        contentClass[i].style.display = "none";
    }
    for (i = 0; i < borderColorClass.length; i++) {
        borderColorClass[i].style.borderBottomColor = "#000000";
    }
}

/*Intercala escala mês atual e próximo mês*/
function trocaEsc() {
    const escAtu = document.getElementById("escAtu");
    const escPro = document.getElementById("escPro");
    if (escAtu.style.display == "none") {
        btnEscPro.innerHTML = "Escala próximo mês"
        btnEscPro.style.backgroundColor = '#f1670b';
        escPro.style.display = "none";
        escAtu.style.display = "block";
    } else {
        btnEscPro.innerHTML = "Escala mês atual"
        btnEscPro.style.backgroundColor = '#089750';
        escAtu.style.display = "none";
        escPro.style.display = "block";
    }
}