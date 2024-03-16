//!Moduli da installare:
//!npm install express
//!npm install fs
const express = require('express');
const fs = require('fs');

const URL_CREDENZIALI = "https://raw.githubusercontent.com/1Lg20/ValutazioneDocenti/main/Credenziali.json"
let loggato = false
const PORT = 3001;
const app = express();
const PDB = './Json/dataBase.json'
const PDM = './Json/domandeProf.json'
const Tutti_Prof = './Json/ProfJSON.json'

//File json letti dal file system
let DB = JSON.parse(
    fs.readFileSync(PDB)
)
let Dati_tutti_prof = JSON.parse(
    fs.readFileSync(Tutti_Prof)
)
let DB_DOM = JSON.parse(
    fs.readFileSync(PDM)
)

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

//Ipotetica home page
app.get('/', (req, res) => {
    if(loggato == true){
        // res.send(home);
        let home = fs.readFileSync('./index.html')
        res.end(home)
    } else {
        res.end("Recarsi alla pagina login per visualizzare la pagina.")
    }
});


//Accesso alla piattaforma
app.post('/login', (req, res) => {
    let nome_utente = req.body.nm_ut
    let password = req.body.psw
    let credenziali_corrette = false

    fetch(URL_CREDENZIALI)
    .then((testo)=>testo.json())
    .then((data)=>{
        data.map((elem, i)=>{
            if(elem.username == nome_utente && elem.password == password){
                credenziali_corrette = true
                loggato = true
            }
        })

        if(credenziali_corrette == true){
            res.redirect('http://localhost:3001/')
        }
    })

    // res.end("sei al login")
})

//Con la get docenti puoi prendere le informazioni del docente che si vuole
app.get('/getDocenti', (req, res) => {
    let classe = req.query.cls.toUpperCase()
    let plesso = req.query.pls.toUpperCase()
    let docente = []
    let indice_materie = null

    if(Dati_tutti_prof[0] != undefined){
        Dati_tutti_prof.map((elem, i)=>{
            if(elem.istituto.includes(plesso) === true && elem.classi.indexOf(classe) !== -1){
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
                docente: docente,
                messaggio: "I dati del docente sono stati estratti con successo!"
            }
        )
    } else {
        res.status(400).json(
            { 
                docente: docente,
                messaggio: "Mi spiace ma al momento non è presente alcun docente."
            }
        )
    }
})

//Funzione per l'inserimento di un voto di un docente
const inserisci_nuovo_voto =(main_db, dati)=>{
    let db_tmp = main_db
    let nome_docente =  dati.nomedocente.toLowerCase()
    let cognome_docente = dati.cognomedocente.toLowerCase()
    let materia_docente = dati.materie[0].nomemateria
    let id_domanda = dati.materie[0].valutazioni[0].domanda
    let voto_docente = dati.materie[0].valutazioni[0].voto
    let classe_alunno = dati.materie[0].valutazioni[0].classealunno
    let docente_presente = false
    let materia_docente_presente = false

    db_tmp.map((elem, i)=>{
        if( elem.cognomedocente.toLowerCase() === cognome_docente.toLowerCase() &&
            elem.nomedocente.toLowerCase() === nome_docente.toLowerCase()
        ){
            docente_presente = true
            
            elem.materie.map((mat, i)=>{
                if(mat.nomemateria.toLowerCase() === materia_docente.toLowerCase()){
                    materia_docente_presente = true 

                    mat.valutazioni.push(
                        {
                            "classealunno": classe_alunno.toUpperCase(),
                            "domanda": id_domanda,
                            "voto": voto_docente
                        }
                    )
                }
            })

            if (materia_docente_presente === false){
                elem.materie.push(
                    {
                        "nomemateria": materia_docente.toUpperCase(),
                        "valutazioni" : [
                            {
                                "classealunno": classe_alunno.toUpperCase(),
                                "domanda": id_domanda,
                                "voto": voto_docente
                            }
                        ]
                    }
                )

                console.log(elem.materie)
            }
        } 
    })

    if(docente_presente === false){
        db_tmp.push(dati)
    }

    fs.writeFileSync(PDB, JSON.stringify(db_tmp, null, 2), 'utf-8');
}

//con la valutaDocente puoi votare il docente che vuoi
app.post('/valutaDocente', (req, res) => {
    let cog_doc = req.body.cog_dc
    let nom_doc = req.body.nom_dc
    let mat = req.body.nm_mat
    let voto = req.body.voto
    let id_dom = req.body.desc
    let classe = req.body.cls

    let info_da_inserire = {
        "cognomedocente": cog_doc,
        "nomedocente": nom_doc,
        "materie": [
            {
                "nomemateria": mat.toUpperCase(),
                "valutazioni" : [
                    {
                        "classealunno": classe.toUpperCase(),
                        "domanda": id_dom,
                        "voto": voto
                    }
                ]
            }
        ]
    }

    inserisci_nuovo_voto(DB, info_da_inserire)

    res.end("sei alla pagina per l'inserimento dei voti di un docente")
})

//Con la getDomande ottieni tutte le domanda da fare al momento della valutazione del singolo docente
app.get('/getDomande', (req, res) => {
    res.status(200).json(
        { 
            domande: DB_DOM,
            messaggio: 'Domande estratte!'
        }
    )
})

//Con la get media puoi ottenere la media dei voti del docente che vuoi
app.get('/getMedia', (req, res) => {
    let cognome_docente = req.query.cog_dc
    let nome_docente = req.query.nom_dc
    let materia_docente = req.query.nm_mat
    let somma_voti = 0
    let n_voti = 0
    let media_docente = 0

    if(DB[0] != undefined){
        DB.map((elem, i)=>{
            if( elem.cognomedocente.toLowerCase() === cognome_docente.toLowerCase() && 
                elem.nomedocente.toLowerCase() === nome_docente.toLowerCase()
            ){

                elem.materie.map((mat, x)=>{
                    if(mat.nomemateria.toLowerCase() === materia_docente.toLowerCase()){
                        n_voti = mat.valutazioni.length

                        mat.valutazioni.map((vt, y)=>{
                            somma_voti += parseInt(vt.voto)
                        })
                    }
                })
            }  
        })

        media_docente = somma_voti / n_voti

        res.status(200).json(
            { 
                media: media_docente,
                messaggio: `Ecco la media del docente ${cognome_docente}!`
            }
        )
    } else {
        res.status(400).json(
            { 
                media: media_docente,
                messaggio: "Mi spiace ma al momento questo docente non è stato registrato. Votalo per registrarlo"
            }
        )
    }
})

//con la viewDocente puoi visualizzare le info sui docenti
app.get('/viewDocente', (req, res) => {
    res.end("sei alla pagina per visualizzare il singolo docente")
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`);
});
