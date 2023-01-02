const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl.js");

const PORT = 5000;
const app = express();

// Middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://elozino:qwerty123@cluster0.37gbscy.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`CONNECTED TO MONGO!`);
  })
  .catch((err) => {
    console.log(`OH NO! MONGO CONNECTION ERROR!`);
    console.log(err);
  });

//

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrl", async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullUrl,
  });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.status(404).send("Not Found");

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(`${shortUrl.full}`);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
