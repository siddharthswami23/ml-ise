const bcrypt = require('bcryptjs');
const { eksBlowfish, ManualbcryptHash } = require('./EksBlowfish');
const dotenv = require('dotenv');
const { getAiResponse } = require('./geminiapi');
dotenv.config();

const password = "sid";
const cost = 10;
const salt = bcrypt.genSaltSync(cost);

console.log("\n=== Testing Bcrypt Implementations ===\n");

// Manual bcrypt hash
// const manualHash = ManualbcryptHash(password, salt, cost);
// console.log("🔑 Password:", password);
// console.log("🧂 Salt:", salt);
// console.log("🛠️ Manual Hash:", manualHash);

// Standard bcrypt hash
// const bcryptHash = bcrypt.hashSync(password, salt);
// console.log("⚙️ Bcrypt.js Hash:", bcryptHash);

// Test bcrypt.compare
// bcrypt.compare(password, bcryptHash, (err, res) => {
//     if (err) throw err;
//     console.log("[TEST] bcrypt.compare() with bcrypt.js hash:", res ? "✅ MATCH" : "❌ FAIL");
// });

// Async Gemini test
(async () => {
    const prompt = `Implement EksBlowfish hashing in Node.js using password: "${password}", salt: "${salt}", and cost: ${cost}. Return JSON with fields: inputPassword, inputSalt, inputCost, hashedResult.`;

    const aiResult1 = await getAiResponse(prompt);
    const aiResult2 = await getAiResponse(prompt); 

    // console.log(aiResult1.hashedResult == aiResult2.hashedResult);
    console.log("\n[TEST] Ai hash consistency:", aiResult1.hashedResult === aiResult2.hashedResult ? "✅ PASS" : "❌ FAIL");
    console.log("\n🤖 Gemini AI Result 1:", JSON.stringify(aiResult1, null, 2));
    console.log("🤖 Gemini AI Result 2:", JSON.stringify(aiResult2, null, 2));

    // console.log("\n[TEST] Gemini AI consistency:", JSON.stringify(aiResult1) === JSON.stringify(aiResult2) ? "✅ PASS" : "❌ FAIL");


})();
