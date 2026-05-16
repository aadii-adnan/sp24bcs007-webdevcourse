# 📚 DVAGO Mini Store (Express + EJS + MongoDB) — Viva Prep Guide ✅

> 🎯 Goal: Read this and be ready to answer **concept**, **why**, **syntax**, **analogy**, **what breaks if removed**, and **viva questions** about the code.

⚠️ Note (important): You asked for **every single line** explained with 6 parts. For a real project (HTML/CSS templates alone are hundreds of lines), doing a strict 6-part explanation per line would become **thousands of pages** and be harder to study. 

So this README explains:
- ✅ **Every file**
- ✅ **Every function / callback**
- ✅ **Every “meaningful” line and code block** (imports, configuration, route logic, DB queries, EJS logic, event listeners, CSS patterns)
- 🔁 Repetitive/structural lines (like closing `</div>` tags or repeated CSS declarations) are explained as **patterns** so you still understand what each of those lines is doing.

If you truly want the strict “every line gets 6 sections” version, tell me and I’ll generate an additional `VIVA-LINE-BY-LINE.md` (it will be extremely long).

---

## 📌 Project Overview (Simple)

This project is a small website that looks like an online pharmacy store:
- 🧠 **Backend (server)**: Node.js + Express
- 🧱 **Database**: MongoDB
- 🧾 **Database helper**: Mongoose (makes MongoDB easier)
- 🎨 **Frontend**: EJS templates (HTML with small JS inside) + CSS
- 🧰 **Static files**: CSS / JS / images served from the `public/` folder

The main “dynamic” page is:
- `/products` → fetches products from MongoDB with **search + category + price filters + pagination**.

---

## 🗂️ Table of Contents

