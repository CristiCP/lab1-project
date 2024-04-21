const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const playerController = require('./Controllers/playersController')(db);
    const teamsController = require('./Controllers/teamsController')(db);

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

    router.get('/all',teamsController.getAllTeamsWithPlayers);

    return router;
};