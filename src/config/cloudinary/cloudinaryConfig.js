const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình Multer để sử dụng Cloudinary làm storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product_images", // Thư mục lưu trữ trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Định dạng file cho phép
    public_id: (req, file) => {
      // Tên file tải lên trên Cloudinary
      return `image${Date.now()}`;
    },
  },
});

const upload = multer({ storage });


module.exports = upload;