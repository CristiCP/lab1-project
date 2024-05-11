const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

function verifyToken(db) {
    return function(req,res,next) {
    const token = req.headers['authorization'];
    console.log("Verifing token " + token);
    if (!token) {
      console.log("Token not provided");
      return res.status(401).json({ error: 'Token not provided' });
    }
    db.query('SELECT * FROM tokens WHERE token = ?', [token], (err, results) => {
      if (err) {
        console.log("Database error");
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        console.log("Invalid token");
        return res.status(403).json({ error: 'Invalid token' });
      }
      const tokenData = results[0];
      jwt.verify(token, '5nB0$CZ4*!8x@1WQzPmY&rS#6QD!oF$D', (jwtErr, decoded) => {
        if (jwtErr) {
          db.query('DELETE FROM tokens WHERE token = ?', [token], (deleteErr, deleteResults) => {
            if (deleteErr) {
              console.error('Error deleting expired token:', deleteErr);
            }
            console.log("Expired token");
            return res.status(403).json({ error: 'Invalid token' });
          });
        } else {
          console.log("Valid token");
          req.user = decoded;
          next();
        }
      });
    });
}
  }

module.exports = (db) => {
    const playerController = require('./Controllers/playersController')(db);
    const teamsController = require('./Controllers/teamsController')(db);
    const authenticationControlller = require('./Controllers/authentificationController')(db);

    router.post('/authentification', authenticationControlller.LoginUser);
    router.post('/signup', authenticationControlller.SignUpUser);
    router.post('/validate',authenticationControlller.ValidateUser);
    router.post('/verify',authenticationControlller.VerifyUser);

    router.use(verifyToken(db));
    router.get('/players', playerController.getAllPlayers);
    router.get('/players/:id', playerController.getPlayerById);
    router.post('/players', playerController.createPlayer);
    router.put('/players/:id', playerController.updatePlayer);
    router.delete('/players/:id', playerController.deletePlayer);

    router.get('/teams', teamsController.getAllTeams);
    router.get('/teams/:name', teamsController.getTeamByName);
    router.post('/teams', teamsController.createTeam);
    router.put('/teams/:name', teamsController.updateTeam);
    router.delete('/teams/:name', teamsController.deleteTeam);

    router.get('/all', teamsController.getAllTeamsWithPlayers);

    return router;
};