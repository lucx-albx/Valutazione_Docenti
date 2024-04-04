const LINK_SERVER = 'http://localhost:3001/'
const API_LOADED_PAGE = LINK_SERVER + 'variabili_onload'
const API_DOMANDE = LINK_SERVER + 'getDomande'

const carica_domande =()=>{
    let contenitore = document.querySelector(".carica_domande")

    fetch(API_DOMANDE)
    .then(testo=>testo.json())
    .then((data)=>{
        data.domande.map((elem, i)=>{
            contenitore.innerHTML += card_domanda(elem.question, i+1)
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

const controlla_se_loggato =()=>{
    fetch(API_LOADED_PAGE)
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.credenziali_res === false){
            window.location.href = './index.html';
        }        
    })
}

window.addEventListener('load', 
    controlla_se_loggato(),
    carica_domande()
)