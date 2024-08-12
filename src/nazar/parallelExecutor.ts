import {JobQueue} from "./queue";

const THREAD_COUNT = 20;

export class NazarParallelExecutor<T> {
    private jobQueue: JobQueue<T>;
    private readonly createWorker: (data: T) => Promise<void>;
    private readonly MAX_CONCURRENT_JOBS = THREAD_COUNT;
    private activeJobs: Set<Promise<void>>;

    constructor(jobQueue: JobQueue<T>, createWorker: (data: T) => Promise<void>) {
        this.jobQueue = jobQueue;
        this.createWorker = createWorker;
        this.activeJobs = new Set();
    }

    async start(): Promise<void> {
        while (true) {
            console.log('Active Jobs:', this.activeJobs);
            if (this.activeJobs.size < this.MAX_CONCURRENT_JOBS) {
                console.log('Checking for new jobs...');
                const jobData = await this.jobQueue.dequeue();
                if (jobData) {
                    const jobPromise = this.createWorker(jobData);

                    this.activeJobs.add(jobPromise);
                    jobPromise.finally(() => {
                        this.activeJobs.delete(jobPromise);
                    });
                } else {
                    await this.delay(1000); // small delay to prevent tight loop
                }
            } else {
                await this.delay(1000*5); // small delay to prevent tight loop
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}