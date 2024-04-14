const fs = require('fs');

let players = require('./players.json');

const savePlayers = () => {
  fs.writeFileSync('./players.json', JSON.stringify(players, null, 2), 'utf8');
};

const getAllPlayers = () => {
  return players.users;
};

const getPlayerById = (id) => {
  return players.users.find(player => player.id === id);
};

const createPlayer = (newPlayer) => {
  const id = players.users.length > 0 ? players.users[players.users.length - 1].id + 1 : 1;
  newPlayer.id = id;
  players.users.push(newPlayer);
  savePlayers();
  return newPlayer;
};

const updatePlayer = (id, updatedPlayer) => {
  let playerIndex = players.users.findIndex(player => player.id === id);
  if (playerIndex !== -1) {
    players.users[playerIndex] = { ...players.users[playerIndex], ...updatedPlayer };
    savePlayers();
    return players.users[playerIndex];
  } else {
    return null;
  }
};

const deletePlayer = (id) => {
  const initialLength = players.users.length;
  players.users = players.users.filter(player => player.id !== id);
  if (players.users.length !== initialLength) {
    savePlayers();
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};