// server/middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.body.category || 'featured'; // Use 'featured' as default category
        const sanitizedCategory = path.basename(category.replace(/[^a-z0-9]/gi, '_').toLowerCase());
        const uploadPath = path.join(__dirname, '../public', sanitizedCategory);

        // Create directory if it does not exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
