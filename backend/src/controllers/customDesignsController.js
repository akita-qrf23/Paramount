const customDesignsController = {};
// Importar modelo de diseños personalizados
import CustomDesigns from "../models/CustomDesigns.js";
// Importar modelo de elementos para verificar existencia
import DesignElements from "../models/DesignElements.js";
// POST (CREATE)
customDesignsController.postDesigns = async (req, res) => {
    try {
        const { codeRequest, piece, base, baseLength, decoration, clasp, customerComments } = req.body;

        // Verificar que la base exista
        const baseExists = await DesignElements.findById(base);
        if (!baseExists) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "La base seleccionada no existe" });
        }
        // Verificar que el cierre exista
        const claspExists = await DesignElements.findById(clasp);
        if (!claspExists) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El cierre seleccionado no existe" });
        }
        // Verificar que los elementos de decoración existan
        for (const decoId of decoration) {
            const exists = await DesignElements.findById(decoId);
            if (!exists) {
                return res.status(400).json({ message: `El elemento de decoración con ID ${decoId} no existe` });
            }
        }
        const newDesign = new CustomDesigns({ codeRequest, piece, base, baseLength, decoration, clasp, customerComments });
        // Guardar diseño
        await newDesign.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Diseño creado con éxito", data: newDesign });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear diseño", error: error.message });
    }
};
// READ (GET ALL)
customDesignsController.getDesigns = async (req, res) => {
    try {
        // Buscar diseños
        const designs = await CustomDesigns.find().populate('base', 'name type').populate('decoration', 'name type').populate('clasp', 'name type');
        // ESTADO DE OK
        res.status(200).json(designs);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener diseños", error: error.message });
    }
};
// READ (GET ONE BY ID)
customDesignsController.getDesign = async (req, res) => {
    try {
        // Buscar un solo diseño
        const design = await CustomDesigns.findById(req.params.id).populate('base', 'name type').populate('decoration', 'name type').populate('clasp', 'name type');
        // Validar que el diseño si exista
        if (!design) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(design);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener diseño", error: error.message });
    }
};
// UPDATE (PUT)
customDesignsController.putDesigns = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de diseño
        if (updates.codeRequest) {
            const existingDesign = await CustomDesigns.findOne({
                codeRequest: updates.codeRequest,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingDesign) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El código de diseño ya está en uso" });
            }
        }
        // Verificar que los elementos de decoración existan
        for (const decoId of updates.decoration) {
            const exists = await DesignElements.findById(decoId);
            if (!exists) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: `El elemento de decoración con ID ${decoId} no existe` });
            }
        }
        const updatedDesign = await CustomDesigns.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedDesign) {
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Diseño actualizado con éxito", data: updatedDesign });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar diseño", error: error.message });
    }
};
// DELETE
customDesignsController.deleteDesigns = async (req, res) => {
    try {
        // Buscar diseño por su ID
        const design = await CustomDesigns.findById(req.params.id);
        if (!design) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        // Borrar diseño
        await CustomDesigns.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Diseño eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar diseño", error: error.message });
    }
};
export default customDesignsController;