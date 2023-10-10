import { Router } from "express";
import path from "path";
import ProductManager from "../clases/productManager.js";

const router = Router();

const productosJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../productos.json"
);

const productManager = new ProductManager(productosJsonPath);

router.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();
  console.log(productosJsonPath, "asdassad");
  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit, 10));
    res.status(200).send(limitedProducts);
  } else {
    res.status(200).send(products);
  }
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(parseInt(pid));
  if (!product) {
    res.status(404).send({ error: `No existe ningún Producto con el id ${pid}` });
  } else {
    res.status(200).send(product);
  }
});

router.post('/products', async (req, res) => {
  const { title, code, price, stock, description } = req.body;
  const productData = req.body;
  console.log(productData,"nuevoproduto")
  try {
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
    console.log(newProduct,"nuevoproduto")
  } catch (error) {
    console.log(productData,"nuevoproduto")
    res.status(500).json({ error: 'No se pudo crear el producto' });
  }
});


router.put('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProductData = req.body;
  
  try {
    const updatedProduct = await productManager.updateProduct(parseInt(pid), updatedProductData);
    if (!updatedProduct) {
      return res.status(404).json({ error: `No existe ningún Producto con el id ${pid}` });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el producto' });
  }
});


router.delete('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProductId = await productManager.deleteProduct(parseInt(pid));
    if (!deletedProductId) {
      return res.status(404).json({ error: `No existe ningún Producto con el id ${pid}` });
    }
    res.status(200).json({ message: `Producto con ID ${deletedProductId} eliminado exitosamente` });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el producto' });
  }
});

export default router;