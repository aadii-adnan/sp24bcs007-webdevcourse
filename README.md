# sp24bcs007-webdevcourse

This repository contains web development course work, practice exercises, and small lab projects. Most folders are static HTML/CSS/JavaScript exercises, and `lab-task2` is a small Express/EJS app.

## Project Structure

- `Assignment1/`, `Assignment2/`, `Lab-Mid/` - landing page assignments with HTML, CSS, JavaScript, and images.
- `lab-task1/` - responsive landing page practice.
- `lab-task2/` - Node.js + Express + EJS app with static assets in `public/` and views in `views/`.
- `Practise/` - assorted practice exercises such as CV layouts, grids, DOM practice, background generator, and an Amazon clone.
- `Startup/` - a simple starter page.

## How To Run

### Static pages

Open the HTML files directly in a browser. Each folder contains its own CSS, JavaScript, and image assets where needed.

### Express app in `lab-task2`

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node server.js
   ```

3. Open `http://localhost:3000` in your browser.

## Notes

- The root route renders the homepage view.
- Additional routes include `/contact-us` and `/hobbies`.
- Static files for the Express app are served from `lab-task2/public`.
