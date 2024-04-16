//!Moduli da installare:
//!npm install express
//!npm install cors
//!npm install mongodb
//!npm install dotenv
//!npm install crypto
//!npm install pdfkit
//!npm install fs
require('dotenv').config()
const express = require('express')
const cors = require("cors")
const { MongoClient } = require("mongodb")
const crypto = require('crypto')
const PDFDocument = require('pdfkit')
const fs = require('fs')

const client = new MongoClient("mongodb://localhost:27017") 

const TABELLA_ACCESSI = client.db("valutazioneDocenti").collection("accessi")
const TABELLA_UTENTI = client.db("valutazioneDocenti").collection("utenti")
const TABELLA_DOMANDE = client.db("valutazioneDocenti").collection("domande")
const TABELLA_VOTI_DOCENTI = client.db("valutazioneDocenti").collection("votiDocenti")

const PORT = 3001
const app = express()
const QTADOM = process.env.NUMERO_DOMANDE
const LOGIN = process.env.API_LOGIN
const LOGOUT = process.env.API_LOGOUT
const RUOLO_UTENTE = process.env.API_RUOLO_UTENTE
const GET_NOME_COGNOME_DOCENTE = process.env.API_GET_NOME_COGNOME_DOCENTE
const GET_DOCENTI_CLASSE = process.env.API_GET_DOCENTI_CLASSE
const GET_DOMANDE = process.env.API_GET_DOMANDE
const VALUTA_DOCENTE = process.env.API_VALUTA_DOCENTE
const ADMIN_CONSOLE = process.env.API_ADMIN_CONSOLE
const START_STOP_VALUTAZIONI = process.env.API_START_STOP_VALUTAZIONI
const CARICA_STUDENTI = process.env.API_CARICA_STUDENTI
const CARICA_DOCENTI = process.env.API_CARICA_DOCENTI
const GET_DOCENTI = process.env.API_GET_DOCENTI
const VIEW_DOCENTE = process.env.API_VIEW_DOCENTE
const SCARICA_PDF_VALUTAZIONI = process.env.API_SCARICA_PDF_VALUTAZIONI

let domande = []
let valutazioni_avviate = false

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

//Funzione per calcolare id domande
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

//Calcola la media per il middleware viewDocente
const calcola_media =(voti)=>{
    let ndom = QTADOM
    let id_voto = voti
    let nvoti = id_voto.length/ndom
    let lista_id = id_domande(ndom)
    let lista_media = []

    lista_id.map((elem, i) => {
        let som = 0
        let med = 0

        id_voto.map((item) => {
            if (item.id === elem) {
                som += item.voto
                med = som/nvoti
            }
        })

        lista_media.push({domanda: domande[i].domanda, media: med.toFixed(2)})
    })

    return lista_media
}

//Funzione per generare il token in chiaro
const genera_token =(em)=>{
    // Genera un array con 10.000 elementi
    const array = Array.from({ length: 10000 }, (_, index) => index + 1)

    // Estrae un dato casuale dall'array
    const index = Math.floor(Math.random() * array.length)
    const dato = array[index]

    return em + String(dato)
}

//Funzione per la crittografia sha256
function crittografia_sha256(psw) {
	return new Promise((resolve, reject) => {
		const password = psw
		const data = Buffer.from(password)
		const hash = crypto.createHash('sha256')	
		
		hash.on('error', (error) => {
			reject(error)
		})

		hash.on('readable', () => {
			const hashData = hash.read()
			if (hashData) {
				const hashHex = hashData.toString('hex')
				resolve(hashHex)
			}
		})

		hash.write(data)
		hash.end()
	})
}

//Middleware per fare l'accesso alla piattaforma
app.post(LOGIN, async(req, res) => {
    let email_utente = req.body.user
    let pass = req.body.password
    let credenziali_corrette = false
    let tk = ''

    try{
        await connessione()
        const dati_accessi = await TABELLA_ACCESSI.find().toArray()

        dati_accessi.map((elem, i)=>{
            if(elem.email == email_utente && elem.password == pass){
                credenziali_corrette = true
                loggato = true
            }
        })

        if(credenziali_corrette == true){
            tk = await crittografia_sha256(genera_token(email_utente))

            await TABELLA_UTENTI.updateOne(
                {email: email_utente},
                {$set: {"token": tk}}
            )

            res.status(200).json(
                {
                    credenziali_res: true,
                    tuo_token: tk,
                    messaggio: 'Benvenuto su valutazione docenti!'
                }
            )
        } else {
            res.json(
                {
                    credenziali_res: false,
                    tuo_token: undefined,
                    messaggio: 'Credenziali non valide oppure non corrette'
                }
            )
        }
    } catch(e){
        res.status(500).json(
            {
                messaggio: 'Errore nel server, riprovare'
            }
        )
    } finally {
        client.close()
    }
})

