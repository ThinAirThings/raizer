


export abstract class Command<C extends CommandClient> {
    abstract returnType: any
    constructor(public wrappedFn: (client: C) => any) {}
}

export abstract class CommandClient {
    send = async <T extends Command<any>>(command: T): Promise<T['returnType']> => {
        try {
            return command.wrappedFn(this)
        } catch (error) {
            throw error
        }
    }
}