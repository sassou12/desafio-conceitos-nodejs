const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function checkExistsRepo(request, response, next) {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }
  request.params.index = index;
  next();
}

const repositories = [];

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", checkExistsRepo, (request, response) => {
  const { id, index } = request.params;
  const { title, url, techs } = request.body;
  const repositoryUpdated = {
    id,
    title,
    techs,
    url,
    likes: repositories[index].likes,
  };
  repositories[index] = repositoryUpdated;
  return response.json(repositoryUpdated)
});

app.delete("/repositories/:id", checkExistsRepo, (request, response) => {
  const { index } = request.params;
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkExistsRepo, (request, response) => {
  const { index } = request.params;
  repositories[index].likes++;
  return response.json(repositories[index]);
});

module.exports = app;
