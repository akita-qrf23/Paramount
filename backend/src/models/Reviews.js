/* Esta colección va a almacenar todas las reseñas de productos.
"reviews": [
    "product": "65a1bc2e3f4d8e2a1b2c3d4e",
    "customer": "65a1bc2e3f4d8e2a1b2c3d4f",
    "rating": 5,
    "comment": "Excelente producto, muy buena calidad",
    "response": "Gracias por tu compra, nos alegra que te guste"
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Reviews
const reviewsSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: [true, "El producto es obligatorio"]
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customers',
        required: [true, "El cliente es obligatorio"]
    },
    rating: {
        type: Number,
        required: [true, "La calificación es obligatoria"],
        min: [1, "La calificación mínima es 1"],
        max: [5, "La calificación máxima es 5"],
        validate: {
            validator: Number.isInteger,
            message: "La calificación debe ser un número entero"
        }
    },
    comment: {
        type: String,
        trim: true,
        minlength: [10, "El comentario debe tener al menos 10 caracteres"],
        maxlength: [500, "El comentario no puede exceder los 500 caracteres"]
    },
    response: {
        type: String,
        trim: true,
        maxlength: [500, "La respuesta no puede exceder los 500 caracteres"]
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Reviews", reviewsSchema, "Reviews");