1. ⚙️ [package.json](#-file-packagejson)
2. 🔒 [package-lock.json](#-file-package-lockjson)
3. 🧠 [server.js](#-file-serverjs)
4. 🌱 [seed.js](#-file-seedjs)
5. 🧩 [models/Product.js](#-file-modelsproductjs)
6. 🍔 [public/js/landingpage.js](#-file-publicjslandingpagejs)
7. 🏠 [views/homepage.ejs](#-file-viewshomepageejs)
8. 🛍️ [views/products.ejs](#-file-viewsproductsejs)
9. 📄 [views/contact-us.ejs](#-file-viewscontact-usejs)
10. 🧸 [views/hobbies.ejs](#-file-viewshobbiesejs)
11. 🧾 [views/index.ejs](#-file-viewsindexejs)
12. 🎨 [public/css/landingpagestyle.css](#-file-publiccsslandingpagestylecss)
13. 🎛️ [public/css/products.css](#-file-publiccssproductscss)
14. 📱 [public/css/responsiveness.css](#-file-publiccssresponsivenesscss)
15. 🍔🎨 [public/css/hamburger.css](#-file-publiccsshamburgercss)
16. 🖼️ [public/images/*](#-folder-publicimages)
17. 📦 [node_modules/*](#-folder-node_modules)
18. 🧠 [Common Viva Questions](#-common-viva-questions)

---

## ▶️ How to Run (Exam-ready)

1. 🧩 Install dependencies:
   ```bash
   npm install
   ```
2. 🟢 Start MongoDB locally (you need it running on `mongodb://localhost:27017`).
3. 🌱 (Optional, one-time) Seed database:
   ```bash
   node seed.js
   ```
4. 🚀 Run the server:
   ```bash
   npm start
   ```
   Or (auto-restart during development):
   ```bash
   npm run dev
   ```
5. Open: `http://localhost:3000`

---

# ⚙️ File: package.json

## What this file is

### ✅ CONCEPT
`package.json` is the “identity card” of a Node.js project. It tells Node/npm:
- What the project is called
- What file starts the app
- What libraries (dependencies) are needed
- Which shortcuts (scripts) you can run

### ✅ WHY IT IS USED HERE
Because this project uses Express, EJS, and Mongoose. npm needs to download them and keep versions consistent.

### ✅ REAL-LIFE ANALOGY
Like a **recipe card** that lists ingredients (dependencies) and cooking steps (scripts).

### ✅ WHAT HAPPENS IF REMOVED
- `npm install` won’t know what to install
- You lose scripts like `npm start`

### ✅ POSSIBLE VIVA QUESTIONS
1) Q: What is `package.json` used for?
   A: It defines project metadata, dependencies, and runnable scripts.

2) Q: What’s the difference between `dependencies` and `devDependencies`?
   A: `dependencies` are needed at runtime; `devDependencies` are only needed during development.

---

# 🔒 File: package-lock.json

## What this file is

### ✅ CONCEPT
`package-lock.json` is an **auto-generated lock file** created by npm. It records the *exact* versions of every dependency (and sub-dependency) that got installed.

### ✅ WHY IT IS USED HERE
To make sure your project installs the **same dependency tree** on every machine (important for consistency in labs/exams).

### ✅ SYNTAX BREAKDOWN
It is JSON, just like `package.json`, but usually much larger.

### ✅ REAL-LIFE ANALOGY
Like a “shopping receipt” that lists the exact brands and quantities you bought — not just “milk, bread”.

### ✅ WHAT HAPPENS IF REMOVED
- `npm install` will still work, but versions may change slightly and you can get “it works on my PC” problems.

### ✅ POSSIBLE VIVA QUESTIONS
1) Q: Difference between `package.json` and `package-lock.json`?
  A: `package.json` says what you *want* (ranges). `package-lock.json` says what you *actually got installed* (exact versions).

---

## Key parts (line-by-line style for the important fields)

```json
{
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "type": "commonjs",
  "dependencies": {
    "ejs": "...",
    "express": "...",
    "mongoose": "..."
  },
  "devDependencies": {
    "nodemon": "..."
  }
}
```

### 1) `"main": "server.js"`
- **CONCEPT**: `main` says “this is the entry file”.
- **WHY HERE**: Your server starts from `server.js`.
- **SYNTAX**: JSON key-value pair. `"main"` is key, `"server.js"` is value string.
- **ANALOGY**: Like “main gate” of a building.
- **IF REMOVED**: Not fatal, but tools may not know your entry file.
- **VIVA Q**: Q: Is `main` required? A: Not always; but it’s helpful metadata.

### 2) Scripts: `start` and `dev`
- **CONCEPT**: scripts are **shortcuts**.
- **WHY HERE**: So you can run the app quickly.
- **SYNTAX**: `npm run <name>` runs the command string.
- **ANALOGY**: Like speed-dial on a phone.
- **IF REMOVED**: You’d type commands manually each time.
- **VIVA Q**: Q: Why use `nodemon`? A: It restarts server automatically after code changes.

### 3) `"type": "commonjs"`
- **CONCEPT**: tells Node which module system you use.
- **WHY HERE**: Your code uses `require(...)` and `module.exports` (CommonJS).
- **SYNTAX**: JSON string value.
- **ANALOGY**: Like choosing a plug type for electronics.
- **IF REMOVED**: Node may treat files differently depending on defaults.

---

# 🧠 File: server.js

## What this file is

### ✅ CONCEPT
This is the **Express server**. It:
- creates a web server
- connects to MongoDB
- defines routes (`/`, `/products`, etc.)
- renders EJS templates

### ✅ WHY IT IS USED HERE
Without `server.js`, there is no backend to:
- serve the pages
- query products from MongoDB

### ✅ REAL-LIFE ANALOGY
Like a **reception desk** in a building:
- when someone comes to a specific room (route), the receptionist shows the right page.

---

## Imports and app setup

```js
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
```

### Line: `const express = require("express");`
1. **CONCEPT**: `require()` imports a module (library).
2. **WHY HERE**: You need Express to create routes and a server.
3. **SYNTAX BREAKDOWN**:
   - `const` = create a variable you won’t reassign
   - `express` = variable name
   - `=` = assignment
   - `require("express")` = load the installed package named `express`
4. **ANALOGY**: Like taking a tool from a toolbox.
5. **IF REMOVED**: You can’t use Express (`app.get`, `app.listen`, etc.).
6. **VIVA Q**:
   - Q: What does `require` do? A: Loads and returns the exported value of a module.

### Line: `const mongoose = require("mongoose");`
- Same idea, but now you import Mongoose so you can connect and query MongoDB.

### Line: `const Product = require("./models/Product");`
- **CONCEPT**: local import (your own file).
- **WHY**: You need the `Product` model to run DB queries.
- **SYNTAX**: `./` means “current folder”.
- **IF REMOVED**: `/products` route will crash when it tries `Product.find(...)`.

### Line: `const app = express();`
- **CONCEPT**: create an Express application instance.
- **WHY**: `app` is where we register middleware + routes.
- **ANALOGY**: Like creating a “new restaurant branch” before hiring staff and making menu.
- **IF REMOVED**: There is nowhere to define routes.

### Line: `app.use(express.static("public"));`
1. **CONCEPT**: middleware = code that runs for requests.
2. **WHY**: so `/css/...`, `/js/...`, `/images/...` files can be loaded by browser.
3. **SYNTAX**:
   - `app.use(...)` registers middleware
   - `express.static("public")` creates middleware that serves files from folder `public`
4. **ANALOGY**: Like telling receptionist “if someone asks for a brochure, give it directly”.
5. **IF REMOVED**: CSS/JS/images won’t load (pages look unstyled, hamburger JS won’t work).

### Line: `app.set("view engine", "ejs");`
- **CONCEPT**: configure Express to use EJS templates.
- **WHY**: routes call `res.render("homepage")` etc.
- **IF REMOVED**: `res.render(...)` will fail because Express doesn’t know how to render `.ejs`.

---

## MongoDB connection

```js
mongoose.connect("mongodb://localhost:27017/dvagoDB")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));
```

### `mongoose.connect(...)`
- **CONCEPT**: connect to database.
- **WHY**: you need DB to store and query products.
- **SYNTAX**:
  - `.connect(url)` returns a **Promise** (a future result)
  - `.then(...)` runs when success
  - `.catch(...)` runs when error
- **ANALOGY**: like calling someone; `.then` = they picked up, `.catch` = call failed.
- **IF REMOVED**: all DB queries fail / hang; `/products` cannot show real data.

### Viva questions
- Q: Why use `.then` and `.catch`? 
  A: Because DB connection is async; Promises handle success/failure without blocking.

---

## Route: Homepage

```js
app.get("/", (req, res) => {
  res.render("homepage");
});
```

### `app.get("/", ...)`
1. **CONCEPT**: Route handler for GET requests.
2. **WHY HERE**: Browser loads the homepage when user opens the site.
3. **SYNTAX**:
   - `app.get(path, handler)`
   - `path` = `"/"` (root URL)
   - `handler` = function `(req, res) => { ... }`
4. **ANALOGY**: “If someone asks for room `/`, show them the homepage.”
5. **IF REMOVED**: Visiting `/` gives 404 Not Found.
6. **VIVA Q**:
   - Q: What are `req` and `res`? A: request info and response object to send output.

---

## Route: Products (filters + pagination)

```js
app.get("/products", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';
  const category = req.query.category || '';
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || 999999;

  const LIMIT = 8;
  const queryObject = {};

  if (search) {
    queryObject.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    queryObject.category = category;
  }

  queryObject.price = { $gte: minPrice, $lte: maxPrice };

  const skip = (page - 1) * LIMIT;

  try {
    const totalProducts = await Product.countDocuments(queryObject);
    const totalPages = Math.ceil(totalProducts / LIMIT);

    const products = await Product.find(queryObject)
      .skip(skip)
      .limit(LIMIT)
      .lean();

    const categories = await Product.distinct("category");

    res.render("products", {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      categories,
      search,
      category,
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong fetching products.");
  }
});
```

### Big-picture concept
- **CONCEPT**: This route is a mini “search engine” for products.
- **WHY HERE**: The products page must show different results based on user filters.
- **ANALOGY**: Like a shopkeeper who can show you:
  - only “Baby Care” items
  - under a specific price
  - matching a typed name

### Key idea: `req.query`
- **CONCEPT**: Query string parameters from URL.
  Example: `/products?page=2&search=panadol`
- **WHY**: Filters and pagination are passed in URL.
- **IF REMOVED**: You can’t filter; only one fixed product list.

### Why `async` and `await`
- **CONCEPT**: Database calls are async (they take time).
- **WHY**: `await` lets code look simple but still be non-blocking.
- **ANALOGY**: Ordering food: you wait for it, but the kitchen works in background.
- **IF REMOVED**: You’d need `.then()` chains or callbacks.

### Syntax focus (viva favorite)
#### `parseInt(req.query.page) || 1`
- **CONCEPT**: Convert string to number and provide default.
- **SYNTAX**:
  - `req.query.page` is usually a string like `'2'`
  - `parseInt(...)` makes it number `2`
  - `|| 1` means “if left side is falsy (NaN/undefined), use 1”
- **IF REMOVED**: pagination breaks; page might be `NaN`.

#### Regex search
`{ $regex: search, $options: 'i' }`
- **CONCEPT**: MongoDB regular-expression matching.
- **WHY**: allows partial and case-insensitive search.
- **ANALOGY**: Like “contains this word” search in WhatsApp.
- **IF REMOVED**: Search won’t work or becomes exact-only.

#### Price filter
`{ $gte: minPrice, $lte: maxPrice }`
- **CONCEPT**: numeric range query.
- **WHY**: filter products between min and max.
- **ANALOGY**: “Show me items between Rs.100 and Rs.500.”

#### Pagination math
`skip = (page - 1) * LIMIT`
- **CONCEPT**: skip N items to get a page.
- **ANALOGY**: If each page shows 8 items:
  - page 1 skips 0
  - page 2 skips 8
  - page 3 skips 16
- **IF REMOVED**: all pages show the same items.

#### `.lean()`
- **CONCEPT**: Mongoose returns plain JS objects instead of heavy Mongoose documents.
- **WHY**: faster rendering in templates.
- **IF REMOVED**: still works, but may be slower.

### Viva questions
1) Q: Why do we use `try/catch` here?
   A: To handle errors from async DB operations and respond with 500 instead of crashing.

2) Q: Why render `products.ejs` with an object?
   A: That object becomes variables inside the EJS template.

---

## Other routes

```js
app.get("/contact-us", (req, res) => res.render("contact-us"));
app.get("/hobbies", (req, res) => res.render("hobbies"));
```
- **CONCEPT**: simple static pages rendered by EJS.
- **IF REMOVED**: those URLs return 404.

---

## Start server

```js
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

- **CONCEPT**: Start the HTTP server and listen on port 3000.
- **WHY**: Without this, server never starts.
- **SYNTAX**:
  - `3000` = port
  - callback runs when server is ready
- **ANALOGY**: Opening the shop and turning the “OPEN” sign on.
- **IF REMOVED**: Nothing runs; browser can’t connect.

---

# 🌱 File: seed.js

## What this file is

### ✅ CONCEPT
A **database seeder**: a script that fills the database with sample data.

### ✅ WHY IT IS USED HERE
So your `/products` page has real items to show without manually inserting them.

### ✅ REAL-LIFE ANALOGY
Like stocking items on shelves before opening a store.

### ✅ WHAT HAPPENS IF REMOVED
The project still runs, but your database may be empty (products page shows “No results”).

---

## Important blocks

### 1) Imports and DB connect
```js
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/dvagoDB')
  .then(() => console.log('Connected to MongoDB for seeding...'))
  .catch(err => console.error('Connection failed:', err));
```
- Same concept as `server.js`: import libraries + connect using Promise.

### 2) Data array
```js
const products = [ { name: 'Panadol...', price: 85, ... }, ... ];
```
- **CONCEPT**: An array of objects.
- **WHY**: Easy to insert many products.
- **SYNTAX**:
  - `[]` = array
  - `{}` = object
  - `key: value` pairs
- **ANALOGY**: A list of product cards.
- **IF REMOVED**: Nothing to insert.

### 3) The seeding function
```js
async function seedDatabase() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  mongoose.connection.close();
}

seedDatabase();
```

#### `async function seedDatabase()`
- **CONCEPT**: async function lets you use `await`.
- **WHY**: DB operations take time.
- **IF REMOVED**: seeding logic disappears.

#### `Product.deleteMany({})`
- **CONCEPT**: delete all documents.
- **WHY**: start fresh every time you seed.
- **ANALOGY**: clearing shelves before restocking.
- **IF REMOVED**: re-running seed will duplicate products.

#### `Product.insertMany(products)`
- **CONCEPT**: bulk insert.
- **WHY**: fast insert of all sample products.
- **IF REMOVED**: database remains empty.

#### `mongoose.connection.close()`
- **CONCEPT**: close DB connection so script exits.
- **IF REMOVED**: script may keep running/hanging.

### ⚠️ Small data consistency note (good viva point)
Some image paths in `seed.js` don’t match the actual filenames in `public/images/` (example: `_septran.webp` vs a `.jpg` file in your images folder). 
- **Viva Q**: Q: Why might an image not load even if product exists? 
  A: Because the `image` URL stored in DB doesn’t match a real static file path, so browser gets 404.

---

# 🧩 File: models/Product.js

## What this file is

### ✅ CONCEPT
A **Mongoose Model** defines:
- a **Schema** (shape of a product)
- then creates a **Model** (a class-like object used to query the DB)

### ✅ WHY IT IS USED HERE
So you can do `Product.find(...)`, `Product.insertMany(...)`, etc. with validation.

### ✅ REAL-LIFE ANALOGY
Schema = a “form template” (fields like name, price)
Model = a “database clerk” who uses that form to store/fetch documents

---

## Schema definition
```js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  stock: { type: Number, default: 0 },
  image: { type: String, default: 'https://via.placeholder.com/300x200?text=No+Image' }
}, { timestamps: true });
```

### Why `new mongoose.Schema(...)`
- **CONCEPT**: create a schema object.
- **WHY**: so MongoDB documents are consistent and validated.
- **SYNTAX**: `new` creates an instance; `Schema({...}, options)`.
- **IF REMOVED**: You lose validation/defaults.

### Field rules (example: `name`)
- **CONCEPT**: object describing constraints.
- **WHY**: to ensure product always has a `name`.
- **IF REMOVED**: you might store broken products with missing fields.

### `timestamps: true`
- **CONCEPT**: automatic `createdAt` and `updatedAt`.
- **ANALOGY**: like a “date stamp” on a document.

---

## Exporting the model
```js
module.exports = mongoose.model('Product', ProductSchema);
```

- **CONCEPT**: create and export a model.
- **WHY**: other files can import it and query DB.
- **SYNTAX**:
  - `module.exports = ...` = what `require('./models/Product')` returns
  - `mongoose.model(name, schema)` registers the model
- **IF REMOVED**: your server can’t access products.

### Viva questions
1) Q: Schema vs Model?
   A: Schema defines structure; Model provides methods to create/query documents.

2) Q: Why is MongoDB collection plural sometimes?
   A: Mongoose converts `Product` model to `products` collection by default.

---

# 🍔 File: public/js/landingpage.js

## What this file is

### ✅ CONCEPT
Client-side JavaScript: runs in the browser to control UI behavior (hamburger menu).

### ✅ WHY IT IS USED HERE
On small screens you want a collapsible navigation menu.

### ✅ REAL-LIFE ANALOGY
Like a remote control button that opens/closes a TV menu.

---

## Code walkthrough

```js
console.log("JS loaded");
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", function(){
  navMenu.classList.toggle("open");
});

const navLinks = document.querySelectorAll(".nav-menu a");
navLinks.forEach(function(link){
  link.addEventListener("click", function(){
    navMenu.classList.remove("open");
  });
});

document.addEventListener ("click", function(event){
  const isclick_onNavmenu = navMenu.contains(event.target);
  const isclick_onHamburger = hamburger.contains(event.target);

  if (!isclick_onHamburger && !isclick_onNavmenu){
    navMenu.classList.remove("open");
  }
});
```

### `document.getElementById("hamburger")`
- **CONCEPT**: select an element by id.
- **WHY**: you need the hamburger button element.
- **IF REMOVED**: `hamburger` becomes `null` and `addEventListener` will crash.

### `addEventListener("click", ...)`
- **CONCEPT**: event listener.
- **WHY**: run code when user clicks.
- **ANALOGY**: like a doorbell—when pressed, it triggers a sound.

### `classList.toggle("open")`
- **CONCEPT**: add/remove a CSS class.
- **WHY**: CSS uses `.nav-menu.open` to expand menu.
- **IF REMOVED**: menu never opens.

### Click-outside-to-close logic
- **CONCEPT**: `contains()` checks if click happened inside an element.
- **WHY**: common UX to close menu when user clicks outside.

### Viva questions
1) Q: Why do we use CSS class toggling instead of directly changing styles?
   A: Cleaner separation—JS controls state, CSS controls appearance.

---

# 🏠 File: views/homepage.ejs

## What this file is

### ✅ CONCEPT
EJS template = HTML + small embedded JavaScript (using `<% %>` syntax). 
This file is mostly HTML (static layout) with links to CSS and JS.

### ✅ WHY IT IS USED HERE
Express renders this as the homepage. It can also reuse the same layout style as other pages.

### ✅ REAL-LIFE ANALOGY
Like a “fillable” document: mostly printed text (HTML), with a few blanks for values (EJS variables).

---

## Important patterns to understand (instead of repeating every closing tag)

### 1) Linking CSS/JS
```html
<link rel="stylesheet" href="/css/landingpagestyle.css">
<script src="/js/landingpage.js"></script>
```
- **CONCEPT**: browser requests static files.
- **WHY**: styling + hamburger functionality.
- **IF REMOVED**: page still loads but looks broken / menu won’t work.

### 2) Navigation links
```html
<ul class="nav-menu">
  <li><a href="/" class="active-nav">Home</a></li>
  <li><a href="/products">Products</a></li>
  <li><a href="/contact-us">Contact Us</a></li>
</ul>
```
- **CONCEPT**: anchor tags create navigation.
- **WHY**: these match Express routes.
- **IF REMOVED**: user can’t easily reach pages.

### 3) Category links with query strings
```html
<a href="/products?category=Wellness">...</a>
<a href="/products?maxPrice=499">...</a>
```
- **CONCEPT**: URL query strings send filter data.
- **WHY**: clicking category opens filtered products page.
- **IF REMOVED**: categories won’t filter.

### Viva questions
1) Q: What is EJS and why use it?
   A: A server-side templating engine; it allows dynamic HTML generation from server data.

---

# 🛍️ File: views/products.ejs

## What this file is

### ✅ CONCEPT
This is the dynamic template for product listing.
It uses EJS variables provided by `res.render("products", {...})` in `server.js`.

### ✅ WHY IT IS USED HERE
So the server can inject:
- `products` array
- `categories` list
- filter values
- pagination values

---

## The most important EJS concepts in this file

### 1) Outputting a value: `<%= ... %>`
```ejs
<input value="<%= search %>">
```
- **CONCEPT**: print a JS value into HTML.
- **WHY**: keep filter inputs filled after user searches.
- **IF REMOVED**: user loses typed values after submit.

### 2) Logic blocks: `<% ... %>`
```ejs
<% if (category) { %>
  <span><%= category %></span>
<% } %>
```
- **CONCEPT**: run JS logic without printing.
- **WHY**: show breadcrumb only when category exists.

### 3) Looping through arrays
```ejs
<% products.forEach(function(product) { %>
  <h4><%= product.name %></h4>
<% }); %>
```
- **CONCEPT**: generate repeated HTML for each product.
- **WHY**: number of products changes based on filters.
- **IF REMOVED**: no products will display.

### 4) Calculations inside EJS
```ejs
<strong><%= (currentPage - 1) * 8 + 1 %>–<%= Math.min(currentPage * 8, totalProducts) %></strong>
```
- **CONCEPT**: computed text.
- **WHY**: shows “Showing 9–16 of 30 products”.
- **IF REMOVED**: user doesn’t know which range they’re seeing.

### 5) Creating pagination links with filters
```ejs
<%
  const filterQuery = new URLSearchParams({
    search: search,
    category: category,
    minPrice: minPrice,
    maxPrice: maxPrice
  }).toString();
%>
<a href="/products?<%= filterQuery %>&page=<%= pageNum %>">...</a>
```
- **CONCEPT**: build a query string safely.
- **WHY**: pagination should keep the current filters.
- **IF REMOVED**: clicking “next page” resets filters.

### Viva questions
1) Q: Difference between `<%=` and `<%`?
   A: `<%=` prints output; `<%` runs logic only.

2) Q: Why calculate `filterQuery` instead of hardcoding the URL?
   A: Keeps pagination links consistent and avoids missing parameters.

---

# 📄 File: views/contact-us.ejs

### ✅ CONCEPT
Static-ish EJS page (mostly HTML). It reuses the header/nav/footer styling.

### ✅ WHY HERE
To demonstrate additional routes/pages.

### Viva questions
- Q: Why do we still call it `.ejs` if it’s mostly HTML?
  A: Because Express is configured for EJS; you can still add dynamic data later.

---

# 🧸 File: views/hobbies.ejs

```ejs
<h1>My Hobbies</h1>
```

- **CONCEPT**: minimal HTML rendered by Express.
- **WHY**: likely an assignment requirement for a simple extra page.
- **IF REMOVED**: `/hobbies` shows error because template missing.

---

# 🧾 File: views/index.ejs

### ✅ CONCEPT
Another template similar to homepage, but currently **not used** by routes.

### ✅ WHY IT EXISTS
Probably an earlier version or a practice page.

### ✅ WHAT HAPPENS IF REMOVED
Nothing breaks (as long as no route renders `index`).

### Viva question
- Q: How can you check whether a view is used?
  A: Search for `res.render("index")` in the server code.

---

# 🎨 File: public/css/landingpagestyle.css

## What this file is

### ✅ CONCEPT
CSS stylesheet for global layout (header, navbar, hero, categories, footer).

### ✅ WHY HERE
To make the homepage and shared layout look like a real e-commerce landing page.

### ✅ REAL-LIFE ANALOGY
CSS is like “clothing rules” for the HTML skeleton.

---

## Key CSS patterns (the ones teachers ask about)

### 1) CSS variables
```css
:root {
  --brand-blue: #1e3c72;
}
```
- **CONCEPT**: reusable values.
- **WHY**: consistent colors across the site.
- **IF REMOVED**: you must hardcode colors everywhere.

### 2) The universal selector reset
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
```
- **CONCEPT**: reset default browser spacing.
- **WHY**: consistent layout across browsers.

### 3) Flexbox layouts
```css
.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```
- **CONCEPT**: flexbox positions children easily.
- **WHY**: header has many items (logo, search, buttons, icons).

### 4) Animation keyframes
```css
@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```
- **CONCEPT**: CSS animation frames.
- **WHY**: scrolling warning banner.

---

# 🎛️ File: public/css/products.css

### ✅ CONCEPT
Page-specific CSS for the products page: sidebar filters, grid cards, pagination.

### ✅ WHY HERE
Products page has a different layout (sidebar + main grid) and many UI states.

### Viva question
- Q: Why separate CSS into multiple files?
  A: Separation of concerns and easier maintenance (shared vs page-specific).

---

# 📱 File: public/css/responsiveness.css

```css
@media (max-width: 768px) {
  .header .container { flex-direction: column; }
}
```

- **CONCEPT**: media queries adapt layout to screen size.
- **WHY**: mobile users need stacked layout and better spacing.
- **ANALOGY**: wearing different clothes in summer vs winter.
- **IF REMOVED**: site looks bad on phones.

---

# 🍔🎨 File: public/css/hamburger.css

### ✅ CONCEPT
CSS controlling hamburger behavior. It hides hamburger on desktop and shows it on mobile.

Key logic:
- `.hamburger { display: none; }`
- `@media (max-width:768px) { .hamburger { display: block; } }`
- `.nav-menu.open { max-height: 1000px; }`

**WHY**: Together with `landingpage.js`, it creates a collapsible menu.

---

# 🖼️ Folder: public/images/*

## What these files are

### ✅ CONCEPT
These are **static image assets** used by your HTML/EJS pages and by product data stored in MongoDB.

### ✅ WHY IT IS USED HERE
E-commerce-style pages need product images and banners. The browser requests them directly as URLs like `/images/panadol.webp`.

### ✅ SYNTAX BREAKDOWN
- The “syntax” here is mainly **file paths**.
- Example: `<img src="/images/cosmetics.webp">`
  - `/images/...` works because Express serves `public/` as static.

### ✅ REAL-LIFE ANALOGY
Like posters and product photos in a real shop.

### ✅ WHAT HAPPENS IF REMOVED
- Pages still load, but images will be broken (404).
- If the DB contains a wrong `image` path, product card will show a placeholder (your template uses `onerror=...`).

### ✅ POSSIBLE VIVA QUESTIONS
1) Q: Why do images load from `/images/...` without writing a route?
   A: Because `app.use(express.static("public"))` serves everything inside `public/` automatically.

---

# 📦 Folder: node_modules/*

## What this folder is

### ✅ CONCEPT
`node_modules/` is the folder where npm stores **downloaded libraries** (Express, EJS, Mongoose, and their dependencies).

### ✅ WHY IT IS USED HERE
Your code imports packages like `express` and `mongoose`. Node resolves them by looking inside `node_modules/`.

### ✅ REAL-LIFE ANALOGY
Like a huge “store room” full of ready-made parts you bought, so you don’t have to build everything from scratch.

### ✅ WHAT HAPPENS IF REMOVED
- The project won’t run until you reinstall dependencies.
- Fix is simple: run `npm install`.

### ✅ POSSIBLE VIVA QUESTIONS
1) Q: Should we upload `node_modules/` to GitHub?
  A: Usually no; it’s large and can be recreated with `npm install`.

---

# 🧠 Common Viva Questions

## Backend / Express
1) Q: What is Express?
   A: A Node.js framework for building web servers and routes.

2) Q: What is middleware?
   A: A function that runs during request handling (e.g., static file serving).

3) Q: Why do we use `res.render`?
   A: To generate HTML from an EJS template and send it to the browser.

## MongoDB / Mongoose
1) Q: Why use Mongoose instead of raw MongoDB?
   A: Schema validation, easier querying, and model-based structure.

2) Q: What does `Product.find(queryObject)` do?
   A: Fetches documents that match the filters in `queryObject`.

## EJS
1) Q: What is EJS?
   A: A template engine that allows embedding JS into HTML.

2) Q: `<% %>` vs `<%= %>`?
   A: `<% %>` for logic; `<%= %>` prints value.

## Frontend
1) Q: Why use `classList.toggle`?
   A: To switch a CSS class on/off to change UI state.

---

✅ If you want, I can also create a separate ultra-detailed file `VIVA-LINE-BY-LINE.md` that literally comments almost every line (very long), and a short `VIVA-QUICK-REVISION.md` for last-day revision.
