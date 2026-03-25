export enum ProductCategory {
  FOOD = 'FOOD',
  DRINK = 'DRINK',
  COMBO = 'COMBO',
  OTHER = 'OTHER',
}

export interface IComboItem {
  productId: string;
  quantity: number;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category: ProductCategory;
  description?: string;
  isActive: boolean;
  comboItems?: IComboItem[];
  discount?: number;
}

export interface FoodCartItem {
  product: IProduct;
  quantity: number;
}
