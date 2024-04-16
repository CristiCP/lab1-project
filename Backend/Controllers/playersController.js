module.exports = function(db) {
    return {
      getAllPlayers: function(req, res) {
        console.log("Getting all players...");
        db.query('SELECT * FROM players', (error, results) => {
          if (error) {
            res.status(500).json("Server error");
            console.log("Server error!!!");
        };
        res.json(results);
        res.status(200);
        console.log("All players sent successfully.")
        });

      },
      getPlayerById: function(req, res) {
        const { id } = req.params;
        console.log("Getting player by ID:", id);
        db.query('SELECT * FROM players WHERE id = ?', [id], (error, results) => {
          if (error) {
            res.status(500).json("Server error");
            console.log("Server error!!!");
        };
        if(results.length === 0) {
            res.status(404).json("No player found with id:" + id);
            console.log("Player not found.");
        }
        else {
          res.json(results[0]);
          res.status(200);
          console.log("Player sent successfully.");
        }
        });
      },
      createPlayer: function(req, res) {
        const newPlayer = req.body;
        console.log("Creating new player:", newPlayer);
        db.query('SELECT * FROM teams WHERE name = ?', [newPlayer.team], (error, results) => {
            if (error) {
                res.status(500).json("Server error");
                console.log("Server error!!!");
                return;
            }
            if (results.length === 0) {
                res.status(404).json("Team not found.");
                console.log("Team not found.");
                return;
            }
            db.query('INSERT INTO players (name, country, team, age) VALUES (?, ?, ?, ?)', [newPlayer.name, newPlayer.country, newPlayer.team, newPlayer.age], (error, results) => {
                if (error) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                    return;
                };
                res.status(201).send(`Player added with ID: ${results.insertId}`);
                console.log("Player created successfully.");
            });
        });
    },
      updatePlayer: function(req, res) {
        const id = parseInt(req.params.id);
        const updatedPlayer = req.body;
        console.log("Updating player with ID:", id);
        db.query('UPDATE players SET name = ?, country = ? , team = ? , age = ? WHERE id = ?', [updatedPlayer.name, updatedPlayer.country, updatedPlayer.team, updatedPlayer.age, id], (error, results) => {
            if (error) {
                res.status(500).json("Server error");
                console.log("Server error!!!");
            };
            if (results.affectedRows === 0) {
                res.status(404).send('Player not found.');
                console.log("Player not found.");
              }
            else {
                res.send('Player updated successfully.');
                res.status(200);
                console.log("Player updated successfully.");
            }
        });
      },
      deletePlayer: function(req, res) {
        const { id } = req.params;
        console.log("Deleting player with ID:", id);
        db.query('DELETE FROM players WHERE id = ?', [id], (error, results) => {
            if (error) {
                res.status(500).json("Server error");
                console.log("Server error!!!");
            };
            if (results.affectedRows === 0) {
                res.status(404).send('Player not found.');
                console.log("Player not found.");
              }
            else {
                res.send('Player deleted successfully.');
                res.status(200);
                console.log("Player deleted successfully.");
            }
        });
      },
      createNewEntity: function(io) {
        const players = [
          { name: "Lionel Messi", country: "Argentina", team: "Paris Saint-Germain", age: "34" },
          { name: "Cristiano Ronaldo", country: "Portugal", team: "Manchester United", age: "37" },
          { name: "Neymar Jr", country: "Brazil", team: "Paris Saint-Germain", age: "30" },
          { name: "Kylian Mbappé", country: "France", team: "Paris Saint-Germain", age: "23" },
          { name: "Robert Lewandowski", country: "Poland", team: "Bayern Munich", age: "33" },
          { name: "Kevin De Bruyne", country: "Belgium", team: "Manchester City", age: "30" },
          { name: "Mohamed Salah", country: "Egypt", team: "Liverpool", age: "29" },
          { name: "Harry Kane", country: "United Kingdom", team: "Tottenham Hotspur", age: "28" },
          { name: "Sadio Mané", country: "Senegal", team: "Liverpool", age: "29" },
          { name: "Erling Haaland", country: "Norway", team: "Borussia Dortmund", age: "21" }
        ];
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        const newPlayer = {
          name: randomPlayer.name,
          country: randomPlayer.country,
          team: randomPlayer.team,
          age: randomPlayer.age
        };
        db.query('INSERT INTO players (name,country,team,age) VALUES (?, ?, ?, ?)', [newPlayer.name, newPlayer.country, newPlayer.team, newPlayer.age], (error, results) => {
          if (error) {
              console.log("Server error!!!");
              return;
          };
          const player = {
            id: results.insertId,
            name: newPlayer.name,
            country: newPlayer.country,
            team: newPlayer.team,
            age: newPlayer.age
          };
          console.log("Creating new player:", newPlayer);
          console.log("Player created successfully.");
          io.emit("newEntity", player);
      });
      }
    };
  };