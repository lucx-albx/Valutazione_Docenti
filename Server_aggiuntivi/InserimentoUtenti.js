const {MongoClient} = require("mongodb");
const http = require("http");

const client = new MongoClient("mongodb://localhost:27017");

http.createServer((req, res) => {
    connessione();
    const miaCollection = client.db("valutazioneDocenti").collection("utenti");
    
    miaCollection.insertMany([{email: 'alba.lucafrancesco@denina.it', password: 'alba.lucafrancesco', classe: '5L'}, 
                              {email: 'audisio.nicolo@denina.it', password: 'audisio.nicolo', classe: '5L'},
                              {email: 'baqiqi.francesco@denina.it', password: 'baqiqi.francesco', classe: '4L'},
                              {email: 'barra.erik@denina.it', password: 'barra.erik', classe: '4L'},
                              {email: 'barra.leonardo@denina.it', password: 'barra.leonardo', classe: '5L'},
                              {email: 'bastonero.stefano@denina.it', password: 'bastonero.stefano', classe: '4L'},
                              {email: 'bianco.andrea@denina.it', password: 'bianco.andrea', classe: '4L'},
                              {email: 'bondar.oleksandr@denina.it', password: 'bondar.oleksandr', classe: '4L'},
                              {email: 'bracco.mattia@denina.it', password: 'bracco.mattia', classe: '5L'},
                              {email: 'canino.leonardo@denina.it', password: 'canino.leonardo', classe: '4L'},
                              {email: 'castellano.gabriele@denina.it', password: 'castellano.gabriele', classe: '4L'},
                              {email: 'chen.lihua@denina.it', password: 'chen.lihua', classe: '4L'},
                              {email: 'culasso.edoardo@denina.it', password: 'culasso.edoardo', classe: '5L'},
                              {email: 'de.bonisimone@denina.it', password: 'de.bonisimone', classe: '5L'},
                              {email: 'dimarco.mirko@denina.it', password: 'dimarco.mirko', classe: '5L'},
                              {email: 'dossetto.giuseppe@denina.it', password: 'dossetto.giuseppe', classe: '5L'},
                              {email: 'elakhdar.ayoub@denina.it', password: 'elakhdar.ayoub', classe: '4L'},
                              {email: 'fortunato.marcochiaffredo@denina.it', password: 'fortunato.marcochiaffredo', classe: '5L'},
                              {email: 'galeasso.federico@denina.it', password: 'galeasso.federico', classe: '5L'},
                              {email: 'galfre.beniaminomaria@denina.it', password: 'galfre.beniaminomaria', classe: '5L'},
                              {email: 'garello.matteo@denina.it', password: 'garello.matteo', classe: '4L'},
                              {email: 'garnero.luca@denina.it', password: 'garnero.luca', classe: '4L'},
                              {email: 'garnerone.stefano@denina.it', password: 'garnerone.stefano', classe: '4L'},
                              {email: 'giusiano.massimo@denina.it', password: 'giusiano.massimo', classe: '5L'},
                              {email: 'kadiasi.daniele@denina.it', password: 'kadiasi.daniele', classe: '4L'},
                              {email: 'lepori.gabriele@denina.it', password: 'lepori.gabriele', classe: '4L'},
                              {email: 'martini.gabriele@denina.it', password: 'martini.gabriele', classe: '5L'},
                              {email: 'masante.federico@denina.it', password: 'masante.federico', classe: '4L'},
                              {email: 'mazzone.samuele@denina.it', password: 'mazzone.samuele', classe: '4L'},
                              {email: 'minetti.leonardo@denina.it', password: 'minetti.leonardo', classe: '5L'},
                              {email: 'monge.isacco@denina.it', password: 'monge.isacco', classe: '4L'},
                              {email: 'occelli.emanuel@denina.it', password: 'occelli.emanuel', classe: '4L'},
                              {email: 'pal.bhushan@denina.it', password: 'pal.bhushan', classe: '4L'},
                              {email: 'paseri.kevin@denina.it', password: 'paseri.kevin', classe: '5L'},
                              {email: 'pellitta.francesco@denina.it', password: 'pellitta.francesco', classe: '4L'},
                              {email: 'ramello.sebastiano@denina.it', password: 'ramello.sebastiano', classe: '4L'},
                              {email: 'ribotta.gabriele@denina.it', password: 'ribotta.gabriele', classe: '4L'},
                              {email: 'singh.siddharth@denina.it', password: 'singh.siddharth', classe: '4L'},
                              {email: 'soave.sebastiano@denina.it', password: 'soave.sebastiano', classe: '5L'},
                              {email: 'stefanin.francesco@denina.it', password: 'stefanin.francesco', classe: '4L'},
                              {email: 'vaschetto.emanuele@denina.it', password: 'vaschetto.emanuele', classe: '5L'},
                              {email: 'volpe.giovanni@denina.it', password: 'volpe.giovanni', classe: '4L'},
                              {email: 'zhou.chenghuan@denina.it', password: 'zhou.chenghuan', classe: '5L'}]);

    res.end("caricato")
}).listen(3001)

const connessione = async() => {
    await client.connect();
}
