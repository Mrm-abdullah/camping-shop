export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export interface ILoginUser {
    email : string;
    password : string;
}