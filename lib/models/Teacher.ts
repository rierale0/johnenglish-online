import mongoose, { Schema, Document } from "mongoose";
import { Teacher } from "@/types";

// Definición del esquema para el modelo Teacher
const teacherSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }], // Relacionado con las clases
});

// Definición de la interfaz para el documento de MongoDB
interface TeacherDocument extends Document, Teacher {
  // No necesitas agregar `id`, ya que Mongoose lo maneja automáticamente como `_id`
}

// Creación del modelo con el esquema
const TeacherModel = mongoose.model<TeacherDocument>("Teacher", teacherSchema);

export default TeacherModel;
