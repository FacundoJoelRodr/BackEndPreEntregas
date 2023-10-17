import express from 'express';
import path from 'path';
import ProductManager from '../clases/productManager.js';

const router = express.Router();

const productosJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../productos.json"
);

const productManager = new ProductManager(productosJsonPath);


router.get('/home', async (req, res) => {
  try {

      const products = await productManager.getProducts();


      res.render('home', { products });
  } catch (error) {
      console.error('Error al cargar los productos:', error);

      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {

    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al cargar los productos:', error);

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;