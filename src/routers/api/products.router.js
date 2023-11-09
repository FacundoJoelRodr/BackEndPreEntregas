import { Router } from "express";
import ProductManager from "../../dao/ProductManagerMongo.js";
import productsModel from "../../models/products.model.js";

const router = Router();

const buildResponse = (data) => {
  return {
    status: "success",
    payload: data.docs.map((product) => product.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.nextPage,
    prevLink: data.hasPrevPage
    ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`
    : "",
    nextLink: data.hasNextPage
    ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`
    : ''
  };
};
router.get("/products", async (req, res) => {
  const { page = 1, limit = 10, category, sort } = req.query;
  const opts = { page, limit };
  if (sort) {
    opts.sort = { price: sort === 'asc' ? 1 : sort === 'desc' ? -1 : 1 };
  }
  const criteria = {};
  if (category) {
    criteria.category = category;
  }
  const products = await productsModel.paginate(criteria, opts);
  res.render('products', buildResponse({ ...products, category }));
});

router.get("/products/:pid", async (req, res) => {
  try {
    const {
      params: { pid },
    } = req;
    const product = await ProductManager.getById(pid);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/products", async (req, res) => {
  const { body } = req;
  const product = await ProductManager.create(body);
  res.status(201).json(product);
});

router.put("/products/:pid", async (req, res) => {
  try {
    const {
      params: { pid },
      body,
    } = req;
    await ProductManager.updateById(pid, body);
    res.status(204).end();
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const {
      params: { pid },
    } = req;
    await ProductManager.deleteById(pid);
    res.status(204).end();
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
