const { Project } = require("ts-morph");
const path = require("path");

const projectPath = "/Users/usuario/Documents/GitHub/mark-frontend";
const project = new Project({
    tsConfigFilePath: path.join(projectPath, "tsconfig.app.json"),
});
project.addSourceFilesAtPaths(path.join(projectPath, "src/**/*.ts"));
project.addSourceFilesAtPaths(path.join(projectPath, "src/**/*.tsx"));

const sourceFile = project.getSourceFile(f => f.getFilePath().endsWith("shared/components/ui/button.tsx"));
if (sourceFile) {
    const oldPath = sourceFile.getFilePath();
    const newPath = path.join(path.dirname(oldPath), "Button.tsx");
    console.log("Found button.tsx. Moving to Button.tsx...");
    sourceFile.move(newPath);
    project.saveSync();
    console.log("Saved.");
} else {
    console.log("Not found.");
}
