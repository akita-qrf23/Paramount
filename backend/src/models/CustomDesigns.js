/* Esta colección va a almacenar toda la información que el usuario seleccione con los productos que el desee
solicitar su propio diseño único.
"customDesigns": [
    {
        "codeRequest": "REQ-344",
        "piece": "Dije",
        "base": "Collar",
        "baseLength": "59",
        "decoration": "Dribvfbever",
        "clasp": "Gancho",
        "customerComments": "El diseño es muy bonito y se ajusta perfectamente a mi cuerpo."
    }
] */
// Importar modelo y schema de Mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para customDesigns
const customDesignsSchema = new Schema({
    codeRequest: {
        type: String,
        required: [true, "El código de solicitud es obligatorio"],
        trim: true,
        minlength: [5, "El código debe tener al menos 5 caracteres"]
    },
    piece: {
        type: String,
        required: [true, "La pieza es obligatoria"],
        enum: {
            values: ["Pulsera", "Cadena", "Tobillera"],
            message: "La pieza debe ser Pulsera, Cadena o Tobillera"
        }
    },
    base: {
        type: Schema.Types.ObjectId,
        ref: "DesignElement",
        required: [true, "La base es obligatoria"]
    },
    baseLength: {
        type: String,
        required: [true, "La longitud de la base es obligatoria"],
        validate: {
            validator: function(v) {
                return /^\d{1,3}(cm|mm)?$/.test(v)
            },
            message: "La longitud debe ser un número seguido opcionalmente por 'cm' o 'mm' (ej: '18cm')"
        }
    },
    decoration: [{
        type: Schema.Types.ObjectId,
        ref: "DesignElement",
        required: true
    }],
    clasp: {
        type: Schema.Types.ObjectId,
        ref: "DesignElement",
        required: [true, "El cierre es obligatorio"]
    },
    customerComments: {
        type: String,
        maxlength: [300, "El comentario no puede exceder los 300 caracteres"],
        default: "",
        trim: true
    }
}, {
    timestamps: true,
    strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("CustomDesigns", customDesignsSchema, "CustomDesigns")