const {MongoClient}=require("mongodb"); 
const http=require("http");

const client = new MongoClient("mongodb://localhost:27017");

http.createServer((req,res)=>{
    connessione();
    const collect=client.db("valutazioneDocenti").collection("domande");
    collect.insertMany([{question:"L'insegnante espone gli argomenti in modo chiaro ed efficace con opportuni esempi.", id:"001"},
        {question:"L'insegnante si mostra disponibile per chiarimenti e in caso attua strategie di recupero e/o approfondimento.", id:"002"},
        {question:"L'insegnante è disponibile ad aiutare il singolo a sviluppare un metodo di apprendimento e di lavoro per quanto riguarda la sua materia.", id:"003"},
        {question:"L'insegnante utilizza, oltre al libro di testo, strumenti e contenuti aggiuntivi utili alla didattica.", id:"004"},
        {question:"I metodi didattici utilizzati dall'insegnante favoriscono l'apprendimento del corso di studi.", id:"005"},
        {question:"Il carico di lavoro è conforme alle esigenze e alle possibilità degli studenti.", id:"006"},
        {question:"La programmazione delle verifiche ed attività è adeguata e viene comunicata con buon anticipo.", id:"007"},
        {question:"I tempi di correzione delle prove scritte rispettano i 15 giorni previsti dalla norma.", id:"008"},
        {question:"L'insegnante, insieme agli studenti, riesce a mantenere la disciplina all'interno della classe e a creare un ambiente sereno e costruttivo.", id:"009"},
        {question:"L'insegnante si dimostra attento a valorizzare interessi e attitudini degli studenti.", id:"010"}
    ]);

    res.end("caricato")
}).listen(3001);

const connessione=async()=>{
    await client.connect; //NB asincrono!!! inserisco una wait
}
