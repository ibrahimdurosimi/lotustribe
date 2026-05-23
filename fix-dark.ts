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

    // Replace static light backgrounds
    // Uses lookarounds to avoid replacing inside existing dark classes
    content = content.replace(/(?<!dark:)bg-white(?!\/|-)/g, 'bg-white dark:bg-gray-900');
    content = content.replace(/(?<!dark:)bg-gray-50(?!\/|-)/g, 'bg-gray-50 dark:bg-gray-800');
    content = content.replace(/(?<!dark:)bg-gray-100(?!\/|-)/g, 'bg-gray-100 dark:bg-gray-800');
    content = content.replace(/(?<!dark:)bg-\[\#fafafa\]/g, 'bg-[#fafafa] dark:bg-[#111]');

    // Replace text colors
    content = content.replace(/(?<!dark:)text-lotus-dark(?!\/|-)/g, 'text-lotus-dark dark:text-white');
    content = content.replace(/(?<!dark:)text-black(?!\/|-)/g, 'text-black dark:text-white');
    content = content.replace(/(?<!dark:)text-gray-500(?!\/|-)/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/(?<!dark:)text-gray-600(?!\/|-)/g, 'text-gray-600 dark:text-gray-300');
    content = content.replace(/(?<!dark:)text-gray-700(?!\/|-)/g, 'text-gray-700 dark:text-gray-200');
    content = content.replace(/(?<!dark:)text-gray-800(?!\/|-)/g, 'text-gray-800 dark:text-gray-200');
    content = content.replace(/(?<!dark:)text-gray-900(?!\/|-)/g, 'text-gray-900 dark:text-gray-100');
    
    // Replace borders
    content = content.replace(/(?<!dark:)border-gray-100(?!\/|-)/g, 'border-gray-100 dark:border-gray-800');
    content = content.replace(/(?<!dark:)border-gray-200(?!\/|-)/g, 'border-gray-200 dark:border-gray-700');
    
    // Specific sections that use #1A1A1A or #111
    // The hero and learn sections in App.tsx
    content = content.replace(/(?<!dark:)bg-\[\#1A1A1A\](?!\/)/g, 'bg-[#1A1A1A] dark:bg-[#0a0a0a]');
    content = content.replace(/(?<!dark:)bg-\[\#111\](?!\/)/g, 'bg-[#111] dark:bg-[#050505]');
    content = content.replace(/(?<!dark:)bg-\[\#222\](?!\/)/g, 'bg-[#222] dark:bg-[#1a1a1a]');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});
