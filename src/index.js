const express = require("express");
const bodyParser = require("body-parser");
const sendBitcoin = require("./send.bitcoin");
const CryptoJS = require("crypto-js");

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post("/api/sendBtc", (req, res) => {
  const data = req.body;
  try {
    if (data) {
      //decrypt the data
      const bytes = CryptoJS.AES.decrypt(data, process.env.DECRYPTION_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const { receiverAddress, amountToSend, privateKey, payerAddress } =
        decryptedData;

      //send the bitcoin

      sendBitcoin({
        receiverAddress: receiverAddress,
        amountToSend: amountToSend,
        privateKey: privateKey,
        payerAddress: payerAddress,
      }).then((result) => {
        // Send a response
        res.status(200).json({
          message: "Data received successfully",
          txId: result,
        });
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "An error occurred",
      error: err.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
