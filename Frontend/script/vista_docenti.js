const LINK_SERVER = 'http://localhost:3001/'
const API_LOADED_PAGE = LINK_SERVER + 'variabili_onload'
const API_LOGOUT = LINK_SERVER + 'logout'

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

window.addEventListener('load', controlla_se_loggato)