export interface ICreateExpense {
  name?: string;
  product_id?: string;
  quantity: number;
  amount: number;
}

export interface IUpdateExpense extends ICreateExpense {
  _id: string;
}

export interface IExpense {
  _id: string;
  name?: string;
  product_id?: {
    _id: string;
    name: string;
  };
  quantity: number;
  amount: number;
}

export interface IFetchExpense {
  expenses: IExpense[];
  page: string;
  totalCount: number;
  totalPages: number;
}
