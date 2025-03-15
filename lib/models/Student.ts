// models/Student.ts
import mongoose, { Schema, Document } from "mongoose";

interface Student {
  name: string;
  isPresent: boolean;
}

interface StudentDocument extends Document, Student {}

const studentSchema = new Schema<StudentDocument>({
  name: { type: String, required: true },
  isPresent: { type: Boolean, required: true },
});

const StudentModel = mongoose.model<StudentDocument>("Student", studentSchema);

export default StudentModel;
