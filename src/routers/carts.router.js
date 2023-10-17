import { Router } from "express";
import path from "path";
import CartsManager from "../clases/cartsManager.js";
import ProductManager from "../clases/productManager.js";

const router = Router();


const carritoJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../carrito.json"
);

const productosJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../productos.json"
);

const cartsManager = new CartsManager(carritoJsonPath);
const productManager = new ProductManager(productosJsonPath);


router.post('/carts/', async (req, res) => {
  const cartData = req.body;
  console.log(cartData, "nuevo carrito");
  try {
    const newCart = await cartsManager.addCart(cartData);
    const cartResponse = {
      idCart: newCart.id,
      products: newCart.products.map(product => ({
        idProduct: product.productId,
        quantity: product.quantity
      })),
    };

    res.status(201).json(cartResponse);
    console.log(newCart, "nuevo carrito try");
  } catch (error) {
    console.log(cartData, "nuevo carrito error");
    res.status(500).json({ error: 'No se pudo crear el carrito' });
  }
});


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


    const productExists = await productManager.getProductById(productId);
    if (!productExists) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const existingProductIndex = cart.products.findIndex(
      (product) => product.idProduct === productId
    );

    if (existingProductIndex !== -1) {

      cart.products[existingProductIndex].quantity += 1;
    } else {

      cart.products.push({ idProduct: productId, quantity: 1 });
    }

    const carts = await cartsManager.getCarts();
    const updatedCartIndex = carts.findIndex((c) => c.idCart === cartId);
    if (updatedCartIndex !== -1) {
      carts[updatedCartIndex] = cart;
    } else {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await cartsManager.saveJsonToFile("../data/carrito.json", carts);

    const cartResponse = {
      idCart: cart.idCart,
      products: cart.products,
    };

    return res.status(200).json(cartResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
