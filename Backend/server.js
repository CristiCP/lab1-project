const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const playerController = require('./playerController');
const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin:"*",
  credentials:true,
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get('/players', playerController.getAllPlayers);
app.get('/players/:id', playerController.getPlayerById);
app.post('/players', playerController.createPlayer);
app.put('/players/:id', playerController.updatePlayer);
app.delete('/players/:id', playerController.deletePlayer);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});