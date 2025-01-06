import { Request, Response, NextFunction } from "express";
import { ProductService, ProductVariantService } from "../domain/";
import { ApiResponse } from "../../../librairies/controllers/api.response";

export class ProductController {
  private productService: ProductService;
  private productVariantService: ProductVariantService;


  constructor() {
    this.productService = new ProductService();
    this.productVariantService = new ProductVariantService();

    this.productService.setProductVariantService(this.productVariantService);
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const newProduct = await this.productService.createProduct(
        req.body,
        currentUser
      );
      ApiResponse.success(res, "Product created successfully", newProduct, 201);
    } catch (error) {
      next(error);
    }
  }

  async createProductWithVariants(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user._id;
      const { product, variants } = req.body;

      const newProduct = await this.productService.createProductWithVariants(
        product,
        variants,
        currentUser
      );

      ApiResponse.success(
        res,
        "Product with variants created successfully",
        newProduct,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      ApiResponse.success(
        res,
        "Products retrieved successfully",
        products,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      ApiResponse.success(res, "Product retrieved successfully", product, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserId = req.user._id;
      const productId = req.params.id;
      const updates = req.body;
      const updatedProduct = await this.productService.updateProductById(
        productId,
        updates,
        currentUserId
      );
      ApiResponse.success(
        res,
        "Product updated successfully",
        updatedProduct,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.id;
      await this.productService.deleteProductById(productId);
      ApiResponse.success(res, "Product deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }

  async toggleProductActivation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updatedProduct = await this.productService.toggleProductActivation(
        id,
        isActive
      );
      ApiResponse.success(
        res,
        "Product activation status updated successfully",
        updatedProduct,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters = req.body;
      const products = await this.productService.searchProducts(filters);
      ApiResponse.success(
        res,
        "Products retrieved successfully",
        products,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async duplicateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const duplicatedProduct = await this.productService.duplicateProduct(id);
      ApiResponse.success(
        res,
        "Product duplicated successfully",
        duplicatedProduct,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductsByStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { isActive } = req.query;
      const products = await this.productService.getProductsByStatus(
        isActive === "true"
      );
      ApiResponse.success(
        res,
        "Products retrieved successfully",
        products,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async addImagesToProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;
      const images = req.body.images;
      const updatedProduct = await this.productService.addImagesToProduct(
        productId,
        images
      );
      ApiResponse.success(
        res,
        "Images added to product successfully",
        updatedProduct,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async removeImageFromProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId, imageId } = req.params;
      const updatedProduct = await this.productService.removeImageFromProduct(
        productId,
        imageId
      );
      ApiResponse.success(
        res,
        "Image removed from product successfully",
        updatedProduct,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const products = await this.productService.getProductsByCategory(
        categoryId
      );
      ApiResponse.success(
        res,
        "Products by category retrieved successfully",
        products,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductsByFeature(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { featureId } = req.params;
      const products = await this.productService.getProductsByFeature(
        featureId
      );
      ApiResponse.success(
        res,
        "Products by feature retrieved successfully",
        products,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductFilters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productFilters = await this.productService.getProductFilters();
      ApiResponse.success(
        res,
        "Product filters retrieved successfully",
        productFilters,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProductWithVariants(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: productId } = req.params;
      const { product, variants } = req.body;
      const currentUserId = req.user._id;
  
      const updatedProduct = await this.productService.updateProductWithVariants(
        productId,
        product,
        variants,
        currentUserId
      );
  
      ApiResponse.success(
        res,
        "Product and its variants updated successfully",
        updatedProduct,
        200
      );
    } catch (error) {
      next(error);
    }
  }
  
}
