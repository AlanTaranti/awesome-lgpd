const fs = require("fs");
const process = require("process");
const { join, parse } = require("path");
const yaml = require("node-yaml");

const diretorioDados = join(__dirname, "./data");

const capitulos = fs.readdirSync(diretorioDados);
const capitulosFilepaths = capitulos.map((capitulo) =>
  join(diretorioDados, capitulo)
);
const arquivosFilepaths = capitulosFilepaths.map((capituloFilepath) => {
  const arquivos = fs
    .readdirSync(capituloFilepath)
    .filter((arquivo) => arquivo.endsWith(".yaml"));
  return arquivos.map((arquivo) => join(capituloFilepath, arquivo));
});

function tratarConteudo(listaArquivos) {
  const conteudo = listaArquivos.map((arquivo) => yaml.readSync(arquivo));
  let conteduloLocal = conteudo.map((dado) => {
    dado.tipo = "categoria";

    if (dado.conteudo) {
      dado.conteudo = dado.conteudo.map((conteudo) => {
        conteudo.categoria = dado.slug;
        conteudo.titulo = conteudo.titulo.trim();

        return conteudo;
      });
    } else {
      dado.conteudo = [];
    }

    return dado;
  });

  conteduloLocal.sort((a, b) => a.ordem - b.ordem);

  return conteduloLocal;
}

function tratarMetadados(listaArquivos) {
  if (listaArquivos.length === 0) {
    return {};
  }
  const diretorioModulo = parse(listaArquivos[0]).dir;
  const indexFilename = "index.js";
  const indexFilepath = join(diretorioModulo, indexFilename);
  return require(indexFilepath);
}

function tratarModulo(listaArquivos) {
  return {
    metadados: tratarMetadados(listaArquivos),
    conteudo: tratarConteudo(listaArquivos),
  };
}

const dados = arquivosFilepaths.map((listaArquivos) =>
  tratarModulo(listaArquivos)
);

module.exports = dados;
