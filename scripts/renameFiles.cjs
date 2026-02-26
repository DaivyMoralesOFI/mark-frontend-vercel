const { Project } = require("ts-morph");
const path = require("path");
const fs = require("fs");

const projectPath = "/Users/usuario/Documents/GitHub/mark-frontend";
const project = new Project({
    tsConfigFilePath: path.join(projectPath, "tsconfig.app.json"),
});

// For Vite/React, if it doesn't find all files from tsconfig properly, we can add them manually:
project.addSourceFilesAtPaths(path.join(projectPath, "src/**/*.ts"));
project.addSourceFilesAtPaths(path.join(projectPath, "src/**/*.tsx"));

const toPascalCase = (str) => {
    // e.g. brand-dna -> BrandDNA
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
        continue; // Wait, Sidebar -> Sidebar.tsx is already PascalCase. "dashboard.app" is not strictly specified by user, keep them.
    }

    let expectedName = baseName;
    let category = null;

    if (folders.includes("components") || folders.includes("pages") || folders.includes("layout") || folders.includes("ui") || folders.includes("error-state") || folders.includes("loading-state") || folders.includes("dropdown") || folders.includes("tooltip") || folders.includes("table") || folders.includes("cards") || folders.includes("button") || folders.includes("header") || folders.includes("content-post") || folders.includes("create-post")) {
        // wait, create-post is a module, not a component. only components in `components/` or `pages/` should be PascalCase. 
        // We should only check if its parent or grandparent is exactly `components` or `pages` or `layout` etc
    }

    // A safer approach: parse exactly from the parent dir
    const parentDir = path.basename(path.dirname(filePath));
    const isComponent = ["components", "pages", "layout", "ui", "button", "cards", "dropdown", "error-state", "header", "loading-state", "table", "tooltip"].includes(parentDir) || ext === ".tsx";

    if (isComponent) {
        // Only apply if it's a file exporting components or is under these dirs. All .tsx files are components essentially.
        expectedName = toPascalCase(baseName);
    } else if (folders.includes("hooks")) {
        expectedName = toCamelCase(baseName);
        if (!expectedName.startsWith("use")) {
            expectedName = "use" + expectedName.charAt(0).toUpperCase() + expectedName.slice(1);
        }
    } else if (folders.includes("utils") || folders.includes("services") || folders.includes("lib") || folders.includes("api")) {
        expectedName = toCamelCase(baseName);
        // User specifically wanted format authService.ts for services
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

    if (expectedName && expectedName !== baseName && expectedName !== baseName.toLowerCase()) {
        // Only if it really changed significantly
        if (expectedName.toLowerCase() === baseName.toLowerCase() && expectedName === baseName) {
            continue; // e.g. Sidebar -> Sidebar
        }

        // Check if expectedName fixes the case but maybe the current is already camelCase/PascalCase?
        if (expectedName !== baseName) {
            if (expectedName + ext === "index" + ext || expectedName + ext === "Index" + ext) {
                continue; // don't rename index.ts
            }
            renameOperations.push({
                sourceFile,
                oldPath: filePath,
                newPath: path.join(path.dirname(filePath), expectedName + ext)
            });
        }
    }
}

// DRY RUN Output
console.log(`Found ${renameOperations.length} files to rename.`);
for (const op of renameOperations.slice(0, 20)) {
    console.log(`${path.basename(op.oldPath)} -> ${path.basename(op.newPath)}`);
}

// Execute rename if script is run with --apply
if (process.argv.includes("--apply")) {
    for (const op of renameOperations) {
        if (fs.existsSync(op.newPath)) {
            // e.g. upper/lower case issue on Mac.
            if (op.newPath.toLowerCase() === op.oldPath.toLowerCase()) {
                console.log(`Case only rename: ${op.oldPath} -> ${op.newPath}`);
                // Can't just fs.renameSync without temporary name or using ts-morph's internal
                op.sourceFile.move(op.newPath);
            } else {
                console.log(`Target exists! Skipping ${op.oldPath} -> ${op.newPath}`);
            }
        } else {
            op.sourceFile.move(op.newPath);
        }
    }
    console.log("Saving project...");
    project.saveSync();
    console.log("Done!");
}
