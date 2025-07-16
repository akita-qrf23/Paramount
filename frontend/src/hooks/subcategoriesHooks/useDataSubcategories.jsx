import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const useDataSubcategories = () => {
  const API = "http://localhost:4000/api/subcategories"
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si es 403 (sin permisos), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para subcategorías - usuario no autorizado")
        setSubcategories([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las subcategorías")
      }
      const data = await response.json()
      setSubcategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
      // Solo mostrar toast si NO es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar subcategorías")
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSubcategories()
  }, [])
  const createHandlers = (API) => ({
    data: subcategories,
    loading,
    onAdd: async (data) => {
      try {
        // Usar FormData si hay imagen
        let body
        let headers = { credentials: "include" }

        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
          // No se establece el Content-Type para FormData, dejar que el navegador lo establezca
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/subcategories`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar subcategoría")
        }
        toast.success('Subcategoría registrada exitosamente')
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar subcategoría")
        throw error
      }
    }, onEdit: async (id, data) => {
      try {
        // Usar FormData si hay imagen
        let body
        let headers = { credentials: "include" }

        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
          // No se establece el Content-Type para FormData, dejar que el navegador lo establezca
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/subcategories/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar subcategoría")
        }
        toast.success('Subcategoría actualizada exitosamente')
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar subcategoría")
        throw error
      }
    }, onDelete: deleteSubcategory
  })
  const deleteSubcategory = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la subcategoría")
      }
      toast.success('Subcategoría eliminada exitosamente')
      fetchSubcategories()
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }
  return {
    subcategories,
    loading,
    deleteSubcategory,
    fetchSubcategories,
    createHandlers
  }
}
export default useDataSubcategories