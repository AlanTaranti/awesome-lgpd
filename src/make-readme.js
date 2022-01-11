const fs = require("fs");
const path = require("path");

const dados = require("./data");

function gerarSecoes(data) {
  return data
    .map((categoria) => {
      if (categoria.softlink) {
        return `## [${categoria.titulo}](${categoria.softlink})\n\n${categoria.descricao}`;
      }

      const itens = categoria.conteudo
        .map((item) => {
          if (!item.conteudo) {
            return `- [${item.titulo}](${item.link}) - ${item.descricao}`;
          }

          const subItens = item.conteudo
            .map(
              (item) => `  - [${item.titulo}](${item.link}) - ${item.descricao}`
            )
            .join("");

          return `- ${item.titulo}\n${subItens}`;
        })
        .join("");

      return `## ${categoria.titulo}\n\n${itens}`;
    })
    .join("\n\n");
}

function gerarArquivo(data) {
  const metadados = data.metadados;
  const conteudo = data.conteudo;
  const dirpath = metadados.root
    ? path.join(__dirname, "..")
    : path.join(__dirname, "..", "modulos");
  const filename = metadados.nomeArquivo + ".md";
  const filepath = path.join(dirpath, `${filename}`);
  const template = path.join(__dirname, metadados.template);

  const secoes = gerarSecoes(conteudo);

  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
  }

  let conteudoReadme = fs.readFileSync(template).toString();
  conteudoReadme = conteudoReadme.replace("#PLACEHOLDER_CATEGORIAS#", secoes);

  fs.writeFileSync(filepath, conteudoReadme);
}

dados.forEach((dado) => gerarArquivo(dado));
