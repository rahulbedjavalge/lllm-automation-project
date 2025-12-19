import { createLLM, validateConfig } from './config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import fs from 'fs/promises';

validateConfig();

// Content generation automation
async function generateBlogPost(topic, keywords, tone = 'informative') {
  const llm = createLLM(0.8);
  
  const template = `Write a comprehensive blog post about: {topic}

Keywords to include: {keywords}
Tone: {tone}

Generate a blog post with:
- Engaging title
- Introduction
- 3-4 main sections with subheadings
- Conclusion
- Call to action

Blog Post:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ topic, keywords, tone });
  return result.text;
}

async function generateSocialMedia(content, platform = 'twitter') {
  const llm = createLLM(0.7);
  
  const templates = {
    twitter: `Create an engaging Twitter thread (5-7 tweets) about:

Content: {content}

Make it informative, engaging, and include relevant hashtags.

Twitter Thread:`,
    
    linkedin: `Create a professional LinkedIn post about:

Content: {content}

Make it professional, insightful, and suitable for a business audience.

LinkedIn Post:`,
    
    instagram: `Create an Instagram caption for content about:

Content: {content}

Make it engaging, include emoji, and relevant hashtags.

Instagram Caption:`,
    
    facebook: `Create a Facebook post about:

Content: {content}

Make it conversational and engaging for a general audience.

Facebook Post:`
  };
  
  const template = templates[platform] || templates.twitter;
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ content });
  return result.text;
}

async function generateProductDescription(productName, features, targetAudience) {
  const llm = createLLM(0.7);
  
  const template = `Create a compelling product description for:

Product Name: {productName}
Key Features: {features}
Target Audience: {targetAudience}

Generate:
1. Headline (attention-grabbing)
2. Short description (2-3 sentences)
3. Detailed features and benefits
4. Why choose this product
5. Call to action

Product Description:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({
    productName,
    features,
    targetAudience
  });
  
  return result.text;
}

async function generateFAQ(topic, commonQuestions = '') {
  const llm = createLLM(0.6);
  
  const template = `Generate a comprehensive FAQ section for: {topic}

${commonQuestions ? 'Common questions to address: {commonQuestions}' : ''}

Create 8-10 frequently asked questions with detailed, helpful answers.

FAQ:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ topic, commonQuestions });
  return result.text;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📝 Content Generator\n');
    console.log('Usage: node src/contentGenerator.js <command> [options]\n');
    console.log('Commands:');
    console.log('  blog <topic>           - Generate blog post');
    console.log('  social <platform>      - Generate social media post (twitter, linkedin, instagram, facebook)');
    console.log('  product <name>         - Generate product description');
    console.log('  faq <topic>            - Generate FAQ section\n');
    console.log('Examples:');
    console.log('  node src/contentGenerator.js blog "AI in Healthcare"');
    console.log('  node src/contentGenerator.js social twitter "Our new product launch"');
    return;
  }
  
  const command = args[0];
  
  try {
    if (command === 'blog') {
      const topic = args[1] || 'Artificial Intelligence Trends';
      const keywords = args[2] || 'AI, machine learning, automation, technology';
      
      console.log(`\n📝 Generating blog post about: ${topic}\n`);
      const blog = await generateBlogPost(topic, keywords);
      
      console.log('='.repeat(60));
      console.log(blog);
      console.log('='.repeat(60) + '\n');
      
      // Save to file
      const filename = `blog_${Date.now()}.md`;
      await fs.writeFile(filename, blog);
      console.log(`✅ Saved to: ${filename}\n`);
      
    } else if (command === 'social') {
      const platform = args[1] || 'twitter';
      const content = args[2] || 'Our amazing new product just launched!';
      
      console.log(`\n📱 Generating ${platform} post...\n`);
      const post = await generateSocialMedia(content, platform);
      
      console.log('='.repeat(60));
      console.log(post);
      console.log('='.repeat(60) + '\n');
      
    } else if (command === 'product') {
      const name = args[1] || 'Smart Home Assistant';
      const features = args[2] || 'Voice control, AI-powered, Easy setup, Multi-device support';
      const audience = args[3] || 'Tech-savvy homeowners';
      
      console.log(`\n🛍️  Generating product description for: ${name}\n`);
      const description = await generateProductDescription(name, features, audience);
      
      console.log('='.repeat(60));
      console.log(description);
      console.log('='.repeat(60) + '\n');
      
    } else if (command === 'faq') {
      const topic = args[1] || 'Cloud Computing Services';
      
      console.log(`\n❓ Generating FAQ for: ${topic}\n`);
      const faq = await generateFAQ(topic);
      
      console.log('='.repeat(60));
      console.log(faq);
      console.log('='.repeat(60) + '\n');
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
