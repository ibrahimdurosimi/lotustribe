import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src', (file: string) => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/hover:bg-gray-100 dark:bg-gray-800/g, 'hover:bg-gray-100 dark:hover:bg-gray-800');
    content = content.replace(/hover:bg-gray-50 dark:bg-gray-800/g, 'hover:bg-gray-50 dark:hover:bg-gray-800');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated hovers in ${file}`);
    }
  }
});
