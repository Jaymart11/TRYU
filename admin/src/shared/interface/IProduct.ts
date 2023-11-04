export interface IProduct extends Document {
  name: string;
  product: IProductCategory[];
}

export interface IProductCategory {
  _id: string;
  code: string;
  name: string;
  price: number;
  quantity?: number;
  box: {
    _id: string;
    quantity: number;
  };
}

export interface IProductCreate {
  name: string;
  code: string;
  category: string | null;
  price: number;
  quantity?: number;
  box?: string;
}

export interface IProductUpdate {
  _id: string;
  name: string;
  code: string;
  category: string | null;
  price: number;
  quantity?: number;
  box?: string;
}
