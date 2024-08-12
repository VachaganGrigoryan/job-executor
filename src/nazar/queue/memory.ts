import type {Queue} from "../interface";

export class JobQueue <T> implements Queue <T> {
    private queue: T[] = [];
    private activeJobs = new Set<T>();

    enqueue(job: T): void {
        this.queue.push(job);
    }

    dequeue(): T | undefined {
        const job = this.queue.shift();
        if (job) {
            this.activeJobs.add(job);
        }
        return job;
    }

    delete(job: T): void {
        this.activeJobs.delete(job);
    }

    active(): Set<T> {
        return this.activeJobs;
    }

    activeCount(): number {
        return this.activeJobs.size;
    }

    getQueueLength(): number {
        return this.queue.length;
    }

    get ActiveJobs() {
        return this.activeJobs;
    }

    get Jobs() {
        return this.queue;
    }

    get AllJobs() {
        return this.queue.concat(Array.from(this.activeJobs));
    }
}