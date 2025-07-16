import { createContext, useState, useEffect } from "react"
const API = "http://localhost:4000/api"
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authCookie, setAuthCookie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const Login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include" // Para incluir cookies en la peticion
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Error en la autenticación")
      }
      // NECESITAMOS OBTENER EL USERTYPE DEL TOKEN O DEL SERVIDOR
      // Hacer una peticion adicional para obtener la info del usuario
      const userInfoResponse = await fetch(`${API}/validateAuthToken`, {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      })
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json()
        
        let userData = { 
          email, 
          userType: userInfo.userType,
          userId: userInfo.userId,
          id: userInfo.userId,  
          name: userInfo.name, 
          lastName: userInfo.lastName,
          profilePic: '' 
        }
       // AGREGAR: Para TODOS los usuarios (incluyendo admin), obtener datos completos
      try {
        let userDataEndpoint = ''
        if (userInfo.userType === 'admin') {
          userDataEndpoint = `${API}/admin/profile/data-public`
        } else if (userInfo.userType === 'customer') {
          userDataEndpoint = `${API}/customers/${userInfo.userId}`
        } else {
          userDataEndpoint = `${API}/employees/${userInfo.userId}`
        }        
        const userDataResponse = await fetch(userDataEndpoint, {
          ...(userInfo.userType !== 'admin' && { credentials: 'include' })
        })
        if (userDataResponse.ok) {
          const completeUserData = await userDataResponse.json()
          // Actualizar userData con datos completos
          userData = {
            ...userData,
            name: completeUserData.name || userData.name,
            lastName: completeUserData.lastName || userData.lastName,
            profilePic: completeUserData.profilePic || '',
            phoneNumber: completeUserData.phoneNumber || '',
            id: userInfo.userType === 'admin' ? 'admin' : userInfo.userId
          }
        }
      } catch (error) {
        console.log("Error obteniendo datos completos en login:", error)
      }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        setAuthCookie(true) // Indicador de que hay cookie valida
        
        return { success: true, message: data.message }
      } else {
        throw new Error("No se pudo obtener información del usuario")
      }
    } catch (error) {
      console.log("Login error:", error.message)
      return { success: false, message: error.message }
    }
  }
  const logout = async () => {
    try {
      // Llamar al endpoint de logout en el backend para limpiar la cookie
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include", // Para incluir cookies en la petición
      })
      console.log("✅ Server logout successful")
    } catch (error) {
      console.error("❌ Error durante el logout:", error)
    } finally {
      // Limpiar datos locales independientemente de si la petición al servidor tuvo éxito
      localStorage.removeItem("user")
      setAuthCookie(null)
      setUser(null)
    }
  }
  // Verificar autenticacion al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intentar restaurar usuario desde localStorage
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          // Verificar si la sesión sigue siendo válida con el servidor
          const response = await fetch(`${API}/validateAuthToken`, {
            method: "POST",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (response.ok) {
            const validationData = await response.json()
            const savedUserData = JSON.parse(savedUser)
            // Obtener datos completos incluyendo profilePic
            let completeUserData = savedUserData
            if (validationData.userType === 'admin') {
              try {
                const adminDataResponse = await fetch(`${API}/admin/profile/data`, {
                  credentials: 'include'  // CON credentials aquí
                })
                if (adminDataResponse.ok) {
                  const adminInfo = await adminDataResponse.json()
                  completeUserData = {
                    ...savedUserData,
                    name: adminInfo.name || "Admin",
                    lastName: adminInfo.lastName || "MixArt",
                    profilePic: adminInfo.profilePic || "",
                    id: "admin",
                    userType: "admin"
                  }
                }
              } catch (error) {
                console.log("Error obteniendo datos de admin en checkAuth:", error)
              }
            } else if (validationData.userType !== 'admin') {
              try {
                let userDataEndpoint = ''
                if (validationData.userType === 'customer') {
                  userDataEndpoint = `${API}/customers/${validationData.userId}`
                } else {
                  userDataEndpoint = `${API}/employees/${validationData.userId}`
                }                
                const userDataResponse = await fetch(userDataEndpoint, {
                  credentials: 'include'
                })
                if (userDataResponse.ok) {
                  const freshUserData = await userDataResponse.json()
                  
                  completeUserData = {
                    ...savedUserData,
                    name: freshUserData.name,
                    lastName: freshUserData.lastName,
                    profilePic: freshUserData.profilePic || '',
                    phoneNumber: freshUserData.phoneNumber,
                    id: validationData.userId,
                    userType: validationData.userType
                  }
                }
              } catch (error) {
                console.log("Error obteniendo datos completos:", error)
              }
            }
            // Actualizar localStorage con datos frescos
            localStorage.setItem("user", JSON.stringify(completeUserData))
            // Sesión válida, restaurar usuario
            setUser(completeUserData)
            setAuthCookie(true) // Indicador de que hay cookie válida
          } else {
            // Sesión inválida, limpiar datos locales
            localStorage.removeItem("user")
            setUser(null)
            setAuthCookie(null)
          }
        } else {
          console.log("📭 No se encontro ningún usuario guardado")
        }
      } catch (error) {
        console.error("❌ Error revisando autenticación:", error)
        // En caso de error, limpiar datos locales
        localStorage.removeItem("user")
        setUser(null)
        setAuthCookie(null)
      } finally {
        console.log("✅ Comprobación de autenticación inicial completada")
        setIsLoading(false)
      }
    }
    checkAuth()
  }, []) // Array vacio - solo ejecutar una vez al montar
  return (
    <AuthContext.Provider value={{ user, Login,  logout, authCookie, setAuthCookie, setUser, API, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
// Export el contexto para poder usarlo en el hook
export { AuthContext }