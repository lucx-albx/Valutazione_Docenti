//!Moduli da installare:
//!npm install express
//!npm install cors
//!npm install mongodb
//!npm install dotenv
require('dotenv').config()

const express = require('express')
const cors = require("cors")
const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017") 

const TABELLA_UTENTI = client.db("valutazioneDocenti").collection("utenti")
const TABELLA_PROFESSORI = client.db("valutazioneDocenti").collection("professori")
const TABELLA_DOMANDE = client.db("valutazioneDocenti").collection("domande")
const TABELLA_VOTI_DOCENTI = client.db("valutazioneDocenti").collection("votiDocenti")

const PORT = 3001
const app = express()
const QTADOM = 10 //Il numero di domande che ci sono nel db

let admin_email = process.env.EMAIL_ADMIN

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(cors())
app.options('*', cors())

//Funzione per connetteri a mongodb
const connessione = async () => {
    try {
        await client.connect()
    } catch (e) {
        throw e
    }
}

//Funzione per costruire id delle domande
const id_domande =(qta_dom)=>{
    let id = []
    let i = 0

    for(i = 0; i < qta_dom; i++){
        if((i+1) < 10){
            id.push('00' + (i+1))
        }
        
        if((i+1) > 9 && (i+1) < 99){
            id.push('0' + (i+1))
        } 
        
        if((i+1) > 99){
            id.push(String(i+1))
        }
    }

    return id
}

//Calcola la media per il middleware viewDocente
const calcola_media =(voti)=>{
    let ndom = QTADOM
    let id_voto = voti
    let nvoti = id_voto.length/ndom
    let lista_id = id_domande(ndom)
    let lista_media = []

    lista_id.map((elem) => {
        let som = 0
        let med = 0

        id_voto.map((item) => {
            if (item.id === elem) {
                som += item.voto
                med = som/nvoti
            }
        })

        lista_media.push({id: elem, media: med})
    })

    return lista_media
}

//Middleware per fare l'accesso alla piattaforma
app.post('/login', async(req, res) => {
    let email_utente = req.body.em_ut
    let password = req.body.psw
    let credenziali_corrette = false
    let tk = ''

    try{
        await connessione()
        const dati_utenti = await TABELLA_UTENTI.find().toArray()

        dati_utenti.map((elem, i)=>{
            if(elem.email == email_utente && elem.password == password){
                credenziali_corrette = true
                loggato = true
                email_alunno_loggato = elem.email
                classe_alunno_loggato = elem.classe
                tk = elem.token
            }
        })

        if(credenziali_corrette == true){
            res.status(200).json(
                {
                    credenziali_res: true,
                    tuo_token: tk,
                    messaggio: 'Benvenuto su valutazione docenti!'
                }
            )
        } else {
            res.status(200).json(
                {
                    credenziali_res: false,
                    tuo_token: undefined,
                    messaggio: 'Credenziali non valide oppure non corrette'
                }
            )
        }
    } catch(e){
        res.status(200).json(
            {
                messaggio: 'Errore nel server, riprovare'
            }
        )
    } finally {
        client.close()
    }
})

//Middlware per controllare se l'utente è un admin
app.post('/admin', async(req, res) => {
    let tk = req.body.token
    let email_utente = ""

    try{
        await connessione()
        const dati_utenti = await TABELLA_UTENTI.find().toArray()
        
        dati_utenti.map((elem, i)=>{
            if(elem.token === tk){
                email_utente = elem.email
            }
        })

        if(email_utente === admin_email){
            res.status(200).json(
                {
                    admin: true,
                }
            )
        } else {
            res.status(200).json(
                {
                    admin: false,
                }
            )
        }
    } catch(e){
        res.status(200).json(
            {
                messaggio: 'Errore nel server, riprovare la connessione'
            }
        )
    } finally {
        client.close()
    }
})

