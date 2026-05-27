import { ProductModel } from "../models/product.model.js";
import { CategoryModel } from "../models/category.model.js";
import { BrandModel } from "../models/brand.model.js";
import { OrderModel } from "../models/order.model.js";

export class AiTools {
  static async getProducts(query: any = {}) {
    try {
      // Basic filtering for AI
      const filter: any = { status: "active", deletedAt: null };
      if (query.category) filter.category = query.category;
      if (query.brand) filter.brand = query.brand;
      if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = query.minPrice;
        if (query.maxPrice) filter.price.$lte = query.maxPrice;
      }

      const products = await ProductModel.find(filter)
        .limit(10)
        .select("name price description discount stock colors items images");
      return JSON.stringify(products);
    } catch (error: any) {
      return `Error fetching products: ${error.message}`;
    }
  }

  static async getCategories() {
    try {
      const categories = await CategoryModel.find({ status: "active" }).select(
        "name description",
      );
      return JSON.stringify(categories);
    } catch (error: any) {
      return `Error fetching categories: ${error.message}`;
    }
  }

  static async getBrands() {
    try {
      const brands = await BrandModel.find({ status: "active" }).select("name");
      return JSON.stringify(brands);
    } catch (error: any) {
      return `Error fetching brands: ${error.message}`;
    }
  }

  static async getUserOrders(userId: string) {
    if (!userId) return "User ID is required to fetch orders.";
    try {
      const orders = await OrderModel.find({ user: userId })
        .limit(5)
        .sort({ createdAt: -1 });
      return JSON.stringify(orders);
    } catch (error: any) {
      return `Error fetching orders: ${error.message}`;
    }
  }

  // Define tools for OpenAI
  static getOpenAiTools() {
    return [
      {
        type: "function",
        function: {
          name: "getProducts",
          description:
            "Search for products based on filters like category, brand, and price range.",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string", description: "Category ID or name" },
              brand: { type: "string", description: "Brand ID or name" },
              minPrice: { type: "number" },
              maxPrice: { type: "number" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getCategories",
          description: "Get all available product categories.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "getBrands",
          description: "Get all available brands.",
          parameters: { type: "object", properties: {} },
        },
      },
    ];
  }

  // Define tools for Gemini
  // NOTE: Gemini rejects empty `properties: {}` — only include parameters when needed
  static getGeminiTools() {
    return [
      {
        name: "getProducts",
        description:
          "Search for products based on filters like category, brand, and price range.",
        parameters: {
          type: "object",
          properties: {
            category: { type: "string", description: "Category name or ID" },
            brand: { type: "string", description: "Brand name or ID" },
            minPrice: { type: "number", description: "Minimum price filter" },
            maxPrice: { type: "number", description: "Maximum price filter" },
          },
        },
      },
      {
        name: "getCategories",
        description: "Get all available product categories.",
      },
      {
        name: "getBrands",
        description: "Get all available brands.",
      },
    ];
  }
}
