export class Matricula {
  constructor({ id, idUsuario, idCurso, dataMatricula, dataConclusao = null }) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idCurso = idCurso;
    this.dataMatricula = dataMatricula;
    this.dataConclusao = dataConclusao;
  }

  toRow() {
    return {
      ID_Matricula: this.id, ID_Usuario: this.idUsuario, ID_Curso: this.idCurso,
      DataMatricula: this.dataMatricula, DataConclusao: this.dataConclusao
    };
  }
}
