import { Product, IProduct, ProductCategory } from '@/models/Product.model';
import { Types } from 'mongoose';

export interface CreateProductInput {
  name: string;
  price: number;
  image?: string;
  category: ProductCategory;
  description?: string;
  comboItems?: { productId: string; quantity: number }[];
  discount?: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  image?: string;
  category?: ProductCategory;
  description?: string;
  isActive?: boolean;
  comboItems?: { productId: string; quantity: number }[];
  discount?: number;
}

export class FoodService {
  async create(input: CreateProductInput): Promise<IProduct> {
    if (input.category === ProductCategory.COMBO && input.comboItems) {
      const comboItems = input.comboItems.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
      }));

      const product = new Product({
        ...input,
        comboItems,
      });

      return await product.save();
    }

    const product = new Product(input);
    return await product.save();
  }

  async getAll(filter: {
    category?: ProductCategory;
    isActive?: boolean;
  } = {}): Promise<IProduct[]> {
    const query: any = {};

    if (filter.category) {
      query.category = filter.category;
    }

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    return await Product.find(query)
      .populate('comboItems.productId', 'name price image')
      .sort({ category: 1, name: 1 });
  }

  async getById(id: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    return await Product.findById(id).populate(
      'comboItems.productId',
      'name price image'
    );
  }

  async update(
    id: string,
    input: UpdateProductInput
  ): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    const updateData: any = { ...input };

    if (input.comboItems) {
      updateData.comboItems = input.comboItems.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
      }));
    }

    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    const result = await Product.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }

  async getActiveProducts(): Promise<IProduct[]> {
    return this.getAll({ isActive: true });
  }

  async getProductsByCategory(
    category: ProductCategory
  ): Promise<IProduct[]> {
    return this.getAll({ category, isActive: true });
  }
}

export const foodService = new FoodService();
