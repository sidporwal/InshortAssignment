const axios = require("axios");

async function scrapCovidData() {
  try {
    const { data } = await axios.get(
      "https://www.mohfw.gov.in/data/datanew.json"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = scrapCovidData;
