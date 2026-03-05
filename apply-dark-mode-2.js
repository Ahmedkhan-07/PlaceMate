const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];
const EXTENSIONS = ['.js', '.jsx'];

function getAllFiles(dirPath, arrayOfFiles) {
    try {
        const files = fs.readdirSync(dirPath);
        files.forEach(function (file) {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            } else {
                if (EXTENSIONS.includes(path.extname(file))) {
                    arrayOfFiles.push(fullPath);
                }
            }
        });
    } catch (e) {
        console.error("Error reading dir", dirPath, e);
    }
    return arrayOfFiles;
}

function processContent(content) {
    let newContent = content;

    // A helper to replace a class with class + dark variant, but only if dark variant isn't already there.
    const safeReplace = (target, darkVariant) => {
        // e.g. target="bg-white", darkVariant="dark:bg-gray-800"
        // Regex: match the target if it's NOT preceded by dark: (like dark:bg-white which doesn't make sense, but just in case)
        // And NOT followed by the dark variant.
        // Easiest reliable way in JS: Split by the target, then join, while checking context.
        // Actually, we can just replace all, and then do a cleanup step for duplicates.
        let regex = new RegExp(`\\b${target}\\b`, 'g');
        newContent = newContent.replace(regex, `${target} ${darkVariant}`);
    };

    // Backgrounds
    safeReplace('bg-white', 'dark:bg-gray-800');
    safeReplace('bg-\\[#F8F9FA\\]', 'dark:bg-[#0F172A]');
    safeReplace('bg-background', 'dark:bg-[#0F172A]');
    safeReplace('bg-bg', 'dark:bg-[#0F172A]'); // Found in page.jsx
    safeReplace('bg-slate-900', 'dark:bg-slate-950');

    // Cards surfaces specifically
    safeReplace('border-border', 'dark:border-gray-700');
    safeReplace('border-\\[#E2E8F0\\]', 'dark:border-gray-700');
    safeReplace('border-gray-200', 'dark:border-gray-700');
    safeReplace('divide-gray-200', 'dark:divide-gray-700');

    // Texts
    safeReplace('text-text-primary', 'dark:text-gray-100');
    safeReplace('text-textPrimary', 'dark:text-gray-100'); // Check camelCase too
    safeReplace('text-\\[#1E293B\\]', 'dark:text-gray-100');
    safeReplace('text-text-secondary', 'dark:text-gray-400');
    safeReplace('text-textSecondary', 'dark:text-gray-400'); // Check camelCase too
    safeReplace('text-\\[#64748B\\]', 'dark:text-gray-400');

    safeReplace('text-gray-900', 'dark:text-gray-100');
    safeReplace('text-gray-800', 'dark:text-gray-200');
    safeReplace('text-gray-700', 'dark:text-gray-300');
    safeReplace('text-gray-600', 'dark:text-gray-400');
    safeReplace('text-gray-500', 'dark:text-gray-400');
    safeReplace('text-slate-900', 'dark:text-gray-100');
    safeReplace('text-slate-800', 'dark:text-gray-200');
    safeReplace('text-slate-700', 'dark:text-gray-300');
    safeReplace('text-slate-600', 'dark:text-gray-400');
    safeReplace('text-slate-500', 'dark:text-gray-400');
    safeReplace('text-slate-400', 'dark:text-gray-500');
    safeReplace('text-black', 'dark:text-white');

    // Hover bg states
    safeReplace('hover:bg-gray-50', 'dark:hover:bg-gray-700');
    safeReplace('hover:bg-gray-100', 'dark:hover:bg-gray-700');
    safeReplace('hover:bg-background', 'dark:hover:bg-[#0F172A]');

    // Badges/Pills (replace base color with combination)
    safeReplace('bg-blue-50', 'dark:bg-blue-900/30');
    safeReplace('text-blue-700', 'dark:text-blue-300');

    safeReplace('bg-green-50', 'dark:bg-green-900/30');
    safeReplace('text-green-700', 'dark:text-green-300');

    safeReplace('bg-red-50', 'dark:bg-red-900/30');
    safeReplace('text-red-700', 'dark:text-red-300');

    safeReplace('bg-yellow-50', 'dark:bg-yellow-900/30');
    safeReplace('bg-amber-50', 'dark:bg-amber-900/30');
    safeReplace('text-yellow-700', 'dark:text-yellow-300');
    safeReplace('text-amber-700', 'dark:text-amber-300');

    safeReplace('bg-gray-100', 'dark:bg-gray-700');
    safeReplace('bg-slate-100', 'dark:bg-slate-800');

    // Clean up duplicates
    // If the dark variant already existed, we just injected it again. 
    // e.g. "dark:bg-gray-800 dark:bg-gray-800"
    const cleanupMap = {
        'dark:bg-gray-800 dark:bg-gray-800': 'dark:bg-gray-800',
        'dark:bg-\\[#0F172A\\] dark:bg-\\[#0F172A\\]': 'dark:bg-[#0F172A]',
        'dark:bg-slate-950 dark:bg-slate-950': 'dark:bg-slate-950',
        'dark:border-gray-700 dark:border-gray-700': 'dark:border-gray-700',
        'dark:divide-gray-700 dark:divide-gray-700': 'dark:divide-gray-700',
        'dark:text-gray-100 dark:text-gray-100': 'dark:text-gray-100',
        'dark:text-gray-200 dark:text-gray-200': 'dark:text-gray-200',
        'dark:text-gray-300 dark:text-gray-300': 'dark:text-gray-300',
        'dark:text-gray-400 dark:text-gray-400': 'dark:text-gray-400',
        'dark:text-white dark:text-white': 'dark:text-white',
        'dark:hover:bg-gray-700 dark:hover:bg-gray-700': 'dark:hover:bg-gray-700',
        'dark:hover:bg-\\[#0F172A\\] dark:hover:bg-\\[#0F172A\\]': 'dark:hover:bg-[#0F172A]',
        'dark:bg-blue-900/30 dark:bg-blue-900/30': 'dark:bg-blue-900/30',
        'dark:text-blue-300 dark:text-blue-300': 'dark:text-blue-300',
        'dark:bg-green-900/30 dark:bg-green-900/30': 'dark:bg-green-900/30',
        'dark:bg-red-900/30 dark:bg-red-900/30': 'dark:bg-red-900/30',
        'dark:bg-yellow-900/30 dark:bg-yellow-900/30': 'dark:bg-yellow-900/30',
        'dark:bg-amber-900/30 dark:bg-amber-900/30': 'dark:bg-amber-900/30',
        'dark:text-amber-300 dark:text-amber-300': 'dark:text-amber-300',
        'dark:bg-gray-700 dark:bg-gray-700': 'dark:bg-gray-700',
        'dark:bg-slate-800 dark:bg-slate-800': 'dark:bg-slate-800',
        'dark:text-green-300 dark:text-green-300': 'dark:text-green-300',
        'dark:text-red-300 dark:text-red-300': 'dark:text-red-300',
        'dark:text-yellow-300 dark:text-yellow-300': 'dark:text-yellow-300',
        'dark:text-gray-500 dark:text-gray-500': 'dark:text-gray-500',
    };

    for (const [dup, clear] of Object.entries(cleanupMap)) {
        // Need to convert dup strings back into regex capable if they have brackets
        const cleanRegex = new RegExp(dup.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/'), 'g');
        newContent = newContent.replace(cleanRegex, clear);
    }

    // extra failsafe: triple duplicates
    for (const [dup, clear] of Object.entries(cleanupMap)) {
        const cleanRegex = new RegExp(dup.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/'), 'g');
        newContent = newContent.replace(cleanRegex, clear);
    }

    return newContent;
}

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = processContent(content);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            return true;
        }
    } catch (e) {
        console.error("Error processing file", filePath, e);
    }
    return false;
}

let modifiedCount = 0;
let totalCount = 0;

console.log("Starting script...");

DIRECTORIES.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`Scanning ${dir}...`);
        const files = getAllFiles(fullPath, []);
        files.forEach(file => {
            totalCount++;
            if (processFile(file)) {
                modifiedCount++;
            }
        });
    } else {
        console.log(`Directory ${dir} not found at ${fullPath}`);
    }
});

console.log(`Processed ${totalCount} files.`);
console.log(`Modified ${modifiedCount} files.`);
