const fs = require("fs");
const { join } = require("path");
const yaml = require("node-yaml");

const diretorioDados = join(__dirname, "../data");

const arquivos = fs.readdirSync(diretorioDados);
const filepaths = arquivos.map((arquivo) => join(diretorioDados, arquivo));
const dados = filepaths.map((arquivo) => yaml.readSync(arquivo));

const dadosTratados = dados.map((dado) => {
  dado.tipo = "categoria";

  dado.conteudo = dado.conteudo.map((conteudo) => {
    conteudo.categoria = dado.slug;
    conteudo.titulo = conteudo.titulo.trim();

    return conteudo;
  });

  return dado;
});

module.exports = dadosTratados;
