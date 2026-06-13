export class Trilha {
  constructor({ id, titulo, descricao, idCategoria }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.idCategoria = idCategoria;
  }

  toRow() {
    return { ID_Trilha: this.id, Titulo: this.titulo, Descricao: this.descricao, ID_Categoria: this.idCategoria };
  }
}

export class TrilhaCurso {
  constructor({ idTrilha, idCurso, ordem }) {
    this.idTrilha = idTrilha;
    this.idCurso = idCurso;
    this.ordem = ordem;
  }

  toRow() {
    return { ID_Trilha: this.idTrilha, ID_Curso: this.idCurso, Ordem: this.ordem };
  }
}
