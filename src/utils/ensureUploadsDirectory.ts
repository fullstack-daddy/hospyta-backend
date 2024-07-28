import fs from 'fs';
import path from 'path';

const ensureUploadsDirectory = () => {
  const dir = path.join(__dirname, '..', '..', 'uploads');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export default ensureUploadsDirectory;
