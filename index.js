const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // For handling file uploads
const app = express();
const { PythonShell } = require('python-shell');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const port = 3080;

const configuration = new Configuration({
    organization: "org-4RxO9OW9Pb09NWZOYU2oiFTk",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`)
})




app.post('/',async (req, res) => {
    const { message } = req.body;
    console.log("input:",message);
    let options = {
      scriptPath: "/Users/shrinivassesadri/Drive/DocAsk/",
      args: [`${message}`,p],
    };
    const pyShell = new PythonShell('ask.py', options);
    
    // Listen for Python script output
    pyShell.on('message', (messages) => {
      // const response = await (message);
      res.json({
        message: messages,
      });
    });
    
    // End the PythonShell process
    pyShell.end((err) => {
      if (err) {
        console.error('Error ending PythonShell:', err);
      }
    });
    
    
});

// Handle the PDF upload
app.post('/upload-pdf', upload.single('pdfFile'), (req, res) => {
  console.log('PDF uploaded:', req.file);
  p = req.file.path;
  res.status(200).send('PDF uploaded successfully.');
});

