const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require('cors')
const { Pool } = require('pg')
const pool = new Pool()
const { response, query } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/prayer', async (req, res) => {
    const prayerMinutes = await getPrayerMinutes();
    res.send(prayerMinutes);
})

app.post('/prayer',async (request,response) => {
  const duration = parseInt(request.query.minutes);
  await savePrayerEntry(duration)
  response.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function savePrayerEntry(duration) {
  const writeQuery = 'insert into prayers (duration, submitted_time)' +
    'values ($1, $2)';
  const values = [duration, new Date().toLocaleString()];
  
    await queryDB(writeQuery, values);
}

async function getPrayerMinutes() { 
  const readQuery = 'select sum(duration) from prayers;';
  return (await queryDB(readQuery)).rows[0].sum;
}

async function queryDB(query, values = null) {
  const client = await pool.connect();
  let response;
  try {
    if (values) {
      response = await client.query(query, values);
    } else {
      response = await client.query(query);
    }
    console.log(response);
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }

  return response;
}

