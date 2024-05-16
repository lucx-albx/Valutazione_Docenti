//! INIZIO BLOCCO VARIABLI E COSTANTI
const LINK_SERVER = 'http://localhost:3001/'
const API_TOKEN_VALIDO = LINK_SERVER + 'token_valido'
const API_ADMIN_CONSOLE = LINK_SERVER + 'admin_console'
const API_DOCENTI_CLASSE = LINK_SERVER + 'get_docenti_classe'
const API_VIEWDOCENTE = LINK_SERVER + 'view_docente'
const API_RUOLO = LINK_SERVER + 'ruolo_utente'
const API_GET_DOCENTI = LINK_SERVER + 'get_docenti'
const API_CARICA_STUDENTI = LINK_SERVER + 'carica_studenti'
const API_CARICA_DOCENTI = LINK_SERVER + 'carica_docenti'
const API_INIZIA_TERMINA_VALUTAZIONI = LINK_SERVER + 'start_stop_valutazioni'
const API_NOME_COGNOME_DOCENTE = LINK_SERVER + 'get_nome_cognome_docente'
const API_SCARICA_PDF = LINK_SERVER + 'scarica_pdf_valutazioni'

let media_docente = null
let nm_doc = ""
let cog_doc = ""
//! FINE BLOCCO VARIABLI E COSTANTI



//! INIZIO BLOCCO FUNZIONI GENERALI
const ripristina_localstorage =()=>{
    localStorage.setItem('token', 'null')
    localStorage.setItem('loggato', 'false')
    window.location.href = './index.html'
}

