//!Moduli da installare:
//!npm install express
//!npm install cors
//!npm install mongodb
const express = require('express');
const cors = require("cors")
const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017") 

const TABELLA_UTENTI = client.db("valutazioneDocenti").collection("utenti")
const TABELLA_PROFESSORI = client.db("valutazioneDocenti").collection("professori")
const TABELLA_DOMANDE = client.db("valutazioneDocenti").collection("domande")
const TABELLA_VOTI_DOCENTI = client.db("valutazioneDocenti").collection("votiDocenti")

const PORT = 3001
const app = express()

let loggato = false
let classe_alunno_loggato = undefined
let email_alunno_loggato = ""
let docenti_alunno_valutati = []

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

const docenti_valutati =()=>{
    connessione()

    docenti_alunno_valutati = []

    TABELLA_UTENTI.find().toArray()
    .then((dati)=>{
        dati.map((elem)=>{
            if(elem.email === email_alunno_loggato){
                elem.docenti_valutati.map((info)=>{
                    docenti_alunno_valutati.push(info)
                })
            }
        })
    }).finally(()=>{ client.close() })
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
                email_alunno_loggato = elem.email
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
    docenti_valutati()

    let dati_docenti = TABELLA_PROFESSORI.find().toArray()

    let classe = classe_alunno_loggato
    let docente = []
    let indice_materie = null

    dati_docenti.then((dati)=>{
        dati.map((elem)=>{
            if(elem.classi.indexOf(classe) !== -1){
                indice_materie = elem.classi.indexOf(classe)

                let docente_gia_votato = docenti_alunno_valutati.some(obj => obj.nome_docente === elem.nome && obj.cognome_docente === elem.cognome)
                
                if(docente_gia_votato !== true){
                    docente.push(
                        {
                            nome: elem.nome,
                            cognome: elem.cognome,
                            materie: elem.materie[indice_materie]
                        }
                    )
                }
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
    let cog_doc = req.body.cognome_docente_votato
    let nom_doc = req.body.nome_docente_votato
    let id_dom = req.body.domande
    let voti = req.body.voti
    let classe = classe_alunno_loggato
    let i = 0
    let valutazioni_classe = []

    let filtro_docente = {
        "cognomedocente": cog_doc,
        "nomedocente": nom_doc
    }

    let filtro_alunno = {
        "email": email_alunno_loggato
    }

    let struttura_iniziale = {
        "cognomedocente": cog_doc,
        "nomedocente": nom_doc,
        "valutazioni" : []
    }

    for(i = 0; i < voti.length; i++){
        valutazioni_classe.push(
            {
                "classealunno": classe,
                "domanda": id_dom[i],
                "voto": voti[i]
            }
        )
    }

    valutazioni_classe.map((elem, i)=>{
        struttura_iniziale.valutazioni.push(elem)
    })

    //Inserimento dati nella tabella delle valutazioni dei docenti
    connessione()

    // Recupero dei dati dei voti dei docenti e inserimento dei nuovi dati
    TABELLA_VOTI_DOCENTI.find().toArray()
    .then((dati) => {
        if (dati.length !== 0) {
            let docente_valutato = false

            dati.map((elem)=>{
                if(dati.cognomedocente === cog_doc && dati.nomedocente === nom_doc){
                    docente_valutato = true
                }
            })
            
            //Se il docente è stato già valutato gli inserisco le nuove valutazioni altrimenti inserisco il docente
            if(docente_valutato === true){
                return TABELLA_VOTI_DOCENTI.updateOne(
                    filtro_docente, 
                    { $push: { "valutazioni": { $each: valutazioni_classe } } 
                }) 
                && 
                TABELLA_UTENTI.updateOne(
                    filtro_alunno, 
                    { $push: { "docenti_valutati": { nome_docente: nom_doc, cognome_docente: cog_doc } } 
                })
            } else {
                return TABELLA_VOTI_DOCENTI.insertOne(struttura_iniziale) 
                && 
                TABELLA_UTENTI.updateOne(
                    filtro_alunno, 
                    { $push: { "docenti_valutati": { nome_docente: nom_doc, cognome_docente: cog_doc } } 
                })
            }
        } else {
            //Inserisco il primo docente valutato nel db
            return TABELLA_VOTI_DOCENTI.insertOne(struttura_iniziale) 
            && 
            TABELLA_UTENTI.updateOne(
                filtro_alunno, 
                { $push: { "docenti_valutati": { nome_docente: nom_doc, cognome_docente: cog_doc } } 
            })
        }
    })
    .then(() => {
        res.status(200).json({
            messaggio: "Valutazione inviata!"
        })
    })
    .catch((err) => {
        res.status(500).json({
            errore: "Si è verificato un errore durante l'inserimento dei dati."
        })
    })
    .finally(() => {
        client.close()
    })
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
    res.end("sei alla pagina per visualizzare la media del docente")
})

//con la viewDocente puoi visualizzare le info sui docenti
app.get('/viewDocente', (req, res) => {
    res.end("sei alla pagina per visualizzare il singolo docente")
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`);
});