//Middleware per sloggare l'utente dall'account
app.post(LOGOUT, async(req, res) => {
    let tk = req.body.token

    try{
        await connessione()
        const dati_utenti = await TABELLA_UTENTI.find({token: tk}).toArray()

        if(dati_utenti[0].token !== "" && dati_utenti.length !== 0){
            if(dati_utenti.length !== 0){
                await TABELLA_UTENTI.updateOne(
                    {token: tk},
                    {$set: {"token": ''}}
                )

                res.status(200).json(
                    {
                        successo: true,
                        messaggio: "Sloggato con successo"
                    }
                )
            } else {
                res.json(
                    {
                        successo: false,
                        messaggio: "Errore nella verifica dell'account"
                    }
                )
            }
        } else {
            res.json({
                docenti: null,
                messaggio: "Autenticazione fallita"
            })
        }
    } catch(e){
        res.status(500).json(
            {
                successo: false,
                messaggio: 'Errore nel server, riprovare'
            }
        )
    } finally {
        client.close()
    }
})

//Middlware per controllare ruolo dell'utente
app.post(RUOLO_UTENTE, async(req, res) => {
    let tk = req.body.token
    let ruolo_utente = ""

    try{
        await connessione()
        const dati_utenti = await TABELLA_UTENTI.find().toArray()
        
        dati_utenti.map((elem, i)=>{
            if(elem.token === tk && elem.token !== ""){
                ruolo_utente = elem.tipo
            }
        })

        res.status(200).json(
            {
                tipo: ruolo_utente,
                messaggio: 'Ruolo trovato con successo'
            }
        )
    } catch(e){
        res.status(200).json(
            {
                tipo: '',
                messaggio: 'Errore nel server, riprovare la connessione'
            }
        )
    } finally {
        client.close()
    }
})

//Middlware per ottenre il nome ed il cognome del docente
app.post(GET_NOME_COGNOME_DOCENTE, async(req, res) => {
    let tk = req.body.token

    try{
        await connessione()
        const dati_utenti = await TABELLA_UTENTI.find({token: tk}).toArray()
        
        if(dati_utenti[0].tipo === "D" && dati_utenti[0].token !== "" && dati_utenti.length !== 0){
            res.status(200).json(
                {
                    nome: dati_utenti[0].nome,
                    cognome: dati_utenti[0].cognome,
                    messaggio: 'Nome e cognome trovati!'
                }
            )
        } else {
            res.status(200).json(
                {
                    nome: dati_utenti[0].nome,
                    cognome: dati_utenti[0].cognome,
                    messaggio: 'Non sei autorizzato'
                }
            )
        }
    } catch(e){
        res.status(200).json(
            {
                nome: null,
                cognome: null,
                messaggio: 'Errore nel server, riprovare la connessione'
            }
        )
    } finally {
        client.close()
    }
})

//Middlware per ottenre tutti i docenti che insegnano nella tua classe
app.post(GET_DOCENTI_CLASSE, async(req, res) => {
    let tk = req.body.token
    let classe = ""
    let docente = []
    let docenti_alunno_valutati = []

    if(valutazioni_avviate === true){
        try{
            //Cerco classe e docenti valutati dall'alunno in questione
            await connessione()
            
            const dati_singolo_utente = await TABELLA_UTENTI.find({token: tk}).toArray()

            if(dati_singolo_utente[0].token !== "" && dati_singolo_utente.length !== 0){
                if(dati_singolo_utente[0].tipo === "S"){
                    classe = dati_singolo_utente[0].classe
                    docenti_alunno_valutati = dati_singolo_utente[0].docenti_valutati
                }

                const dati_utenti = await TABELLA_UTENTI.find().toArray()

                dati_utenti.map((elem)=>{
                    if(elem.tipo === "D"){
                        elem.classi_materie.map((info)=>{
                            if(info.nome === classe){
                                let materie = info.materie

                                let docente_gia_votato = docenti_alunno_valutati.some(obj => obj.nome_docente === elem.nome && obj.cognome_docente === elem.cognome)
                            
                                if(docente_gia_votato !== true){
                                    docente.push(
                                        {
                                            nome: elem.nome,
                                            cognome: elem.cognome,
                                            materie: materie
                                        }
                                    )
                                }
                            }
                        })
                    }
                })

                res.status(200).json(
                    {
                        docenti: docente,
                        messaggio: "I dati del docente sono stati estratti con successo!",
                        valuta: true
                    }
                )
            } else {
                res.json({
                    docenti: null,
                    messaggio: "Autenticazione fallita",
                    valuta: null
                })
            }
        } catch(e) {
            res.status(500).json({
                docenti: null,
                messaggio: "Si è verificato un errore durante il caricamento dei dati.",
                valuta: null
            })
        } finally {
            client.close()
        }
    } else {
        res.json({
            docenti: null,
            messaggio: "Non è ancora possibile valutare i docenti",
            valuta: false
        })
    }
})

