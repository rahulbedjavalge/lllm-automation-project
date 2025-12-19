/**
 * Example Usage of LLM Automation Tools
 * 
 * This file demonstrates how to use the automation tools programmatically
 */

import { createLLM, validateConfig } from '../src/config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

// Example 1: Simple text generation
async function example1_SimpleGeneration() {
  console.log('Example 1: Simple Text Generation\n');
  
  const llm = createLLM();
  const response = await llm.call([
    { role: 'user', content: 'Write a haiku about coding' }
  ]);
  
  console.log(response.content);
  console.log('\n' + '='.repeat(60) + '\n');
}

// Example 2: Using prompt templates
async function example2_PromptTemplates() {
  console.log('Example 2: Using Prompt Templates\n');
  
  const llm = createLLM();
  const template = `Generate 3 {adjective} ideas for a {type}:

Ideas:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({
    adjective: 'innovative',
    type: 'mobile app'
  });
  
  console.log(result.text);
  console.log('\n' + '='.repeat(60) + '\n');
}

// Example 3: Code refactoring suggestions
async function example3_CodeRefactoring() {
  console.log('Example 3: Code Refactoring\n');
  
  const llm = createLLM(0.3); // Lower temperature for more focused output
  
  const badCode = `
function calc(a,b,c){
  var x=a+b
  var y=x*c
  if(y>100){
    return "big"
  }else{
    return "small"
  }
}
`;
  
  const template = `Refactor this code to follow best practices:

{code}

Refactored code with explanations:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ code: badCode });
  console.log(result.text);
  console.log('\n' + '='.repeat(60) + '\n');
}

// Example 4: Chain multiple operations
async function example4_ChainedOperations() {
  console.log('Example 4: Chained Operations\n');
  
  const llm = createLLM();
  
  // Step 1: Generate a story outline
  const outlineTemplate = `Create a brief story outline about: {topic}`;
  const outlinePrompt = PromptTemplate.fromTemplate(outlineTemplate);
  const outlineChain = new LLMChain({ llm, prompt: outlinePrompt });
  
  const outline = await outlineChain.call({ topic: 'a robot learning to paint' });
  console.log('Story Outline:');
  console.log(outline.text);
  console.log('\n---\n');
  
  // Step 2: Write the first paragraph based on outline
  const storyTemplate = `Based on this outline, write an engaging first paragraph:

Outline: {outline}

First paragraph:`;
  
  const storyPrompt = PromptTemplate.fromTemplate(storyTemplate);
  const storyChain = new LLMChain({ llm, prompt: storyPrompt });
  
  const story = await storyChain.call({ outline: outline.text });
  console.log('First Paragraph:');
  console.log(story.text);
  console.log('\n' + '='.repeat(60) + '\n');
}

// Example 5: Custom automation workflow
async function example5_CustomWorkflow() {
  console.log('Example 5: Custom Automation Workflow\n');
  console.log('Building a meeting agenda from bullet points...\n');
  
  const llm = createLLM(0.6);
  
  const bulletPoints = `
- Q4 results review
- New product launch timeline
- Budget allocation for 2025
- Team expansion plans
`;
  
  const template = `Convert these meeting topics into a professional agenda:

Topics:
{topics}

Generate a structured meeting agenda with:
- Time allocations
- Discussion points
- Expected outcomes

Meeting Agenda:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ topics: bulletPoints });
  console.log(result.text);
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run all examples
async function runAllExamples() {
  validateConfig();
  
  console.log('🚀 LLM Automation Examples\n');
  console.log('='.repeat(60) + '\n');
  
  try {
    await example1_SimpleGeneration();
    await example2_PromptTemplates();
    await example3_CodeRefactoring();
    await example4_ChainedOperations();
    await example5_CustomWorkflow();
    
    console.log('✅ All examples completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if executed directly
runAllExamples();
