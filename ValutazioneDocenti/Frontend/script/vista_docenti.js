//! INIZIO BLOCCO VARIABLI E COSTANTI
const LINK_SERVER = 'http://localhost:3001/'
const API_LOGOUT = LINK_SERVER + 'logout'
const API_DOCENTI_CLASSE = LINK_SERVER + 'get_docenti_classe'
const API_VIEWDOCENTE = LINK_SERVER + 'view_docente'
const API_RUOLO = LINK_SERVER + 'ruolo_utente'
const API_INIZIA_TERMINA_VALUTAZIONI = LINK_SERVER + 'start_stop_valutazioni'
const API_NOME_COGNOME_DOCENTE = LINK_SERVER + 'get_nome_cognome_docente'
const API_SCARICA_PDF = LINK_SERVER + 'scarica_pdf_valutazioni'

let media_docente = null
let nm_doc = ""
let cog_doc = ""
//! FINE BLOCCO VARIABLI E COSTANTI



//! INIZIO BLOCCO FUNZIONI GENERALI
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

                <div class="carica_docenti"></div>

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
                <br>

                <button onclick="inizia_termina_val()">Inizia / termina valutazioni</button>

                <br>

                <div class="cont_media_docente"></div>

                <br>

                <button class="mt-1" onclick="logout()">Logout</button>
            `
        } else if(data.tipo === 'D'){
            container_interface.innerHTML +=
            `
                <h1>Tuoi Docenti</h1>

                <div class="container_media_docenti"></div>

                <br>

                <button class="mt-1" onclick="scarica_pdf()">Scarica PDF</button>

                <br>

                <button class="mt-1" onclick="logout()">Logout</button>
            `

            carica_media_docenti()
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
//! FINE BLOCCO FUNZIONI GENERALI



//! INIZIO BLOCCO FUNZIONI PER LO STUDENTE
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

const carica_docenti =()=>{
    let contenitore = document.querySelector(".carica_docenti")
    let token = localStorage.getItem('token')

    fetch(API_DOCENTI_CLASSE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.valuta === true){
            if(data.docenti.length !== 0){
                data.docenti.map((elem)=>{
                    contenitore.innerHTML += card_docente(elem.nome, elem.cognome, elem.materie)
                })
            } else {
                contenitore.innerHTML += "<b> Non ci sono più docenti da valutare.<b>"
            }
        } else {
            contenitore.innerHTML += "<b> Il periodo per l'inserimento delle valutazioni non è ancora iniziato.<b>"
        }
    })
}

const carica_pagina_domande =(nom, cog)=>{
    localStorage.setItem('nome_docente', nom)
    localStorage.setItem('cognome_docente', cog)

    window.location.href = './domande.html';
}
//! FINE BLOCCO FUNZIONI PER LO STUDENTE



//! INIZIO BLOCCO FUNZIONI PER L'ADMIN
const card_viewdocente =(domanda, media, nome, cognome)=>{
    return( 
        `
            <div class="card_viewdocente mt-1">
                <div>
                    <b>${nome} ${cognome}</b>
                </div>

                <div>
                    <p>${domanda}</p>
                </div> 

                <div>
                    Media domanda: <b>${media}</b>
                </div>
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
                contenitore_viewdocente.innerHTML += card_viewdocente(elem.domanda, elem.media, nome_docente, cognome_docente)
            })
        }
    })
}

const inizia_termina_val =()=>{
    let token = localStorage.getItem('token')

    fetch(API_INIZIA_TERMINA_VALUTAZIONI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        alert(data.messaggio)
    }) 
}
//! FINE BLOCCO FUNZIONI PER L'ADMIN



//! INIZIO BLOCCO FUNZIONI PER IL DOCENTE
const carica_media_docenti =()=>{
    let cmedoc = document.querySelector(".container_media_docenti")
    let token = localStorage.getItem('token')

    fetch(API_NOME_COGNOME_DOCENTE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.nome !== null && data.cognome !== null){
            let nome_docente = data.nome
            let cognome_docente = data.cognome
            nm_doc = data.nome
            cog_doc = data.cognome

            fetch(API_VIEWDOCENTE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nome_docente, cognome_docente, token})
            })
            .then(testo=>testo.json())
            .then((data)=>{
                if(data.media != null){
                    media_docente = data.media
                    data.media.map((elem)=>{
                        cmedoc.innerHTML += card_viewdocente(elem.domanda, elem.media, nome_docente, cognome_docente)
                    })
                }
            })
        } else {
            cmedoc += `${data.messaggio}`
        }
    }) 

}

const scarica_pdf =()=>{
    let token = localStorage.getItem('token')
    let valutazioni = media_docente
    let nome_docente = nm_doc
    let cognome_docente = cog_doc

    fetch(API_SCARICA_PDF, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome_docente, cognome_docente, valutazioni, token})
    })
    .then(response => {
        if (response.ok) {
            return response.blob()
        } else {
            throw new Error('Errore durante il download del PDF')
        }
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `valutazioni_${nome_docente}_${cognome_docente}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    })
    .catch((e) => {
        alert('Si è verificato un errore durante il download del PDF');
    })
}
//! FINE BLOCCO FUNZIONI PER IL DOCENTE



//! INIZIO BLOCCO DELLE FUNZIONI CHE SI ESEGUONO AL CARICARSI DELLA PAGINA
window.addEventListener('load', 
    controlla_se_loggato(),
    controlla_ruolo_utente_e_carica_interfaccia()
)
//! FINE BLOCCO DELLE FUNZIONI CHE SI ESEGUONO AL CARICARSI DELLA PAGINA
