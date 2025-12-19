# 🚀 Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenRouter API Key (free models)
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# Get your key from: https://openrouter.ai/keys
```

Your `.env` should look like:
```
OPENROUTER_API_KEY=sk-your-actual-key-here
MODEL_NAME=gpt-3.5-turbo
TEMPERATURE=0.7
```

### 3. Test Your Setup
```bash
# Run a simple example
node examples/example-usage.js
```

## 🎯 Try These First

### 1. Summarize a Web Article
```bash
npm run summarize https://en.wikipedia.org/wiki/Artificial_intelligence
```

### 2. Analyze Sample Code
```bash
npm run analyze explain src/config.js
```

### 3. Generate Content
```bash
node src/contentGenerator.js blog "The Future of AI"
```

### 4. Analyze Sample Data
```bash
node src/dataAnalyzer.js analyze examples/sample-data.csv business
```

### 5. Chat with AI
```bash
npm run chat
```

## 💡 Common Use Cases

### For Developers
```bash
# Review your code
npm run analyze review full your-file.js

# Generate tests
npm run analyze tests your-file.js

# Generate project README
npm run docs readme
```

### For Writers
```bash
# Generate blog post
node src/contentGenerator.js blog "Your Topic"

# Create social media post
node src/contentGenerator.js social twitter "Your announcement"

# Improve your writing
node src/emailWriter.js improve grammar "Your text"
```

### For Business
```bash
# Generate professional email
node src/emailWriter.js email professional

# Analyze business data
node src/dataAnalyzer.js analyze your-data.csv business

# Create FAQ
node src/contentGenerator.js faq "Your Product/Service"
```

## 🔧 Customization

### Change AI Model
Edit `.env`:
```
MODEL_NAME=gpt-4  # For better quality (more expensive)
# or
MODEL_NAME=gpt-3.5-turbo  # Faster and cheaper
```

### Adjust Creativity
Edit `.env`:
```
TEMPERATURE=0.3  # More focused and deterministic
# or
TEMPERATURE=0.9  # More creative and varied
```

## 📚 Next Steps

1. **Explore Examples**: Check `examples/example-usage.js` for programmatic usage
2. **Read Full README**: See `README.md` for complete documentation
3. **Try Each Tool**: Experiment with different automation scripts
4. **Customize**: Modify scripts in `src/` for your specific needs

## ❓ Having Issues?

### OpenAI API Key Error
Make sure your `.env` file exists and contains a valid API key:
```bash
# Check if .env exists
ls -la .env

# Verify format (should show your key)
cat .env
```

### Module Not Found
Install dependencies:
```bash
npm install
```

### Slow Responses
This is normal! LLM calls can take 5-30 seconds depending on complexity.

### Rate Limits
If you hit OpenAI rate limits:
- Wait a few minutes
- Use gpt-3.5-turbo instead of gpt-4
- Upgrade your OpenAI plan

## 💰 Cost Considerations

- **gpt-3.5-turbo**: ~$0.001 per request (very affordable)
- **gpt-4**: ~$0.03 per request (better quality, higher cost)

Most automation tasks with gpt-3.5-turbo cost less than $0.01 each!

## 🎉 You're Ready!

Start automating tasks and boosting your productivity with AI!

For complete documentation, see [README.md](README.md)
