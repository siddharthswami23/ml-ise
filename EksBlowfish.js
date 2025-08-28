const crypto = require("crypto");

// Helper: XOR two Buffers
function xorBuffers(buf1, buf2) {
  const result = Buffer.alloc(buf1.length);
  for (let i = 0; i < buf1.length; i++) {
    result[i] = buf1[i] ^ buf2[i];
  }
  return result;
}

// Helper: Blowfish F function
function F(x, S) {
  const a = (x >>> 24) & 0xff;
  const b = (x >>> 16) & 0xff;
  const c = (x >>> 8) & 0xff;
  const d = x & 0xff;
  return (((S[a] + S[256 + b]) ^ S[512 + c]) + S[768 + d]) >>> 0;
}

// Blowfish encrypt a 64-bit block
function blowfishEncrypt(L, R, state) {
  const { P, S } = state;
  for (let i = 0; i < 16; i++) {
    L ^= P[i];
    R ^= F(L, S);
    [L, R] = [R, L];
  }
  [L, R] = [R, L];
  R ^= P[16];
  L ^= P[17];
  return [L >>> 0, R >>> 0];
}

// Initialize Blowfish state
function initializeBlowfishState() {
  const P = new Uint32Array(18);
  const S = new Uint32Array(1024);

  for (let i = 0; i < P.length; i++) P[i] = 0x243F6A88 ^ i;
  for (let i = 0; i < S.length; i++) S[i] = 0x85A308D3 ^ i;

  return { P, S };
}

// Expand key
function expandKey(state, passwordBytes, saltBytes) {
  const P = state.P;
  const S = state.S;
  const passwordLen = passwordBytes.length;

  for (let i = 0; i < P.length; i++) {
    const pwVal = (passwordBytes[i % passwordLen] << 24) |
                  (passwordBytes[(i + 1) % passwordLen] << 16) |
                  (passwordBytes[(i + 2) % passwordLen] << 8) |
                  passwordBytes[(i + 3) % passwordLen];
    P[i] ^= pwVal >>> 0;
  }

  let L = ((saltBytes[0] << 24) | (saltBytes[1] << 16) | (saltBytes[2] << 8) | saltBytes[3]) >>> 0;
  let R = ((saltBytes[4] << 24) | (saltBytes[5] << 16) | (saltBytes[6] << 8) | saltBytes[7]) >>> 0;

  for (let i = 0; i < P.length; i += 2) {
    [L, R] = blowfishEncrypt(L, R, state);
    P[i] = L;
    P[i + 1] = R;
  }

  return state;
}

// EksBlowfish setup
function eksBlowfish(cost, password, salt) {
  let state = initializeBlowfishState();
  const passwordBytes = Buffer.from(password, "utf-8");
  const saltBytes = Buffer.from(salt, "utf-8");

  state = expandKey(state, saltBytes, passwordBytes);
  state = expandKey(state, passwordBytes, saltBytes);

  const iterations = Math.pow(2, cost);
  for (let i = 0; i < iterations; i++) {
    state = expandKey(state, passwordBytes, saltBytes);
    state = expandKey(state, saltBytes, passwordBytes);
  }

  return state;
}

// Convert buffer to bcrypt Base64
function base64ToBcrypt64(buffer) {
  const b64 = buffer.toString("base64");
  return b64.replace(/\+/g, '.').replace(/\//g, '.').slice(0, 31);
}

// Corrected Manual bcrypt hash
function ManualbcryptHash(password, salt, cost = 10) {
  // Extract only the 22-character salt (required by bcrypt)
  let saltStr = salt.toString();
  if (saltStr.startsWith("$2b$")) saltStr = saltStr.slice(7, 29);
  if (saltStr.length < 22) saltStr = saltStr.padEnd(22, 'A');

  // EksBlowfish state
  const state = eksBlowfish(cost, password, saltStr);

  // Encrypt fixed string
  const text = Buffer.from("OrpheanBeholderScryDoubt", "ascii");
  let blocks = [];
  for (let i = 0; i < text.length; i += 8) {
    const L = (text[i] << 24 | text[i+1] << 16 | text[i+2] << 8 | text[i+3]) >>> 0;
    const R = (text[i+4] << 24 | text[i+5] << 16 | text[i+6] << 8 | text[i+7]) >>> 0;
    const [encL, encR] = blowfishEncrypt(L, R, state);
    blocks.push(encL, encR);
  }

  let hashBytes = Buffer.alloc(blocks.length * 4);
  for (let i = 0; i < blocks.length; i++) hashBytes.writeUInt32BE(blocks[i], i * 4);

  const hashB64 = base64ToBcrypt64(hashBytes);

  // Correct bcrypt string
  return `$2b$${cost.toString().padStart(2,'0')}$${saltStr}${hashB64}`;
}

module.exports = {
  eksBlowfish,
  ManualbcryptHash
};
