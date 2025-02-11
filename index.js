import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path, { dirname } from"path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const app = express();


// Middleware

app.set("View engine", "ejs");
app.use(express.static(path.join(_dirname, "public")));

//bodyParser Middleware

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Routes

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/joke", async (req, res) => {
    const {firstName, lastName} = req.body;
    const apiUrl = "https://v2.jokeapi.dev/joke/Any";

    try {
        const response = await axios.get(apiUrl);
        const jokeData = response.data;

        let joke;
        if (jokeData.type === "single") {
            joke = jokeData.joke;
        } else {
            joke = `${jokeData.setup} - ${jokeData.delivery}`;
        }

        res.render("result.ejs", { joke, firstName, lastName});


    } catch (error) {
        console.error(error.message);
        res.render("result.ejs", { joke: "Could not fetch a joke. Please try again", firstName, lastName});
    }
    
});


// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});