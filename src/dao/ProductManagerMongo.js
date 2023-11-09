import productSchema from "../models/products.model.js";
import { Exception } from "../utils.js";

export default class ProductManager {
  ///OBTENER TODOS LOS PRODUCTOS
  static get(query = {}) {
    const criteria = {};
    if (query.course) {
      criteria.course = query.course;
    }

    return productSchema.find(criteria);
  }
  //CREAR PRODUCTO
  static async create(data) {
    try {
        const products = await productSchema.find(); 
        const { title, code, price, stock, description, category } = data;
        const product = await productSchema.create(data);
        if (!title || !code || !price || !stock || !description|| !category) {
            console.log(`Faltan campos obligatorios`);
            return null;
        }
        if (products.some((p) => p.code === code)) {
            console.log(
                "Este producto ya se encuentra en el array y no se va a agregar"
            );
            return null;
        } else {
            console.log("Producto creado correctamente");
            return product;
        }
    } catch (error) {
        console.error("Error al buscar productos:", error);
        return null;
    }
}

  ///OBTENER PRODUCTO POR ID
  static async getById(pid) {
    const product = await productSchema.findById(pid);
    if (!product) {
      throw new Exception("No existe el producto", 404);
    }
    return product;
  }

  ///ACTUALIZA EL PRODUCTO POR ID
  static async updateById(pid, data) {
    const { title, code, price, stock, description,category } = data;

    if (!title || !code || !price || !stock || !description|| !category) {
        console.log(`Faltan campos obligatorios`);
        return null;
    }
    const product = await productSchema.findById(pid);
    if (!product) {
      throw new Exception("No existe el producto", 404);
    }
    const criteria = { _id: pid };
    const operation = { $set: data };
    
    await productSchema.updateOne(criteria, operation);
    
    console.log("Producto se ha actualizado correctamente");
}

  ///BORRRA EL PRODUCTO POR ID

  static async deleteById(pid) {
    const product = await productSchema.findById(pid);
    if (!product) {
      throw new Exception("No existe el producto", 404);
    }
    const criteria = { _id: pid };
    
    await productSchema.deleteOne(criteria);
    
    console.log("Producto se ha eliminado correctamente");
}
}
