const bcrypt = require('bcryptjs');
const { eksBlowfish, ManualbcryptHash } = require('./EksBlowfish');
const dotenv = require('dotenv');
const { getAiResponse } = require('./geminiapi');
dotenv.config();


const password = "mysecret";
const salt = bcrypt.genSaltSync(10);
const cost = 10;

// Manual bcrypt hash
const manualHash = ManualbcryptHash(password, salt, cost);
console.log("Password:", password);
console.log("Salt:", salt);
console.log("Manual:", manualHash);

// Standard bcrypt hash
const bcryptHash = bcrypt.hashSync(password, salt);
console.log("Bcrypt:", bcryptHash);

// Gemini EksBlowfish hash (async)
(async () => {
    const prompt = `Implement EksBlowfish hashing in Node.js using password: "${password}", salt: "${salt}", and cost: ${cost}. Return JSON with fields: inputPassword, inputSalt, inputCost, hashedResult.`;

    const aiResult = await getAiResponse(prompt);

    console.log("AI Result:", JSON.stringify(aiResult, null, 2));
})();
