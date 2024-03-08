//!Moduli da installare:
//!npm install express
//!npm install fs
//!npm install crypto
const express = require('express');
const fs = require('fs');
// const crypto = require('crypto')

const URL_CREDENZIALI = "https://raw.githubusercontent.com/1Lg20/ValutazioneDocenti/main/Credenziali.json"
let loggato = false
const PORT = 3001;
const app = express();
const PDB = './dataBase.json'
let DB = JSON.parse(
        fs.readFileSync(PDB)
    )

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

//Funzione che serve per crittografare con l'algoritmo sha-256
// function criptaPassword(psw){
// 	return new Promise((resolve, reject) => {
// 		const password = psw
// 		const data = Buffer.from(password)
// 		const hash = crypto.createHash('sha256')	
		
// 		hash.on('error', (error) => {
// 			reject(error)
// 		})

// 		hash.on('readable', () => {
// 			const hashData = hash.read()
// 			if (hashData) {
// 				const hashHex = hashData.toString('hex')
// 				resolve(hashHex)
// 			}
// 		})

// 		hash.write(data)
// 		hash.end()
// 	})
// }

//Funzione per l'inserimento di un voto di un docente
const inserisci_nuovo_voto =(main_db, dati, voto)=>{
    let db_tmp = main_db
    let docente_presente = false

    db_tmp.map((elem, i)=>{
        if( elem.nome.toLowerCase() === dati.nome.toLowerCase() && 
            elem.materia.toLowerCase() === dati.materia.toLowerCase() && 
            elem.classe.toLowerCase() === dati.classe.toLowerCase()){

            docente_presente = true
            elem.voto.push(voto)
            elem.id = i
        } 
    })

    if(docente_presente === false){
        db_tmp.push(dati)
        imposta_id(db_tmp)
    }

    fs.writeFileSync(PDB, JSON.stringify(db_tmp, null, 2), 'utf-8');
}

//Imposta automaticamente gli id dei docenti
const imposta_id =(db)=>{
    console.log('ecco: ' + db)
    db.map((elem, i)=>{
        elem.id = i
    })
}

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
    // let cognome_docente = req.body.cog_dc
    // let materia_docente = req.body.nm_mat
    let classe = req.body.cls || '5L'
    let docente = []

    if(DB[0] != undefined){
        DB.map((elem, i)=>{
            if( elem.classe.toLowerCase() === classe.toLowerCase()){
                docente.push(elem.nome)
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
                messaggio: "Mi spiace ma al momento questo docente non è stato registrato. Votalo per registrarlo"
            }
        )
    }
})

//con la valutaDocente puoi votare il docente che vuoi
app.post('/valutaDocente', (req, res) => {
    let cgd = req.body.cog_dc
    let mt = req.body.nm_mat
    let vt = req.body.voto
    let des = req.body.desc
    let cls = req.body.cls

    let info_da_inserire = {
        'nome': cgd,
        'classe': cls,
        'materia': mt,
        'id': null,
        'descrizione': des,
        'voto': [ vt ]
    }

    console.log('Ecco: ' + info_da_inserire)

    inserisci_nuovo_voto(DB, info_da_inserire, vt)

    res.end("sei alla pagina per l'inserimento dei voti di un docente")
})

//Con la get media puoi ottenere la media dei voti del docente che vuoi
app.get('/getMedia', (req, res) => {
    let cognome_docente = req.query.cog_dc
    // let materia_docente = req.body.nm_mat
    // let classe = req.body.cls
    let somma_voti = 0
    let n_voti = 0
    let media_docente = 0

    if(DB[0] != undefined){
        DB.map((elem, i)=>{
            if( elem.nome.toLowerCase() === cognome_docente.toLowerCase() // && 
                // elem.materia.toLowerCase() === materia_docente.toLowerCase() && 
                // elem.classe.toLowerCase() === classe.toLowerCase()
                ){

                elem.voto.map((info, x)=>{
                    somma_voti += parseInt(info)
                })

                n_voti = elem.voto.length
            }  
        })

        media_docente = somma_voti / n_voti

        console.log(somma_voti)

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

//con la viewDocente puoi visualizzare le info sul singolo docente
app.get('/viewDocente', (req, res) => {
    res.end("sei alla pagina per visualizzare il singolo docente")
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`);
});
