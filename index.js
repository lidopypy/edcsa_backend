const { ethers } = require("ethers");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // 處理get,post,... request 取得 req.body
const Serie = require("./models/serie");
const keccak256 = require("keccak256");
const cors = require("cors");

// const corsOptions = {
//   origin: "https://test-soul-nft.netlify.app/Mint",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

//Middleware
// app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); // 處理get,post,... request 取得 req.body

// mongoose.set("useFindAndModify", false);

//connect mongodb atlas (use mongoose).
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongodb atlas.");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/", cors(), (req, res) => {
  const nowTime = Math.round(new Date() / 1000);
  const exipreTime = nowTime + 120;
  let { account, serie } = req.body;
  let hashSerie = keccak256(serie).toString("hex");
  Serie.findOne({ serie: hashSerie })
    .then((data) => {
      if (data !== null) {
        const message = ethers.utils.solidityKeccak256(
          ["address", "string", "uint64"],
          [account, serie, exipreTime]
        );
        const arrayifyMessage = ethers.utils.arrayify(message);
        const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY);
        signer.signMessage(arrayifyMessage).then((result) => {
          const flatSignature = result;
          res.send({ exipreTime: exipreTime, flatSignature: flatSignature });
        });
      } else {
        res.status(404).send("Your serie not correct!");
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

//route
app.get("/*", (req, res) => {
  res.status(404);
  res.send("Not allowed.");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port 8080.");
});
