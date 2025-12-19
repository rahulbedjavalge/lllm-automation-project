import fs from 'fs/promises';
import path from 'path';
import { createLLM, validateConfig } from './config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

validateConfig();

// Automatically generate documentation for code files
async function analyzeDirectory(dirPath) {
  const files = [];
  
  async function scan(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scan(fullPath);
      } else if (entry.isFile() && /\.(js|ts|py|java|cpp|go)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dirPath);
  return files;
}

async function generateDocumentation(filePath) {
  const code = await fs.readFile(filePath, 'utf-8');
  const llm = createLLM(0.4);
  
  const template = `Analyze the following code and generate comprehensive documentation:

File: {filename}

Code:
{code}

Generate documentation including:
1. Purpose and overview
2. Main functions/classes and their purposes
3. Key dependencies
4. Usage examples if applicable
5. Any important notes

Documentation:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({
    filename: path.basename(filePath),
    code: code.slice(0, 8000) // Limit code size
  });
  
  return result.text;
}

async function generateREADME(projectPath) {
  const llm = createLLM(0.5);
  
  // Scan for package.json
  let projectInfo = 'No package.json found';
  try {
    const packageJson = await fs.readFile(path.join(projectPath, 'package.json'), 'utf-8');
    projectInfo = packageJson;
  } catch (e) {
    // Continue without package.json
  }
  
  // Get file list
  const files = await analyzeDirectory(projectPath);
  const fileList = files.map(f => path.relative(projectPath, f)).join('\n');
  
  const template = `Generate a comprehensive README.md for this project:

Package Info:
{packageInfo}

Files in project:
{fileList}

Create a README with:
1. Project title and description
2. Features
3. Installation instructions
4. Usage guide
5. Project structure
6. Contributing guidelines

README.md:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({
    packageInfo,
    fileList
  });
  
  return result.text;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('📚 Documentation Generator\n');
  
  if (command === 'readme') {
    const projectPath = args[1] || process.cwd();
    console.log(`Generating README for: ${projectPath}\n`);
    
    try {
      const readme = await generateREADME(projectPath);
      const outputPath = path.join(projectPath, 'README_GENERATED.md');
      await fs.writeFile(outputPath, readme);
      console.log(`✅ README generated: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  } else if (command === 'file') {
    const filePath = args[1];
    if (!filePath) {
      console.log('Usage: npm run docs file <filepath>');
      return;
    }
    
    console.log(`Generating docs for: ${filePath}\n`);
    
    try {
      const docs = await generateDocumentation(filePath);
      console.log('='.repeat(60));
      console.log(docs);
      console.log('='.repeat(60));
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  } else {
    console.log('Usage:');
    console.log('  npm run docs readme [path]  - Generate README for project');
    console.log('  npm run docs file <path>    - Generate docs for specific file');
  }
}

main();
