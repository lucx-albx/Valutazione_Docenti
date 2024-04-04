const URL_SERVER = "http://localhost:5001/"

const carica =(middleware)=>{
    const URL = URL_SERVER + middleware

    fetch(URL)
    .then((testo)=>testo.json())
    .then((data)=>{
        alert(data.risposta)
    })
}