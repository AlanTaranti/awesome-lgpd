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

      if (!item.conteudo) {
        return `- [${item.titulo}](${item.link}) - ${item.descricao}`;
      }

      const subItens = item.conteudo.map(item => `  - [${item.titulo}](${item.link}) - ${item.descricao}`).join("")

      return `- ${item.titulo}\n${subItens}`;
      
    })
    .join("");

  return `## ${categoria.titulo}\n\n${itens}`;
}).join('\n\n');

let conteudoReadme = fs.readFileSync(template).toString();
conteudoReadme = conteudoReadme.replace("- #PLACEHOLDER_SUMARIO#", sumario);
conteudoReadme = conteudoReadme.replace("#PLACEHOLDER_CATEGORIAS#", secoes);

fs.writeFileSync(readme, conteudoReadme);
