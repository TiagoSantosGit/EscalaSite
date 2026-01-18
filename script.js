/*Requisita versículo da API aleatoriamente*/
let verse = document.getElementById("verso")
let verseRef = document.getElementById("versoRef")
const versions = ['nvi', 'acf']
const version = getRandom(2) == 0 ? versions[0] : versions[1]

getAPI({
    url: `https://www.abibliadigital.com.br/api/verses/${version}/random`,
    method: "get",
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJTYXQgSmFuIDE3IDIwMjYgMjM6MzE6MzUgR01UKzAwMDAudGlhZ29zYW50b3NwbnpAaG90bWFpbC5jb20iLCJpYXQiOjE3Njg2OTI2OTV9.Zuf29-vxDrDyJhqlOhNk0W3tFoDab9L3wv6uTUOZBYE"
    },
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

getAPI({
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

cabecalhoFixoFlutuante()

/* Monta o cabelho flutuante de acordo com o fixo da tabela*/
function cabecalhoFixoFlutuante() {
    const cabFloat = document.getElementById('cabFloat')
    cabFloat.insertAdjacentHTML('beforeend', document.querySelector('#cabFixed1').innerHTML)
    var header = document.getElementById('cabFloat').createTHead()
    header.appendChild(document.createElement('tr'))
    const tr = header.querySelector('tr')
    const lista = document.querySelector('#cabFixed2').cloneNode(true).querySelectorAll('th')
    for (index = 1; index < lista.length; index++) {
        lista[index].setAttribute('class', 'style-hidden')
    }
    lista[lista.length - 1].className += ' style-border-right'
    lista.forEach(e => tr.appendChild(e))
}

/*Define dias da escala*/
function defineEscala(escalaLista, indexCultoRef) {
    let dataAgora = new Date()
    let dataDia = getDataHoje(dataAgora)
    let horaDia = getHoraHoje(dataAgora)
    let dataInicio = getDataInicial(dataAgora)
    const escalaMostra = []
    for (i = 0; i < escalaLista.length; i++) {
        let dataCulto = getDataCulto(escalaLista[i].dataHoraId)
        let horaFimCulto = getHoraFimCulto(escalaLista[i].dataHoraId)
        escalaLista[i]['day'] = 0
        if (dataCulto >= dataDia && indexCultoRef == -1) {
            if (dataCulto == dataDia && horaDia >= horaFimCulto) {
            } else {
                indexCultoRef = i
                escalaLista[i]['day'] = 1
            }
        }
        if (dataCulto >= dataInicio) {
            escalaMostra.push(escalaLista[i])
            if (escalaMostra.length == 20) {
                break
            }
        }
    }
    return escalaMostra
}

/*Pega a data invertida*/
function getDataCulto(dataHoraCulto) {
    let dataCulto = dataHoraCulto.split('T')
    dataCulto = dataCulto[0]
    dataCulto = dataCulto.split('-')
    dataCulto = `${dataCulto[0]}${dataCulto[1]}${dataCulto[2]}`
    return dataCulto
}

/*Pega a hora do final do culto*/
function getHoraFimCulto(dataHoraCulto) {
    let horaCulto = dataHoraCulto.split('T')
    horaCulto = horaCulto[1]
    horaCulto = horaCulto.split(':')
    horaCulto = `${Number(horaCulto[0]) + 2}${horaCulto[1]}${horaCulto[2]}`
    return Number(horaCulto)
}

/*Pega a hora do dia*/
function getHoraHoje(dataHora) {
    let hours = doisDigitos(dataHora.getHours())
    let minutes = doisDigitos(dataHora.getMinutes())
    return Number(`${hours}${minutes}00`)
}

/*Data do dia*/
function getDataHoje(dataHora) {
    let month = doisDigitos(dataHora.getMonth() + 1)
    let day = doisDigitos(dataHora.getDate())
    return `${dataHora.getFullYear()}${month}${day}`
}

/*Data inicial calculada -10 dias*/
function getDataInicial(dataHora) {
    let year = dataHora.getFullYear()
    let month = dataHora.getMonth() + 1
    let day = dataHora.getDate()
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
        let dados = [diaCulto.dataHoraCulto, diaCulto.obreiroPonto1, diaCulto.obreiroPonto2, diaCulto.obreiroPonto3, diaCulto.obreiroOferta, diaCulto.obreiroOfertaMaquininha]
        let celulas = []
        for (let index = 0; index < dados.length; index++) {
            let td = document.createElement('td')
            td.innerHTML = dados[index]
            td.className = 'style-cell'
            celulas.push(td)
        }
        celulas[celulas.length - 1].className += ' style-border-right'
        let classMark = ''
        if (diaCulto.cultoDeSantaCeia == true || diaCulto.day == 1) {
            if (diaCulto.cultoDeSantaCeia == true) {
                classMark = ' cultoCeia'
            }
            if (diaCulto.day == 1) {
                classMark += ' text-day'
            }
            celulas.forEach(celula => celula.className += classMark)
        }
        let tr = document.createElement('tr')
        celulas.forEach(celula => tr.appendChild(celula))
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
    return Math.floor(Math.random() * numberMax)
}

/*Erro se houver*/
function errorVerse(e) {
    verse.innerHTML = "Desculpe, não foi possível mostrar o versículo!"
    verseRef.innerHTML = e.status === undefined ? `${e}` : `${e.status} - ${e.statusText}`
}

/*Requisição da API e do arquivo JSON*/
function getAPI(config) {
    const xhr = new XMLHttpRequest()
    xhr.open(config.method, config.url, true)
    if (config.headers) {
        for (const key in config.headers) {
            xhr.setRequestHeader(key, config.headers[key])
        }
    }
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
    const divContent = document.getElementById(elementId)
    if (divContent.style.display == "block") {
        divContent.style.display = "none"
        if (element != null) {
            element.style.borderBottomColor = "#000000"
        }
    } else {
        this.noneContentPosto()
        divContent.style.display = "block"
        if (element != null) {
            element.style.borderBottomColor = "#ffffff"
        }
    }
}

/*Oculta todas as tags com a classe content*/
function noneContentPosto() {
    const contentClass = document.getElementsByClassName("content")
    const borderColorClass = document.getElementsByClassName("borderColor")
    var i
    for (i = 0; i < contentClass.length; i++) {
        contentClass[i].style.display = "none"
    }
    for (i = 0; i < borderColorClass.length; i++) {
        borderColorClass[i].style.borderBottomColor = "#000000"
    }
}