import CartSchema from "../models/carts.model.js";
import ProductSchema from "../models/products.model.js";
import { Exception } from "../utils.js";

export default class CartsManager {
  // OBTENER TODOS LOS CARRITOS
  static get(query = {}) {
    const criteria = {};
    // Si tienes algún filtro basado en consulta, puedes aplicarlo aquí.
    return CartSchema.find(criteria).populate('products.product')
  }

  // CREAR CARRITO
  static async create(data) {
    try {
      const newCart = await CartSchema.create(data); 
  
      console.log("Carrito creado correctamente");
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      return null;
    }
  }

  // OBTENER CARRITO POR ID
  static async getById(cid) {
    const cart = await CartSchema.findById(cid).populate('products.product');
    if (!cart) {
      throw new Exception("No se encontró el carrito", 404);
    }
    return cart;
  }
  // ACTUALIZAR CARRITO POR ID
  static async updateById(cid, pid, quantity) {
    const cart = await CartSchema.findById(cid);
  
    if (!cart) {
      throw new Exception("No se encontró el carrito", 404);
    }
  
    let product = cart.products.find((p) => String(p.product) === pid);
  
    if (!product) {
      console.log("El producto no existe en el carrito");
      
      product = { product: pid, quantity: quantity };
      cart.products.push(product);
    }
  
    product.quantity += quantity;
  
    await cart.save();
  
    console.log("Carrito actualizado correctamente");
  }
  

  // ELIMINAR CARRITO POR ID
  static async deleteById(cid) {
    const cart = await CartSchema.findById(cid);
  
    if (!cart) {
      throw new Exception("No se encontró el carrito", 404);
    }
    const criteria = { _id: cid };
    
    await CartSchema.deleteOne(criteria);
  
    console.log("Carrito eliminado correctamente");
  }



static async deleteProduct(cid, pid, quantity) {

  
  const cart = await CartSchema.findById(cid);
  
  if (!cart) {
    throw new Exception("No se encontró el carrito", 404);
  }


  const product = cart.products.find((p) => String(p._id) === pid);

  if (!product) {
    console.log("El producto no existe en el carrito");
    cart.products.push({ _id: pid, quantity });
  } else {
    console.log("El producto ya existe en el carrito");
    
    product.quantity -= quantity; 
  }

  await cart.save(); 

  console.log("Carrito actualizado correctamente");
}

static async deleteProductsInCart(cid) {
  const cart = await CartSchema.findOneAndUpdate({ _id: cid }, { $set: { products: [] } }, { new: true });

  if (!cart) {
    throw new Exception("No se encontró el carrito", 404);
  }

  console.log("Productos en el carrito eliminados correctamente");
}

}