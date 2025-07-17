import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Database;

  constructor() {
    this.connect();
  }

  async connect() {
    mongoose
      .connect(process.env.MONGO_CONNECTSTRING!, {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
      })
      .then(() => {
        console.log("Connected Mongodb Success");
      })
      .catch((e) => {
        // để lỗi rơi vào uncaughtException
        throw new Error("Connect mongodb failed", e.message);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
