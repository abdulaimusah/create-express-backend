#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMPLATE_REPO = 'https://github.com/abdulaimusah/express-ts-template.git';

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
  return true;
}

function updatePackageJson(projectPath, projectName) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.name = projectName;
  packageJson.version = "1.0.0";
  delete packageJson.repository;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json');
}

function createBackendProject(projectName) {
  const currentDir = process.cwd();
  const projectPath = path.join(currentDir, projectName);

  console.log(`Creating a new backend project in ${projectPath}`);

  // Clone the template repository
  const cloneCmd = `git clone ${TEMPLATE_REPO} ${projectName}`;
  if (!runCommand(cloneCmd)) {
    console.error('Failed to clone the template repository');
    return;
  }

  // Change into the project directory
  process.chdir(projectPath);

  // Remove the .git folder to start fresh
  runCommand('rm -rf .git');

  // Initialize a new git repository
  runCommand('git init');

  // Update package.json
  updatePackageJson(projectPath, projectName);

  // Install dependencies
  if (!runCommand('npm install')) {
    console.error('Failed to install dependencies');
    return;
  }

  console.log('Backend project created and set up successfully!');
  console.log(`To get started, run the following commands:

  cd ${projectName}
  npm run dev
  `);
}

// Get the project name from command line arguments
const projectName = process.argv[2];

if (!projectName) {
  console.error('Please specify the project name:');
  console.error('  npx create-custom-backend my-backend');
  process.exit(1);
}

createBackendProject(projectName);