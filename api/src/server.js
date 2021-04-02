const express = require("express");
const axios = require("axios");

const Redis = require("./cache/redis");

const app = express();
const PORT = 3000;

app.get("/:username", async (req, res) => {
  const { username } = req.params;

  let user = await Redis.get(username);

  if (user) {
    user = JSON.parse(user);
  } else {
    const response = await axios.default.get(
      `https://api.github.com/users/${username}`,
      { validateStatus: () => true }
    );

    if (response.status !== 204) return res.status(404).json(response.data);

    user = response.data;
    Redis.set(username, JSON.stringify(user), 30);
  }

  res.status(200).json(user);
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server runnint on port ${PORT}`)
);
