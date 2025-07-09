// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo controlador de productos
import productsController from "../controllers/productsController.js"

const router = express.Router();
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren un parámetro en específico
router.route("/")
    .get(productsController.getProducts)
    .post(upload.single("productImage"), productsController.postProducts)
// Rutas que requieren un parámetro en específico
router.route("/:id")
    .get(productsController.getProduct)
    .put(upload.single("productImage"), productsController.putProducts)
    .delete(productsController.deleteProducts)

export default router