//!Moduli da installare:
//!npm install express
//!npm install cors
//!npm install mongodb
const express = require("express")
const cors = require("cors")
const { MongoClient } = require("mongodb")

const app = express()
const PORT = 5001
const client = new MongoClient("mongodb://localhost:27017")
const connessione = async ()=>{ await client.connect }

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(cors())
app.options('*', cors())

app.get('/carica_utenti', async(req, res) => {
    connessione()

    const miaCollection = client.db("valutazioneDocenti").collection("utenti")
    
    miaCollection.insertMany(
        [
            {email: 'admin@denina.it', password: 'admin', classe: 'admin', docenti_valutati: [], token: ""}, 
            {email: 'alba.lucafrancesco@denina.it', password: 'alba.lucafrancesco', classe: '5L', docenti_valutati: [], token: ""}, 
            {email: 'audisio.nicolo@denina.it', password: 'audisio.nicolo', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'baqiqi.francesco@denina.it', password: 'baqiqi.francesco', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'barra.erik@denina.it', password: 'barra.erik', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'barra.leonardo@denina.it', password: 'barra.leonardo', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'bastonero.stefano@denina.it', password: 'bastonero.stefano', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'bianco.andrea@denina.it', password: 'bianco.andrea', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'bondar.oleksandr@denina.it', password: 'bondar.oleksandr', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'bracco.mattia@denina.it', password: 'bracco.mattia', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'canino.leonardo@denina.it', password: 'canino.leonardo', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'castellano.gabriele@denina.it', password: 'castellano.gabriele', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'chen.lihua@denina.it', password: 'chen.lihua', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'culasso.edoardo@denina.it', password: 'culasso.edoardo', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'de.bonisimone@denina.it', password: 'de.bonisimone', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'dimarco.mirko@denina.it', password: 'dimarco.mirko', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'dossetto.giuseppe@denina.it', password: 'dossetto.giuseppe', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'elakhdar.ayoub@denina.it', password: 'elakhdar.ayoub', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'fortunato.marcochiaffredo@denina.it', password: 'fortunato.marcochiaffredo', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'galeasso.federico@denina.it', password: 'galeasso.federico', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'galfre.beniaminomaria@denina.it', password: 'galfre.beniaminomaria', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'garello.matteo@denina.it', password: 'garello.matteo', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'garnero.luca@denina.it', password: 'garnero.luca', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'garnerone.stefano@denina.it', password: 'garnerone.stefano', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'giusiano.massimo@denina.it', password: 'giusiano.massimo', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'kadiasi.daniele@denina.it', password: 'kadiasi.daniele', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'lepori.gabriele@denina.it', password: 'lepori.gabriele', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'martini.gabriele@denina.it', password: 'martini.gabriele', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'masante.federico@denina.it', password: 'masante.federico', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'mazzone.samuele@denina.it', password: 'mazzone.samuele', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'minetti.leonardo@denina.it', password: 'minetti.leonardo', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'monge.isacco@denina.it', password: 'monge.isacco', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'occelli.emanuel@denina.it', password: 'occelli.emanuel', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'pal.bhushan@denina.it', password: 'pal.bhushan', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'paseri.kevin@denina.it', password: 'paseri.kevin', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'pellitta.francesco@denina.it', password: 'pellitta.francesco', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'ramello.sebastiano@denina.it', password: 'ramello.sebastiano', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'ribotta.gabriele@denina.it', password: 'ribotta.gabriele', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'singh.siddharth@denina.it', password: 'singh.siddharth', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'soave.sebastiano@denina.it', password: 'soave.sebastiano', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'stefanin.francesco@denina.it', password: 'stefanin.francesco', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'vaschetto.emanuele@denina.it', password: 'vaschetto.emanuele', classe: '5L', docenti_valutati: [], token: ""},
            {email: 'volpe.giovanni@denina.it', password: 'volpe.giovanni', classe: '4L', docenti_valutati: [], token: ""},
            {email: 'zhou.chenghuan@denina.it', password: 'zhou.chenghuan', classe: '5L', docenti_valutati: [], token: ""}
        ]
    )

    res.json({risposta: "Utenti caricati con successo"})
})

app.get('/carica_domande', (req, res) => {
    connessione()

    const collect = client.db("valutazioneDocenti").collection("domande")

    collect.insertMany(
        [
            {question:"L'insegnante espone gli argomenti in modo chiaro ed efficace con opportuni esempi.", id:"q001"},
            {question:"L'insegnante si mostra disponibile per chiarimenti e in caso attua strategie di recupero e/o approfondimento.", id:"q002"},
            {question:"L'insegnante è disponibile ad aiutare il singolo a sviluppare un metodo di apprendimento e di lavoro per quanto riguarda la sua materia.", id:"q003"},
            {question:"L'insegnante utilizza, oltre al libro di testo, strumenti e contenuti aggiuntivi utili alla didattica.", id:"q004"},
            {question:"I metodi didattici utilizzati dall'insegnante favoriscono l'apprendimento del corso di studi.", id:"q005"},
            {question:"Il carico di lavoro è conforme alle esigenze e alle possibilità degli studenti.", id:"q006"},
            {question:"La programmazione delle verifiche ed attività è adeguata e viene comunicata con buon anticipo.", id:"q007"},
            {question:"I tempi di correzione delle prove scritte rispettano i 15 giorni previsti dalla norma.", id:"q008"},
            {question:"L'insegnante, insieme agli studenti, riesce a mantenere la disciplina all'interno della classe e a creare un ambiente sereno e costruttivo.", id:"q009"},
            {question:"L'insegnante si dimostra attento a valorizzare interessi e attitudini degli studenti.", id:"q010"}
        ]
    )

    res.json({risposta: "Domande caricate con successo"})
})

