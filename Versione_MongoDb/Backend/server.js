//!Moduli da installare:
//!npm install express
//!npm install cors
//!npm install mongodb
const express = require('express');
const fs = require('fs');
const cors = require("cors")
const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017") 

const TABELLA_UTENTI = client.db("valutazioneDocenti").collection("utenti")
const TABELLA_PROFESSORI = client.db("valutazioneDocenti").collection("professori")
const TABELLA_DOMANDE = client.db("valutazioneDocenti").collection("domande")

let loggato = false
let classe_alunno_loggato = undefined
const PORT = 3001
const app = express()

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use(cors())
app.options('*', cors())

//Funzione per connetteri a mongodb
const connessione = async () => {
    try {
        await client.connect()
    } catch (error) {
        throw error
    }
}

//Restituisco quelle variabili che al caricamento della pagina vanno perdute
app.get('/variabili_onload', (req, res) => {
    res.json({
        credenziali_res: loggato
    })
});

//Accesso alla piattaforma
app.post('/login', (req, res) => {
    connessione()

    let dati_utenti = TABELLA_UTENTI.find().toArray()

    let email_utente = req.body.em_ut
    let password = req.body.psw
    let credenziali_corrette = false

    dati_utenti.then((dati)=>{
        dati.map((elem, i)=>{
            if(elem.email == email_utente && elem.password == password){
                credenziali_corrette = true
                loggato = true
                classe_alunno_loggato = elem.classe
            }
        })

        if(credenziali_corrette == true){
            res.status(200).json(
                {
                    credenziali_res: true,
                    message: 'Benvenuto su valutazione docenti!'
                }
            )
        } else {
            res.status(200).json(
                {
                    credenziali_res: false,
                    message: 'Credenziali non valide oppure non corrette'
                }
            )
        }
    }).finally(()=>{ client.close() })
})

//Logout dell'account
app.get('/logout', (req, res) => {
    loggato = false
    
    res.json({
        credenziali_res: loggato,
        message: "Sloggato dall'account con successo"
    })
});

//Con la get docenti ottieni tutti i docenti che insegnano nella tua classe
app.get('/getDocenti', (req, res) => {
    connessione()

    let dati_docenti = TABELLA_PROFESSORI.find().toArray()

    let classe = classe_alunno_loggato
    let docente = []
    let indice_materie = null

    dati_docenti.then((dati)=>{
        dati.map((elem)=>{
            if(elem.classi.indexOf(classe) !== -1){
                indice_materie = elem.classi.indexOf(classe)

                docente.push(
                    {
                        nome: elem.nome,
                        cognome: elem.cognome,
                        materie: elem.materie[indice_materie]
                    }
                )
            }
        })

        res.status(200).json(
            { 
                docenti: docente,
                messaggio: "I dati del docente sono stati estratti con successo!"
            }
        )
    }).finally(()=>{ client.close() })
})

//con la valutaDocente puoi votare il docente che vuoi
app.post('/valutaDocente', (req, res) => {
    
})

//Con la getDomande ottieni tutte le domanda da fare al momento della valutazione del singolo docente
app.get('/getDomande', (req, res) => {
    connessione()

    let dati_domande = TABELLA_DOMANDE.find().toArray()
    let array_domande = []

    dati_domande.then((dati)=>{
        array_domande = dati

        res.status(200).json(
            { 
                domande: array_domande,
                messaggio: 'Domande estratte!'
            }
        )
    }).finally(()=>{ client.close() })
})

//Con la get media puoi ottenere la media dei voti del docente che vuoi
app.get('/getMedia', (req, res) => {
    
})

//con la viewDocente puoi visualizzare le info sui docenti
app.get('/viewDocente', (req, res) => {
    res.end("sei alla pagina per visualizzare il singolo docente")
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`);
});
