import { Server } from "socket.io";
import path from "path";
import ProductManager from "./clases/productManager.js";

const productosJsonPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "./productos.json"
);

let io;

const productManager = new ProductManager(productosJsonPath);

export const init = (httpServer) => {
  io = new Server(httpServer);

  io.on('connection', async (socketClient) => {
    console.log("Se ha conectado un cliente");
    let products = await productManager.getProducts();
    socketClient.emit("listProducts", products);

    socketClient.on("addProduct", async (newP) => {
      await productManager.addProduct(newP);
      products = await productManager.getProducts(); // Actualiza la lista de productos
      io.emit("listProducts", products); // Emite la lista actualizada a todos los clientes
    });

    socketClient.on("deleteProduct", async (idP) => {
        await productManager.deleteProduct(parseInt(idP.id));
        products = await productManager.getProducts(); // Actualiza la lista de productos
        console.log(idP,"sockets");
        io.emit("listProducts", products); // Emite la lista actualizada a todos los clientes
      });
  });
};