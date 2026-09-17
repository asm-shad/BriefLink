import Groq from 'groq-sdk';
import 'dotenv/config';  // auto-loads .env, no .config() call needed

const client = new Groq(); // picks up GROQ_API_KEY from env automatically

const res = await client.chat.completions.create({
  model: 'openai/gpt-oss-120b',
  messages: [{ role: 'user', content: 'Hello! How are you?' }],
});

console.log(res.choices[0]?.message.content);   