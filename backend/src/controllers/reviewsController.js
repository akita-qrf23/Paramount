const reviewsController = {};
// Importo el modelo de reseñas
import Reviews from "../models/Reviews.js";
// Importo el modelo de productos
import Products from "../models/Products.js";
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// POST (CREATE)
reviewsController.postReviews = async (req, res) => {
    try {
        const { product, customer, rating, comment, response } = req.body;
        // Verificar que el producto exista
        const productExists = await Products.findById(product);
        if (!productExists) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El producto no existe" });
        }
        // Verificar que el cliente exista
        const customerExists = await Customers.findById(customer);
        if (!customerExists) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El cliente no existe" });
        }
        const newReview = new Reviews({ reviewCode, product, customer, rating, comment, response });
        // Guardar la reseña
        await newReview.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Reseña creada con éxito", data: newReview });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear reseña", error: error.message });
    }
};
// READ (GET ALL)
reviewsController.getReviews = async (req, res) => {
    try {
        // Buscar reseñas
        const reviews = await Reviews.find().populate('product', 'name description').populate('customer', 'username email');
        // ESTADO DE OK
        res.status(200).json(reviews);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener reseñas", error: error.message });
    }
};
// READ (GET ONE BY ID)
reviewsController.getReview = async (req, res) => {
    try {
        // Buscar una sola reseña
        const review = await Reviews.findById(req.params.id).populate('product', 'name description').populate('customer', 'username email');
        // Validar que la reseña si exista
        if (!review) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(review);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener reseña", error: error.message });
    }
};
// UPDATE (PUT)
reviewsController.putReviews = async (req, res) => {
    try {
        const { product, customer, rating, comment, response } = req.body;
        // Verificar que el producto exista
        const productExists = await Products.findById(product);
        if (!productExists) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El producto no existe" });
        }
        // Verificar que el cliente exista
        const customerExists = await Customers.findById(customer);
        if (!customerExists) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El cliente no existe" });
        }
        const updatedReview = await Reviews.findByIdAndUpdate(req.params.id, { reviewCode, product, customer, rating, comment, response }, { new: true });
        // Validar que la reseña si exista
        if (!updatedReview) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Reseña actualizada con éxito", data: updatedReview });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar reseña", error: error.message });
    }
};
// DELETE (DELETE)
reviewsController.deleteReviews = async (req, res) => {
    try {
        // Buscar reseña por ID
        const review = await Reviews.findById(req.params.id);
        // Validar que la reseña si exista
        if (!review) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        // Eliminar reseña
        await Reviews.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Reseña eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar reseña", error: error.message });
    }
};
export default reviewsController;