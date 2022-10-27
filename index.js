const fs = require("fs");

class Contenedor {
  constructor(nombre) {
    this.nombreArchivo = nombre;
  }

  async save(product) {
    try {
      if (fs.existsSync(this.nombreArchivo)) {
        const productos = await this.getAll();
        if (productos.length > 0) {
          const lastId = productos[productos.length - 1].id + 1;
          product.id = lastId;
          productos.push(product);
          await fs.promises.writeFile(
            this.nombreArchivo,
            JSON.stringify(productos, null, 2)
          );
        } else {
          product.id = 1;
          await fs.promises.writeFile(
            this.nombreArchivo,
            JSON.stringify([product], null, 2)
          );
        }
      } else {
        product.id = 1;
        await fs.promises.writeFile(
          this.nombreArchivo,
          JSON.stringify([product], null, 2)
        );
      }
    } catch (error) {
      return "El producto no se pudo guardar";
    }
  }

  async getById(id) {
    try {
      const productos = await this.getAll();
      const producto = productos.find((elemento) => elemento.id === id);
      return producto;
    } catch (error) {
      return "No se encuentra el producto";
    }
  }

  async getAll() {
    try {
      const contenido = await fs.promises.readFile(this.nombreArchivo, "utf-8");
      if (contenido.length > 0) {
        const productos = JSON.parse(contenido);
        return productos;
      } else {
        return [];
      }
    } catch (error) {
      return "No hay productos";
    }
  }

  async deleteById(id) {
    try {
      const productos = await this.getAll();
      const productosNuevos = productos.filter((e) => e.id !== id);
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(productosNuevos, null, 2)
      );
      return `Producto id: ${id} eliminado con exito`;
    } catch (error) {
      return "No se pudo eliminar el elemento";
    }
  }

  async deleteAll() {
    try {
      const contenido = await fs.promises.readFile(this.nombreArchivo, "utf-8");
      if (contenido) {
        await fs.promises.writeFile(this.nombreArchivo, "");
      } else {
        return "No se encontró el archivo";
      }
    } catch (error) {
      return "No se pudo vaciar el archivo";
    }
  }
}

const item = {
  title: "Intel I9",
  price: 899,
  thumbnail: "https://i.ebayimg.com/images/g/jm8AAOSwNp1e4Isf/s-l640.jpg",
};

const manejadorProductos = new Contenedor("productos.txt");
console.log(manejadorProductos);
const getData = async () => {
  await manejadorProductos.save(item);
  const productos = await manejadorProductos.getAll();
  console.log("Productos:", productos);
  const productoBuscado = await manejadorProductos.getById(2);
  console.log("Producto buscado:", productoBuscado);
  await manejadorProductos.deleteById(3);
  await manejadorProductos.deleteAll();
};
//getData();

module.exports = Contenedor;
