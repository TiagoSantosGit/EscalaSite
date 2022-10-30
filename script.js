/*Carrega a imagem da escala pegando mês atual e próximo mês*/
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
/*Requisita versículo da API aleatoriamente*/
let verse = document.getElementById("verso");
let verseRef = document.getElementById("versoRef");
let mapBibleFont = getRandom(2) == 0 ? "mapBibleAT.min.json" : "mapBibleNT.min.json";
ajax({
    url: mapBibleFont,
    method: "get",
    success(response) {
        const mapBible = JSON.parse(response)
        const randomBooks = getRandom(mapBible.books.length);
        const randomChapter = getRandom(mapBible.books[randomBooks].chaptersVerses.length);
        const randomVerse = getRandom(mapBible.books[randomBooks].chaptersVerses[randomChapter].totVers);
        const abb = mapBible.books[randomBooks].abbrev;
        const cha = mapBible.books[randomBooks].chaptersVerses[randomChapter].chap;
        const ver = randomVerse > 0 ? randomVerse : 1;
        ajax({
            url: `https://www.abibliadigital.com.br/api/verses/nvi/${abb}/${cha}/${ver}`,
            method: "get",
            success(response) {
                try {
                    const verseBible = JSON.parse(response)
                    verse.innerHTML = verseBible.text
                    verseRef.innerHTML = `${verseBible.book.name} ${verseBible.chapter}:${verseBible.number} (${verseBible.book.version})`
                } catch (e) {
                    errorVerse(e)
                }
            },
            erro(e) {
                errorVerse(e)
            }
        })
    }
})

/*Gera número aleatório*/
function getRandom(numberMax) {
    return Math.floor(Math.random() * numberMax);
}

/*Erro se houver*/
function errorVerse(e) {
    verse.innerHTML = "Desculpe, não foi possível mostrar o versículo!"
    verseRef.innerHTML = ""
}

/*Requisição da API e do arquivo JSON*/
function ajax(config) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", config.url, true)
    xhr.onload = e => {
        if (xhr.status === 200) {
            config.success(xhr.response)
        } else if (xhr.status >= 400) {
            config.erro({
                code: xhr.status,
                text: xhr.statusText
            })
        }
    }
    xhr.send()
}

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