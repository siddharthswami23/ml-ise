const { ManualbcryptHash } = require('./EksBlowfish');

/**
 * Manual compare function for bcrypt/EksBlowfish
 * @param {string} inputPassword - Password to verify
 * @param {string} storedHash - Full bcrypt hash ($2b$10$...)
 * @returns {boolean} - true if password matches, false otherwise
 */
function ManualCompare(inputPassword, storedHash) {
  const parts = storedHash.split('$');
  if (parts.length < 4) throw new Error("Invalid hash format");

  const cost = parseInt(parts[2], 10);
  const saltAndHash = parts[3];
  const saltB64 = saltAndHash.slice(0, 22);

  function bcrypt64ToBuffer(b64) {
    const b64fixed = b64.replace(/\./g, '+').replace(/\//g, '/');
    return Buffer.from(b64fixed, 'base64');
  }

  const saltBuffer = bcrypt64ToBuffer(saltB64);
  const generatedHash = ManualbcryptHash(inputPassword, saltBuffer, cost);

  return generatedHash === storedHash;
}

module.exports = { ManualCompare };
