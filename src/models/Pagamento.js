export class Pagamento {
  constructor({ id, idAssinatura, valorPago, dataPagamento, metodoPagamento, idTransacaoGateway }) {
    this.id = id;
    this.idAssinatura = idAssinatura;
    this.valorPago = valorPago;
    this.dataPagamento = dataPagamento;
    this.metodoPagamento = metodoPagamento;
    this.idTransacaoGateway = idTransacaoGateway;
  }

  toRow() {
    return {
      ID_Pagamento: this.id, ID_Assinatura: this.idAssinatura, ValorPago: this.valorPago,
      DataPagamento: this.dataPagamento, MetodoPagamento: this.metodoPagamento,
      Id_Transacao_Gateway: this.idTransacaoGateway
    };
  }
}
