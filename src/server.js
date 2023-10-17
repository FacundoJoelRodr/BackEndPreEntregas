import app from './app.js';
import { init } from './socket.js';



const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});


init(httpServer);