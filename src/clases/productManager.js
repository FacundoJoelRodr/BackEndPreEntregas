import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path.replace(/^\\/g, ''); 
  }

  async getProducts() {
    return this.getJsonFromFile(this.path);
  }

  async addProduct(productAdd) {
    const { title, code, price, stock, description } = productAdd;
    const products = await this.getJsonFromFile(this.path);
  
    if (!title || !code || !price || !stock || !description) {
      console.log(`Faltan campos obligatorios`);
      return null; 
    }
  
    if (products.some((p) => p.code === code)) {
      console.log("Este producto ya se encuentra en el array y no se va a agregar");
      return null; 
    } else {
      const id = products.length + 1;
      const newProduct = {
        id,
        title,
        code,
        price,
        stock,
        description,
      };
      products.push(newProduct);
      console.log("Se agregó correctamente el producto");
      if (this.saveJsonToFile(this.path, products)) {
        return newProduct;
      } else {
        return null;
      }
    }
  }

  async getProductById(productId) {
    const products = await this.getJsonFromFile(this.path);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      console.log(`No se encontró el ID ${productId} solicitado`);
    }
    return product;
  }

  async updateProduct(productId, updatedProduct) {
    const products = await this.getJsonFromFile(this.path);
    let { title, code, price, stock, description } = updatedProduct;
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      console.log(`No se encontró el ID ${productId} solicitado`);
      return null;
    }

    const properties = [
      "title",
      "code",
      "thumbnail",
      "price",
      "stock",
      "description",
    ];
    for (const prop in updatedProduct) {
      if (!properties.includes(prop)) {
        console.log(`La propiedad ${prop} no es permitida`);
        return null;
      }
    }

    if (
      !title ||
      !code ||
      !price ||
      !stock ||
      !description
    ) {
      console.log(`Faltan campos obligatorios`);
      return;
    }

    let newUpdatedProduct = {
      title,
      code,
      price,
      stock,
      description,
      id: productId,
    };

    products[productIndex] = {
      ...products[productIndex],
      ...newUpdatedProduct,
      id: productId,
    };

    try {
      await this.saveJsonToFile(this.path, products);
      console.log(`Producto con ID ${productId} actualizado exitosamente`);
      return products[productIndex];
    } catch (error) {
      console.error("Error al guardar los cambios:", error.message);
      return null;
    }
  }

  async deleteProduct(productId) {
    const products = await this.getJsonFromFile(this.path);
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      console.log(`No se encontró el ID ${productId} solicitado`);
      return null;
    }
    products.splice(productIndex, 1);

    try {
      await this.saveJsonToFile(this.path, products);
      console.log(`Producto con ID ${productId} eliminado exitosamente`);
      return productId;
    } catch (error) {
      console.error("Error al guardar los cambios:", error.message);
      return null;
    }
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
    const content = JSON.stringify(data, null, "\t");
    try {
      await fs.writeFile(path, content, "utf-8");
    } catch (error) {
      throw new Error("El archivo lamentablemente no pudo ser guardado");
    }
  }
  
}

export default ProductManager;

