const signupController = {}
// Importo el modelo de empleados
import employeesModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../utils/config.js"
//POST (CREATE)
signupController.registerEmployee = async (req, res) => {
    const {name, lastName, username, email,  password, phoneNumber, birthDate, DUI, userType, hireDate, isVerified} = req.body

    try {
        // Verificacion de si el empleado ya existe
        const employeeExist = await employeesModel.findOne({email})
        // Si existe un empleado, entonces se va a responder con un mensaje de error
        if(employeeExist){
            return res.status(409).json({ message: "El empleado ya existe" }) // 409 Conflict
        }
        // Encriptacion de contraseña
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = new employeesModel({name, lastName, username, email,  password: hashedPassword, phoneNumber, birthDate: birthDate ? new Date(birthDate): null, DUI: DUI, userType: userType, hireDate: hireDate ? new Date(hireDate): null, isVerified: isVerified || false})
        // Guardar el empleado
        await newUser.save()
        // TOKEN
        jsonwebtoken.sign({id: newUser._id, userType}, config.JWT.secret, { expiresIn: config.JWT.expiresIn}, (err, token) => {
            if (err) {
                console.error("Error al generar el token", err)
                return res.status(500).json({ message: "Error al generar el token" })
            }
            res.cookie("authToken", token)
            return res.status(201).json({ message: "Empleado registrado exitosamente", employee: { id: newUser._id, name: newUser.name, lastName: newUser.lastName, email: newUser.email, userType: newUser.userType }})
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}
export default signupController 