#!/usr/bin/env node

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
    res.send(200, prayerMinutes);
})

app.post('/prayer',async (request,response) => {
  const duration = parseInt(request.query.minutes);
  try {
    await savePrayerEntry(duration)
    response.sendStatus(200);
  }
  catch(error) {
    response.sendStatus(500);
  }
  
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Example app listening on port ${port}`)
})

async function savePrayerEntry(duration) {
  const writeQuery = 'insert into prayers (duration, submitted_time)' +
    `values ($1, TO_TIMESTAMP($2, 'DD/MM/YYYY, HH24:MI:SS'))`;
  const values = [duration, new Date().toLocaleString()];
  
    await queryDB(writeQuery, values);
}

async function getPrayerMinutes() { 
  const readQuery = 'select sum(duration) from prayers;';
  let readResult = await queryDB(readQuery);
  return readResult.rows[0].sum || 0;
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
    throw Error("test")
  } finally {
    client.release();
  }

  return response;
}

