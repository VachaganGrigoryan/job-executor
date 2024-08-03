import type {Handler} from "../src";

export class JobHandlerExample<T> implements Handler<T> {
    private readonly data: T;

    constructor(data: T) {
        this.data = data;
    }

    async execute(): Promise<void> {
        console.log(`Executing Example ${this.data}...`);
        // Add your job logic here
        const timeout = Math.floor(Math.random() * 5000);

        await new Promise(resolve => setTimeout(resolve, timeout)); // Simulate async work
        console.log(`Example ${this.data} Completed`);
    }
}
// Compare this snippet from examples/handler.ts: