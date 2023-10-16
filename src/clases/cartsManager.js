import { promises as fs } from "fs";

class CartsManager {
  constructor(path) {
    this.path = path.replace(/^\\/g, "");
  }

  async getCarts() {
    return this.getJsonFromFile(this.path);
  }

  async addCart(cartAdd) {
  const { productId, quantity } = cartAdd;
  const carts = await this.getJsonFromFile(this.path);

  const id = carts.length + 1;
  const newCart = {
    idCart: id,
    products: [],
  };

  if (productId && quantity) {
    newCart.products.push({
      idProduct: productId,
      quantity,
    });
  }

  carts.push(newCart);

  await this.saveJsonToFile(this.path, carts);

  console.log("Se agregó correctamente el carrito");

  return newCart;
}

  async getCartById(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find((p) => p.idCart === cartId);

    if (!cart) {
      console.log(`No se encontró el ID ${cartId} solicitado`);
    }
    return cart;
  }

  async existFile(path) {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getJsonFromFile(path) {
    if (!(await this.existFile(path))) {
      console.log(`El archivo no existe en la ruta: ${path}`);
      return [];
    }
    let content;

    try {
      content = await fs.readFile(path, "utf-8");
    } catch (error) {
      console.error("Error al leer el archivo:", error.message);
      throw new Error("El archivo lamentablemente no pudo ser leído");
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Error al analizar el archivo JSON:", error.message);
      throw new Error("El archivo no tiene un formato JSON correcto");
    }
  }
  async saveJsonToFile(path, data) {
    try {
      const content = JSON.stringify(data, null, "\t");
      await fs.writeFile(path, content, "utf-8");
      console.log("Archivo guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el archivo:", error.message);
      throw new Error("El archivo lamentablemente no pudo ser guardado");
    }
  }
}

export default CartsManager;