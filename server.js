const express = require("express");
const app = express();
const PORT = 8080;
const Contenedor = require("./index");

const contenedorProductos = new Contenedor("productos.txt");

app.get("/productos", async (request, response) => {
  const productos = await contenedorProductos.getAll();
  response.send(productos);
});

app.get("/productoRandom", async (request, response) => {
  const productos = await contenedorProductos.getAll();
  const indexRandom = numeroRandom(0, productos.length - 1);
  const productoRandom = productos[indexRandom];
  response.send(productoRandom);
});

function numeroRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
