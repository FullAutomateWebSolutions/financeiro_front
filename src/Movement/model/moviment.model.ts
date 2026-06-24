export interface User {
  codUsuario: number | undefined;
  nome: string;
  email: string;
  role: "ADMIN" | "USER";
  indAtivo: boolean;
}

export interface Category {
  codCategory: number | undefined; 
  descCategoria: string;
  indAtivo: boolean;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;
}

export interface Account {
  codConta: number | undefined;
  tipoConta: string;
  descConta: string;
  indAtivo: boolean;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;
}

export interface Card {
  codCartao: number | undefined;
  tipoCartao: string;
  descCartao: string;
  indAtivo: boolean;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;
}

export interface Status {
  codStatus: number | undefined;
  descStatus: string;
  descCompleta: string;
  indAtivo: boolean;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;
}

export interface PaymentMethod {
  codFormPag: number | undefined;
  tipoFormPag: string;
  descFormPag: string;
  indAtivo: boolean;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;
}


// ==========================================
// CLASSES MODELO
// ==========================================

export class User implements User {
  codUsuario: number | undefined;
  nome: string = "";
  email: string = "";
  role: "ADMIN" | "USER" = "USER";
  indAtivo: boolean = false;

  constructor(init?: Partial<User>) {
    if (init) Object.assign(this, init);
  }
}

export class Category implements Category {
  codCategoria: number | undefined;
  descCategoria: string = "";
  indAtivo: boolean = true;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;

  constructor(init?: Partial<Category>) {
    if (init) Object.assign(this, init);
  }
}

export class Account implements Account {
  codConta: number | undefined;
  tipoConta: string = "";
  descConta: string = "";
  indAtivo: boolean = true;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;

  constructor(init?: Partial<Account>) {
    if (init) Object.assign(this, init);
  }
}

export class Card implements Card {
  codCartao: number | undefined;
  tipoCartao: string = "";
  descCartao: string = "";
  indAtivo: boolean = true;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;

  constructor(init?: Partial<Card>) {
    if (init) Object.assign(this, init);
  }
}

export class Status implements Status {
  codStatus: number | undefined;
  descStatus: string = "";
  descCompleta: string = "";
  indAtivo: boolean = true;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;

  constructor(init?: Partial<Status>) {
    if (init) Object.assign(this, init);
  }
}

export class PaymentMethod implements PaymentMethod {
  codFormPag: number | undefined;
  tipoFormPag: string = "";
  descFormPag: string = "";
  indAtivo: boolean = true;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;

  constructor(init?: Partial<PaymentMethod>) {
    if (init) Object.assign(this, init);
  }
}


export class Movement {
  codMovimentacao?: string;
  dataMov: string = "";
  descMovimento: string = "";
  valorUnit: string = "0";
  porcJuros: string = "0";
  valorJuros: string = "0";
  tipoParcelamento: number = 1;
  qtdParcAtual: number = 1;
  qtdParcFinal: number = 1;
  qtdParcPendente: number = 0;
  valorTotalPendente: string = "0";
  dataFimMov: string = "";
  codFormPag?: number;
  codConta?: number;
  codStatus?: number;
  codCategoria?: number;
  codCartao?: number;
  indAtivo: boolean = true;
  dataCriacao?: string;
  dataAtualizacao?: string;
  dataIntegracao?: string | null = null;
  dataFechamento?: string | null = null;
  categoria?: Category;
  conta?: Account;
  cartao?: Card;
  status?: Status;
  formaPagamento?: PaymentMethod;

  toJSON() {
    return {
      codMovimentacao: this.codMovimentacao,
      dataMov: this.dataMov,
      descMovimento: this.descMovimento,
      valorUnit: this.valorUnit,
      porcJuros: this.porcJuros,
      valorJuros: this.valorJuros,
      tipoParcelamento: this.tipoParcelamento,
      qtdParcAtual: this.qtdParcAtual,
      qtdParcFinal: this.qtdParcFinal,
      qtdParcPendente: this.qtdParcPendente,
      valorTotalPendente: this.valorTotalPendente,
      dataFimMov: this.dataFimMov,
      codFormPag: this.codFormPag,
      codConta: this.codConta,
      codStatus: this.codStatus,
      codCategoria: this.codCategoria,
      codCartao: this.codCartao,
      indAtivo: this.indAtivo,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      dataIntegracao: this.dataIntegracao,
      dataFechamento: this.dataFechamento,
      categoria: this.categoria,
      conta: this.conta,
      cartao: this.cartao,
      status: this.status,
      formaPagamento: this.formaPagamento,
    };
  }
}

export type MovementType = InstanceType<typeof Movement>;

export interface MovementListResponse {
  content: Movement[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
}

export interface MovementFilter {
  codMovimentacao?: string;
  descMovimento?: string;
  codCategoria?: number;
  codConta?: number | undefined;
  page: number;
  size: number;
  sort?: string;
}

export interface MovementDelete {
  id: string | undefined; 
}

export interface MovementById {
  id: string | undefined;
}

export interface MovementResponse {
  timestamp: string;
  status: number;
  message: string;
  path: string;
}