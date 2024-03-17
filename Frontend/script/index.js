const LINK_SERVER = 'http://localhost:3001/'
const API_LOGIN = LINK_SERVER + 'login'
const API_LOADED_PAGE = LINK_SERVER + 'variabili_onload'

const accedi =()=>{
    let nm_ut = document.querySelector('#nm_ut').value
    let psw = document.querySelector('#psw').value

    console.log(nm_ut)

    fetch(API_LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nm_ut, psw})
    })
    .then(testo=>testo.json())
    .then((data)=>{
        if(data.credenziali_res === true){
            window.location.href = './vista_docenti.html'
        } else {
            alert(data.message)
        }
    })
}

const controlla_se_loggato =()=>{
    fetch(API_LOADED_PAGE)
    .then(testo=>testo.json())
    .then((data)=>{
        console.log(data)
        if(data.credenziali_res === true){
            window.location.href = './vista_docenti.html';
        }        
    })
}

window.addEventListener('load', controlla_se_loggato)