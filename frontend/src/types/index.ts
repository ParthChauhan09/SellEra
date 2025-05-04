
export interface User {
  _id: string;
  name: string;
  email: string;
  cart: string[];
  orderHistory: Order[];
  review: Review[];
}

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  description: string;
  productList: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorName: string | Vendor;
  image?: any;
  review?: Review[];
  qty?: number;
}

export interface Review {
  _id: string;
  star: number;
  review: string;
  user: User | {
    _id: string;
    name: string;
    email: string;
  };
  product: Product | {
    _id: string;
    name: string;
  };
}

export interface Order {
  _id: string;
  orderProducts: Product[];
  customer: string | User;
  date: string;
  total: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  products: CartItem[];
  total: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User | Vendor;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  token?: string;
}
