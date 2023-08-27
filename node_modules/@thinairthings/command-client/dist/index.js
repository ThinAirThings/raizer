"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandClient = exports.Command = void 0;
class Command {
    constructor(wrappedFn) {
        this.wrappedFn = wrappedFn;
    }
}
exports.Command = Command;
class CommandClient {
    constructor() {
        this.send = async (command) => {
            try {
                return command.wrappedFn(this);
            }
            catch (error) {
                throw error;
            }
        };
    }
}
exports.CommandClient = CommandClient;
