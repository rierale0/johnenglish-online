import mongoose, { Schema, Document } from "mongoose";

// Interfaz para cada estudiante con asistencia
interface StudentAttendance {
  studentId: mongoose.Schema.Types.ObjectId; // Referencia al estudiante
  isPresent: boolean; // Asistencia del estudiante
}

interface Class {
  name: string;
  date: string;
  students: StudentAttendance[]; // Lista de estudiantes con su asistencia
}

interface ClassDocument extends Document, Class {}

const classSchema = new Schema<ClassDocument>({
  name: { type: String, required: true },
  date: { type: String, required: true },
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Referencia al modelo Student
      isPresent: { type: Boolean, required: true }, // Asistencia del estudiante
    },
  ],
});

const ClassModel = mongoose.model<ClassDocument>("Class", classSchema);

export default ClassModel;
