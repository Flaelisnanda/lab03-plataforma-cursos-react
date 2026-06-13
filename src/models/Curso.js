export class Curso {
  constructor({ id, titulo, descricao, idInstrutor, idCategoria, nivel, dataPublicacao, totalAulas = 0, totalHoras = 0 }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.idInstrutor = idInstrutor;
    this.idCategoria = idCategoria;
    this.nivel = nivel;
    this.dataPublicacao = dataPublicacao;
    this.totalAulas = totalAulas;
    this.totalHoras = totalHoras;
  }

  toRow() {
    return {
      ID_Curso: this.id, Titulo: this.titulo, Descricao: this.descricao,
      ID_Instrutor: this.idInstrutor, ID_Categoria: this.idCategoria,
      Nivel: this.nivel, DataPublicacao: this.dataPublicacao,
      TotalAulas: this.totalAulas, TotalHoras: this.totalHoras
    };
  }
}
