import crypto from 'crypto';
import BaseX from 'base-x';

const B58 = BaseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
const iv = Buffer.from([0x42, 0x4F, 0x53, 0x5F, 0x43, 0x4F, 0x49, 0x4E,
  0x5F, 0x57, 0x41, 0x4C, 0x4C, 0x45, 0x54, 0x53]);


const sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest();
};

const createKey = (passphrase) => {
  return sha256(passphrase);
};

export const encryptWallet = (passphrase, seed) => {
  try {
    const cipher = crypto.createCipheriv('aes256', createKey(passphrase), iv);
    const encrypted = cipher.update(seed, 'utf8');
    return `BOS${B58.encode(Buffer.concat([encrypted, cipher.final()]))}W1`;  
  } catch (e) {
    return null;
  }
};

export const decryptWallet = (passphrase, encoded) => {
  const rawEncoded = encoded.slice(3).slice(0, -2);

  try {
    const decipher = crypto.createDecipheriv('aes256', createKey(passphrase), iv);
    const decrypted = decipher.update(B58.decode(rawEncoded), 'binary', 'utf8');
    return decrypted + decipher.final('utf8');  
  } catch (e) {
    return null;
  }
};