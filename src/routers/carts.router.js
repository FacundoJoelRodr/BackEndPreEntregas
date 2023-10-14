import { Router } from "express";
import path from "path";
import CartsManager from "../clases/cartsManager.js";
import ProductManager from "../clases/productManager.js";

const router = Router();

//path de los archivos json
const carritoJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../carrito.json"
);

const productosJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../productos.json"
);

//nuevos productos y carritos 
const cartsManager = new CartsManager(carritoJsonPath);
const productManager = new ProductManager(productosJsonPath);

//creacion de nuevos carritos
router.post("/carts/", async (req, res) => {
  const { productId, quantity } = req.body;
  const cartData = req.body;
  try {
    const newCart = await cartsManager.addCart(cartData);
    const cartResponse = {
      idCart: newCart.id,
      products: newCart.products.map((product) => ({
        idProduct: product.productId,
        quantity: product.quantity,
      })),
    };

    res.status(201).json(cartResponse);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el carrito" });
  }
});

//se obtiene carrito por id
router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsManager.getCartById(parseInt(cid));
  if (!cart) {
    res
      .status(404)
      .send({ error: `No existe ningún Producto con el id ${cid}` });
  } else {
    res.status(200).send(cart);
  }
});

//se agrega productos por id al carrito por id 
router.post("/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cartId = parseInt(cid);
  const productId = parseInt(pid);

  try {
    const cart = await cartsManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (!cart.products) {
      cart.products = [];
    }

    //verifica si el producto existe
    const productExists = await productManager.getProductById(productId);
    
    if (!productExists) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const existingProduct = cart.products.find(
      (product) => product.idProduct === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ idProduct: productId, quantity: 1 });
    }

    await cartsManager.saveJsonToFile(cartsManager.path, [cart]);

    const cartResponse = {
      idCart: cart.id,
      products: cart.products,
    };

    return res.status(200).json(cartResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


export default router;
