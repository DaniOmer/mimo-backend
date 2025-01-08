import { Mongoose, connect } from "mongoose";
import { AppConfig } from "../app.config";

export class MongooseConfig {
  private static instance?: MongooseConfig;
  readonly mongoose: Mongoose;

  private constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
  }

  public static async get(): Promise<MongooseConfig> {
    if (!this.instance) {
      const mongoose = await this.initMongoose();
      this.instance = new MongooseConfig(mongoose);
    }
    return this.instance;
  }

  private static async initMongoose(): Promise<Mongoose> {
    const mongooseConnection = connect(AppConfig.mongoose.uri as string, {
      auth: {
        username: AppConfig.mongoose.options.auth.username,
        password: AppConfig.mongoose.options.auth.password,
      },
      dbName: AppConfig.mongoose.options.dbName,
    });
    return mongooseConnection;
  }
}
