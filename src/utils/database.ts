import mongoose, { ConnectOptions } from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from "../apps/auth/data-access/";
import { RoleModel } from "../apps/auth/data-access/role/role.model";
import { PreferenceModel } from "../apps/preference/data-access/preference.model";
import { AppConfig } from "../config/app.config";
import { SecurityUtils } from "../utils/security.utils";

export class DatabaseTestUtils {
  static async initDatabase(): Promise<void> {
    const testDbUri =
      process.env.TEST_DB_URI || "mongodb://localhost:27018/testdb";

    if (!testDbUri.includes("testdb")) {
      throw new Error(
        "Test database URI must include 'testdb' to avoid overwriting production data"
      );
    }

    await mongoose.connect(testDbUri, {
      dbName: "testdb",
      auth: {
        username: process.env.MONGODB_USERNAME || "mimo",
        password: process.env.MONGODB_PASSWORD || "mimo",
      },
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    const collections = mongoose.connection.collections;
    for (const collectionName in collections) {
      await collections[collectionName].deleteMany({});
    }
  }

  static async cleanupDatabase(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    for (const key in collections) {
      await collections[key].dropIndexes();
    }
  }

  static async closeDatabase(): Promise<void> {
    await mongoose.disconnect();
  }

  static async seedUsers(): Promise<void> {
    await UserModel.deleteMany({ email: /admin@example.com|user@example.com/ });

    const adminRole = await RoleModel.findOneAndUpdate(
      { name: "admin" },
      { name: "admin", permissions: [] },
      { upsert: true, new: true }
    );

    const userRole = await RoleModel.findOneAndUpdate(
      { name: "user" },
      { name: "user", permissions: [] },
      { upsert: true, new: true }
    );

    await UserModel.create({
      email: "admin@example.com",
      password: await bcrypt.hash("Azerty1234567!", 10),
      roles: [adminRole],
      isTermsOfSale: true,
      isVerified: true,
      firstName: "Admin",
      lastName: "User",
      authType: "basic",
    });

    // 3) On crée un rôle user

    // 4) On crée l’utilisateur user
    await UserModel.create({
      email: "user@example.com",
      password: await bcrypt.hash("Azerty1234567!", 10),
      roles: [userRole],
      isTermsOfSale: true,
      isVerified: true,
      firstName: "Regular",
      lastName: "User",
      authType: "basic",
    });
  }

  static async seedPreferences(): Promise<void> {
    // Supprimer les préférences existantes pour les utilisateurs spécifiés
    await UserPreferenceModel.deleteMany({
      user: {
        $in: await UserModel.find({
          email: /admin@example.com|user@example.com/,
        }).distinct("_id"),
      },
    });

    // Récupérer les utilisateurs admin et user
    const adminUser = await UserModel.findOne({ email: "admin@example.com" });
    const regularUser = await UserModel.findOne({ email: "user@example.com" });

    if (!adminUser || !regularUser) {
      throw new Error(
        "Admin or Regular user not found. Ensure users are seeded first."
      );
    }

    await PreferenceModel.create({
      user: adminUser._id,
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      marketingConsent: true,
      cookiesConsent: true,
      personalizedAds: false,
      language: "en",
      currency: "USD",
    });

    await PreferenceModel.create({
      user: regularUser._id,
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      marketingConsent: false,
      cookiesConsent: true,
      personalizedAds: true,
      language: "fr",
      currency: "EUR",
    });
  }

  /**
   * getAuthToken : on réutilise SecurityUtils.generateJWTToken
   * pour rester cohérent avec le code applicatif.
   */
  static async getAuthToken(email: string, password: string): Promise<string> {
    const user = await UserModel.findOne({ email })
      .populate("roles")
      .populate("permissions");

    if (!user) {
      throw new Error(`User with email=${email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const rolesForJWT = Array.isArray(user.roles)
      ? user.roles.map((r: any) => ({
          _id: r._id.toString(),
          name: r.name,
        }))
      : [];

    const permissionsForJWT = Array.isArray(user.permissions)
      ? user.permissions.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
        }))
      : [];

    return await SecurityUtils.generateJWTToken({
      _id: user._id.toString(),
      roles: rolesForJWT,
      permissions: permissionsForJWT,
    });
  }

  static async getUserId(email: string): Promise<string> {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");
    return user._id.toString();
  }

  /**
   * getAdminAuthToken : pour simplifier, on suppose que l'admin a
   * un mot de passe "Azerty1234567!" (cf. seedUsers).
   */
  static async getAdminAuthToken(): Promise<string> {
    return this.getAuthToken("admin@example.com", "Azerty1234567!");
  }
}
