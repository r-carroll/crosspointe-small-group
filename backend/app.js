const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const bucketName = 'smallgroup-tallies';
const filePath = 'prayer-tally.json';
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/prayer', (req, res) => {
  res.send('Hello World!')
})

app.post('/prayer',(request,response) => {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    console.log(request.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function uploadFile() {
    const options = {
      destination: destFileName,
      // Optional:
      // Set a generation-match precondition to avoid potential race conditions
      // and data corruptions. The request to upload is aborted if the object's
      // generation number does not match your precondition. For a destination
      // object that does not yet exist, set the ifGenerationMatch precondition to 0
      // If the destination object already exists in your bucket, set instead a
      // generation-match precondition using its generation number.
      preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
    };
  
    await storage.bucket(bucketName).upload(filePath, options);
    console.log(`${filePath} uploaded to ${bucketName}`);
  }

