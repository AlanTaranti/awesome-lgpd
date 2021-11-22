const fs = require("fs");
const path = require("path");

const dados = require("./data");

function gerarSumario(data) {
  return data
    .map((categoria) => `- [${categoria.titulo}](#${categoria.slug})`)
    .join("\n");
}

function gerarSecoes(data) {
  return data.map((categoria) => {
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
}

function gerarArquivo(data) {
  const metadados = data.metadados;
  const conteudo = data.conteudo;
  const dirpath = metadados.root ? '..' : '../modulos';
  const filename = metadados.nomeArquivo + '.md';
  const filepath = path.join(dirpath, `${filename}`);
  const readme = path.join(__dirname, filepath);
  const template = path.join(__dirname, metadados.template);

  const sumario = gerarSumario(conteudo)

  const secoes = gerarSecoes(conteudo);

  let conteudoReadme = fs.readFileSync(template).toString();
  conteudoReadme = conteudoReadme.replace("- #PLACEHOLDER_SUMARIO#", sumario);
  conteudoReadme = conteudoReadme.replace("#PLACEHOLDER_CATEGORIAS#", secoes);

  fs.writeFileSync(readme, conteudoReadme);
}


dados.forEach(dado => gerarArquivo(dado));