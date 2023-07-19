import { Application } from "express";
import bodyParser from "body-parser";
import express from "express";
import { contactRouter } from "./routes/contact";
import dotenv from "dotenv";
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setController();
  }

  private setConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private setController() {
    this.app.use("/api", contactRouter);
  }
}

export default new App().app;
