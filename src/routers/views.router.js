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
      // Obtiene la lista de productos a través del productManager
      const products = await productManager.getProducts();

      // Renderiza la vista y pasa los datos de los productos
      res.render('home', { products });
  } catch (error) {
      console.error('Error al cargar los productos:', error);
      // Maneja el error apropiadamente
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    // Obtén la lista de productos desde el administrador de productos
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    // Maneja el error apropiadamente
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;