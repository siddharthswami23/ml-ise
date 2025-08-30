const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyB4MreStuDc70mA9MlzeWIHzW9iZF7olvU"

// Fail fast if API key is missing
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in your .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to implement bcrypt hashing algorithm in Node.js. The script should take password, salt, and cost as input and return the hash. Provide the result in JSON format with fields: inputPassword, inputSalt, inputCost, and hashedResult.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "EksBlowfishHashTask": {\n    "inputPassword": "mysecret",\n    "inputSalt": "$2b$10$jKctD.9iAzZ/3BYd0wMHTu",\n    "inputCost": 10,\n    "hashedResult": "$2b$10$RMB16FoT/2ivCIquJ2IqzeGShSRExDSXEYLE4nZllQOhM8XqFgQ0B"\n  }\n}\n```\n',
        },
      ],
    },
  ],
});

module.exports = { chatSession };
