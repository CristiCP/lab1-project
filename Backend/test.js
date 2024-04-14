const request = require('supertest');
const fs = require('fs');
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('./playerModel');

describe('Player Model Tests', () => {
  test('getAllPlayers function should return all players', () => {
    const players = getAllPlayers();
    expect(players.length).toBe(4);
  });

  test('getPlayerById function should return correct player by id', () => {
    const player = getPlayerById(3);
    expect(player.name).toBe('Popan Iosif-Cristian');
  });

  test('createPlayer function should create a new player', () => {
    const newPlayer = {
      "name": "Player",
      "country": "Country",
      "team": "Team",
      "age": "69"
    };
    const createdPlayer = createPlayer(newPlayer);
    expect(createdPlayer.id).toBeDefined();
    expect(createdPlayer.name).toBe('Player');
  });

  test('updatePlayer function should update the last created player', () => {
    const allPlayers = getAllPlayers();
    const lastPlayer = allPlayers[allPlayers.length - 1];
    const updatedPlayerData = {
      "name": "UpdatedPlayerName"
    };
    const updatedPlayer = updatePlayer(lastPlayer.id, updatedPlayerData);
    expect(updatedPlayer.name).toBe('UpdatedPlayerName');
  });

  test('deletePlayer function should delete the last created player', () => {
    const initialLength = getAllPlayers().length;
    const allPlayers = getAllPlayers();
    const lastPlayer = allPlayers[allPlayers.length - 1];
    deletePlayer(lastPlayer.id);
    const playersAfterDeletion = getAllPlayers();
    expect(playersAfterDeletion.length).toBe(initialLength - 1);
  });
});

describe('Player Controller Tests',()=>{
  test('should get all players', async () => {
    const res = await request('http://localhost:4000').get('/players');
    expect(res.statusCode).toEqual(200);
  });

  test('should get player by ID', async () => {
    const res = await request('http://localhost:4000').get('/players/2');
    expect(res.statusCode).toEqual(200);
  });

  test('should create a new player', async () => {
    const newPlayer = {
      name: 'Test Player',
      country: 'Test Country',
      team: 'Test Team',
      age: '25'
    };
    const res = await request('http://localhost:4000')
      .post('/players')
      .send(newPlayer);
    expect(res.statusCode).toEqual(201);
    lastPlayerId = res.body.id;
  });

  test('should update the last player created', async () => {
    const updatedPlayer = {
      name: 'Updated Test Player',
      country: 'Updated Test Country',
      team: 'Updated Test Team',
      age: '30'
    };
    const res = await request('http://localhost:4000')
      .put(`/players/${lastPlayerId}`)
      .send(updatedPlayer);
    expect(res.statusCode).toEqual(200);
  });

  test('should delete the last player created', async () => {
    const res = await request('http://localhost:4000')
      .delete(`/players/${lastPlayerId}`);
    expect(res.statusCode).toEqual(204);
  });
})