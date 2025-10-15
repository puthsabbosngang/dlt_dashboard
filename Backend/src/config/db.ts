import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const db = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "sb@DLT023jds",
  database: process.env.DB_NAME || "los_system",
  synchronize: false,
  logging: true,
  entities: [__dirname + "/../entities/*.ts"],
});
