const express = require("express");
const scrapCovidData = require("./utils/scrapCovidData");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/covidData", async (req, res) => {
  try {
    const covidData = await scrapCovidData();
    res.send(covidData);
  } catch (error) {
    res.status(404).send({ message: "No data available" });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening to port ${port}..`));
