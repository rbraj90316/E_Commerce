// D: \re - commerce\E - commerce\server\controllers\itemsController.js
const Item = require("../models/itemsModel")

/* GET request handler */
const getItem = async (req, res) => {
    const items = await Item.find()
    res.json(items)
}

/* POST Request handler */
const addItem = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the entire request body

        // Ensure that highlights and size are provided and are strings
        const highlights = req.body.highlights ? req.body.highlights.split(",") : [];
        const size = req.body.size ? req.body.size.split(",") : [];

        console.log('Highlights:', highlights);
        console.log('Size:', size);

        const item = {
            name: req.body.name,
            category: req.body.category,
            type: req.body.type,
            color: req.body.color,
            description: req.body.description,
            price: req.body.price,
            image: req.files, // Make sure this is correct
            size: size,
            highlights: highlights,
            detail: req.body.detail
        };

        await Item.create(item);
        res.status(201).json({ message: "Items Add Success" });
    } catch (err) {
        console.error('Error adding item:', err.message); // Log the error
        res.status(500).json({ message: "Something went wrong!" });
    }
};
    
/* PUT Request handler */
/* PUT Request handler */
const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedData = req.body;

        // Update item in the database
        const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item updated successfully", item: updatedItem });
    } catch (err) {
        console.error('Error updating item:', err.message);
        res.status(500).json({ message: "Something went wrong!" });
    }
};


/* DELETE Request handler */
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        // Delete item from the database
        const deletedItem = await Item.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error('Error deleting item:', err.message);
        res.status(500).json({ message: "Something went wrong!" });
    }
};


module.exports = {
    getItem,
    addItem,
    updateItem,
    deleteItem
}