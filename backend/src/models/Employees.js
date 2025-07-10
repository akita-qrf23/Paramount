/* Esta colección va a almacenar toda la información relacionada con los empleados (incluyendo admin y colaborador).
"Employees": [
    "name": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "birthDate": "1990-05-15",
    "DUI": "123456789-0",
    "password": "securepassword123",
    "userType": "admin",
    "profilePic": "https://example.com/profile.jpg",
    "hireDate": "2023-01-01",
    "isVerified": true,
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para los empleados
const employeesSchema = new Schema({
   name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [100, "El nombre no puede exceder los 100 caracteres"]
  },
  lastName: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    trim: true,
    minlength: [2, "El apellido debe tener al menos 2 caracteres"],
    maxlength: [100, "El apellido no puede exceder los 100 caracteres"]
  },
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    trim: true,
    minlength: [5, "El nombre de usuario debe tener al menos 5 caracteres"],
    maxlength: [50, "El nombre de usuario no puede exceder los 50 caracteres"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: v => /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(v),
      message: "El correo electrónico debe ser válido"
    }
  },
  phoneNumber: {
    type: String,
    required: [true, "El número de teléfono es obligatorio"],
    trim: true,
    validate: {
      validator: v => /^(?:\+503\s?)?(6|7)\d{3}-?\d{4}$/.test(v),
      message: "El teléfono debe ser válido en formato salvadoreño"
    }
  },
  birthDate: {
    type: Date,
    required: [true, "La fecha de nacimiento es obligatoria"],
    validate: {
      validator: v => v <= new Date(),
      message: "La fecha debe ser anterior a la actual"
    }
  },
  DUI: {
    type: String,
    required: [true, "El DUI es obligatorio"],
    trim: true,
    validate: {
      validator: v => /^\d{8}-\d$/.test(v),
      message: "El DUI debe tener el formato salvadoreño: 12345678-9"
    }
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    trim: true,
    minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
    maxlength: [100, "La contraseña no puede exceder los 100 caracteres"],
    validate: {
      validator: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v),
      message: "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales"
    },
    select: false
  },
  userType: {
    type: String,
    required: [true, "El tipo de usuario es obligatorio"],
    enum: ["vendedor", "colaborador"],
    default: "colaborador"
  },
  profilePic: {
    type: String,
    validate: {
      validator: v => /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v),
      message: "La URL de imagen debe ser válida"
    }
  },
  hireDate: {
    type: Date,
    required: [true, "La fecha de contratación es obligatoria"],
    validate: {
      validator: v => v <= new Date(),
      message: "La fecha de contratación no puede estar en el futuro"
    }
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Employees", employeesSchema, "Employees")