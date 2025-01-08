import { ProductService } from "../../domain/product.service";
import { ProductRepository, IProduct } from "../../data-access";
import { CategoryService, ProductFeatureService, ProductImageService, ProductDTO } from "../../domain";
import { GeneralUtils } from "../../../../utils";
import mongoose from "mongoose";
import BadRequestError from "../../../../config/error/bad.request.config";

describe("ProductService - createProduct", () => {
  let productService: ProductService;
  let categoryService: CategoryService;
  let featureService: ProductFeatureService;
  let imageService: ProductImageService;

  beforeEach(() => {
    productService = new ProductService();
    categoryService = new CategoryService();
    featureService = new ProductFeatureService();
    imageService = new ProductImageService();
  });

  it("should create a product successfully with priceVat calculated", async () => {
    // Créer une catégorie et une caractéristique fictives
    const category = await categoryService.createCategory({ name: "Test Category" });
    const feature = await featureService.createFeature({ name: "Test Feature" });

    const productData: ProductDTO = {
      name: "Test Product",
      description: "A test product description",
      priceEtx: 100,
      categoryIds: [category._id.toString()],
      featureIds: [feature._id.toString()],
      images: ["img1"],
      isActive: true,
    };

    const userId = "user123";

    const createdProduct = await productService.createProduct(productData, userId);

    // Vérifications
    expect(createdProduct).not.toBeNull();
    expect(createdProduct.priceVat).toBe(GeneralUtils.calculatePriceWithTax(100));
    expect(createdProduct.categoryIds).toContain(category._id.toString());
    expect(createdProduct.featureIds).toContain(feature._id.toString());
    expect(createdProduct.isActive).toBe(true);
  });

  it("should throw an error if category does not exist", async () => {
    const invalidCategoryId = new mongoose.Types.ObjectId();
    const productData: ProductDTO = {
      name: "Invalid Product",
      description: "A product with invalid category",
      priceEtx: 100,
      categoryIds: [invalidCategoryId.toString()],
      featureIds: [],
      images: ["img1"],
      isActive: true,
    };

    const userId = "user123";

    await expect(productService.createProduct(productData, userId)).rejects.toThrow(
      new BadRequestError({ message: "One or more category IDs are invalid." })
    );
  });

  it("should throw an error if feature does not exist", async () => {
    const category = await categoryService.createCategory({ name: "Test Category" });
    const invalidFeatureId = new mongoose.Types.ObjectId();

    const productData: ProductDTO = {
      name: "Product with invalid feature",
      description: "A product with invalid feature",
      priceEtx: 100,
      categoryIds: [category._id.toString()],
      featureIds: [invalidFeatureId.toString()],
      images: ["img1"],
      isActive: true,
    };

    const userId = "user123";

    await expect(productService.createProduct(productData, userId)).rejects.toThrow(
      new BadRequestError({ message: "One or more feature IDs are invalid." })
    );
  });

  it("should update a product with variants", async () => {
    const category = await categoryService.createCategory({ name: "Test Category" });
    const feature = await featureService.createFeature({ name: "Test Feature" });

    const productData: ProductDTO = {
      name: "Test Product",
      description: "A test product",
      priceEtx: 100,
      categoryIds: [category._id.toString()],
      featureIds: [feature._id.toString()],
      images: ["img1"],
      isActive: true,
    };

    const userId = "user123";
    const createdProduct = await productService.createProduct(productData, userId);

    const variantData = [
      {
        priceEtx: 110,
        productId: createdProduct._id.toString(),
        sizeId: "size123",
        colorId: "color123",
        material: "Cotton",
        weight: 200,
        isLimitedEdition: true,
      },
      {
        priceEtx: 120,
        productId: createdProduct._id.toString(),
        sizeId: "size124",
        colorId: "color124",
        material: "Polyester",
        weight: 250,
      },
    ];

    const updatedProduct = await productService.updateProductWithVariants(
      createdProduct._id.toString(),
      productData,
      variantData,
      userId,
    );

    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct.variants).toHaveLength(2);
    // expect(updatedProduct.variants[0].priceVat).toBe(GeneralUtils.calculatePriceWithTax(110));
    // expect(updatedProduct.variants[1].priceVat).toBe(GeneralUtils.calculatePriceWithTax(120));
  });

  it("should add images to a product", async () => {
    const category = await categoryService.createCategory({ name: "Test Category" });
    const productData: ProductDTO = {
      name: "Product with images",
      description: "A product with images",
      priceEtx: 100,
      categoryIds: [category._id.toString()],
      featureIds: [],
      images: [],
      isActive: true,
    };

    const userId = "user123";
    const createdProduct = await productService.createProduct(productData, userId);

    const imageData = [{ url: "http://example.com/img1.jpg" }, { url: "http://example.com/img2.jpg" }];
    const updatedProduct = await productService.addImagesToProduct(createdProduct._id.toString(), imageData);

    expect(updatedProduct.images).toHaveLength(2);
    // expect(updatedProduct.images[0]).toBeDefined();
    // expect(updatedProduct.images[1]).toBeDefined();
  });

  it("should throw an error if image not associated with the product", async () => {
    const category = await categoryService.createCategory({ name: "Test Category" });
    const productData: ProductDTO = {
      name: "Product with images",
      description: "A product with images",
      priceEtx: 100,
      categoryIds: [category._id.toString()],
      featureIds: [],
      images: [],
      isActive: true,
    };

    const userId = "user123";
    const createdProduct = await productService.createProduct(productData, userId);

    const imageId = new mongoose.Types.ObjectId().toString(); // Random imageId
    await expect(productService.removeImageFromProduct(createdProduct._id.toString(), imageId)).rejects.toThrow(
      new BadRequestError({ message: "Image not associated with this product." })
    );
  });
});