const is_valid_token =(token)=>{
    return new Promise((resolve, reject) => {
        fetch(API_TOKEN_VALIDO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(testo=>testo.json())
        .then((data)=>{
            resolve(data)
        })
    })
}

const controlla_se_loggato =()=>{
    let log = localStorage.getItem('loggato')

    if(log === 'false' || log === null){
        window.location.href = './index.html'
        localStorage.setItem("token", "null")
    }        
}

const logout =()=>{
    localStorage.setItem('token', 'null')
    localStorage.setItem('loggato', 'false')

    window.location.href = './index.html'
}

const controlla_ruolo_utente_e_carica_interfaccia =()=>{
    let token = localStorage.getItem("token")

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let container_interface = document.querySelector(".load_interface")
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

                        <div class="pbc">
                            <select id="nome_select">
                            </select>

                            <select id="cognome_select">
                            </select>

                            <button onclick="viewdocente()">Cerca</button>
                        </div>

                        <br>
                        <br>

                        <div class="console pbc"></div>

                        <br>

                        <div class="cont_media_docente"></div>

                        <br>

                        <button class="mt-1" onclick="logout()">Logout</button>
                    `
                    carica_docenti_nella_select()
                    AdminConsole()
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
        } else {
            ripristina_localstorage()
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
    let token = localStorage.getItem("token")

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let contenitore = document.querySelector(".carica_docenti")

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
        } else {
            ripristina_localstorage()
        }
    })
}

const carica_pagina_domande =(nom, cog)=>{
    let token = localStorage.getItem("token")

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            localStorage.setItem('nome_docente', nom)
            localStorage.setItem('cognome_docente', cog)

            window.location.href = './domande.html'
        } else {
            ripristina_localstorage()
        }
    })
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
    let token = localStorage.getItem("token")

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let nome_docente = document.querySelector("#nome_select").value
            let cognome_docente = document.querySelector("#cognome_select").value
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
        } else {
            ripristina_localstorage()
        }
    })
}

const carica_docenti_nella_select =()=>{
    let token = localStorage.getItem("token")

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let select_nome = document.querySelector("#nome_select")
            let select_cogome = document.querySelector("#cognome_select")

            fetch(API_GET_DOCENTI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token})
            })
            .then(testo=>testo.json())
            .then((data)=>{
                if(data.docenti !== null){
                    data.docenti.map((elem, i)=>{
                        select_nome.innerHTML += `<option> ${elem.nome} </option>`
                        select_cogome.innerHTML += `<option> ${elem.cognome} </option>`
                    })
                } else {
                    alert("Errore, ricaricare pagina")
                }
            }) 
        } else {
            ripristina_localstorage()
        }
    })
}

const admin_carica_studenti =()=>{
    let token = localStorage.getItem('token')

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            fetch(API_CARICA_STUDENTI, {
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
        } else {
            ripristina_localstorage()
        }
    })
}

const admin_carica_docenti =()=>{
    let token = localStorage.getItem('token')

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            fetch(API_CARICA_DOCENTI, {
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
        } else {
            ripristina_localstorage()
        }
    })
}

const AdminConsole =()=>{
    let token = localStorage.getItem('token')

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let contenitore_console = document.querySelector(".console")
            let array_funzioni = [admin_carica_studenti, admin_carica_docenti, inizia_termina_val]

            fetch(API_ADMIN_CONSOLE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token})
            })
            .then(testo=>testo.json())
            .then((data)=>{
                if(data.length !== undefined){
                    data.forEach((elem, i) => {
                        if(data.length - 1 !== i){
                            let buttonId = elem.button === 'Start/Stop Valutazioni' ? 'Valutazione' : 'btn' + (i+1)
                            let button = document.createElement('button')
                            button.textContent = elem.button
                            button.onclick = array_funzioni[i]
                            button.id = buttonId
                            contenitore_console.appendChild(button)
                        } else {
                            let buttonavviate = document.querySelector("#Valutazione")

                            if(elem.status === true){
                                buttonavviate.textContent = "Termina Valutazioni" 
                            } else {
                                buttonavviate.textContent = "Inizia Valutazioni"
                            }
                        }
                    })
                }
            }) 
        } else {
            ripristina_localstorage()
        }
    })
}

const inizia_termina_val =()=>{
    let token = localStorage.getItem('token')

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let button_valuta = document.querySelector("#Valutazione")

            fetch(API_INIZIA_TERMINA_VALUTAZIONI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token})
            })
            .then(testo=>testo.json())
            .then((data)=>{
                if (data.valuta === true){
                    button_valuta.innerHTML = "Termina Valutazioni"
                } else {
                    button_valuta.innerHTML = "Inizia Valutazioni"
                }
            }) 
        } else {
            ripristina_localstorage()
        }
    })
}
//! FINE BLOCCO FUNZIONI PER L'ADMIN



//! INIZIO BLOCCO FUNZIONI PER IL DOCENTE
const carica_media_docenti =()=>{
    let token = localStorage.getItem('token')

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let cmedoc = document.querySelector(".container_media_docenti")

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
                        media_docente = data.media

                        if(data.media !== null){
                            data.media.map((elem)=>{
                                cmedoc.innerHTML += card_viewdocente(elem.domanda, elem.media, nome_docente, cognome_docente)
                            })
                        } else {
                            cmedoc.innerHTML += `${data.messaggio}`
                        }
                    })
                } else {
                    cmedoc.innerHTML += `${data.messaggio}`
                }
            })
        } else {
            ripristina_localstorage()
        }
    })
}

const scarica_pdf =()=>{
    let token = localStorage.getItem('token')

    is_valid_token(token)
    .then((data)=>{
        if(data.valido === true){
            let valutazioni = media_docente
            let nome_docente = nm_doc
            let cognome_docente = cog_doc

            if(valutazioni !== null){
                fetch(API_SCARICA_PDF, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({nome_docente, cognome_docente, valutazioni, token})
                })
                .then((response) => {
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
                    alert('Si è verificato un errore durante il download del PDF')
                })
            } else {
                alert('Al momento delle valutazioni non è possibile scaricare la propria media, riprovare al termine delle valutazioni.')
            }
        } else {
            ripristina_localstorage()
        }
    })
}
//! FINE BLOCCO FUNZIONI PER IL DOCENTE



//! INIZIO BLOCCO DELLE FUNZIONI CHE SI ESEGUONO AL CARICARSI DELLA PAGINA
window.addEventListener('load', 
    controlla_ruolo_utente_e_carica_interfaccia(),
    controlla_se_loggato()
)
//! FINE BLOCCO DELLE FUNZIONI CHE SI ESEGUONO AL CARICARSI DELLA PAGINA
