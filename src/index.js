require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const sendBitcoin = require("./send.bitcoin");
const CryptoJS = require("crypto-js");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.use(cors());

app.post("/api/sendBtc", async (req, res) => {
  const body = req.body;

  if (!body.data) {
    res.status(400).json({
      message: "Data is required",
    });
  }

  try {
    //decrypt the data
    const bytes = CryptoJS.AES.decrypt(body.data, process.env.DECRYPTION_KEY);

    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const { receiverAddress, amountToSend, privateKey, payerAddress } =
      decryptedData;

    let tnxData;
    //send the bitcoin
    await sendBitcoin({
      receiverAddress: receiverAddress,
      amountToSend: amountToSend,
      privateKey: privateKey,
      payerAddress: payerAddress,
    })
      .then((result) => {
        tnxData = result;
      })
      .catch((err) => {
        res.status(400).json({
          message: "An error occurred",
          error: err.message,
        });
      });

    res.status(200).json({
      message: "Data received successfully",
      tx: tnxData,
    });
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
