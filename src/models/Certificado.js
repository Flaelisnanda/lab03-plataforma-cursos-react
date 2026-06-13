export class Certificado {
  constructor({ id, idUsuario, idCurso, idTrilha = null, codigoVerificacao, dataEmissao }) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idCurso = idCurso;
    this.idTrilha = idTrilha;
    this.codigoVerificacao = codigoVerificacao;
    this.dataEmissao = dataEmissao;
  }

  toRow() {
    return {
      ID_Certificado: this.id, ID_Usuario: this.idUsuario, ID_Curso: this.idCurso,
      ID_Trilha: this.idTrilha, CodigoVerificacao: this.codigoVerificacao, DataEmissao: this.dataEmissao
    };
  }
}
