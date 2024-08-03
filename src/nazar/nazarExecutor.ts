import type {JobQueue} from "./queue";
import type {Handler, HandlerConstructor} from './interface';

export class NazarExecutor <T> {
    private jobQueue: JobQueue<T>;
    private activeJobs: Set<Promise<void>>;
    private readonly handler: HandlerConstructor<T>; // You should implement JobHandler interface
    private readonly MAX_CONCURRENT_JOBS = 10;

    constructor(jobQueue: JobQueue<T>, handler: HandlerConstructor<T>) {
        this.jobQueue = jobQueue;
        this.handler = handler;
        this.activeJobs = new Set();
    }

    async start(): Promise<void> {
        while (true) {
            console.log('Active Jobs:', this.activeJobs);
            if (this.activeJobs.size < this.MAX_CONCURRENT_JOBS) {
                console.log('Checking for new jobs...');
                const jobData = await this.jobQueue.dequeue();
                if (jobData) {
                    const job = this.createJobFromData(jobData);
                    const jobPromise = this.executeJob(job);

                    this.activeJobs.add(jobPromise);
                    jobPromise.finally(() => {
                        this.activeJobs.delete(jobPromise);
                    });
                } else {
                    await this.delay(1000); // small delay to prevent tight loop
                }
            } else {
                await this.delay(1000); // small delay to prevent tight loop
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
