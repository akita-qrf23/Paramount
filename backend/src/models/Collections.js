/* Esta colección va a almacenar toda la información relacionada con las colecciones. */
/* "collections": [
    "nombre": "Colección de Anillos",
    "description": "Colección de anillos de oro y plata",
    "image": "https://example.com/colletion1.jpg",
    "isActive": true
] */

// Importar modelo y schema de mongoos
import { Schema, model } from 'mongoose';
// Definir el schema para Collections
const collectionsSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre de la colección es obligatorio"],
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
        minlength: [10, "La descripción debe tener al menos 10 caracteres"],
        maxlength: [500, "La descripción no puede exceder los 500 caracteres"]
    },
    image: {
        type: String,
        validate: {
            validator: function(v) {
                // Solo valida si el campo tiene un valor y no está vacío
                if (!v || v.trim() === '') return true;
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v);
            },
            message: "La URL de imagen debe ser válida"
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Collections", collectionsSchema, "Collections")