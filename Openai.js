import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));