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

    content = content.replace(/(?<!dark:)text-black\/80/g, 'text-black/80 dark:text-gray-200');
    content = content.replace(/(?<!dark:)text-black\/20/g, 'text-black/20 dark:text-gray-500');
    content = content.replace(/(?<!dark:)text-white\/20/g, 'text-white/20 dark:text-gray-600');
    content = content.replace(/(?<!dark:)text-white\/80/g, 'text-white/80 dark:text-gray-300');
    content = content.replace(/(?<!dark:)text-white\/90/g, 'text-white/90 dark:text-gray-200');
    content = content.replace(/border-black\/20/g, 'border-black/20 dark:border-white/20');
    
    // In Funds.tsx / App.tsx: bg-white/50 -> dark:bg-black/20
    content = content.replace(/bg-white\/50/g, 'bg-white/50 dark:bg-black/20');
    
    // And fixing text inside that bg-white/50 box: it has `FY 2025 Return` without explicit text color
    content = content.replace(/<div className="bg-white\/50 dark:bg-black\/20 p-4 rounded-xl font-medium flex justify-between items-center neo-border border-2 border-black\/20 dark:border-white\/20">/g, '<div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl font-medium flex justify-between items-center neo-border border-2 border-black/20 dark:border-white/20 text-black dark:text-white">');


    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated opacities in ${file}`);
    }
  }
});