app.get('/carica_professori', (req, res) => {
    connessione()

    const collect=client.db("valutazioneDocenti").collection("professori")

    collect.insertMany(
        [
			// INIZIO Giusiano
            {
                "nome":"Manuela",
                "cognome":"Dalbesio",
                "classi": ["3L", "4L", "5L"],
                "materie": [
                    ["SISTEMI E RETI", "INFORMATICA"],
                    ["SISTEMI E RETI", "INFORMATICA"], 
                    ["SISTEMI E RETI", "INFORMATICA", "GESTIONE PROGETTO"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Pierangelo",
                "cognome": "Verga",
                "classi": ["2L", "3L", "4L", "5L"],
                "materie": [
                    ["STA"],
                    ["SISTEMI E RETI"],
                    ["SISTEMI E RETI"],
                    ["SISTEMI E RETI", "GESTIONE PROGETTO"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Flaviano",
                "cognome":"Monge",
                "classi": ["3L", "4L", "5L"],
                "materie": [
                    ["INFORMATICA"],
                    ["INFORMATICA"],
                    ["INFORMATICA"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Monica",
                "cognome": "Rosso",
                "classi": ["1X", "4L", "5F"],
                "materie": [
                    ["INGLESE"],
                    ["INGLESE"],
                    ["INGLESE"]
                ],
                "istituto":["RIVOIRA"]
            },
			// FINE Giusiano

			// INIZIO Paseri
            {
                "nome":"Carlotta",
                "cognome":"Rosso",
                "classi_materie": [
                    {
                        "nome": "4L",
                        "materie": ["EDUCAZIONE FISICA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "5L",
                        "materie": ["EDUCAZIONE FISICA"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "nome":"Giovanna",
                "cognome":"Migliore",
                "classi_materie": [
                    {
                        "nome": "4L",
                        "materie": ["LINGUA E LETTERATURA ITALIANA", "STORIA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "5L",
                        "materie": ["LINGUA E LETTERATURA ITALIANA", "STORIA"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "nome":"Raffaella",
                "cognome":"Cometto",
                "classi_materie": [
                    {
                        "nome": "2L",
                        "materie": ["MATEMATICA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "4L",
                        "materie": ["MATEMATICA"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "nome":"Nazareno",
                "cognome":"Muratore",
                "classi_materie": [
                    {
                        "nome": "4L",
                        "materie": ["TELECOMUNICAZIONI"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
			// FINE Paseri

			// INIZIO Galeasso
            {
                "nome":"Patrick",
                "cognome":"Gourdain",
                "classi": ["4L"],
                "materie": [
                    ["TELECOMUNICAZIONI"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Enrico",
                "cognome":"Allione",
                "classi": ["1L", "4L", "5L"],
                "materie": [
                    ["INFORMATICA"],
                    ["TPSIT"],
                    ["TPSIT"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Andrea",
                "cognome":"Giordano",
                "classi": ["1L", "4A", "4L", "5L"],
                "materie": [
                    ["INFORMATICA"],
                    ["INFORMATICA"],
                    ["TPSIT"],
                    ["TPSIT"]
                ],
                "istituto":["Denina","RIVOIRA"]
            },
            {
                "nome":"Sara",
                "cognome":"Obertino",
                "classi": ["4L", "5L"],
                "materie":[
                    ["RELIGIONE"],
                    ["RELIGIONE"]
                ],
                "istituto":["RIVOIRA"]
            },
			// FINE Galeasso

			// INIZIO Culasso
            {
                "nome":"Rossella",
                "cognome":"Rossaro",
                "classi": ["4L", "5L"],
                "materie":[
                    ["EDUCAZIONE CIVICA"],
                    ["EDUCAZIONE CIVICA"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Laura",
                "cognome":"Cavallera",
                "classi": ["5L"],
                "materie":[
                    ["MATEMATICA"]
                ],
                "istituto":["RIVOIRA"]
            },
            {
                "nome":"Carlo",
                "cognome":"Depetris",
                "classi": ["5L"],
                "materie":[
                    ["INGLESE"]
                ],
                "istituto":["RIVOIRA"]
            }
			// FINE Culasso
        ]
    )

    res.json({risposta: "Professori caricati con successo"})
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`);
});