//Middleware per inserire la valutazione di un docente nel db
app.post(VALUTA_DOCENTE, async(req, res) => {
    let cog_doc = req.body.cognome_docente
    let nom_doc = req.body.nome_docente
    let tk = req.body.token
    let valutazioni = req.body.valutazioni
    let i = 0
    let valutazioni_classe = []

    if(valutazioni_avviate === true){
        try {
            //Cerco la classe dell'alunno
            await connessione()

            const dati = await TABELLA_UTENTI.find({ token: tk }).toArray()

            if(dati[0].token !== "" && dati.length !== 0){
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

                for(i = 0; i < valutazioni.length; i++){
                    valutazioni_classe.push(
                        {
                            "classealunno": classe,
                            "domanda": valutazioni[i].idDomanda,
                            "voto": valutazioni[i].voto
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
            } else {
                res.json({
                    messaggio: "Autenticazione fallita"
                })
            }
        } catch (e) {
            res.status(500).json({
                messaggio: "Si è verificato un errore nel server"
            })
        } finally {
            client.close()
        }
    } else {
        res.json({
            messaggio: "Non puoi votare, le valutazioni sono terminate"
        })
    }
})

//Middleware per caricare i bottoni per la console dell'admin
app.post(ADMIN_CONSOLE, async(req, res) => {
    let tk = req.body.token

    try{
        await connessione()
        const dati = await TABELLA_UTENTI.find({ token: tk }).toArray()

        if(dati[0].token !== "" && dati.length !== 0){
            res.json(
                [
                    {
                        button: "Carica Studenti",
                        urlEndpoint:"carica_studenti"
                    },
                    {
                        button: "Carica Docenti",
                        urlEndpoint:"carica_docenti"
                    },
                    {
                        button: "Visualizza Docente",
                        urlEndpoint: "visualizza_docente"
                    },
                    {
                        button: "Start/Stop Valutazioni",
                        urlEndpoint: "start_stop_valutazioni"
                    }
                ]
            )
        }
    } catch (e) {
        res.status(500).json({
            domande: null,
            messaggio: "Si è verificato un errore nel server."
        })
    } finally {
        client.close()
    }
})

//Middleware per caricare gli studenti da file system tramite un json
app.post(CARICA_STUDENTI, (req, res) => {
    connessione();

    const collect = client.db("valutazioneDocenti").collection("utenti");

    // PERCORSO FILE
    const PERCORSOFILE = './json/utenti.json';

    fs.readFile(PERCORSOFILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
            return;
        }
    
        try {
            // Converti il contenuto del file JSON in un oggetto JavaScript
            const json = JSON.parse(data);
    
            // Cicla sull'array di oggetti
            json.forEach(elemento => {
                // Se il tipo è 'S', inserisce l'elemento nel db
                if (elemento.tipo === 'S') {
                    // console.log(elemento)
                    collect.insertOne(elemento);
                }
            });
        } catch (error) {
            console.error('Errore nella conversione del JSON:', error);
        }
    });

    res.json({messaggio: "Studenti caricati con successo"})
});

//Middleware per caricare i docenti da file system tramite un json
app.post(CARICA_DOCENTI, (req, res) => {
    connessione();

    const collect = client.db("valutazioneDocenti").collection("professori");

    // PERCORSO FILE
    const PERCORSOFILE = './json/utenti.json';

    fs.readFile(PERCORSOFILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
            return;
        }
    
        try {
            // Converti il contenuto del file JSON in un oggetto JavaScript
            const json = JSON.parse(data);
    
            // Cicla sull'array di oggetti
            json.forEach(elemento => {
                // Se il tipo è 'D', inserisce l'elemento nel db
                if (elemento.tipo === 'D') {
                    // console.log(elemento)
                    collect.insertOne(elemento);
                }
            });
        } catch (error) {
            console.error('Errore nella conversione del JSON:', error);
        }
    });

    res.json({messaggio: "Professori caricati con successo"})
});

//Middleware per iniziare il periodo di valutazione
app.post(START_STOP_VALUTAZIONI, async(req, res) => {
    let tk = req.body.token

    try{
        await connessione()
        const dati = await TABELLA_UTENTI.find({ token: tk }).toArray()

        if(dati[0].token !== "" && dati.length !== 0){
            if(valutazioni_avviate === false){
                valutazioni_avviate = true

                res.json({
                    valuta: valutazioni_avviate,
                    messaggio: 'Valutazioni avviate!'
                })
            } else {
                valutazioni_avviate = false

                res.json({
                    valuta: valutazioni_avviate,
                    messaggio: 'Valutazioni terminate!'
                })
            }
        }
    } catch (e) {
        res.status(500).json({
            valuta: null,
            messaggio: "Si è verificato un errore nel server."
        })
    } finally {
        client.close()
    }
})

