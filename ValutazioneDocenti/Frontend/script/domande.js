const LINK_SERVER = 'http://localhost:3001/'
const API_LOADED_PAGE = LINK_SERVER + 'variabili_onload'
const API_DOMANDE = LINK_SERVER + 'getDomande'
const API_VOTA_DOCENTE = LINK_SERVER + 'valutaDocente'

const carica_domande =()=>{
    let contenitore = document.querySelector(".carica_domande")
    let contenitore_info_docente = document.querySelector(".docente-info")

    contenitore_info_docente.innerHTML += `Valuta ${localStorage.nome_docente} ${localStorage.cognome_docente}`

    fetch(API_DOMANDE)
    .then(testo=>testo.json())
    .then((data)=>{
        data.domande.map((elem, i)=>{
            contenitore.innerHTML += card_domanda(elem.domanda, i+1)
        })
    })
}

const card_domanda =(domanda, num)=>{
    return( 
        `
            <div class="card_domande mt-1">
                <h3>Domanda n ${num}°</h3>
                <p>${domanda}</p>
                <input type="number" min=2 max=10 class="voto" value="6">
            </div>
        `
    )
}

const ottieni_voti =()=>{
    let input_valutazioni = document.querySelectorAll(".voto")
    let valutazioni = []

    for(let i = 0; i < input_valutazioni.length; i++){
        valutazioni.push(parseInt(input_valutazioni[i].value))
    }

    return valutazioni
}

const id_domande =(qta_dom)=>{
    let id = []
    let i = 0

    for(i = 0; i < qta_dom; i++){
        if((i+1) < 10){
            id.push('q00' + (i+1))
        }
        
        if((i+1) > 9 && (i+1) < 99){
            id.push('q0' + (i+1))
        }
        
        if((i+1) > 99){
            id.push('q' + String(i+1))
        }
    }

    return id
}

const crea_valutazioni =(voti, id)=>{
    let val = []

    voti.map((elem, i)=>{
        val.push({
            idDomanda: id[i],
            voto: elem
        })
    })

    return val
}

const invia_valutazione =()=>{
    let voti = ottieni_voti()
    let id_dom = id_domande(voti.length)

    let nomeDocente = localStorage.nome_docente
    let cognomeDocente = localStorage.cognome_docente
    let valutazioni = crea_valutazioni(voti, id_dom)
    let token = localStorage.getItem("token")

    fetch(API_VOTA_DOCENTE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nomeDocente, cognomeDocente, valutazioni, token})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        alert(data.messaggio)
        window.location.href = './vista_docenti.html';
    })
}

const controlla_se_loggato =()=>{
    let log = localStorage.getItem('loggato')

    if(log === 'false' || log === null){
        window.location.href = './index.html'
    }        
}

window.addEventListener('load', 
    controlla_se_loggato(),
    carica_domande()
)