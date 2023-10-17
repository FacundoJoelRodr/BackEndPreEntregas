import express from "express";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter);
app.use('/api', cartRouter);

app.listen(8080, () => {
  console.log("Servidor en funcionamiento");
});