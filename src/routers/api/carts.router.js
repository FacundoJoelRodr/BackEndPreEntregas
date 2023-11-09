import { Router } from "express";
import CartsManagerMongo from "../../dao/cartsManagerMongo.js";
import mongoose from "mongoose";

const router = Router();

//// MONGO

router.post("/carts", async (req, res) => {
  const { body } = req;
   await CartsManagerMongo.create(body);
  res.status(200).json(body);
});

router.get("/carts", async (req, res) => {
   await CartsManagerMongo.get();
  res.status(200).json();
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { params: { cid } } = req;
    const cart = await CartsManagerMongo.getById(cid);
     const a = cart.products.map((product) => product.toJSON())
     const b = cart._id
     console.log(b, "a");
   res.render('carts',{a, b})
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

/////////////////////
router.put("/carts/:cid/product/:pid", async (req, res) => {
  const { params: { cid, pid }} = req;
  const { quantity } = req.body; 

  if (quantity === undefined) {
    return res.status(400).json({ error: 'La cantidad no se proporcionó correctamente' });
  }

  try {
    if (!mongoose.isValidObjectId(cid) || !mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }

    const cart = await CartsManagerMongo.getById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await CartsManagerMongo.updateById(cid, pid, quantity);

    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
///////////////////////////////
router.put("/carts/:cid", async (req, res) => {
  try {
    const { params: { cid }, body  } = req;
    await CartsManagerMongo.updateById(cid, body);
    res.status(204).end();
  } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });  
  }
});

router.delete("/carts/:cid", async (req, res) => {
  try {
    const { params: { cid },  } = req;
    await CartsManagerMongo.deleteProductsInCart(cid);
    res.status(204).end();
  } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  }
});


router.delete("/carts/:cid/product/:pid", async (req, res) => {
  const { params: { cid, pid }} = req;
  const { quantity } = req.body; 

  if (quantity === undefined) {
    return res.status(400).json({ error: 'La cantidad no se proporcionó correctamente' });
  }

  try {
    if (!mongoose.isValidObjectId(cid) || !mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }

    const cart = await CartsManagerMongo.getById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await CartsManagerMongo.deleteProduct(cid, pid, quantity);

    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


export default router;
