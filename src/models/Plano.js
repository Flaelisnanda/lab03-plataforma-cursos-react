export class Plano {
  constructor({ id, nome, descricao, preco, duracaoMeses }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.duracaoMeses = duracaoMeses;
  }

  toRow() {
    return { ID_Plano: this.id, Nome: this.nome, Descricao: this.descricao, Preco: this.preco, DuracaoMeses: this.duracaoMeses };
  }
}
