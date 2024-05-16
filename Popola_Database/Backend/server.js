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

app.get('/carica_accessi', (req, res) => {
    connessione()

    const collect = client.db("Alba_ValutazioneDocenti").collection("accessi")

    collect.insertMany(
        [
            {"email": "admin@denina.it", "password": "admin"}, 
            {"email": "alba.lucafrancesco@denina.it", "password": "alba.lucafrancesco"}, 
            {"email": "audisio.nicolo@denina.it", "password": "audisio.nicolo"},
            {"email": "baqiqi.francesco@denina.it", "password": "baqiqi.francesco"},
            {"email": "barra.erik@denina.it", "password": "barra.erik"},
            {"email": "barra.leonardo@denina.it", "password": "barra.leonardo"},
            {"email": "bastonero.stefano@denina.it", "password": "bastonero.stefano"},
            {"email": "bianco.andrea@denina.it", "password": "bianco.andrea"},
            {"email": "bondar.oleksandr@denina.it", "password": "bondar.oleksandr"},
            {"email": "bracco.mattia@denina.it", "password": "bracco.mattia"},
            {"email": "canino.leonardo@denina.it", "password": "canino.leonardo"},
            {"email": "castellano.gabriele@denina.it", "password": "castellano.gabriele"},
            {"email": "chen.lihua@denina.it", "password": "chen.lihua"},
            {"email": "culasso.edoardo@denina.it", "password": "culasso.edoardo"},
            {"email": "de.bonisimone@denina.it", "password": "de.bonisimone"},
            {"email": "dimarco.mirko@denina.it", "password": "dimarco.mirko"},
            {"email": "dossetto.giuseppe@denina.it", "password": "dossetto.giuseppe"},
            {"email": "elakhdar.ayoub@denina.it", "password": "elakhdar.ayoub"},
            {"email": "fortunato.marcochiaffredo@denina.it", "password": "fortunato.marcochiaffredo"},
            {"email": "galeasso.federico@denina.it", "password": "galeasso.federico"},
            {"email": "galfre.beniaminomaria@denina.it", "password": "galfre.beniaminomaria"},
            {"email": "garello.matteo@denina.it", "password": "garello.matteo"},
            {"email": "garnero.luca@denina.it", "password": "garnero.luca"},
            {"email": "garnerone.stefano@denina.it", "password": "garnerone.stefano"},
            {"email": "giusiano.massimo@denina.it", "password": "giusiano.massimo"},
            {"email": "kadiasi.daniele@denina.it", "password": "kadiasi.daniele"},
            {"email": "lepori.gabriele@denina.it", "password": "lepori.gabriele"},
            {"email": "martini.gabriele@denina.it", "password": "martini.gabriele"},
            {"email": "masante.federico@denina.it", "password": "masante.federico"},
            {"email": "mazzone.samuele@denina.it", "password": "mazzone.samuele"},
            {"email": "minetti.leonardo@denina.it", "password": "minetti.leonardo"},
            {"email": "monge.isacco@denina.it", "password": "monge.isacco"},
            {"email": "occelli.emanuel@denina.it", "password": "occelli.emanuel"},
            {"email": "pal.bhushan@denina.it", "password": "pal.bhushan"},
            {"email": "paseri.kevin@denina.it", "password": "paseri.kevin"},
            {"email": "pellitta.francesco@denina.it", "password": "pellitta.francesco"},
            {"email": "ramello.sebastiano@denina.it", "password": "ramello.sebastiano"},
            {"email": "ribotta.gabriele@denina.it", "password": "ribotta.gabriele"},
            {"email": "singh.siddharth@denina.it", "password": "singh.siddharth"},
            {"email": "soave.sebastiano@denina.it", "password": "soave.sebastiano"},
            {"email": "stefanin.francesco@denina.it", "password": "stefanin.francesco"},
            {"email": "vaschetto.emanuele@denina.it", "password": "vaschetto.emanuele"},
            {"email": "volpe.giovanni@denina.it", "password": "volpe.giovanni"},
            {"email": "zhou.chenghuan@denina.it", "password": "zhou.chenghuan"},
            {"email": "manuela.dalbesio@denina.it", "password": "manuela.dalbesio"},
            {"email": "pierangelo.verga@denina.it", "password": "pierangelo.verga"},
            {"email": "flaviano.monge@denina.it", "password": "flaviano.monge"},
            {"email": "monica.rosso@denina.it", "password": "monica.rosso"},
            {"email": "carlotta.rosso@denina.it", "password": "carlotta.rosso"},
            {"email": "giovanna.migliore@denina.it", "password": "giovanna.migliore"},
            {"email": "raffaella.cometto@denina.it", "password": "raffaella.cometto"},
            {"email": "nazareno.muratore@denina.it", "password": "nazareno.muratore"},
            {"email": "patrick.gourdain@denina.it", "password": "patrick.gourdain"},
            {"email": "enrico.allione@denina.it", "password": "enrico.allione"},
            {"email": "andrea.giordano@denina.it", "password": "andrea.giordano"},
            {"email": "sara.obertino@denina.it", "password": "sara.obertino"},
            {"email": "rossella.rossaro@denina.it", "password": "rossella.rossaro"},
            {"email": "laura.cavallera@denina.it", "password": "laura.cavallera"},
            {"email": "carlo.depetris@denina.it", "password": "carlo.depetris"}
        ]
    )

    res.json({messaggio: "Professori caricati con successo"})
})

