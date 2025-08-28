const express = require('express');
const bcrypt = require('bcryptjs');
const { eksBlowfish, ManualbcryptHash } = require('./EksBlowfish');
const app = express();


const password = "mysecret";
const salt = bcrypt.genSaltSync(10);
const cost = 4;

const hash =   ManualbcryptHash(password, salt, cost);
console.log("Password:", password);
console.log("Salt:", salt);
console.log("Manual bcrypt hash:", hash);


const bcryptHash = bcrypt.hashSync(password, salt);
console.log("Bcrypt hash:", bcryptHash);
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});