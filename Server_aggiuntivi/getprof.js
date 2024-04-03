const {MongoClient}=require("mongodb"); 
const http=require("http");

const client = new MongoClient("mongodb://localhost:27017");

http.createServer((req,res)=>{
    connessione();
    const collect=client.db("votidocenti").collection("prof");
    collect.insertMany([
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
        {
            "nome":"Carlotta",
            "cognome":"Rosso",
            "classi": ["4L", "5L"],
            "materie": [
                ["EDUCAZIONE FISICA"],
                ["EDUCAZIONE FISICA"]
            ],
            "istituto":["RIVOIRA"]
        },
        {
            "nome":"Giovanna",
            "cognome":"Migliore",
            "classi": ["4L", "5L"],
            "materie": [
                ["LINGUA E LETTERATURA ITALIANA", "STORIA"],
                ["LINGUA E LETTERATURA ITALIANA", "STORIA"]
            ],
            "istituto":["RIVOIRA"]
        },
        {
            "nome":"Raffaella",
            "cognome":"Cometto",
            "classi": ["2L", "4L"],
            "materie": [
                ["MATEMATICA"],
                ["MATEMATICA"]
            ],
            "istituto":["RIVOIRA"]
        },
        {
            "nome":"Nazareno",
            "cognome":"Muratore",
            "classi": ["4L"],
            "materie": [
                ["TELECOMUNICAZIONI"]
            ],
            "istituto":["RIVOIRA"]
        },
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
        },	
    
    ]);
}).listen(3000);

const connessione=async()=>{
    await client.connect; //NB asincrono!!! inserisco una wait
}