app.get('/carica_utenti', async(req, res) => {
    connessione()

    const miaCollection = client.db("Alba_ValutazioneDocenti").collection("utenti")
    
    miaCollection.insertMany(
        [
            {
                "email": "admin@denina.it",
                "tipo": "A",
                
            }, 
            {
                "email": "alba.lucafrancesco@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            }, 
            {
                "email": "audisio.nicolo@denina.it",
                "classe": "5L",
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "baqiqi.francesco@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "barra.erik@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "barra.leonardo@denina.it", 
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [],
                
            },
            {
                "email": "bastonero.stefano@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "bianco.andrea@denina.it",
                "classe": "4L",
                "tipo": "S",
                "docenti_valutati": [],
                
            },
            {
                "email": "bondar.oleksandr@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "bracco.mattia@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "canino.leonardo@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "castellano.gabriele@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [],
                
            },
            {
                "email": "chen.lihua@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "culasso.edoardo@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [],
                
            },
            {
                "email": "de.bonisimone@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "dimarco.mirko@denina.it",
                "classe": "5L",
                "tipo": "S", 
                "docenti_valutati": [],
                
            },
            {
                "email": "dossetto.giuseppe@denina.it", 
                "classe": "5L",
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "elakhdar.ayoub@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "fortunato.marcochiaffredo@denina.it",
                "classe": "5L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "galeasso.federico@denina.it",
                "classe": "5L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "galfre.beniaminomaria@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "garello.matteo@denina.it",
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [],
                
            },
            {
                "email": "garnero.luca@denina.it",
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [],
                
            },
            {
                "email": "garnerone.stefano@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "giusiano.massimo@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "kadiasi.daniele@denina.it",
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "lepori.gabriele@denina.it",
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "martini.gabriele@denina.it",
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [],
                
            },
            {
                "email": "masante.federico@denina.it", 
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "mazzone.samuele@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "minetti.leonardo@denina.it", 
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "monge.isacco@denina.it", 
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "occelli.emanuel@denina.it", 
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "pal.bhushan@denina.it", 
                "classe": "4L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "paseri.kevin@denina.it", 
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "pellitta.francesco@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "ramello.sebastiano@denina.it", 
                "classe": "4L",
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "ribotta.gabriele@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "singh.siddharth@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "soave.sebastiano@denina.it", 
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "stefanin.francesco@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "vaschetto.emanuele@denina.it", 
                "classe": "5L", 
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "volpe.giovanni@denina.it", 
                "classe": "4L",
                "tipo": "S", 
                "docenti_valutati": [], 
                
            },
            {
                "email": "zhou.chenghuan@denina.it", 
                "classe": "5L",
                "tipo": "S",
                "docenti_valutati": [], 
                
            },
            {
                "email": "manuela.dalbesio@denina.it",
                "tipo": "D",
                
                "nome":"Manuela",
                "cognome":"Dalbesio",
                "classi_materie":[
                    {
                        "nome":"3L",
                        "materie":["SISTEMI E RETI", "INFORMATICA"],
                        "plesso":"RIVOIRA"
                    },
                    {
                        "nome":"4L",
                        "materie":["SISTEMI E RETI", "INFORMATICA"],
                        "plesso":"RIVOIRA" 
                    },
                    {
                        "nome":"5L",
                        "materie":["SISTEMI E RETI", "INFORMATICA", "GESTIONE PROGETTO"],
                        "plesso":"RIVOIRA"
                    }
                ]
            },
            {
                "email": "pierangelo.verga@denina.it",
                "tipo": "D",
                
                "nome":"Pierangelo",
                "cognome": "Verga",
                "classi_materie":[
                    {
                        "nome":"2L",
                        "materie":["STA"],
                        "plesso":"RIVOIRA"
                    },
                    {
                        "nome":"3L",
                        "materie":["SISTEMI E RETI"],
                        "plesso":"RIVOIRA"
                    },
                    {
                        "nome":"4L",
                        "materie":["SISTEMI E RETI"],
                        "plesso":"RIVOIRA" 
                    },
                    {
                        "nome":"5L",
                        "materie":["SISTEMI E RETI", "GESTIONE PROGETTO"],
                        "plesso":"RIVOIRA"
                    }
                ]
            },
            {
                "email": "flaviano.monge@denina.it",
                "tipo": "D",
                
                "nome":"Flaviano",
                "cognome":"Monge",
                "classi_materie":[
                    {
                        "nome":"3L",
                        "materie":["INFORMATICA"],
                        "plesso":"RIVOIRA"
                    },
                    {
                        "nome":"4L",
                        "materie":["INFORMATICA"],
                        "plesso":"RIVOIRA" 
                    },
                    {
                        "nome":"5L",
                        "materie":["INFORMATICA"],
                        "plesso":"RIVOIRA"
                    }
                ]
            },
            {
                "email": "monica.rosso@denina.it",
                "tipo": "D",
                
                "nome":"Monica",
                "cognome": "Rosso",
                "classi_materie":[
                    {
                        "nome":"1X",
                        "materie":["INGLESE"],
                        "plesso":"RIVOIRA"
                    },
                    {
                        "nome":"4L",
                        "materie":["INGLESE"],
                        "plesso":"RIVOIRA" 
                    },
                    {
                        "nome":"5F",
                        "materie":["INGLESE"],
                        "plesso":"RIVOIRA"
                    }
                ]
            },
            {
                "email": "carlotta.rosso@denina.it",
                "tipo": "D", 
                
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
                "email": "giovanna.migliore@denina.it", 
                "tipo": "D",
                
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
                "email": "raffaella.cometto@denina.it", 
                "tipo": "D",
                
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
                "email": "nazareno.muratore@denina.it", 
                "tipo": "D",
                
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
            {
                "email": "patrick.gourdain@denina.it", 
                "tipo": "D",
                
                "nome":"Patrick",
                "cognome":"Gourdain",
                "classi_materie": [
                    {
                        "nome": "4L",
                        "materie": ["TELECOMUNICAZIONI"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "email": "enrico.allione@denina.it", 
                "tipo": "D",
                
                "nome":"Enrico",
                "cognome":"Allione",
                "classi_materie": [
                    {
                        "nome": "1L",
                        "materie": ["INFORMATICA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "1F",
                        "materie": ["INFORMATICA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "1G",
                        "materie": ["INFORMATICA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "1K",
                        "materie": ["INFORMATICA"],
                        "plesso": "DENINA"
                    },
                    {
                        "nome": "4L",
                        "materie": ["TPSIT"],
                        "plesso": "RIVOIRA"
                    }, 
                    {
                        "nome": "5L",
                        "materie": ["TPSIT"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "email": "andrea.giordano@denina.it", 
                "tipo": "D",
                
                "nome":"Andrea",
                "cognome":"Giordano",
                "classi_materie": [
                    {
                        "nome": "1L",
                        "materie": ["INFORMATICA"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "4A",
                        "materie": ["INFORMATICA"],
                        "plesso": "DENINA"
                    },
                    {
                        "nome": "4L",
                        "materie": ["TPSIT"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "5L",
                        "materie": ["TPSIT"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "email": "sara.obertino@denina.it", 
                "tipo": "D",
                
                "nome":"Sara",
                "cognome":"Obertino",	
                "classi_materie": [
                    {
                        "nome": "4L",
                        "materie": ["RELIGIONE"],
                        "plesso": "RIVOIRA"
                    },
                    {
                        "nome": "5L",
                        "materie": ["RELIGIONE"],
                        "plesso": "RIVOIRA"
                    }
                ]
            },
            {
                "email": "rossella.rossaro@denina.it", 
                "tipo": "D",
                
                "nome":"Rossella",
                "cognome":"Rossaro",
                "classi_materie": [
                    {
                        "nome":"4L",
                        "materie":["EDUCAZIONE CIVICA"],
                        "plesso":"RIVOIRA"
                    },
                    {
                        "nome":"5L",
                        "materie":["EDUCAZIONE CIVICA"],
                        "plesso":"RIVOIRA"
                    }
                ]
            },
            {
                "email": "laura.cavallera@denina.it", 
                "tipo": "D",
                
                "nome":"Laura",
                "cognome":"Cavallera",
                "classi_materie": [
                    {
                        "nome":"5L",
                        "materie":["MATEMATICA"],
                        "plesso":"RIVOIRA" 
                    }
                ]
            },
            {
                "email": "carlo.depetris@denina.it", 
                "tipo": "D",
                
                "nome":"Carlo",
                "cognome":"Depetris",
                "classi_materie": [
                    {
                        "nome":"5L",
                        "materie":["INGLESE"],
                        "plesso":"RIVOIRA" 
                    }
                ]
            }
        ]
    )

    res.json({messaggio: "Utenti caricati con successo"})
})

app.get('/carica_domande', (req, res) => {
    connessione()

    const collect = client.db("Alba_ValutazioneDocenti").collection("domande")

    collect.insertMany(
        [
            {"id": "q001", "domanda": "L'insegnante espone gli argomenti in modo chiaro ed efficace con opportuni esempi."},
            {"id": "q002", "domanda": "L'insegnante si mostra disponibile per chiarimenti e in caso attua strategie di recupero e/o approfondimento."},
            {"id": "q003", "domanda": "L'insegnante è disponibile ad aiutare il singolo a sviluppare un metodo di apprendimento e di lavoro per quanto riguarda la sua materia."},
            {"id": "q004", "domanda": "L'insegnante utilizza, oltre al libro di testo, strumenti e contenuti aggiuntivi utili alla didattica."},
            {"id": "q005", "domanda": "I metodi didattici utilizzati dall'insegnante favoriscono l'apprendimento del corso di studi."},
            {"id": "q006", "domanda": "Il carico di lavoro è conforme alle esigenze e alle possibilità degli studenti."},
            {"id": "q007", "domanda": "La programmazione delle verifiche ed attività è adeguata e viene comunicata con buon anticipo."},
            {"id": "q008", "domanda": "I tempi di correzione delle prove scritte rispettano i 15 giorni previsti dalla norma."},
            {"id": "q009", "domanda": "L'insegnante, insieme agli studenti, riesce a mantenere la disciplina all'interno della classe e a creare un ambiente sereno e costruttivo."},
            {"id": "q010", "domanda": "L'insegnante si dimostra attento a valorizzare interessi e attitudini degli studenti."}
        ]
    )

    res.json({messaggio: "Domande caricate con successo"})
})

app.listen(PORT, () => {
    console.log(`Il server sta ascoltando alla porta ${PORT}`);
});