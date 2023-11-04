export interface IOrder {
  products: Array<{
    product: string;
    quantity: number;
    price: number;
    less?: Array<{
      product: string;
      name: string;
      quantity: number;
    }>;
  }>;
  cashier: string;
  totalAmount: number;
  paymentMethod: "Cash";
  orderType: "Dine-In" | "Take-Out" | "Grab" | "Food Panda";
  discount?: number;
}
