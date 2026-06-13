export class Avaliacao {
  constructor({ id, idUsuario, idCurso, nota, comentario = null, dataAvaliacao }) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idCurso = idCurso;
    this.nota = nota;
    this.comentario = comentario;
    this.dataAvaliacao = dataAvaliacao;
  }

  toRow() {
    return {
      ID_Avaliacao: this.id, ID_Usuario: this.idUsuario, ID_Curso: this.idCurso,
      Nota: this.nota, Comentario: this.comentario, DataAvaliacao: this.dataAvaliacao
    };
  }
}
