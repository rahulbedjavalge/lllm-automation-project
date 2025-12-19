import fs from 'fs/promises';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { createLLM, validateConfig } from './config.js';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';

validateConfig();

// Interactive chatbot with document context
class DocumentChatbot {
  constructor() {
    this.llm = createLLM(0.7);
    this.memory = new BufferMemory();
    this.context = '';
  }
  
  async loadDocument(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      this.context = content.slice(0, 15000); // Limit context size
      console.log(`✅ Loaded document: ${filePath} (${content.length} chars)\n`);
    } catch (error) {
      console.error(`❌ Failed to load document: ${error.message}`);
    }
  }
  
  async chat(userMessage) {
    const template = this.context 
      ? `You are a helpful AI assistant with access to the following document:

Document Content:
{context}

Previous conversation:
{history}

User: {input}
Assistant:`
      : `You are a helpful AI assistant.

Previous conversation:
{history}

User: {input}
Assistant:`;
    
    const prompt = PromptTemplate.fromTemplate(template);
    const chain = new ConversationChain({
      llm: this.llm,
      memory: this.memory,
      prompt
    });
    
    const response = await chain.call({
      input: userMessage,
      context: this.context
    });
    
    return response.response;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const docPath = args[0];
  
  console.log('💬 AI Chatbot\n');
  
  const bot = new DocumentChatbot();
  
  if (docPath) {
    await bot.loadDocument(docPath);
    console.log('Ask questions about the document, or chat normally.\n');
  } else {
    console.log('No document loaded. Starting general chat mode.\n');
    console.log('Tip: Run with a file path to chat about a document');
    console.log('Example: npm run chat path/to/document.txt\n');
  }
  
  const rl = readline.createInterface({ input, output });
  
  console.log('Type "exit" or "quit" to end the conversation.\n');
  
  while (true) {
    const userInput = await rl.question('You: ');
    
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye!');
      rl.close();
      break;
    }
    
    if (!userInput.trim()) continue;
    
    try {
      const response = await bot.chat(userInput);
      console.log(`\nBot: ${response}\n`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }
}

main();