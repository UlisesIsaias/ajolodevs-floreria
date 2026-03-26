const multer    = require('multer');
const cloudinary = require('../config/cloudinary');

// Guardar imagen en memoria antes de subir a Cloudinary
const storage = multer.memoryStorage();
const upload  = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// Subir imagen a Cloudinary
const subirImagen = (buffer, carpeta) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `ajolodevs/${carpeta}` },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Eliminar imagen de Cloudinary
const eliminarImagen = async (imageUrl) => {
  try {
    const partes    = imageUrl.split('/');
    const archivo   = partes[partes.length - 1].split('.')[0];
    const carpeta   = partes[partes.length - 2];
    const public_id = `ajolodevs/${carpeta}/${archivo}`;
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
  }
};

module.exports = { upload, subirImagen, eliminarImagen };