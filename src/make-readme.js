const fs = require("fs");
const path = require("path");

const dados = require("./data");
const readme = path.join(__dirname, "../README.md");
const template = path.join(__dirname, "readme-template.md");

const sumario = dados
  .map((categoria) => `- [${categoria.titulo}](#${categoria.slug})`)
  .join("\n");

const secoes = dados.map((categoria) => {
  const itens = categoria.conteudo
    .map((item) => {
      return `- [${item.titulo}](${item.link}) - ${item.descricao}`;
    })
    .join("\n");

  return `## ${categoria.titulo}\n\n${itens}`;
}).join('\n\n');

let conteudoReadme = fs.readFileSync(template).toString();
conteudoReadme = conteudoReadme.replace("#PLACEHOLDER_SUMARIO#", sumario);
conteudoReadme = conteudoReadme.replace("#PLACEHOLDER_CATEGORIAS#", secoes);

fs.writeFileSync(readme, conteudoReadme);
