import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const useDataCollections = () => {
  const API = "http://localhost:4000/api/collections"
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCollections = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si es 403 (sin permisos), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para colecciones - usuario no autorizado")
        setCollections([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las colecciones")
      }
      const data = await response.json()
      setCollections(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
      // Solo mostrar toast si NO es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar colecciones")
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCollections()
  }, [])
  const createHandlers = (API) => ({
    data: collections,
    loading,
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/collections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar colección")
        }
        toast.success('Colección registrada exitosamente')
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar colección")
        throw error
      }
    }, onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/collections/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar colección")
        }
        toast.success('Colección actualizada exitosamente')
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar colección")
        throw error
      }
    }, onDelete: deleteCollection
  })
  const deleteCollection = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la colección")
      }
      toast.success('Colección eliminada exitosamente')
      fetchCollections()
    } catch (error) {
      console.error("Error al eliminar colección:", error)
      toast.error("Error al eliminar colección")
    }
  }
  return {
    collections,
    loading,
    deleteCollection,
    fetchCollections,
    createHandlers
  }
}
export default useDataCollections