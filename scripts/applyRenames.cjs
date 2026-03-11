const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const projectPath = "/Users/usuario/Documents/GitHub/mark-frontend";
const project = new Project({
    tsConfigFilePath: path.join(projectPath, "tsconfig.app.json"),
});

// For Vite/React, if it doesn't find all files from tsconfig properly, we can add them manually:
project.addSourceFilesAtPaths(path.join(projectPath, "src/**/*.ts"));
project.addSourceFilesAtPaths(path.join(projectPath, "src/**/*.tsx"));

const toPascalCase = (str) => {
    if (str === "brand-dna") return "BrandDNA";
    if (str === "api-errors-schema") return "ApiErrorsSchema";
    if (str === "api-errors") return "ApiErrors"; // as per project text
    return str.replace(/(^\w|-\w|_\w)/g, (match) =>
        match.replace("-", "").replace("_", "").toUpperCase()
    );
};

const toCamelCase = (str) => {
    if (str === "api-config") return "apiConfig";
    if (str === "schema-validator") return "schemaValidator";
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

// 1. Collect all rename operations
let renameOperations = [];

for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();
    if (filePath.includes("node_modules") || filePath.includes(".git") || filePath.includes("assets")) {
        continue;
    }

    const baseName = sourceFile.getBaseNameWithoutExtension();
    const ext = sourceFile.getExtension();
    const relPath = path.relative(path.join(projectPath, "src"), filePath);
    const folders = relPath.split(path.sep);

    // Skip entry files
    if (["App", "main", "vite-env", "routes", "router", "dashboard.app", "creation-studio.app", "Sidebar"].includes(baseName)) {
        continue;
    }

    const parentDir = path.basename(path.dirname(filePath));
    const isComponent = ["components", "pages", "layout", "ui", "button", "cards", "dropdown", "error-state", "header", "loading-state", "table", "tooltip"].includes(parentDir) || ext === ".tsx";

    let expectedName = baseName;

    if (isComponent) {
        expectedName = toPascalCase(baseName);
    } else if (folders.includes("hooks")) {
        expectedName = toCamelCase(baseName);
        if (!expectedName.startsWith("use")) {
            expectedName = "use" + expectedName.charAt(0).toUpperCase() + expectedName.slice(1);
        }
    } else if (folders.includes("utils") || folders.includes("services") || folders.includes("lib") || folders.includes("api")) {
        expectedName = toCamelCase(baseName);
        if (folders.includes("services") && !expectedName.toLowerCase().includes("service")) {
            expectedName += "Service";
        }
    } else if (folders.includes("types") || folders.includes("schemas") || folders.includes("type")) {
        expectedName = toPascalCase(baseName);
    } else if (folders.includes("store")) {
        if (["store", "rootReducer", "middleware"].includes(baseName)) {
            expectedName = baseName;
        } else {
            expectedName = toCamelCase(baseName);
            if (!expectedName.toLowerCase().includes("slice") && !expectedName.includes("Mock") && !expectedName.includes("mock")) {
                expectedName += "Slice";
            }
        }
    }

    if (expectedName && expectedName !== baseName) {
        if (expectedName + ext === "index" + ext || expectedName + ext === "Index" + ext) {
            continue;
        }
        renameOperations.push({
            oldPath: filePath,
            newPath: path.join(path.dirname(filePath), expectedName + ext),
            oldBaseName: baseName,
            newBaseName: expectedName
        });
    }
}

console.log(`Found ${renameOperations.length} files to rename.`);

// 2. Build a map of old rel path without ext -> new rel path without ext
const renameMap = new Map();
for (const op of renameOperations) {
    // We want to match imports like "@/shared/components/ui/button"
    // So we map "button" to "Button" in the specific directory context.
    const parentDir = path.dirname(op.oldPath);
    // Let's store replacing logic: key is the exact old filename, value is the new filename
    // We will look at every import specifier string.
    renameMap.set(op.oldPath, op);
}

// 3. Update all imports in the project
let updatedFiles = 0;
for (const sourceFile of project.getSourceFiles()) {
    let modified = false;
    const fileDir = path.dirname(sourceFile.getFilePath());

    const updateSpecifier = (decl) => {
        const specifierNode = decl.getModuleSpecifier();
        if (!specifierNode) return;
        const val = specifierNode.getLiteralText();

        // Let's resolve what this points to. 
        // Example 1: "@/shared/components/ui/button"
        // Example 2: "../ui/button"
        // Example 3: "./button"

        let resolvedPath = "";
        if (val.startsWith("@/")) {
            resolvedPath = path.join(projectPath, "src", val.slice(2));
        } else if (val.startsWith("./") || val.startsWith("../")) {
            resolvedPath = path.resolve(fileDir, val);
        } else {
            return; // 3rd party package
        }

        // Check if resolvedPath (with .ts or .tsx) is in our rename operations
        for (const ext of [".ts", ".tsx"]) {
            const possibleOldPath = resolvedPath + ext;
            if (renameMap.has(possibleOldPath)) {
                const op = renameMap.get(possibleOldPath);
                // We just need to replace the last part of the import string (the filename)
                const parts = val.split("/");
                parts[parts.length - 1] = op.newBaseName;
                const newVal = parts.join("/");
                specifierNode.setLiteralValue(newVal);
                modified = true;
                break;
            }
        }
    };

    sourceFile.getImportDeclarations().forEach(updateSpecifier);
    sourceFile.getExportDeclarations().forEach(updateSpecifier);

    if (modified) {
        updatedFiles++;
    }
}

console.log(`Updated imports in ${updatedFiles} files. Saving changes...`);
project.saveSync();

// 4. Execute git mv for all files
let mvSuccess = 0;
let mvFail = 0;

for (const op of renameOperations) {
    try {
        // e.g. git mv src/shared/components/ui/button.tsx src/shared/components/ui/Button.tsx
        // APFS case tricky: git mv handles case changes natively
        const cmd = `git mv --force "${op.oldPath}" "${op.newPath}"`;
        execSync(cmd, { cwd: projectPath });
        mvSuccess++;
    } catch (e) {
        // fall back or ignore if the rename already happened or git is not tracking
        mvFail++;
        console.error(`Failed to git mv: ${op.oldPath} -> ${op.newPath}`);
    }
}

console.log(`Git mv finished: ${mvSuccess} succeeded, ${mvFail} failed.`);
