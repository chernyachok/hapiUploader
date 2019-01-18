import { Server } from '../types';
import { Plugin } from "../types";

export default class InertPlugin implements Plugin {

  constructor(private server: Server) {}

  async register(): Promise<void> {
    try {
      return this.server.register(require("inert"));
    } catch (err) {
      console.log(`Error registering inert plugin: ${err}`);
    }
  }

  info() {
    return { name: "Inert", version: "1.0.0" };
  }
}
