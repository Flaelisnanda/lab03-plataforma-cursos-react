export class Categoria {
  constructor({ id, nome, descricao }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }

  toRow() {
    return { ID_Categoria: this.id, Nome: this.nome, Descricao: this.descricao };
  }
}
