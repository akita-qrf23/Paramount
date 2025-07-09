/* Esta colección va a almacenar toda la información relacionada con los proveedores.
"suppliers": [
    "name": "Proveedor A",
    "contactPerson": "Juan Pérez",
    "phoneNumber": "503-123-4567",
    "email": "proveedora@example.com",
    "address": "Calle 123, Ciudad, Salvador" 
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Suppliers
const suppliersSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre del proveedor es obligatorio"],
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        unique: true
    },
    contactPerson: {
        type: String,
        required: [true, "La persona de contacto es obligatoria"],
        trim: true,
        minlength: [5, "El nombre debe tener al menos 5 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"]
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
    address: {
        type: String,
        required: [true, "La dirección es obligatoria"],
        trim: true,
        minlength: [10, "La dirección debe tener al menos 10 caracteres"],
        maxlength: [200, "La dirección no puede exceder los 200 caracteres"]
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Suppliers", suppliersSchema, "Suppliers");