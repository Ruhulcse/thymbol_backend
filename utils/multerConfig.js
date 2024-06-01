// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const storeId = req.storeId; // Use storeId set in req object
        const dir = `../public/stores/${storeId}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit per file
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
