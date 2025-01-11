import multer from 'multer';
import path from 'node:path';
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'uploads'),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.mp4');
  }
});

const upload = multer({ storage: storage });

export default upload;
