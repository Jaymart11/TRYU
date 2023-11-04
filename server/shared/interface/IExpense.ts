export interface IExpense extends Document {
  name?: string;
  product_id?: string;
  quantity: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}
