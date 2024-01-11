
// está hecho con npm porque cuando lo hice no usaba pnpm. si quieren lo pasamos a pnpm.

// uso argón porque bcrypt me jodio varios deploy

// están instalados firebase sharp y multer para subir imagenes a firebase, las imagenes se suben comprimidas usando sharp
// para tener bastante espacio. (de momento solo están los paquetes, la logica la tengo en otro repo, despues la añadimos y quizás la mejoramos)

// winston para loggear,

// para autenticación está passport, pero no me gusta mas que para oauth, si alguien tiene una librería mejor que la instale.




import express from "express";
import "dotenv/config";

import compression from "compression";
import { connectDb } from "./config/utils/mongoConnect.js";
import { addLogger } from "./config/logger.js"; // Import logger and addLogger
import { logger } from "./config/logger.js";

import messagesRouter from "./modules/Users/router.js";
import usersRouter from "./modules/Users/router.js";

// connectDb(); esto es mongo, conecten la db que quiera.

const PORT = process.env.PORT || 3000;
const app = express();
app.listen(PORT, () => {
   console.log("listening on port: " + PORT);
});

// Middlewares //
app.use(express.static('public')); // serve public
app.use(addLogger); // logger para los endpoint
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

app.use(compression({})); // Enable response compression

// Routers //

app.use("/api/messages", messagesRouter);
app.use("/api/users", usersRouter);

// Error handlers //

//Bad JSON
app.use((err, req, res, next) => {
   if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).json({ error: "Invalid JSON" });
   } else {
      next(err);
   }
});

// Catch all //
app.use((err, req, res, next) => {
   logger.error(`${err.stack}`);
   res.status(500).json({ error: "Internal Server Error (Catch all   )" });
});

