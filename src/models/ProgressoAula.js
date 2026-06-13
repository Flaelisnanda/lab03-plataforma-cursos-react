export class ProgressoAula {
  constructor({ idUsuario, idAula, dataConclusao, status }) {
    this.idUsuario = idUsuario;
    this.idAula = idAula;
    this.dataConclusao = dataConclusao;
    this.status = status;
  }

  toRow() {
    return { ID_Usuario: this.idUsuario, ID_Aula: this.idAula, DataConclusao: this.dataConclusao, Status: this.status };
  }
}
