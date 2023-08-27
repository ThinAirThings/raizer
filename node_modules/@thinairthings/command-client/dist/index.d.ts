export declare abstract class Command<C extends CommandClient> {
    wrappedFn: (client: C) => any;
    abstract returnType: any;
    constructor(wrappedFn: (client: C) => any);
}
export declare abstract class CommandClient {
    send: <T extends Command<any>>(command: T) => Promise<T["returnType"]>;
}
