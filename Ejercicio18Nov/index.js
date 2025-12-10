import express from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Escuchando puerto 3000');
});
app.get("/", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Falta parámetro 'url'");

  try {
    const respuesta = await fetch(url);
    const html = await respuesta.text();
    const $ = cheerio.load(html);
    const texto = $("body").text().trim();
    const posicion = texto.indexOf("£");
    const text = texto.substring(posicion, posicion + 100);

    const resultado = getLibra(text);
    console.log(resultado);

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener la página:", error);
    res.status(500).send("Error al procesar la página");
  }
});


function getLibra(texto) {
  const regex = /GBP\s*=\s*([\d.]+)\s*MXN/;
  const match = texto.match(regex);

  if (match) {
    const resultado = {
      nombre: "libra",
      valor: match[1] + "MXN"
    };
    return resultado;
  }

  return null;
}