import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const useDataProducts = () => {
  const API = "http://localhost:4000/api/products"
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubategories] = useState([])
  const [collections, setCollections] = useState([])
  const [rawmaterials, setRawMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si es 403 (sin permisos), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para productos - usuario no autorizado")
        setProducts([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los productos")
      }
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener productos:", error)
      // Solo mostrar toast si NO es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar artículos")
      }
      setLoading(false)
    }
  }
  const fetchCollections = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/collections", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las colecciones")
      }
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener categorías de productos")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
    }
  }
  const fetchSubcategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/subcategories", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las subcategorías")
      }
      const data = await response.json()
      setSubategories(data)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
    }
  }
  const fetchRawMaterials = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/rawmaterials", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las materias primas")
      }
      const data = await response.json()
      setRawMaterials(data)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
    }
  }
  useEffect(() => {
    fetchProducts()
    fetchCollections()
    fetchCategories()
    fetchSubcategories()
    fetchRawMaterials()
  }, [])
  const createHandlers = (API) => ({
    data: products,
    loading,
    onAdd: async (data) => {
      try {
        // Usar FormData si hay imagen
        let body
        let headers = { credentials: "include" }
        
        // Si hay array de imágenes, usar FormData
        if (data.images && Array.isArray(data.images) && data.images.some(file => file instanceof File)) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            if (key === "images") {
              // Si el campo es 'images' y es un array, itera y añade cada archivo
              data.images.forEach((file) => {
                if (file instanceof File) {
                  formData.append("images", file) // Importante: mismo nombre de campo para cada archivo
                }
              })
            } else {
              formData.append(key, data[key])
            }
          })
          body = formData
          // No se establece el Content-Type para FormData, dejar que el navegador lo establezca
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/products`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar producto")
        }
        toast.success('Producto registrado exitosamente')
        fetchProducts()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar producto")
        throw error
      }
    }, onEdit: async (id, data) => {
      try {
        // Usar FormData si hay imagen (o imágenes)
        let body
        let headers = { credentials: "include" }
        
        // Si hay array de imágenes, usar FormData
        if (data.images && Array.isArray(data.images) && data.images.some(file => file instanceof File)) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            if (key === "images") {
              // Si el campo es 'images' y es un array, itera y añade cada archivo
              data.images.forEach((file) => {
                if (file instanceof File) {
                  formData.append("images", file) // Importante: mismo nombre de campo para cada archivo
                }
              })
            } else {
              formData.append(key, data[key])
            }
          })
          body = formData
          // No se establece el Content-Type para FormData, dejar que el navegador lo establezca
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/products/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar artículo")
        }
        toast.success('Producto actualizado exitosamente')
        fetchProducts()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar producto")
        throw error
      }
    }, onDelete: deleteProduct
  })
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el producto")
      }
      toast.success('Producto eliminado exitosamente')
      fetchProducts()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      toast.error("Error al eliminar producto")
    }
  }
  return {
    products,
    categories,
    subcategories,
    collections,
    rawmaterials,
    loading,
    fetchProducts,
    fetchCollections,
    fetchCategories,
    fetchSubcategories,
    fetchRawMaterials,
    deleteProduct,
    createHandlers
  }
}
export default useDataProducts