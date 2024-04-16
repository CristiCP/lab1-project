module.exports = function(db) {
    return {
        getAllTeams: function(req,res) {
            console.log("Getting all teams...");
            db.query('SELECT * FROM teams', (error, results) => {
                if (error) {
                  res.status(500).json("Server error");
                  console.log("Server error!!!");
              };
              res.json(results);
              res.status(200);
              console.log("All teams sent successfully.")
              });
        },
        getTeamByName: function(req,res) {
            const { name } = req.params;
            console.log("Getting team by Name:", name);
            db.query('SELECT * FROM teams WHERE name = ?', [name], (error, results) => {
            if (error) {
                res.status(500).json("Server error");
                console.log("Server error!!!");
            };
            if(results.length === 0) {
                res.status(404).json("No team found with name:" + name);
                console.log("Team not found.");
            }
            else {
            res.json(results[0]);
            res.status(200);
            console.log("Team sent successfully.");
            }
            });
        },
        createTeam: function(req, res) {
            const newTeam = req.body;
            console.log("Creating new team:", newTeam);
            db.query('SELECT * FROM teams WHERE name = ?', [newTeam.name], (selectError, selectResults) => {
                if (selectError) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                    return;
                }
                if (selectResults.length > 0) {
                    res.status(409).json("A team with that name already exists.");
                    console.log("Attempt to create a team that already exists.");
                } else {
                    db.query('INSERT INTO teams (name, country, year) VALUES (?, ?, ?)', [newTeam.name, newTeam.country, newTeam.year], (insertError, insertResults) => {
                        if (insertError) {
                            res.status(500).json("Server error");
                            console.log("Server error!!!");
                            return;
                        }
                        res.status(201).send(`Team added successfully!`);
                        console.log("Team created successfully.");
                    });
                }
            });
        },
        updateTeam: function(req, res) {
            const name = req.params.name;
            const updatedTeam = req.body;
            console.log("Updating Team with Name:", name);
            db.query('UPDATE teams SET country = ? , year = ? WHERE name = ?', [updatedTeam.country, updatedTeam.year, name], (error, results) => {
                if (error) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                };
                if (results.affectedRows === 0) {
                    res.status(404).send('Team not found.');
                    console.log("Team not found.");
                  }
                else {
                    res.send('Team updated successfully.');
                    res.status(200);
                    console.log("Team updated successfully.");
                }
            });
          },
        deleteTeam: function(req, res) {
            const { name } = req.params;
            console.log("Deleting player with Name:", name);
            db.query('DELETE FROM teams WHERE name = ?', [name], (error, results) => {
                if (error) {
                    res.status(500).json("Server error");
                    console.log("Server error!!!");
                };
                if (results.affectedRows === 0) {
                    res.status(404).send('Team not found.');
                    console.log("Team not found.");
                  }
                else {
                    res.send('Team and all players from the team deleted successfully.');
                    res.status(200);
                    console.log("Team and all players from the team deleted successfully.");
                }
            });
          }
    };
};