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
    combo?: Array<{
      product: string;
    }>;
  }>;
  cashier: string;
  totalAmount: number;
  paymentMethod: "Cash" | "GCash";
  orderType: "Dine-In" | "Take-Out" | "Grab" | "Food Panda";
  discount?: number;
}
