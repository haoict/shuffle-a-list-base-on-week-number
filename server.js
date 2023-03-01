const express = require("express");
const app = express();
const shuffleSeed = require("shuffle-seed");

// middleware to parse request body as JSON
app.use(express.json());

const users = [
  { name: "Phan" },
  { name: "Hao" },
  { name: "Chao" },
  { name: "Luca" },
  { name: "Dmitry" },
  { name: "Gaetan" },
];

// POST route to shuffle list of users
app.post("/cpthuddle", (req, res) => {
  const dateParam = req.body.form?.text;
  let date;
  if (dateParam) {
    date = new Date(dateParam);
    if (!date instanceof Date || isNaN(date)) {
      console.log("Invalid date param, will current date");
      date = new Date();
    }
    date.setTime(date.getTime() + 9 * 60 * 60 * 1000); // shift to JST
  }
  const weekNum = getWeekNumber(date); // get current week number
  console.log({ weekNum, date });
  const shuffledUsers = shuffleSeed.shuffle(users, weekNum); // shuffle users based on current week number
  res.json({ shuffledUsers });
});

// helper function to shuffle users based on week number
function shuffle(array, seed) {
  // <-- ADDED ARGUMENT
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed; // <-- ADDED LINE
  }

  return array;
}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// helper function to get week number from date
function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

// start server on port 3000
app.listen(3000, () => console.log("Server started on port 3000"));
