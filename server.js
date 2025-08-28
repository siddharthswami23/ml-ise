const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();

const password = "sid";

(async () => {
    // const salt = bcrypt.genSaltSync(10);
    //  console.log("Salt:", salt);
    // const hash1 = bcrypt.hashSync(password, salt);
    // const hash2 = bcrypt.hashSync(password, salt);

    // console.log("Hash1:", hash1);
    // console.log("Hash2:", hash2);

    // console.log("Hashes are same:", hash1 === hash2);

    // const salt = bcrypt.genSaltSync(10);
    // console.log(salt);
    const hash = bcrypt.hashSync(password, "$2b$10$4z/0AENGAg2ijkXuWOpAuu");
    console.log(hash);

    const newhash = "$2b$10$4z/0AENGAg2ijkXuWOpAuu6o8ftfQu3rIQ5O6JXk0FGQmFr0Z8Lf2"
    
    // for (let i = 1; i < 10; i++) {
    //     const hash = bcrypt.hashSync(password, salt);
    //     console.log(`Hash with ${i} rounds: ${hash}`);
    // }
})();


// for (let i = 1; i < 10; i ++) {
//     bcrypt.hash(password, i, (err, hash) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(`Hashed password: ${hash}`);
//     });
// }


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});