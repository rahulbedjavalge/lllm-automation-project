import axios from 'axios';
import * as cheerio from 'cheerio';
import { createLLM, validateConfig } from './config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

validateConfig();

// Web content summarizer
async function fetchWebContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove script and style elements
    $('script, style, nav, footer, header').remove();
    
    // Get main text content
    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10000); // Limit to first 10k chars
    
    return text;
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }
}

async function summarizeContent(content, summaryType = 'concise') {
  const llm = createLLM(0.3);
  
  const prompts = {
    concise: `Summarize the following content in 3-5 bullet points, focusing on key information:

Content: {content}

Summary:`,
    detailed: `Provide a detailed summary of the following content, including main points, key takeaways, and important details:

Content: {content}

Detailed Summary:`,
    executive: `Create an executive summary of the following content suitable for business leaders:

Content: {content}

Executive Summary:`
  };
  
  const template = prompts[summaryType] || prompts.concise;
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ content });
  return result.text;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📝 Web Content Summarizer');
    console.log('\nUsage: npm run summarize <url> [type]');
    console.log('\nTypes: concise (default), detailed, executive');
    console.log('\nExample: npm run summarize https://example.com detailed');
    return;
  }
  
  const url = args[0];
  const type = args[1] || 'concise';
  
  console.log(`\n📥 Fetching content from: ${url}`);
  
  try {
    const content = await fetchWebContent(url);
    console.log(`✅ Content fetched (${content.length} characters)`);
    
    console.log(`\n🤖 Generating ${type} summary...`);
    const summary = await summarizeContent(content, type);
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 SUMMARY');
    console.log('='.repeat(60));
    console.log(summary);
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
