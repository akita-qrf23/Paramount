const loginController = {}
// Importo el modelo de empleados
import loginModel from "../models/Employees.js"
// Importo el modelo de clientes
import customersModel from "../models/Customers.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../utils/config.js"
import { API } from "../utils/api.js"
//POST (CREATE)
loginController.login = async (req, res) => {
    const {email, password, rememberMe} = req.body

    try {
        let userFound //Se guarda el usuario encontrado
        let userType //Se guarda el tipo de usuario (admin, colaborador o cliente)
        
        console.log("=== INICIO LOGIN ===")
        console.log("Email recibido:", email)
        console.log("Password recibido:", password ? "[PRESENTE]" : "[AUSENTE]")
        console.log("No es admin, verificando otros usuarios...")
        //Tipos de usuario: admin, empleados, clientes
        if (email === config.CREDENTIALS.email && password === config.CREDENTIALS.password) {
            console.log("LOGIN ADMIN EXITOSO")
            try {
                // AGREGAR: Crear/obtener admin de BD
                const adminDataResponse = await fetch(`${API}/admin/profile/data`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                })
                let adminData = { name: "Admin", lastName: "Pergola", profilePic: "" }
                
                if (adminDataResponse.ok) {
                    const adminInfo = await adminDataResponse.json()
                    adminData = {
                        name: adminInfo.name || "Admin",
                        lastName: adminInfo.lastName || "Pergola", 
                        profilePic: adminInfo.profilePic || ""
                    }
                    console.log("Admin data from BD:", adminData)
                }
                userType = "admin"
                userFound = {
                    _id: "admin", 
                    email: config.CREDENTIALS.email,
                    ...adminData
                }
                //TOKEN para admin
                jsonwebtoken.sign( { id: "admin", email: config.CREDENTIALS.email, userType: "admin", ...adminData }, 
                    config.JWT.secret, 
                    { expiresIn: rememberMe ? "30d" : config.JWT.expiresIn }, // 30 dias si recordarme, sino el tiempo normal
                    (err, token) => {
                        if(err) {
                            console.log("Error generando token:", err)
                            return res.status(500).json({message: "Error interno del servidor"})
                        }
                        res.cookie("authToken", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 dias vs 24 horas
                        })
                        console.log("Token generado y cookie establecida para admin")
                        res.json({message: "Inicio de sesión exitoso"})
                    }
                )
                return
            } catch (error) {
                console.log("Error obteniendo datos de admin:", error)
                // Continuar con datos por defecto si hay error
                res.status(500).json({message: "Error interno del servidor"})
            }
        } 
        // Si no es admin, verificar credenciales incorrectas inmediatamente
        console.log("No es admin, verificando otros usuarios...")
        // Buscar en empleados primero
        userFound = await loginModel.findOne({email})
        if (userFound) {
            console.log("Usuario encontrado en empleados")
            userType = userFound.userType 
            console.log("Tipo de usuario:", userType)
        } else {
            // Si no se encuentra en empleados, buscar en clientes
            userFound = await customersModel.findOne({email})
            if (userFound) {
                console.log("Usuario encontrado en clientes")
                userType = "customer"
            }
        }
        // Si no se encuentra el usuario
        if (!userFound) {
            console.log("Usuario no encontrado")
            return res.status(401).json({message: "El usuario no existe"})
        }
        // Verificar contraseña para usuarios no-admin
        console.log("Verificando contraseña...")
        const isMatch = await bcryptjs.compare(password, userFound.password)
        if (!isMatch) {
            console.log("Contraseña incorrecta")
            return res.status(401).json({message: "Contraseña incorrecta"})
        }
        console.log("Contraseña correcta")
        //TOKEN para empleados/clientes
        jsonwebtoken.sign(
            {id: userFound._id, userType, email: userFound.email, name: userFound.name, lastName: userFound.lastName}, 
            config.JWT.secret, 
            { expiresIn: rememberMe ? "30d" : config.JWT.expiresIn }, // 30 dias si recordarme, sino el tiempo normal
            (err, token) => {
                if(err) {
                    console.log("Error generando token:", err)
                    return res.status(500).json({message: "Error interno del servidor"})
                }
                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 dias vs 24 horas
                })
                console.log("🍪 Token generado y cookie establecida")
                res.status(200).json({message: "Inicio de sesión exitoso"})
            }
        )
    } catch (error) {
        console.log("Error en login:", error)
        res.status(500).json({message: "Error interno del servidor"})
    }
}
export default loginController