//Middlware per ottenre tutti i docenti che insegnano nella tua classe
app.post('/getDocenti', async(req, res) => {
    let tk = req.body.token
    let classe = ""
    let docente = []
    let docenti_alunno_valutati = []
    let indice_materie = null

    try{
        //Cerco classe e docenti valutati dall'alunno in questione
        await connessione()
        
        const dati_utenti = await TABELLA_UTENTI.find({token: tk}).toArray()
        classe = dati_utenti[0].classe
        docenti_alunno_valutati = dati_utenti[0].docenti_valutati

        //Carico i docenti ancora da valutare dell'alunno
        await connessione()

        const dati_proferssori = await TABELLA_PROFESSORI.find().toArray()

        dati_proferssori.map((elem)=>{
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
        
    } catch(e) {
        res.status(500).json({
            messaggio: "Si è verificato un errore durante il caricamento dei dati."
        })
    } finally {
        client.close()
    }
})

//Middleware per inserire la valutazione di un docente nel db
app.post('/valutaDocente', async(req, res) => {
    let cog_doc = req.body.cognome_docente_votato
    let nom_doc = req.body.nome_docente_votato
    let tk = req.body.token
    let voti = req.body.voti
    let id_dom = id_domande(QTADOM)
    let i = 0
    let valutazioni_classe = []

    try {
        //Cerco la classe dell'alunno
        await connessione()

        const dati = await TABELLA_UTENTI.find({ token: tk }).toArray()
        let classe = dati[0].classe

        //Filtri
        let filtro_docente = {
            "cognomedocente": cog_doc,
            "nomedocente": nom_doc
        }

        let filtro_alunno = {
            "token": tk
        }

        //Strutture da impostare nel db
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
            struttura_iniziale.valutazioni.push(elem);
        })

        //Inserimento dati nella tabella delle valutazioni dei docenti
        await connessione()

        const datiVoti = await TABELLA_VOTI_DOCENTI.find().toArray()

        let docente_valutato = false

        datiVoti.map((elem)=>{
            if(elem.cognomedocente === cog_doc && elem.nomedocente === nom_doc){
                docente_valutato = true
            }
        })

        if(docente_valutato === true){
            await TABELLA_VOTI_DOCENTI.updateOne(
                filtro_docente, 
                { $push: { "valutazioni": { $each: valutazioni_classe } } }
            )

            await TABELLA_UTENTI.updateOne(
                filtro_alunno, 
                { $push: { "docenti_valutati": { nome_docente: nom_doc, cognome_docente: cog_doc } } }
            )
        } else {
            await TABELLA_VOTI_DOCENTI.insertOne(struttura_iniziale)

            await TABELLA_UTENTI.updateOne(
                filtro_alunno, 
                { $push: { "docenti_valutati": { nome_docente: nom_doc, cognome_docente: cog_doc } } }
            )
        }

        res.status(200).json({
            messaggio: "Valutazione inviata!"
        })
    } catch (e) {
        res.status(500).json({
            messaggio: "Si è verificato un errore durante l'inserimento dei dati."
        })
    } finally {
        client.close()
    }
})

//Middleware per ottienre tutte le domanda da fare al momento della valutazione del singolo docente
app.get('/getDomande', async(req, res) => {
    let array_domande = []

    try{
        await connessione()
        const dati_domande = await TABELLA_DOMANDE.find().toArray()
        
        array_domande = dati_domande

        res.status(200).json(
            { 
                domande: array_domande,
                messaggio: 'Domande estratte!'
            }
        )
    } catch (e) {
        res.status(500).json({
            messaggio: "Si è verificato un errore durante l'inserimento dei dati."
        })
    } finally {
        client.close()
    }
})

//con la viewDocente puoi visualizzare le info sui docenti
app.post('/viewDocente', async(req, res) => {
    let nome = req.body.nome_docente
    let cognome = req.body.cognome_docente
    let voti_dom = []

    try{
        await connessione()

        const dati_docenti = await TABELLA_VOTI_DOCENTI.find({cognomedocente: cognome, nomedocente: nome}).toArray()

        console.log(dati_docenti[0].valutazioni)
        
        dati_docenti[0].valutazioni.map((elem)=>{
            voti_dom.push({id:elem.domanda, voto:elem.voto})
        })

        let media_voti = calcola_media(voti_dom)

        res.status(500).json({
            media: media_voti,
            messaggio: "Media docente calcolata!"
        })
    } catch(e){
        res.status(500).json({
            messaggio: "Si è verificato un errore durante l'inserimento dei dati."
        })
    } finally {
        client.close()
    }
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`)
})
