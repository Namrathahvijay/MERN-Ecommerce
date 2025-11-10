import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (err) {
      cb(err, uploadPath);
    }
  },
  filename: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, "_");
    callback(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
