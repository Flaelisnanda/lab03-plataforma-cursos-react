export class Assinatura {
  constructor({ id, idUsuario, idPlano, dataInicio, dataFim }) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idPlano = idPlano;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }

  toRow() {
    return { ID_Assinatura: this.id, ID_Usuario: this.idUsuario, ID_Plano: this.idPlano, DataInicio: this.dataInicio, DataFim: this.dataFim };
  }
}
