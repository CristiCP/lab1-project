const playerModel = require('./playerModel');

const getAllPlayers = (req, res) => {
  console.log("Getting all players...");
  const players = playerModel.getAllPlayers();
  res.json(players);
  console.log("All players sent successfully.")
};

const getPlayerById = (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Getting player by ID:", id);
  const player = playerModel.getPlayerById(id);
  if (!player) {
    console.log("Player not found.");
    res.status(404).json({ error: 'Player not found' });
  } else {
    res.json(player);
    console.log("Player sent successfully.");
  }
};

const createPlayer = (req, res) => {
  const newPlayer = req.body;
  console.log("Creating new player:", newPlayer);
  const player = playerModel.createPlayer(newPlayer);
  res.status(201).json(player);
  console.log("Player created successfully.");
};

const updatePlayer = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedPlayer = req.body;
  console.log("Updating player with ID:", id);
  const player = playerModel.updatePlayer(id, updatedPlayer);
  if (!player) {
    console.log("Player not found.");
    res.status(404).json({ error: 'Player not found' });
  } else {
    res.json(player);
    console.log("Player updated successfully.");
  }
};

const deletePlayer = (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Deleting player with ID:", id);
  const success = playerModel.deletePlayer(id);
  if (success) {
    console.log("Player deleted successfully.");
    res.sendStatus(204);
  } else {
    console.log("Player not found.");
    res.status(404).json({ error: 'Player not found' });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};