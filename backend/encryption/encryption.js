const sodium = require('libsodium-wrappers');

exports.encryptMessage = async (message) => {
  await sodium.ready;
  const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const cipherText = sodium.crypto_secretbox_easy(message, nonce, key);

  return { cipherText, nonce, key };
};

exports.decryptMessage = async ({ cipherText, nonce, key }) => {
  await sodium.ready;
  const decryptedMessage = sodium.crypto_secretbox_open_easy(cipherText, nonce, key);

  return decryptedMessage;
};
