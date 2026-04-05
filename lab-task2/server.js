const express = require("express");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

// homepage
app.get("/", (req, res) => {
    res.render("homepage");
});

// contact page
app.get("/contact-us", (req, res) => {
    res.render("contact-us");
});

// hobbies page
app.get("/hobbies", (req, res) => {
    res.render("hobbies");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});