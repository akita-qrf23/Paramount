import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const useDataRawMaterials = () => {
  const API = "http://localhost:4000/api/rawmaterials"
  const [rawmaterials, setRawMaterials] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRawMaterials = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si es 403 (sin permisos), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para materias primas - usuario no autorizado")
        setRawMaterials([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las materias primas")
      }
      const data = await response.json()
      setRawMaterials(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
      // Solo mostrar toast si NO es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar materias primas")
      }
      setLoading(false)
    }
  }
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/suppliers", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener proveedores")
      }
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
    }
  }
  useEffect(() => {
    fetchRawMaterials()
    fetchSuppliers()
  }, [])
  const createHandlers = (API) => ({
    data: rawmaterials,
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
        const response = await fetch(`${API}/rawmaterials`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar materia prima")
        }
        toast.success('Materia prima registrada exitosamente')
        fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar materia prima")
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
        const response = await fetch(`${API}/rawmaterials/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar materia prima")
        }
        toast.success('Materia prima actualizada exitosamente')
        fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar materia prima")
        throw error
      }
    }, onDelete: deleteRawMaterial
  })
  const deleteRawMaterial = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la materia prima")
      }
      toast.success('Materia prima eliminada exitosamente')
      fetchRawMaterials()
    } catch (error) {
      console.error("Error al eliminar materia prima:", error)
      toast.error("Error al eliminar materia prima")
    }
  }
  return {
    rawmaterials,
    suppliers,
    loading,
    fetchRawMaterials,
    fetchSuppliers,
    deleteRawMaterial,
    createHandlers
  }
}
export default useDataRawMaterials