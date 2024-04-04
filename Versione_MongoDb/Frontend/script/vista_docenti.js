const LINK_SERVER = 'http://localhost:3001/'
const API_LOADED_PAGE = LINK_SERVER + 'variabili_onload'
const API_LOGOUT = LINK_SERVER + 'logout'
const API_DOCENTI = LINK_SERVER + 'getDocenti'

const carica_docenti =()=>{
    let contenitore = document.querySelector(".carica_docenti")

    fetch(API_DOCENTI)
    .then(testo=>testo.json())
    .then((data)=>{
        data.docenti.map((elem)=>{
            contenitore.innerHTML += card_docente(elem.nome, elem.cognome, elem.materie)
        })
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
    console.log("ciao")
    localStorage.setItem('nome_docente', nom)
    localStorage.setItem('cognome_docente', cog)

    window.location.href = './domande.html';
}

const controlla_se_loggato =()=>{
    fetch(API_LOADED_PAGE)
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.credenziali_res === false){
            window.location.href = './index.html';
        }        
    })
}

const logout =()=>{
    fetch(API_LOGOUT)
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.credenziali_res === false){
            window.location.href = './index.html';
        }        
    })
}

window.addEventListener('load', 
    controlla_se_loggato(),
    carica_docenti()
)