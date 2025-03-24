const express = require("express");
const shuffleSeed = require("shuffle-seed");

const app = express();
const port = process.env.PORT || 3000; // Use process.env.PORT for Vercel

// middleware to parse request body as URL-encoded form data
app.use(express.urlencoded({ extended: false }));

const users = [
  { name: "Hao" },
  { name: "Chao" },
  { name: "Luca" },
  { name: "Dmitry" },
  { name: "Gaetan" },
  { name: "Gayathree" },
  { name: "Harumi" },
];

// POST route to shuffle list of users
app.post("/", (req, res) => {
  const dateParam = req.body.text; // Access the 'text' field directly from req.body
  let date;

  if (dateParam) {
    date = new Date(dateParam);
    if (! (date instanceof Date) || isNaN(date)) {
      console.log("Invalid date param, will current date");
      date = new Date();
    }
  } else {
    date = new Date();
  }

  date.setTime(date.getTime() + 9 * 60 * 60 * 1000); // shift to JST
  const weekNum = getWeekNumber(date); // get current week number
  console.log({ weekNum, date });

  const shuffledUsers = shuffleSeed.shuffle(users, weekNum); // shuffle users based on current week number

  const returnMsg =
    "_[Date: " +
    date.toLocaleDateString("ja-JP") +
    " | Week: " +
    weekNum +
    "]_\nToday huddle order is: \n" +
    shuffledUsers.map((u) => "- *" + u.name + "*").join("\n");

  // res.json({ shuffledUsers });
  res.send(returnMsg);
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

// helper function to get week number from date
function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

// start server
app.listen(port, () => console.log(`Server started on port ${port}`));
