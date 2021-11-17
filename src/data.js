const fs = require("fs");
const process = require("process");
const { join } = require("path");
const yaml = require("node-yaml");

const diretorioDados = join(__dirname, "../data");

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

function tratarConteudo(conteudo) {
  let conteduloLocal = conteudo.map((dado) => {
    dado.tipo = "categoria";

    dado.conteudo = dado.conteudo.map((conteudo) => {
      conteudo.categoria = dado.slug;
      conteudo.titulo = conteudo.titulo.trim();

      return conteudo;
    });

    return dado;
  });

  conteduloLocal.sort((a, b) => a.ordem - b.ordem);

  return conteduloLocal;
}

function tratarModulo(listaArquivos) {
  const modulo = {
    metadados: {},
    conteudo: listaArquivos.map((arquivo) => yaml.readSync(arquivo)),
  };

  modulo.conteudo = tratarConteudo(modulo.conteudo);

  return modulo;
}

const dados = arquivosFilepaths.map((listaArquivos) =>
  tratarModulo(listaArquivos)
);

console.log(dados);
process.exit();


module.exports = dados;
