# 🤖 LLM Automation Project

A comprehensive collection of AI-powered automation tools using LangChain and OpenAI. This project provides various helpful automations for developers, content creators, and business professionals.

## ✨ Features

### 🔍 Code Analysis & Documentation
- **Code Analyzer**: Review code for bugs, security issues, and improvements
- **Test Generator**: Automatically generate unit tests
- **Code Explainer**: Get detailed explanations of complex code
- **Documentation Generator**: Auto-generate README files and documentation

### 📝 Content Creation
- **Blog Post Generator**: Create comprehensive blog posts on any topic
- **Social Media Content**: Generate platform-specific posts (Twitter, LinkedIn, Instagram, Facebook)
- **Product Descriptions**: Create compelling product copy
- **FAQ Generator**: Build FAQ sections automatically

### 📊 Data & Analysis
- **CSV Analyzer**: Extract insights from CSV data
- **Natural Language to SQL**: Convert English to SQL queries
- **Report Generator**: Create data reports and summaries

### 💬 Communication Tools
- **Email Writer**: Generate professional emails (business, follow-ups, apologies, thank yous)
- **Text Improver**: Enhance grammar, tone, and clarity
- **Meeting Request Generator**: Create professional meeting invites

### 🌐 Web Tools
- **Web Content Summarizer**: Summarize articles and web pages
- **Document Chatbot**: Interactive Q&A with documents

## 🚀 Quick Start

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your OpenRouter API key to `.env` (recommended free tier):
```
OPENROUTER_API_KEY=your_openrouter_key_here
MODEL_NAME=xiaomi/mimo-v2-flash:free   # example free model
```

### Get Your Free OpenRouter API Key
1. Visit https://openrouter.ai/keys
2. Sign up (free) and create an API key
3. Paste it into `.env` as `OPENROUTER_API_KEY`
4. Choose a model (e.g., `xiaomi/mimo-v2-flash:free`) and set `MODEL_NAME`

### Prefer OpenAI Instead?
1. Visit https://platform.openai.com/api-keys
2. Create a key and set `OPENAI_API_KEY=your_key`
3. (Optional) Set `OPENAI_BASE_URL` if using a custom endpoint
4. Update `MODEL_NAME` to a compatible OpenAI model (e.g., `gpt-3.5-turbo`)

## 📖 Usage Examples

### Web Content Summarizer
```bash
# Concise summary
npm run summarize https://example.com/article

# Detailed summary
npm run summarize https://example.com/article detailed

# Executive summary
npm run summarize https://example.com/article executive
```

### Code Analyzer
```bash
# Full code review
npm run analyze review full src/app.js

# Check for bugs
npm run analyze review bugs src/utils.js

# Generate tests
npm run analyze tests src/helper.js

# Explain code
npm run analyze explain src/config.js
```

### Documentation Generator
```bash
# Generate README for project
npm run docs readme

# Generate docs for specific file
npm run docs file src/app.js
```

### Interactive Chatbot
```bash
# General chat
npm run chat

# Chat about a specific document
npm run chat path/to/document.txt
```

### Content Generator
```bash
# Generate blog post
node src/contentGenerator.js blog "AI in Healthcare"

# Generate social media post
node src/contentGenerator.js social twitter "Product launch announcement"

# Generate product description
node src/contentGenerator.js product "Smart Watch"

# Generate FAQ
node src/contentGenerator.js faq "Cloud Computing"
```

### Email Writer
```bash
# Generate professional email
node src/emailWriter.js email professional

# Generate thank you email
node src/emailWriter.js email thank_you

# Improve text grammar
node src/emailWriter.js improve grammar "Your text here"

# Make text more professional
node src/emailWriter.js improve professional "Casual text"
```

### Data Analyzer
```bash
# Analyze CSV file
node src/dataAnalyzer.js analyze data.csv business

# Convert natural language to SQL
node src/dataAnalyzer.js sql "users(id,name,email)" "show all users from California"

# Generate report
node src/dataAnalyzer.js report "Sales data for Q4 2024"
```

## 🛠️ Available Scripts

- `npm run summarize` - Web content summarizer
- `npm run docs` - Documentation generator
- `npm run analyze` - Code analyzer
- `npm run chat` - Interactive chatbot

## 📁 Project Structure

```
llm-automation-project/
├── src/
│   ├── config.js              # Configuration and LLM setup
│   ├── summarizer.js          # Web content summarization
│   ├── docGenerator.js        # Documentation generation
│   ├── codeAnalyzer.js        # Code analysis and testing
│   ├── chatbot.js             # Interactive chatbot
│   ├── emailWriter.js         # Email and text generation
│   ├── contentGenerator.js    # Content creation tools
│   └── dataAnalyzer.js        # Data analysis tools
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuration

Edit the `.env` file to customize:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `MODEL_NAME`: AI model to use (default: gpt-3.5-turbo)
- `TEMPERATURE`: Response creativity (0-1, default: 0.7)

## 💡 Use Cases

### For Developers
- Analyze code for bugs and improvements
- Generate unit tests automatically
- Create documentation from code
- Get explanations of complex code

### For Content Creators
- Generate blog posts and articles
- Create social media content
- Write product descriptions
- Build FAQ sections

### For Business Professionals
- Write professional emails
- Summarize long articles and reports
- Analyze business data
- Generate reports and insights

### For Data Analysts
- Extract insights from CSV data
- Convert natural language to SQL
- Generate data reports
- Identify trends and patterns

## 🤝 Contributing

Feel free to open issues or submit pull requests with improvements!

## 📄 License

ISC

## ⚠️ Notes

- Requires an OpenAI API key
- API usage will incur costs based on OpenAI's pricing
- Some features may require internet connection
- Large files/datasets are automatically truncated to stay within token limits

## 🆘 Troubleshooting

**"OPENAI_API_KEY not found"**
- Ensure you've created a `.env` file with your API key

**"Module not found" errors**
- Run `npm install` to install all dependencies

**API rate limits**
- Reduce frequency of requests or upgrade your OpenAI plan

**Slow responses**
- Normal for complex tasks; consider using gpt-3.5-turbo for faster results

---

Built with ❤️ using LangChain and OpenAI