export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "Cashier" | "Manager";
}
