//npm install express pdfkit
//npm install express
let express=require("express")
const PDFDocument = require('pdfkit');
const fs = require('fs');
let app = new express();

const domande =["spiegazione:","verifiche:","atteggiamento:","inclusità:","spiegazione"]
const voti=[6,7,8,9,10]
app.get("/", (req,resp)=>{
	resp.send("gf")
})
app.get("/creazionepdf", (req,resp)=>{
	const doc = new PDFDocument();
					const filePath = 'example.pdf';

				doc
					.fontSize(15)
					.text('I.I.S. Denina sez. ”Rivoira”\n\n', {
						align: 'center',
						valign: 'center'
					});
				doc
					.fontSize(27)
					.text('Risultati valutazione docenti\n', {
						align: 'center',
						valign: 'center'
				});
				
				doc.image("./img/logoDenina.png", {
					align: 'center',
					valign: 'center'
				});
				doc
					.addPage()	
					.fontSize(20)
					.text('Risultati valutazioni del docente Enrico Allione da parte degli studenti:\n\n');
					let tot=0
					for (let i = 0; i < domande.length; i++) {
						doc
						.fontSize(15)
						.text(domande[i]+voti[i]+"\n");
						tot+=voti[i]
					}
					let media= tot/domande.length
				doc
					.fontSize(15)
					.text("\nMedia valutazioni: " +media);
				doc.end();
				const writeStream = fs.createWriteStream(filePath);
				doc.pipe(writeStream);
				// non funziona
				writeStream.on('finish', () => {
					resp.send("<a href='"+filePath+"' download='example.pdf'><button class='link'><h4>Scarica esempio dispatcher</h4></button></a>");
			});
})
app.listen(3001, ()=>{
	console.log("server listen on port 3001")
})


