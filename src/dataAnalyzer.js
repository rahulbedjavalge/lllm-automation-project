import fs from 'fs/promises';
import { createLLM, validateConfig } from './config.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

validateConfig();

// Data analysis and insights generation
async function analyzeCSV(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  const headers = lines[0].split(',');
  const sampleRows = lines.slice(1, Math.min(101, lines.length)); // First 100 rows
  
  return {
    headers,
    rowCount: lines.length - 1,
    sample: sampleRows.slice(0, 5).join('\n')
  };
}

async function generateInsights(data, analysisType = 'general') {
  const llm = createLLM(0.5);
  
  const templates = {
    general: `Analyze the following dataset and provide insights:

Headers: {headers}
Total Rows: {rowCount}
Sample Data:
{sample}

Provide:
1. Data summary and overview
2. Key patterns and trends
3. Interesting insights
4. Potential issues or anomalies
5. Recommendations

Analysis:`,
    
    business: `Perform a business analysis on this dataset:

Headers: {headers}
Total Rows: {rowCount}
Sample Data:
{sample}

Provide business insights including:
1. Revenue/performance trends
2. Customer behavior patterns
3. Opportunities for growth
4. Risk factors
5. Action recommendations

Business Analysis:`,
    
    statistical: `Provide statistical analysis for this dataset:

Headers: {headers}
Total Rows: {rowCount}
Sample Data:
{sample}

Describe:
1. Data distribution characteristics
2. Notable statistical patterns
3. Correlation observations
4. Data quality assessment
5. Suggested statistical tests

Statistical Analysis:`
  };
  
  const template = templates[analysisType] || templates.general;
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call(data);
  return result.text;
}

async function generateSQL(naturalLanguageQuery, tableSchema) {
  const llm = createLLM(0.3);
  
  const template = `Convert the following natural language query to SQL:

Table Schema: {schema}

Natural Language Query: {query}

Generate only the SQL query:

SQL:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({
    schema: tableSchema,
    query: naturalLanguageQuery
  });
  
  return result.text;
}

async function generateReport(data, reportType = 'summary') {
  const llm = createLLM(0.6);
  
  const template = `Generate a ${reportType} report for this data:

Data: {data}

Create a well-structured report with:
- Executive summary
- Key findings
- Visualizations suggestions
- Conclusions
- Next steps

Report:`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({ llm, prompt });
  
  const result = await chain.call({ data, reportType });
  return result.text;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📊 Data Analyzer\n');
    console.log('Usage: node src/dataAnalyzer.js <command> [options]\n');
    console.log('Commands:');
    console.log('  analyze <csv-file> [type]  - Analyze CSV (types: general, business, statistical)');
    console.log('  sql <schema> <query>       - Convert natural language to SQL');
    console.log('  report <data-description>  - Generate data report\n');
    console.log('Examples:');
    console.log('  node src/dataAnalyzer.js analyze sales.csv business');
    console.log('  node src/dataAnalyzer.js sql "users(id,name,email)" "get all users from NY"');
    return;
  }
  
  const command = args[0];
  
  try {
    if (command === 'analyze') {
      const filePath = args[1];
      const type = args[2] || 'general';
      
      if (!filePath) {
        console.log('❌ Please provide a CSV file path');
        return;
      }
      
      console.log(`\n📊 Analyzing: ${filePath}\n`);
      const data = await analyzeCSV(filePath);
      
      console.log(`Found ${data.headers.length} columns and ${data.rowCount} rows\n`);
      console.log('Generating insights...\n');
      
      const insights = await generateInsights(data, type);
      
      console.log('='.repeat(60));
      console.log(insights);
      console.log('='.repeat(60) + '\n');
      
    } else if (command === 'sql') {
      const schema = args[1];
      const query = args[2];
      
      if (!schema || !query) {
        console.log('❌ Please provide both schema and query');
        return;
      }
      
      console.log(`\n💾 Converting to SQL...\n`);
      const sql = await generateSQL(query, schema);
      
      console.log('Natural Language:');
      console.log(query);
      console.log('\n' + '='.repeat(60));
      console.log('SQL:');
      console.log(sql);
      console.log('='.repeat(60) + '\n');
      
    } else if (command === 'report') {
      const dataDesc = args.slice(1).join(' ');
      
      if (!dataDesc) {
        console.log('❌ Please provide data description');
        return;
      }
      
      console.log('\n📄 Generating report...\n');
      const report = await generateReport(dataDesc);
      
      console.log('='.repeat(60));
      console.log(report);
      console.log('='.repeat(60) + '\n');
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
