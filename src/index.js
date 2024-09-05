const { testnet, mainnet } = require("bitcore-lib/lib/networks");
const { createWallet, createHDWallet } = require("./wallet.bitcoin");
const sendBitcoin = require("./send.bitcoin");

sendBitcoin("mfcCYZrefb66Fpd6byNDyDMWmCGYqT8DT7", 0.00003)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

// console.log(createHDWallet(testnet))
