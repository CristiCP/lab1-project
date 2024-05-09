const jwt = require('jsonwebtoken');
module.exports = function(db) {
    return {
      getAllPlayers: function(req, res) {
        console.log("Getting all players...");
        const token = req.headers['authorization'];
        const decodedToken = jwt.decode(token);
        const username = decodedToken.username;
        
        let { sortBy, order, page, pageSize } = req.query;
        sortBy = sortBy || 'name';
        order = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        page = parseInt(page) || 1; 
        pageSize = parseInt(pageSize) || 50; 
        const offset = (page - 1) * pageSize;
        const sql = `SELECT * FROM players WHERE team IN (SELECT name FROM teams WHERE username = ?) ORDER BY ${sortBy} ${order} LIMIT ?, ?`;
            db.query(sql, [username, offset, pageSize], (error, results) => {
                if (error) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                    return;
                }
                res.json(results);
                console.log("Players sent successfully.");
            });
    },
    getPlayerById: function(req, res) {
      const { id } = req.params;
      const token = req.headers['authorization'];
      const decodedToken = jwt.decode(token);
      const username = decodedToken.username;
  
      console.log("Getting player by ID:", id);
      db.query('SELECT players.*, teams.username FROM players INNER JOIN teams ON players.team = teams.name WHERE players.id = ?', [id], (error, results) => {
          if (error) {
              res.status(500).json("Server error");
              console.log("Server error!!!");
              return;
          }
          if (results.length === 0) {
              res.status(404).json("No player found with id:" + id);
              console.log("Player not found.");
              return;
          }
  
          const player = results[0];
          if (player.username !== username) {
              res.status(403).json("You don't have permission to access this player.");
              console.log("Permission denied.");
              return;
          }
  
          res.json(player);
          res.status(200);
          console.log("Player sent successfully.");
      });
  },
      createPlayer: function(req, res) {
        const token = req.headers['authorization'];
        const decodedToken = jwt.decode(token);
        const username = decodedToken.username;

        const newPlayer = req.body;
        console.log("Creating new player:", newPlayer);
        db.query('SELECT * FROM teams WHERE name = ? AND username = ?', [newPlayer.team, username], (error, results) => {
            if (error) {
                res.status(500).json("Server error");
                console.log("Server error!!!");
                return;
            }
            if (results.length === 0) {
                res.status(404).json("Team not found or you don't have permission to add players to this team.");
                console.log("Team not found or you don't have permission to add players to this team.");
                return;
            }
            db.query('INSERT INTO players (name, country, team, age) VALUES (?, ?, ?, ?)', [newPlayer.name, newPlayer.country, newPlayer.team, newPlayer.age], (error, results) => {
                if (error) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                    return;
                }
                res.status(201).send(`Player added with ID: ${results.insertId}`);
                console.log("Player created successfully.");
            });
        });
    },
    updatePlayer: function(req, res) {
      const token = req.headers['authorization'];
      const decodedToken = jwt.decode(token);
      const username = decodedToken.username;

      const id = parseInt(req.params.id);
      const updatedPlayer = req.body;
      console.log("Updating player with ID:", id);
      db.query('SELECT * FROM teams WHERE name = ? AND username = ?', [updatedPlayer.team, username], (error, results) => {
          if (error) {
              res.status(500).json("Server error");
              console.log("Server error!!!");
              return;
          }
          if (results.length === 0) {
              res.status(404).json("Team not found or you don't have permission to update players in this team.");
              console.log("Team not found or you don't have permission to update players in this team.");
              return;
          }
          db.query('UPDATE players SET name = ?, country = ?, team = ?, age = ? WHERE id = ?', [updatedPlayer.name, updatedPlayer.country, updatedPlayer.team, updatedPlayer.age, id], (error, results) => {
              if (error) {
                  res.status(500).json("Server error");
                  console.log("Server error!!!");
                  return;
              }
              if (results.affectedRows === 0) {
                  res.status(404).send('Player not found.');
                  console.log("Player not found.");
                  return;
              }
              res.send('Player updated successfully.');
              res.status(200);
              console.log("Player updated successfully.");
          });
      });
  },
  deletePlayer: function(req, res) {
    const token = req.headers['authorization'];
    const decodedToken = jwt.decode(token);
    const username = decodedToken.username;

    const { id } = req.params;
    console.log("Deleting player with ID:", id);
    db.query('SELECT team FROM players WHERE id = ?', [id], (error, results) => {
        if (error) {
            res.status(500).json("Server error");
            console.log("Server error!!!");
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Player not found.');
            console.log("Player not found.");
            return;
        }
        const playerTeam = results[0].team;
        db.query('SELECT * FROM teams WHERE name = ? AND username = ?', [playerTeam, username], (error, results) => {
            if (error) {
                res.status(500).json("Server error");
                console.log("Server error!!!");
                return;
            }
            if (results.length === 0) {
                res.status(403).json("You don't have permission to delete this player.");
                console.log("You don't have permission to delete this player.");
                return;
            }
            db.query('DELETE FROM players WHERE id = ?', [id], (error, results) => {
                if (error) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                    return;
                }
                res.send('Player deleted successfully.');
                res.status(200);
                console.log("Player deleted successfully.");
            });
        });
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