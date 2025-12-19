import { createLLM, validateConfig } from './config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

validateConfig();

// Automated email/message writer
async function generateEmail(type, details) {
  const llm = createLLM(0.7);
  
  const templates = {
    professional: `Write a professional email with the following details:

To: {recipient}
Subject: {subject}
Purpose: {purpose}
Key Points: {keyPoints}

Generate a well-structured, professional email:`,
    
    followup: `Write a follow-up email based on:

Previous Context: {context}
Purpose of Follow-up: {purpose}
Action Items: {actionItems}

Generate a polite follow-up email:`,
    
    apology: `Write an apology email for:

Situation: {situation}
What Went Wrong: {issue}
Proposed Solution: {solution}

Generate a sincere apology email:`,
    
    thank_you: `Write a thank you email for:

Recipient: {recipient}
Reason for Thanks: {reason}
Specific Details: {details}

Generate a warm, appreciative thank you email:`,
    
    meeting_request: `Write a meeting request email:

Attendees: {attendees}
Purpose: {purpose}
Proposed Times: {times}
Duration: {duration}

Generate a clear meeting request email:`
  };
  
  const template = templates[type] || templates.professional;
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call(details);
  return result.text;
}

async function improveText(text, improvementType = 'grammar') {
  const llm = createLLM(0.3);
  
  const templates = {
    grammar: `Fix grammar and spelling errors in the following text:

Text: {text}

Corrected Text:`,
    
    professional: `Make the following text more professional and formal:

Text: {text}

Professional Version:`,
    
    concise: `Make the following text more concise while preserving the meaning:

Text: {text}

Concise Version:`,
    
    friendly: `Make the following text more friendly and approachable:

Text: {text}

Friendly Version:`
  };
  
  const template = templates[improvementType] || templates.grammar;
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ text });
  return result.text;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('✉️  Email & Text Writer\n');
    console.log('Usage: node src/emailWriter.js <command> [options]\n');
    console.log('Commands:');
    console.log('  email <type>     - Generate email (types: professional, followup, apology, thank_you, meeting_request)');
    console.log('  improve <type>   - Improve text (types: grammar, professional, concise, friendly)\n');
    console.log('Examples:');
    console.log('  node src/emailWriter.js email professional');
    console.log('  node src/emailWriter.js improve grammar "Your text here"');
    return;
  }
  
  const command = args[0];
  
  if (command === 'email') {
    const type = args[1] || 'professional';
    
    // Example usage - in real use, you'd pass these as arguments or prompts
    const exampleDetails = {
      professional: {
        recipient: 'team@company.com',
        subject: 'Project Update',
        purpose: 'Provide weekly project status update',
        keyPoints: 'Milestone 1 completed, On track for deadline, Need approval for budget increase'
      },
      thank_you: {
        recipient: 'John Doe',
        reason: 'Helping with the project deadline',
        details: 'Your extra hours and expertise on the backend integration were crucial'
      },
      meeting_request: {
        attendees: 'Development Team',
        purpose: 'Discuss Q1 roadmap and priorities',
        times: 'Next Tuesday or Wednesday afternoon',
        duration: '1 hour'
      }
    };
    
    const details = exampleDetails[type] || exampleDetails.professional;
    
    console.log(`\n📧 Generating ${type} email...\n`);
    const email = await generateEmail(type, details);
    
    console.log('='.repeat(60));
    console.log(email);
    console.log('='.repeat(60) + '\n');
    
  } else if (command === 'improve') {
    const type = args[1] || 'grammar';
    const text = args[2] || 'This is example text that need improvement.';
    
    console.log(`\n✨ Improving text (${type})...\n`);
    const improved = await improveText(text, type);
    
    console.log('Original:');
    console.log(text);
    console.log('\n' + '='.repeat(60));
    console.log('Improved:');
    console.log(improved);
    console.log('='.repeat(60) + '\n');
  }
}

main();
