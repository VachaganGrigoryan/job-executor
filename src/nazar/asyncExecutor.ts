import type {JobQueue} from "./queue";
import type {Handler, HandlerConstructor} from './interface';

export class NazarAsyncExecutor<T> {
    private jobQueue: JobQueue<T>;
    private readonly handler: HandlerConstructor<T>; // You should implement JobHandler interface
    private readonly MAX_CONCURRENT_JOBS = 10;

    constructor(jobQueue: JobQueue<T>, handler: HandlerConstructor<T>) {
        this.jobQueue = jobQueue;
        this.handler = handler;
    }

    async start(): Promise<void> {
        while (true) {
            console.log('Active Jobs:', this.jobQueue.active());
            if (this.jobQueue.activeCount() < this.MAX_CONCURRENT_JOBS) {
                console.log('Checking for new jobs...');
                const jobData = await this.jobQueue.dequeue();
                if (jobData) {
                    const job = this.createJobFromData(jobData);
                    const jobPromise = this.executeJob(job);

                    jobPromise.finally(() => {
                        this.jobQueue.delete(jobData);
                    });
                } else {
                    await this.delay(1000); // small delay to prevent tight loop
                }
            } else {
                await this.delay(1000 * 2); // small delay to prevent tight loop
            }
        }
    }

    private async executeJob(job: Handler<T>): Promise<void> {
        try {
            await job.execute();
        } catch (error) {
            console.error('Handler Execution Failed:', error);
        }
    }

    private createJobFromData(data: T): Handler<T> {
        // Deserialize job data to Handler instance
        return new this.handler(data);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
