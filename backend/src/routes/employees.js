// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo el controlador de empleados
import employeesController from "../controllers/employeesController.js"

const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(employeesController.getEmployees)
    .post(upload.single("employeeImage"), employeesController.postEmployees)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(employeesController.getEmployee)
    .put(upload.single("employeeImage"), employeesController.putEmployees)
    .delete(employeesController.deleteEmployees)

export default router