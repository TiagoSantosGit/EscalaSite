/*Requisita versículo da API aleatoriamente*/
let verse = document.getElementById("verso");
let verseRef = document.getElementById("versoRef");
const versions = ['nvi', 'acf'];
const version = getRandom(2) == 0 ? versions[0] : versions[1];
ajax({
    url: `https://www.abibliadigital.com.br/api/verses/${version}/random`,
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

ajax({
    url: "Escala.json",
    method: "get",
    success(response) {
        try {
            var indexCultoRef = -1
            criarTabela(defineEscala(JSON.parse(response), indexCultoRef))
            document.getElementById('colunaStatus').remove()
        } catch (e) {
            erroTabela()
        }
    },
    erro(e) {
        erroTabela()
    }
})
/*Define dias na escala*/
function defineEscala(escalaLista, indexCultoRef) {
    let dataAgora = new Date()
    let dataDia = dataHoje(dataAgora);
    let dataInicio = dataInicial(dataAgora);
    const escalaMostra = [];
    for (i = 0; i < escalaLista.length; i++) {
        let dataCulto = getDataCulto(escalaLista[i].dataHoraId);
        escalaLista[i]['day'] = 0;
        if (dataCulto >= dataDia && indexCultoRef == -1) {
            indexCultoRef = i;
            escalaLista[i]['day'] = 1;
        }
        if (dataCulto >= dataInicio) {
            escalaMostra.push(escalaLista[i]);
            if (escalaMostra.length == 20) {
                break;
            }
        }
    }
    return escalaMostra;
}

/*Pega a data invertida*/
function getDataCulto(dataHoraCulto) {
    let dataCulto = dataHoraCulto.split('T')
    dataCulto = dataCulto[0]
    dataCulto = dataCulto.split('-')
    dataCulto = `${dataCulto[0]}${dataCulto[1]}${dataCulto[2]}`
    return dataCulto
}

/*Data do dia*/
function dataHoje(data) {
    let month = doisDigitos(data.getMonth() + 1)
    let day = doisDigitos(data.getDate())
    return `${data.getFullYear()}${month}${day}`
}

/*Data inicial calculada -10 dias*/
function dataInicial(data) {
    let year = data.getFullYear()
    let month = data.getMonth() + 1
    let day = data.getDate()
    if (day - 10 <= 0) {
        let day1 = 10 - day
        day = 30 - day1
        if (month == 1) {
            month = 12
            year = year - 1
        } else {
            month = month - 1
        }
    } else {
        day = day - 10
    }
    month = doisDigitos(month)
    day = doisDigitos(day)
    return `${year}${month}${day}`
}

/*Retorna numero com duas casas*/
function doisDigitos(numero) {
    return numero < 10 ? `0${numero}` : numero

}

/*Cria linhas da tabela*/
function criarTabela(escala) {
    const linhas = escala.map(diaCulto => {
        const tdData = document.createElement('td')
        tdData.innerHTML = diaCulto.dataHoraCulto
        tdData.className = 'style-cell'
        const tdPonto1 = document.createElement('td')
        tdPonto1.innerHTML = diaCulto.obreiroPonto1
        tdPonto1.className = 'style-cell'
        const tdPonto2 = document.createElement('td')
        tdPonto2.innerHTML = diaCulto.obreiroPonto2
        tdPonto2.className = 'style-cell'
        const tdPonto3 = document.createElement('td')
        tdPonto3.innerHTML = diaCulto.obreiroPonto3
        tdPonto3.className = 'style-cell'
        const tdOferta = document.createElement('td')
        tdOferta.innerHTML = diaCulto.obreiroOferta
        tdOferta.className = 'style-cell style-border-right'
        if (diaCulto.cultoDeSantaCeia == true) {
            const classMark = ' cultoCeia'
            if (diaCulto.day == 1) {
                classMark += ' border-shadow'
            }
            tdData.className += classMark
            tdPonto1.className += classMark
            tdPonto2.className += classMark
            tdPonto3.className += classMark
            tdOferta.className += classMark
        } else if (diaCulto.day == 1) {
            const classMark = ' text-day border-shadow'
            tdData.className += classMark
            tdPonto1.className += classMark
            tdPonto2.className += classMark
            tdPonto3.className += classMark
            tdOferta.className += classMark
        }
        const tr = document.createElement('tr')
        tr.appendChild(tdData)
        tr.appendChild(tdPonto1)
        tr.appendChild(tdPonto2)
        tr.appendChild(tdPonto3)
        tr.appendChild(tdOferta)
        return tr
    })
    const escalaTbody = document.getElementById('linhasEscala')
    linhas.forEach(linha => escalaTbody.appendChild(linha))
}
/*Se houver erro no carregamento*/
function erroTabela() {
    document.getElementById('linhaStatus').innerText = "Erro ao carregar a escala!!!"
}

/*Gera número aleatório*/
function getRandom(numberMax) {
    return Math.floor(Math.random() * numberMax);
}

/*Erro se houver*/
function errorVerse(e) {
    verse.innerHTML = "Desculpe, não foi possível mostrar o versículo!"
    verseRef.innerHTML = e.status === undefined ? `${e}` : `${e.status} - ${e.statusText}`
}

/*Requisição da API e do arquivo JSON*/
function ajax(config) {
    const xhr = new XMLHttpRequest()
    xhr.open(config.method, config.url, true)
    xhr.onload = e => {
        if (xhr.status === 200) {
            config.success(xhr.response)
        } else if (xhr.status >= 400) {
            config.erro({
                status: xhr.status,
                statusText: xhr.statusText
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