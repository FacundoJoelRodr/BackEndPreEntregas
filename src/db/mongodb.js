import mongoose from "mongoose";

export const init = async ()=>{
  try {
    const URI = 'mongodb+srv://developer:zpaQBjmN8JFRtUkI@cluster0.c9gg271.mongodb.net/ecommerce';
    await mongoose.connect(URI)
    console.log('Base de datos conectado');
  } catch (error) {
    console.log('Ocurrio un error al intentar conectar la base de datos', error.message);
  }
}