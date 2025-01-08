import { GeneralUtils } from "../general.utils"; 

describe("GeneralUtils", () => {
  describe("generateUniqueIdentifier", () => {
    it("should generate a string that includes the provided prefix", () => {
      const prefix = "TEST";
      const result = GeneralUtils.generateUniqueIdentifier(prefix);

      expect(result.startsWith(prefix)).toBe(true);

      expect(result).toContain(`${prefix}-`);
    });

    it("should generate different identifiers for each call", () => {
      const prefix = "CALL";
      const id1 = GeneralUtils.generateUniqueIdentifier(prefix);
      const id2 = GeneralUtils.generateUniqueIdentifier(prefix);

      expect(id1).not.toEqual(id2);
    });
  });

  describe("calculatePriceWithTax", () => {
    it("should calculate price with default TVA rate (20%)", () => {
      const priceHT = 100;
      const result = GeneralUtils.calculatePriceWithTax(priceHT);
      expect(result).toBe(120.0);
    });

    it("should calculate price with a custom TVA rate", () => {
      const priceHT = 200;
      const customRate = 10;
      const result = GeneralUtils.calculatePriceWithTax(priceHT, customRate);
      expect(result).toBe(220.0);
    });

    it("should throw an error if priceHT is negative", () => {
      const negativePrice = -50;
      expect(() =>
        GeneralUtils.calculatePriceWithTax(negativePrice)
      ).toThrowError("Price HT must be a positive value.");
    });

    it("should round the result to two decimals", () => {
      const priceHT = 100.1234;
      const result = GeneralUtils.calculatePriceWithTax(priceHT);
      expect(result).toBe(120.15);
    });
  });
});
