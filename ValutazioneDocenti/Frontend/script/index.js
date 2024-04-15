//! INIZIO BLOCCO VARIABLI E COSTANTI
const LINK_SERVER = 'http://localhost:3001/'
const API_LOGIN = LINK_SERVER + 'login'
//! FINE BLOCCO VARIABLI E COSTANTI



//! INIZIO BLOCCO FUNZIONI GENERALI
const controlla_se_loggato =()=>{
    let log = localStorage.getItem('loggato')

    if(log === 'true'){
        window.location.href = './vista_docenti.html'
    } else {
        localStorage.setItem("token", "null")
    }
}
//! FINE BLOCCO FUNZIONI GENERALI



//! INIZIO BLOCCO FUNZIONI PER L'ACCESSO
const accedi =()=>{
    let user = document.querySelector('#em_ut').value
    let password = document.querySelector('#psw').value

    fetch(API_LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user, password})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.credenziali_res === true){
            localStorage.setItem('token', data.tuo_token)
            localStorage.setItem('loggato', 'true')

            window.location.href = './vista_docenti.html'
        } else {
            alert(data.messaggio)
        }
    })
}
//! FINE BLOCCO FUNZIONI PER L'ACCESSO



//! INIZIO BLOCCO DELLE FUNZIONI CHE SI ESEGUONO AL CARICARSI DELLA PAGINA
window.addEventListener('load', controlla_se_loggato)
//! FINE BLOCCO DELLE FUNZIONI CHE SI ESEGUONO AL CARICARSI DELLA PAGINA
