import fs from 'fs/promises';
import { createLLM, validateConfig } from './config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

validateConfig();

// Code analyzer for improvements, bugs, and best practices
async function analyzeCode(filePath, analysisType = 'full') {
  const code = await fs.readFile(filePath, 'utf-8');
  const llm = createLLM(0.3);
  
  const prompts = {
    bugs: `Review the following code for potential bugs, errors, and edge cases:

Code:
{code}

List all potential bugs and issues:`,
    
    improvements: `Suggest improvements for the following code (performance, readability, best practices):

Code:
{code}

Improvement suggestions:`,
    
    security: `Analyze the following code for security vulnerabilities:

Code:
{code}

Security analysis:`,
    
    full: `Perform a comprehensive code review of the following:

Code:
{code}

Provide:
1. Code quality assessment
2. Potential bugs
3. Performance improvements
4. Security concerns
5. Best practice recommendations

Code Review:`
  };
  
  const template = prompts[analysisType] || prompts.full;
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ code: code.slice(0, 8000) });
  return result.text;
}

async function generateTests(filePath) {
  const code = await fs.readFile(filePath, 'utf-8');
  const llm = createLLM(0.5);
  
  const template = `Generate unit tests for the following code:

Code:
{code}

Generate comprehensive test cases covering:
- Normal cases
- Edge cases
- Error handling
- Mock dependencies if needed

Use appropriate testing framework (Jest, Mocha, etc.)

Test Code:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ code: code.slice(0, 8000) });
  return result.text;
}

async function explainCode(filePath) {
  const code = await fs.readFile(filePath, 'utf-8');
  const llm = createLLM(0.4);
  
  const template = `Explain the following code in simple terms:

Code:
{code}

Provide:
1. What this code does (high-level)
2. Step-by-step breakdown
3. Key concepts used
4. Example usage

Explanation:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ code: code.slice(0, 8000) });
  return result.text;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 Code Analyzer\n');
    console.log('Usage: npm run analyze <command> <filepath>\n');
    console.log('Commands:');
    console.log('  review [type] <file>  - Code review (types: full, bugs, improvements, security)');
    console.log('  tests <file>          - Generate unit tests');
    console.log('  explain <file>        - Explain code\n');
    console.log('Examples:');
    console.log('  npm run analyze review bugs src/app.js');
    console.log('  npm run analyze tests src/utils.js');
    console.log('  npm run analyze explain src/config.js');
    return;
  }
  
  const command = args[0];
  
  try {
    if (command === 'review') {
      const type = args[2] ? args[1] : 'full';
      const filePath = args[2] || args[1];
      
      console.log(`\n🔍 Analyzing: ${filePath} (${type})\n`);
      const analysis = await analyzeCode(filePath, type);
      
      console.log('='.repeat(60));
      console.log(analysis);
      console.log('='.repeat(60) + '\n');
      
    } else if (command === 'tests') {
      const filePath = args[1];
      console.log(`\n🧪 Generating tests for: ${filePath}\n`);
      const tests = await generateTests(filePath);
      
      console.log('='.repeat(60));
      console.log(tests);
      console.log('='.repeat(60) + '\n');
      
    } else if (command === 'explain') {
      const filePath = args[1];
      console.log(`\n💡 Explaining: ${filePath}\n`);
      const explanation = await explainCode(filePath);
      
      console.log('='.repeat(60));
      console.log(explanation);
      console.log('='.repeat(60) + '\n');
      
    } else {
      console.log(`❌ Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
