import fs from "fs";
import path from "path";

const projectName = process.argv[2];
if (!projectName) {
  console.error("Please provide a project name in kebab-case (e.g., my-cool-project).");
  process.exit(1);
}

const camelCaseName = projectName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const pascalCaseName = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);

// TODO: Replace in all files under src/
// Zelt Template with My Cool Project
// ZeltTemplate with MyCoolProject
// zeltTemplate with myCoolProject
// zeltzelt-template with my-cool-project

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/ZeltTemplateTemplate/g, pascalCaseName);
  content = content.replace(/zeltTemplate/g, camelCaseName);
  content = content.replace(/zeltzelt-template/g, projectName);
  fs.writeFileSync(filePath, content, "utf8");
};

const walkDir = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      replaceInFile(fullPath);
    }
  });
};

walkDir(path.join(process.cwd()));
console.log(`Renamed project to ${projectName} successfully.`);
