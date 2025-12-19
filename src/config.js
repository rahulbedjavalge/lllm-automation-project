import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const baseURL =
  process.env.OPENAI_BASE_URL ||
  (process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined);

export const llmConfig = {
  apiKey,
  baseURL,
  modelName: process.env.MODEL_NAME || 'gpt-3.5-turbo',
  temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
};

export function createLLM(temperature = llmConfig.temperature) {
  return new ChatOpenAI({
    openAIApiKey: llmConfig.apiKey,
    modelName: llmConfig.modelName,
    temperature,
    configuration: llmConfig.baseURL ? { baseURL: llmConfig.baseURL } : undefined,
  });
}

export function validateConfig() {
  if (!llmConfig.apiKey) {
    console.error('❌ Error: Set OPENROUTER_API_KEY or OPENAI_API_KEY in .env');
    process.exit(1);
  }
}
