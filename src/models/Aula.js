export class Aula {
  constructor({ id, idModulo, titulo, tipoConteudo, urlConteudo, duracaoMinutos, ordem }) {
    this.id = id;
    this.idModulo = idModulo;
    this.titulo = titulo;
    this.tipoConteudo = tipoConteudo;
    this.urlConteudo = urlConteudo;
    this.duracaoMinutos = duracaoMinutos;
    this.ordem = ordem;
  }

  toRow() {
    return {
      ID_Aula: this.id, ID_Modulo: this.idModulo, Titulo: this.titulo,
      TipoConteudo: this.tipoConteudo, URL_Conteudo: this.urlConteudo,
      DuracaoMinutos: this.duracaoMinutos, Ordem: this.ordem
    };
  }
}
