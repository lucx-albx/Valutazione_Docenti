const LINK_SERVER = 'http://localhost:3001/'
const API_LOADED_PAGE = LINK_SERVER + 'variabili_onload'
const API_LOGOUT = LINK_SERVER + 'logout'
const API_DOCENTI = LINK_SERVER + 'getDocenti'
const API_VIEWDOCENTE = LINK_SERVER + 'viewDocente'
const API_RUOLO= LINK_SERVER + 'ruolo_utente'

const carica_docenti =()=>{
    let contenitore = document.querySelector(".carica_docenti")
    let token = localStorage.getItem('token')

    fetch(API_DOCENTI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.docenti.length !== 0){
            data.docenti.map((elem)=>{
                contenitore.innerHTML += card_docente(elem.nome, elem.cognome, elem.materie)
            })
        } else {
            contenitore.innerHTML += "<b> Non ci sono più docenti da valutare.<b>"
        }
    })
}

const card_docente =(nome, cognome, materie)=>{
    return( 
        `
            <div class="card_docente mt-1" onclick='carica_pagina_domande("${nome}", "${cognome}")'>
                <h2>${nome} ${cognome}</h2>
                <p>${materie}</p>
            </div>
        `
    )
}

const carica_pagina_domande =(nom, cog)=>{
    localStorage.setItem('nome_docente', nom)
    localStorage.setItem('cognome_docente', cog)

    window.location.href = './domande.html';
}

const card_viewdocente =(id, media, nome, cognome)=>{
    return( 
        `
            <div class="card_viewdocente mt-1">
                <p>Il docente <b>${nome}</b> <b>${cognome}</b> alla domanda <b>n${id.slice(1)}</b> ha come media: <b>${media}</b>
            </div>
        `
    )
}

const viewdocente =()=>{
    let nome_docente = document.querySelector("#nom_doc").value
    let cognome_docente = document.querySelector("#cog_doc").value
    let token = localStorage.getItem("token")
    let contenitore_viewdocente = document.querySelector(".cont_media_docente")

    contenitore_viewdocente.innerHTML = ""

    fetch(API_VIEWDOCENTE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome_docente, cognome_docente, token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        alert(data.messaggio)
        if(data.media != null){
            data.media.map((elem)=>{
                contenitore_viewdocente.innerHTML += card_viewdocente(elem.id, elem.media, nome_docente, cognome_docente)
            })
        }
    })
}

const controlla_ruolo_utente_e_carica_interfaccia =()=>{
    let container_interface = document.querySelector(".load_interface")
    let token = localStorage.getItem('token')

    container_interface.innerHTML = ''

    fetch(API_RUOLO, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        //Controllo se l'utente è un admin oppure meno, per mostrargli la giusta interfaccia
        if(data.tipo === 'S'){
            container_interface.innerHTML +=
            `
                <h1>Tuoi Docenti</h1>

                <div class="carica_docenti">
                </div>

                <br>

                <button class="mt-1" onclick="logout()">Logout</button>
            `

            //Dopo aver caricato l'interfaccia lato utente gli carico i docenti ancora da valutare
            carica_docenti()
        } else if(data.tipo === 'A'){
            container_interface.innerHTML +=
            `
                <h1>Zona Admin</h1>

                <h3>Gestione database</h3>

                <h3>Viewdocente </h3>

                <input type="text" value="Manuela" placeholder="Inserisci nome docente..." id="nom_doc">
                <input type="text" value="Dalbesio" placeholder="Inserisci cognome docente..." id="cog_doc">

                <button onclick="viewdocente()">Cerca</button>

                <br>

                <div class="cont_media_docente"></div>

                <br>

                <button class="mt-1" onclick="logout()">Logout</button>
            `
        }
    })
}

const controlla_se_loggato =()=>{
    let log = localStorage.getItem('loggato')

    if(log === 'false' || log === null){
        window.location.href = './index.html'
    }        
}

const logout =()=>{
    let token = localStorage.getItem('token')

    fetch(API_LOGOUT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.successo === true){
            localStorage.setItem('token', 'null')
            localStorage.setItem('loggato', 'false')

            window.location.href = './index.html'
        }
    })   
}

window.addEventListener('load', 
    controlla_se_loggato(),
    controlla_ruolo_utente_e_carica_interfaccia()
)