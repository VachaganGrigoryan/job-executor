export interface Handler <T> {
    execute(): Promise<void>;
}

export interface HandlerConstructor <T> {
    new(data: T): Handler<T>
}
