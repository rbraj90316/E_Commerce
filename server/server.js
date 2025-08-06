const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors({
    origin: 'http://localhost:3000', // or your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/items', require("./routes/items"));
app.use('/api/auth', authRoutes);
// app.use('/api/payment', cors(), require("./routes/payment"));
// app.use('/api/stripe', require("./routes/stripe")); // Add this line for the stripe routes


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const morgan = require('morgan');
app.use(morgan('combined')); // Logs HTTP requests

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
