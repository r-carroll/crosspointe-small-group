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

app.get('/prayer/timespan', async (req, res) => {
  const timespans = await getEntriesByTimespan();
  res.send(200, timespans);
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

app.get('/reading', async (req, res) => {
    const readingMinutes = await getReadingMinutes();
    res.send(200, readingMinutes);
})

app.get('/reading/timespan', async (req, res) => {
  const timespans = await getReadingByTimespan();
  res.send(200, timespans);
})

app.post('/reading',async (request,response) => {
  const duration = parseInt(request.query.minutes);
  const passage = request.query.passage;
  try {
    await saveReadingEntry(duration, passage)
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

async function saveReadingEntry(duration, passage) {
  const writeQuery = 'insert into reading (duration, passage, submitted_time)' +
    `values ($1, $2, CURRENT_TIMESTAMP)`;
  const values = [duration, passage];
  
    await queryDB(writeQuery, values);
}

async function getPrayerMinutes() { 
  const readQuery = 'select sum(duration) from prayers;';
  let readResult = await queryDB(readQuery);
  return readResult.rows[0].sum || 0;
}

async function getReadingMinutes() { 
  const readQuery = 'select sum(duration) from reading;';
  let readResult = await queryDB(readQuery);
  return readResult.rows[0].sum || 0;
}

async function getEntriesByTimespan() {
  const readQuery = `select json_agg(subquery) as timespans from (select *, 
    extract(hour from submitted_time) as hour,
    extract(dow from submitted_time) as day
     from prayers where submitted_time is not null order by hour) as subquery;`
  
  const readResult = await queryDB(readQuery);

  return readResult.rows[0];
}

async function getReadingByTimespan() {
  const readQuery = `select json_agg(subquery) as timespans from (select *, 
    extract(hour from submitted_time) as hour,
    extract(dow from submitted_time) as day
     from reading where submitted_time is not null order by hour) as subquery;`
  
  const readResult = await queryDB(readQuery);

  return readResult.rows[0];
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

