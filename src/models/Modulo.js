export class Modulo {
  constructor({ id, idCurso, titulo, ordem }) {
    this.id = id;
    this.idCurso = idCurso;
    this.titulo = titulo;
    this.ordem = ordem;
  }

  toRow() {
    return { ID_Modulo: this.id, ID_Curso: this.idCurso, Titulo: this.titulo, Ordem: this.ordem };
  }
}