//Middleware per ottienre tutte le domanda da fare al momento della valutazione del singolo docente
app.get(GET_DOMANDE, async(req, res) => {
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
app.post(VIEW_DOCENTE, async(req, res) => {
    let nome = req.body.nome_docente
    let cognome = req.body.cognome_docente
    let tk = req.body.token
    let voti_dom = []

    if(valutazioni_avviate === false){
        try{
            await connessione()
            
            domande = await TABELLA_DOMANDE.find().toArray()
            const dati_docenti = await TABELLA_VOTI_DOCENTI.find({cognomedocente: cognome, nomedocente: nome}).toArray()
            
            if(dati_docenti.length !== 0){
                const dati_utenti = await TABELLA_UTENTI.find({token: tk}).toArray()

                if(dati_utenti.length !== 0 && dati_utenti[0].token !== ""){
                    if(dati_utenti[0].tipo === "A" || dati_utenti[0].tipo === "D"){
                        dati_docenti[0].valutazioni.map((elem)=>{
                            voti_dom.push({id:elem.domanda, voto:elem.voto})
                        })

                        let media_voti = calcola_media(voti_dom)

                        res.status(200).json({
                            media: media_voti,
                            messaggio: "Media docente calcolata!"
                        })
                    } else {
                        res.json({
                            media: null,
                            messaggio: "Non sei autorizzato ad accedere a questa risorsa!"
                        })
                    }
                } else {
                    res.json({
                        media: null,
                        messaggio: "Non sei autorizzato ad accedere a questa risorsa!"
                    })
                }
            } else {
                res.json({
                    media: null,
                    messaggio: "Al momento questo docente è inesistente oppure non è stato votato."
                })
            }
        } catch(e){
            res.status(500).json({
                media: null,
                messaggio: "Si è verificato un errore durante il calcolo della media"
            })
        } finally {
            client.close()
        }
    } else {
        res.json({
            media: null,
            messaggio: "Al momento delle valutazioni non è possibile visualizzare la propria media, controllare al termine delle valutazioni."
        })
    }
})

//Middleware per scaricare la pagella del docente
app.post(SCARICA_PDF_VALUTAZIONI, async(req, res) => {
    let nome = req.body.nome_docente
    let cognome = req.body.cognome_docente
    let valutazioni = req.body.valutazioni
    let tk = req.body.token

    const doc = new PDFDocument()
	const filePath = `valutazioni_${nome}_${cognome}.pdf`

    if(valutazioni_avviate === false){
        try{
            await connessione()
            const dati = await TABELLA_UTENTI.find({ token: tk }).toArray()
            
            if(dati[0].token !== "" && dati[0].tipo === "D" || dati[0].tipo === "A" && dati.length !== 0){
                doc
                .fontSize(17)
                .text('I.I.S. Denina sez. ”Rivoira”\n\n', {
                    align: 'center',
                    valign: 'center'
                })

                doc
                .fontSize(25)
                .text(`Risultati delle valutazioni ottenute per il docente ${nome} ${cognome}\n`, {
                    align: 'center',
                    valign: 'center'
                })
                
                const pageWidth = doc.page.width
                const logoWidth = 204
                const xPositionLogo = (pageWidth - logoWidth) / 2

                doc.image("./img/logoDenina.png", xPositionLogo, doc.y + 20, { width: logoWidth })

                doc.addPage()

                valutazioni.map((elem, i)=>{
                    doc
                    .fontSize(12.1)
                    .text(
                        `${i+1}) ${elem.domanda}\n\nMedia dei voti ottenuti alla domanda n${i+1}°: ${elem.media}
                        `,
                        {
                            align: 'left'
                        }
                    )
                })

                doc.end()

                const writeStream = fs.createWriteStream(filePath)
                doc.pipe(writeStream)

                writeStream.on('finish', () => {
                    res.download(filePath, (err) => {
                        if (err) {
                            res.json({
                                messaggio: "Si è verificato un errore durante il download del PDF"
                            });
                        } else {
                            fs.unlinkSync(filePath)
                        }
                    })
                })
            }
        } catch(e){
            res.json({
                messaggio: "Si è verificato un errore durante la creazione del pdf"
            })
        } finally {
            client.close()
        }
    } else {
        res.json({
            messaggio: "Al momento delle valutazioni non è possibile scaricare il pdf delle proprie valutazioni."
        })
    }
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`)
})
