import { ProductService } from "../domain/product.service";
import { CategoryModel, CategoryRepository, ProductRepository } from "../data-access";
import { ProductDTO, ProductUpdateDTO, ProductFilterDto } from "../domain";
import { ProductVariantService } from "../domain/productVariant/productVariant.service";
import { GeneralUtils } from "../../../utils";
import BadRequestError from "../../../config/error/bad.request.config";

jest.mock("../data-access");
jest.mock("../domain/productVariant/productVariant.service");
jest.mock("../../../utils");
// jest.mock("../category.model");


describe("ProductService", () => {
  let productService: ProductService;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockProductVariantService: jest.Mocked<ProductVariantService>;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;
  let mockCategoryModel: jest.Mocked<typeof CategoryModel>;
  
  beforeEach(() => {
    mockProductRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    mockProductVariantService = new ProductVariantService() as jest.Mocked<ProductVariantService>;
    // mockCategoryRepository = new CategoryRepository() as jest.Mocked<CategoryRepository>;
    mockCategoryModel = CategoryModel as jest.Mocked<typeof CategoryModel>;

    productService = new ProductService();
    productService.setProductVariantService(mockProductVariantService);

    jest.clearAllMocks();
  });

  // it("should find categories by IDs", async () => {
  //   const categoryIds = ["cat1", "cat2"];
    
  //   const result = await mockCategoryRepository.findByIds(categoryIds);
    
  //   // You can now check that `exec()` was called and `find()` returned the expected result
  //   expect(CategoryModel.find).toHaveBeenCalledWith({
  //     _id: { $in: categoryIds }
  //   });
  //   expect(result).toEqual([]); // Adjust this as per your mock data
  // });

  describe("createProduct", () => {
    it("should create a product with priceVat calculated", async () => {
      const userId = "user123";
      const productData: ProductDTO = {
        name: "Test Product",
        description: "A test product",
        priceEtx: 100,
        categoryIds: ["cat1", "cat2"],
        featureIds: ["feat1"],
        images: ["img1"],
        isActive: true
      };
  
      const mockResponse = {
        ...productData,
        priceVat: GeneralUtils.calculatePriceWithTax(100),
        createdBy: userId,
      };
  
      // Mock the repository methods, not productRepository
      const mockFind = jest.fn().mockResolvedValue([{ _id: "cat1" }, { _id: "cat2" }]);
      const mockExec = jest.fn().mockResolvedValue([{ _id: "cat1" }, { _id: "cat2" }]);
      const mockRepository = {
        create: jest.fn().mockResolvedValue(mockResponse),
        findByIds: mockFind,
      };
  
      // Inject the mock into the service's repository property
      const productService = new ProductService(); // assuming you have an instance of ProductService
      // productService.repository = mockRepository; // Override the repository
  
      const result = await productService.createProduct(productData, userId);
  
      expect(result).toEqual(mockResponse);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...productData,
        priceVat: GeneralUtils.calculatePriceWithTax(100),
        createdBy: userId,
      });
      expect(mockFind).toHaveBeenCalledWith(["cat1", "cat2"]);
    });
  
    it("should throw error if dependencies validation fails", async () => {
      const userId = "user123";
      const productData: ProductDTO = {
        name: "Test Product",
        description: "A test product",
        priceEtx: 100,
        categoryIds: ["invalidCatId"],
        featureIds: ["feat1"],
        images: ["img1"],
        isActive: true
      };
  
      const mockValidateDependencies = jest.fn().mockRejectedValue(new BadRequestError({ message: "Invalid category IDs" }));
      const productService = new ProductService();
      productService.validateDependencies = mockValidateDependencies;
  
      await expect(productService.createProduct(productData, userId)).rejects.toThrow("Invalid category IDs");
    });
  });    

  describe("createProductWithVariants", () => {
    it("should create a product with variants and return the complete product", async () => {
      const userId = "user123";
      const productData: ProductDTO = {
        name: "Test Product with Variants",
        description: "A test product with variants",
        priceEtx: 100,
        categoryIds: ["cat1"],
        featureIds: ["feat1"],
        images: ["img1"],
        isActive: true
      };
      const variantsData = [
        { name: "Variant 1", priceEtx: 50 },
        { name: "Variant 2", priceEtx: 60 },
      ];

      const mockProductResponse = {
        ...productData,
        priceVat: GeneralUtils.calculatePriceWithTax(100),
        createdBy: userId,
        _id: "productId123",
      };

      const mockVariantResponse = {
        _id: "variantId123",
        productId: "productId123",
        priceVat: GeneralUtils.calculatePriceWithTax(50),
      };

      mockProductRepository.create.mockResolvedValue(mockProductResponse as any);
      mockProductVariantService.createProductVariant.mockResolvedValue(mockVariantResponse as any);

      const result = await productService.createProductWithVariants(productData, variantsData as any, userId);

      expect(result).toEqual(mockProductResponse);
      expect(mockProductRepository.create).toHaveBeenCalledWith({
        ...productData,
        priceVat: GeneralUtils.calculatePriceWithTax(100),
        createdBy: userId,
      });
      expect(mockProductVariantService.createProductVariant).toHaveBeenCalledTimes(2);
    });

    it("should throw error if ProductVariantService is not set", async () => {
      const userId = "user123";
      const productData: ProductDTO = {
        name: "Test Product with Variants",
        description: "A test product with variants",
        priceEtx: 100,
        categoryIds: ["cat1"],
        featureIds: ["feat1"],
        images: ["img1"],
        isActive: true
      };
      const variantsData = [
        { name: "Variant 1", priceEtx: 50 },
        { name: "Variant 2", priceEtx: 60 },
      ];

      productService.setProductVariantService(undefined as any);

      await expect(productService.createProductWithVariants(productData, variantsData as any, userId)).rejects.toThrow("ProductVariantService not set in ProductService");
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const productId = "productId123";
      const mockProduct = { _id: productId, name: "Test Product", priceVat: 120 };

      mockProductRepository.getProductWithVariantsAndInventory.mockResolvedValue(mockProduct as any);

      const result = await productService.getProductById(productId);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.getProductWithVariantsAndInventory).toHaveBeenCalledWith({ productId });
    });

    it("should throw error if product is not found", async () => {
      const productId = "nonexistentId";

      mockProductRepository.getProductWithVariantsAndInventory.mockResolvedValue(null);

      await expect(productService.getProductById(productId)).rejects.toThrow("Product not found.");
    });
  });

  describe("toggleProductActivation", () => {
    it("should toggle product activation status", async () => {
      const productId = "productId123";
      const isActive = true;
      const mockProduct = { _id: productId, isActive: !isActive };

      mockProductRepository.getById.mockResolvedValue(mockProduct as any);
      mockProductRepository.updateById.mockResolvedValue({ ...mockProduct as any, isActive });

      const result = await productService.toggleProductActivation(productId, isActive);

      expect(result.isActive).toBe(isActive);
      expect(mockProductRepository.updateById).toHaveBeenCalledWith(productId, { isActive });
    });

    it("should throw error if product is not found", async () => {
      const productId = "nonexistentId";

      mockProductRepository.getById.mockResolvedValue(null);

      await expect(productService.toggleProductActivation(productId, true)).rejects.toThrow("Product not found.");
    });
  });

  describe("updateProductById", () => {
    it("should update a product by ID", async () => {
      const productId = "productId123";
      const userId = "user123";
      const updates: ProductUpdateDTO = { name: "Updated Product" };

      const mockUpdatedProduct = { ...updates, _id: productId };

      mockProductRepository.updateById.mockResolvedValue(mockUpdatedProduct as any);

      const result = await productService.updateProductById(productId, updates, userId);

      expect(result).toEqual(mockUpdatedProduct);
      expect(mockProductRepository.updateById).toHaveBeenCalledWith(productId, { ...updates, updatedBy: userId });
    });
  });

  describe("deleteProductById", () => {
    it("should delete a product by ID", async () => {
      const productId = "productId123";

      const mockDeletedProduct = { _id: productId };

      mockProductRepository.deleteById.mockResolvedValue(mockDeletedProduct as any);

      const result = await productService.deleteProductById(productId);

      expect(result).toEqual(mockDeletedProduct);
      expect(mockProductRepository.deleteById).toHaveBeenCalledWith(productId);
    });

    it("should throw error if product is not found", async () => {
      const productId = "nonexistentId";

      mockProductRepository.deleteById.mockResolvedValue(null);

      await expect(productService.deleteProductById(productId)).rejects.toThrow("Product not found.");
    });
  });
});