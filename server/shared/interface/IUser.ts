export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "Cashier" | "Manager";
  createdAt: string;
  updatedAt: string;
}
