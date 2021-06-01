const express = require("express");
const path = require("path");
const util = require("util")
const fs = require("fs");

//require("./routes/htmlRoutes")(app);
//sets up the express app
const app = express();
const PORT = process.env.PORT || 3000;

//set up Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//routes for api
const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

const readFile = async () => {
    let data = await readFilePromise("./db/db.json", "utf8")
    return JSON.parse(data)
}

const writeFile = async (data) => {
    data = JSON.stringify(data, null, 2)
    await writeFilePromise("./db/db.json", data)
}

  //Routes for html
app.get("/,", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });
  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
  
app.get("/api/notes", (req, res) => {
    readFilePromise("./db/db.json", "utf8").then((data) => {
      console.log(data);
      const notes = JSON.parse(data);
      console.log(notes);
      res.json(notes);
    });
  });

  app.post('/api/notes', async (req, res) => {
    const newNote = req.body;
    let data = await readFile()
    await writeFile([...data, newNote])
    res.json(newNote);
});

app.delete('/api/notes/:id', async (req, res) => {
    const note = req.params.id;
    let data = await readFile()
    let [matchedId] = data.filter(id => id.title === note)
    if (matchedId) return res.json(matchedId);
    return res.json(false);
});

  



//code below starts our server
app.listen(PORT, () => {
    console.log(`NoteTaker App listening on PORT:http://localhost:${PORT}`);
  });
  