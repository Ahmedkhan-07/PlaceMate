const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];
const EXTENSIONS = ['.js', '.jsx'];

// Recursively get all target files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (EXTENSIONS.includes(path.extname(file))) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

// Processing logic
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We do simple regex replacements. To avoid repeating dark classes if already present,
    // we use a negative lookahead, or just rely on a simple replace all and then a cleanup step.

    // We will do straightforward global regex replacements, ensuring we don't double inject.
    // e.g. text-text-primary -> text-text-primary dark:text-gray-100

    // Backgrounds
    content = content.replace(/(?<!dark:)bg-white/g, 'bg-white dark:bg-gray-800');
    content = content.replace(/(?<!dark:)bg-\[\#F8F9FA\]/g, 'bg-[#F8F9FA] dark:bg-[#0F172A]');
    content = content.replace(/(?<!dark:)bg-background/g, 'bg-background dark:bg-[#0F172A]');

    // Cards surfaces specifically
    // Sometimes border-border is used.
    content = content.replace(/(?<!dark:)border-border/g, 'border-border dark:border-gray-700');
    content = content.replace(/(?<!dark:)border-\[\#E2E8F0\]/g, 'border-[#E2E8F0] dark:border-gray-700');
    content = content.replace(/(?<!dark:)border-gray-200/g, 'border-gray-200 dark:border-gray-700');
    content = content.replace(/(?<!dark:)divide-gray-200/g, 'divide-gray-200 dark:divide-gray-700');

    // Texts
    content = content.replace(/(?<!dark:)text-text-primary/g, 'text-text-primary dark:text-gray-100');
    content = content.replace(/(?<!dark:)text-\[\#1E293B\]/g, 'text-[#1E293B] dark:text-gray-100');
    content = content.replace(/(?<!dark:)text-text-secondary/g, 'text-text-secondary dark:text-gray-400');
    content = content.replace(/(?<!dark:)text-\[\#64748B\]/g, 'text-[#64748B] dark:text-gray-400');

    content = content.replace(/(?<!dark:)text-gray-900/g, 'text-gray-900 dark:text-gray-100');
    content = content.replace(/(?<!dark:)text-gray-800/g, 'text-gray-800 dark:text-gray-200');
    content = content.replace(/(?<!dark:)text-gray-700/g, 'text-gray-700 dark:text-gray-300');
    content = content.replace(/(?<!dark:)text-gray-600/g, 'text-gray-600 dark:text-gray-400');
    content = content.replace(/(?<!dark:)text-gray-500/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/(?<!dark:)text-black/g, 'text-black dark:text-white');

    content = content.replace(/(?<!dark:)placeholder:text-slate-400/g, 'placeholder:text-slate-400 dark:placeholder:text-gray-500');

    // Hover bg states
    content = content.replace(/(?<!dark:)hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-gray-700');
    content = content.replace(/(?<!dark:)hover:bg-gray-100/g, 'hover:bg-gray-100 dark:hover:bg-gray-700');

    // Badges/Pills
    content = content.replace(/(?<!dark:)bg-blue-50(?!.*dark:bg-blue-900\/30)/g, 'bg-blue-50 dark:bg-blue-900/30');
    content = content.replace(/(?<!dark:)text-blue-700(?!.*dark:text-blue-300)/g, 'text-blue-700 dark:text-blue-300');

    content = content.replace(/(?<!dark:)bg-green-50(?!.*dark:bg-green-900\/30)/g, 'bg-green-50 dark:bg-green-900/30');
    content = content.replace(/(?<!dark:)text-green-700(?!.*dark:text-green-300)/g, 'text-green-700 dark:text-green-300');

    content = content.replace(/(?<!dark:)bg-red-50(?!.*dark:bg-red-900\/30)/g, 'bg-red-50 dark:bg-red-900/30');
    content = content.replace(/(?<!dark:)text-red-700(?!.*dark:text-red-300)/g, 'text-red-700 dark:text-red-300');

    content = content.replace(/(?<!dark:)bg-yellow-50(?!.*dark:bg-yellow-900\/30)/g, 'bg-yellow-50 dark:bg-yellow-900/30');
    content = content.replace(/(?<!dark:)text-yellow-700(?!.*dark:text-yellow-300)/g, 'text-yellow-700 dark:text-yellow-300');

    content = content.replace(/(?<!dark:)bg-gray-100(?!.*dark:bg-gray-700)/g, 'bg-gray-100 dark:bg-gray-700');

    // Clean up any double injections that might have happened if it already existed
    content = content.replace(/dark:bg-gray-800 dark:bg-gray-800/g, 'dark:bg-gray-800');
    content = content.replace(/dark:bg-\[\#0F172A\] dark:bg-\[\#0F172A\]/g, 'dark:bg-[#0F172A]');
    content = content.replace(/dark:border-gray-700 dark:border-gray-700/g, 'dark:border-gray-700');
    content = content.replace(/dark:divide-gray-700 dark:divide-gray-700/g, 'dark:divide-gray-700');
    content = content.replace(/dark:text-gray-100 dark:text-gray-100/g, 'dark:text-gray-100');
    content = content.replace(/dark:text-gray-200 dark:text-gray-200/g, 'dark:text-gray-200');
    content = content.replace(/dark:text-gray-300 dark:text-gray-300/g, 'dark:text-gray-300');
    content = content.replace(/dark:text-gray-400 dark:text-gray-400/g, 'dark:text-gray-400');
    content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');
    content = content.replace(/dark:hover:bg-gray-700 dark:hover:bg-gray-700/g, 'dark:hover:bg-gray-700');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

let modifiedCount = 0;
let totalCount = 0;

DIRECTORIES.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        const files = getAllFiles(fullPath, []);
        files.forEach(file => {
            totalCount++;
            if (processFile(file)) {
                modifiedCount++;
            }
        });
    }
});

console.log(`Processed ${totalCount} files.`);
console.log(`Modified ${modifiedCount} files.`);
