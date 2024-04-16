const request = require('supertest');
const fs = require('fs');

describe('Player Controller Tests',()=>{
  test('should return all players when getAllPlayers is called', () => {
    const mockDb = {
      query: jest.fn((query, callback) => {
        callback(null, [{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }]);
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn()
    };
    controller.getAllPlayers(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM players', expect.any(Function));
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }]);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  
  test('should return a player when getPlayerById is called with a valid ID', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        if (params[0] === 1) {
          callback(null, [{ id: 1, name: 'Player 1' }]);
        } else {
          callback(null, []);
        }
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = { params: { id: 1 } }; 
    const res = {
      json: jest.fn(),
      status: jest.fn()
    };
    controller.getPlayerById(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM players WHERE id = ?', [1], expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Player 1' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should return 404 when getPlayerById is called with an invalid ID', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        callback(null, []);
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = { params: { id: 999 } }; 
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    controller.getPlayerById(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM players WHERE id = ?', [999], expect.any(Function));
    expect(res.json).toHaveBeenCalledWith("No player found with id:999");
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('should create a new player when createPlayer is called with valid data', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        if (query.includes('SELECT * FROM teams')) {
          callback(null, [{ id: 1, name: 'Team A' }]);
        } else {
          callback(null, { insertId: 1 });
        }
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {
      body: {
        name: 'New Player',
        country: 'Country A',
        team: 'Team A',
        age: 25
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    controller.createPlayer(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE name = ?', ['Team A'], expect.any(Function));
    expect(mockDb.query).toHaveBeenCalledWith('INSERT INTO players (name, country, team, age) VALUES (?, ?, ?, ?)', ['New Player', 'Country A', 'Team A', 25], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith('Player added with ID: 1');
  });
  
  test('should return 404 when createPlayer is called with invalid team name', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        if (query.includes('SELECT * FROM teams')) {
          callback(null, []);
        }
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {
      body: {
        name: 'New Player',
        country: 'Country A',
        team: 'Nonexistent Team',
        age: 25
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  
    controller.createPlayer(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE name = ?', ['Nonexistent Team'], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Team not found.');
  });

  test('should update an existing player when updatePlayer is called with valid data', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {
      params: { id: 1 }, 
      body: {
        name: 'Updated Player',
        country: 'Country B',
        team: 'Team B',
        age: 30
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    controller.updatePlayer(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('UPDATE players SET name = ?, country = ? , team = ? , age = ? WHERE id = ?', ['Updated Player', 'Country B', 'Team B', 30, 1], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Player updated successfully.');
  });

  test('should return 404 when updatePlayer is called with non-existing player ID', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        callback(null, { affectedRows: 0 });
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {
      params: { id: 999 },
      body: {
        name: 'Updated Player',
        country: 'Country B',
        team: 'Team B',
        age: 30
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    controller.updatePlayer(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('UPDATE players SET name = ?, country = ? , team = ? , age = ? WHERE id = ?', ['Updated Player', 'Country B', 'Team B', 30, 999], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Player not found.');
  });

  test('should delete an existing player when deletePlayer is called with valid ID', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {
      params: { id: 1 } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    controller.deletePlayer(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM players WHERE id = ?', [1], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Player deleted successfully.');
  });
  
  test('should return 404 when deletePlayer is called with non-existing player ID', () => {
    const mockDb = {
      query: jest.fn((query, params, callback) => {
        callback(null, { affectedRows: 0 });
      })
    };
    const controller = require('./Controllers/playersController')(mockDb);
    const req = {
      params: { id: 999 } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    controller.deletePlayer(req, res);
    expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM players WHERE id = ?', [999], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Player not found.');
  });
})

describe('Team Controller Tests',()=>{
  test('should return all teams successfully', () => {
    const mockDb = {
        query: jest.fn((query, callback) => {
            callback(null, [{name: 'Team 1'}, {name: 'Team 2'}]);
        })
    };
    const teamsController = require('./Controllers/teamsController')(mockDb);
    const req = {};
    const res = {
        json: jest.fn(),
        status: jest.fn()
    };
    teamsController.getAllTeams(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{name: 'Team 1'}, {name: 'Team 2'}]);
});

test('should return a team when getTeamByName is called with a valid team name', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      if (query.includes('SELECT * FROM teams')) {
        callback(null, [{ id: 1, name: 'Team A' }]);
      }
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    params: { name: 'Team A' } 
  };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
  controller.getTeamByName(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE name = ?', ['Team A'], expect.any(Function));
  expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Team A' });
  expect(res.status).toHaveBeenCalledWith(200);
});

test('should return 404 when getTeamByName is called with a non-existing team name', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      if (query.includes('SELECT * FROM teams')) {
        callback(null, []);
      }
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    params: { name: 'Nonexistent Team' }
  };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
  controller.getTeamByName(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE name = ?', ['Nonexistent Team'], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith('No team found with name:Nonexistent Team');
});

test('should create a new team when createTeam is called with valid data', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      if (query.includes('SELECT * FROM teams')) {
        callback(null, []);
      } else {
        callback(null, { insertId: 1 });
      }
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    body: {
      name: 'New Team',
      country: 'Country A',
      year: 2024
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  controller.createTeam(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE name = ?', ['New Team'], expect.any(Function));
  expect(mockDb.query).toHaveBeenCalledWith('INSERT INTO teams (name, country, year) VALUES (?, ?, ?)', ['New Team', 'Country A', 2024], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.send).toHaveBeenCalledWith('Team added successfully!');
});

test('should return 409 when createTeam is called with a team name that already exists', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      if (query.includes('SELECT * FROM teams')) {
        callback(null, [{ id: 1, name: 'Existing Team' }]);
      }
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    body: {
      name: 'Existing Team',
      country: 'Country B',
      year: 2024
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  controller.createTeam(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE name = ?', ['Existing Team'], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith('A team with that name already exists.');
});

test('should update an existing team when updateTeam is called with valid data', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    params: { name: 'Team A' }, 
    body: {
      country: 'Country B',
      year: 2025
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  controller.updateTeam(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('UPDATE teams SET country = ? , year = ? WHERE name = ?', ['Country B', 2025, 'Team A'], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith('Team updated successfully.');
});

test('should return 404 when updateTeam is called with a non-existing team name', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      callback(null, { affectedRows: 0 });
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    params: { name: 'Nonexistent Team' }, 
    body: {
      country: 'Country B',
      year: 2025
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  controller.updateTeam(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('UPDATE teams SET country = ? , year = ? WHERE name = ?', ['Country B', 2025, 'Nonexistent Team'], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Team not found.');
});

test('should delete an existing team when deleteTeam is called with valid name', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    params: { name: 'Team A' }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  controller.deleteTeam(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM teams WHERE name = ?', ['Team A'], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith('Team and all players from the team deleted successfully.');
});

test('should return 404 when deleteTeam is called with a non-existing team name', () => {
  const mockDb = {
    query: jest.fn((query, params, callback) => {
      callback(null, { affectedRows: 0 });
    })
  };
  const controller = require('./Controllers/teamsController')(mockDb);
  const req = {
    params: { name: 'Nonexistent Team' } 
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  controller.deleteTeam(req, res);
  expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM teams WHERE name = ?', ['Nonexistent Team'], expect.any(Function));
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Team not found.');
});
})