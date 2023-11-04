export interface IProductSchema extends Document {
  name: string;
  code: string;
  category: IProductCategory;
  box: string;
  active: boolean;
  quantity?: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCategory {
  _id: string;
  name: string;
}

export interface IProduct extends Document {
  name: string;
  code: string;
  category: string | { name: string };
  active: boolean;
  quantity?: number;
  price: number;
  box: string;
  createdAt: Date;
  updatedAt: Date;
}
