const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: "ua-kozaky-secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: "https://ua-kozaky-cs2-fun-241.onrender.com/auth/steam/return",
    realm: "https://ua-kozaky-cs2-fun-241.onrender.com/",
    apiKey: "CC2CBE4BC8F74FAD5E8EDB850AB5C982"
  },
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

app.get("/auth/steam", passport.authenticate("steam"));

app.get("/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => res.redirect("/")
);

app.get("/api/user", (req, res) => {
  if (!req.user) return res.json(null);
  res.json({
    name: req.user.displayName,
    avatar: req.user.photos[2].value
  });
});

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

// =======================
// Кейси + топ гравців
// =======================
let players = [];

const caseItems = [
  { name: "VIP на 1 день", price: 10 },
  { name: "Скін наклейка", price: 2 },
  { name: "Скін CS2", price: 5 }
];

app.post("/open-case", (req, res) => {
  const { name } = req.body;
  if (!name) return res.json({ error: "Введи нік!" });

  const reward = caseItems[Math.floor(Math.random() * caseItems.length)];

  // Додаємо до топ гравців
  const playerIndex = players.findIndex(p => p.name === name);
  if (playerIndex === -1) {
    players.push({ name, rewards: [reward.name] });
  } else {
    players[playerIndex].rewards.push(reward.name);
  }

  // Топ 5 гравців
  const topPlayers = players.slice(-5).reverse();

  res.json({ reward, topPlayers });
});

app.get("/top-players", (req, res) => {
  res.json(players.slice(-5).reverse());
});

app.listen(3000, () => console.log("Server running"));
