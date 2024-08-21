import express from "express";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url)); 
const app = express(); // Ensure this line is included

const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { joke: "" });
});

app.get("/joke/:name", async (req, res) => {
    const { name } = req.params;
    try {
        let response = await axios.get("https://v2.jokeapi.dev/joke/any", {
            params: {
                contains: name,
            },
        });

        if (response.data.error) {
            // Fallback to a random joke if no matching joke is found
            response = await axios.get("https://v2.jokeapi.dev/joke/any");
        }

        if (response.data.type === "single") {
            res.send(response.data.joke);
        } else if (response.data.type === "twopart") {
            res.send(`${response.data.setup} - ${response.data.delivery}`);
        } else {
            res.send("No joke found!");
        }
    } catch (error) {
        console.error("Error fetching joke:", error);
        res.status(500).send("Error fetching joke");
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

