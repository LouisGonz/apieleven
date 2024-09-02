const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Para permitir o processamento de JSON no corpo das requisições

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Carrega as chaves e limites do arquivo
let apiKeys = JSON.parse(fs.readFileSync(path.join(__dirname, 'apiKeys.json'), 'utf8'));

// Função para obter uma frase aleatória
function getRandomPhrase() {
  const data = fs.readFileSync(path.join(__dirname, 'frases.json'), 'utf8');
  const json = JSON.parse(data);
  const frases = json.frases;
  const randomIndex = Math.floor(Math.random() * frases.length);
  return frases[randomIndex];
}

// Rota para obter uma frase aleatória
app.get('/frases', (req, res) => {
  const frase = getRandomPhrase();
  apiKeys[req.apiKey].used += 1; // Atualiza o uso da chave
  fs.writeFileSync(path.join(__dirname, 'apiKeys.json'), JSON.stringify(apiKeys, null, 2)); // Salva as alterações
  res.json({ frase });
});

// Rota para consultar o uso da chave
app.get('/uso', (req, res) => {
  const key = req.apiKey;
  const used = apiKeys[key].used;
  const limit = apiKeys[key].limit;
  res.json({ used, limit, remaining: limit - used });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
