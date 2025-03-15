import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const connectToMongo = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://johnerys:${process.env.DB_PASSWORD}@eva0.hifwazt.mongodb.net/?retryWrites=true&w=majority&appName=eva0`
    );

    // Verificar si la conexión fue exitosa
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
      console.log("Conexión a MongoDB exitosa");
    } else {
      console.log("Conexión fallida con MongoDB");
    }
  } catch (error) {
    console.error("Error al conectar con MongoDB", error);
  }
};

connectToMongo();
