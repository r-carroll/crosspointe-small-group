const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const bucketName = 'smallgroup-tallies';
const filePath = fileName = 'prayer-tally.json';
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/prayer', async (req, res) => {
    const prayerMinutes = await getPrayerMinutes();
    res.send(prayerMinutes);
})

app.post('/prayer',async (request,response) => {
    const currentPrayerMinutes = (await getPrayerMinutes())["prayer-tally"];
    const newMinutes = currentPrayerMinutes + parseInt(request.query.minutes);
    console.log('current', currentPrayerMinutes)
    console.log('new',  parseInt(request.query.minutes))
    await uploadFile({"prayer-tally": newMinutes})
    response.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function uploadFile(file) {
    const options = {
      destination: file
    };
    console.log(JSON.stringify(file));
    await storage.bucket(bucketName).file(filePath).save(JSON.stringify(file)).catch(e => console.log(e));
  }

  async function getPrayerMinutes() { 
    // Downloads the file
    const file = await storage.bucket(bucketName).file(fileName).download();
    return JSON.parse(file[0].toString('utf8'));
  }
