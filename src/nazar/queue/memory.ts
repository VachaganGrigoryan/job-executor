import type {Queue} from "../interface";

export class  JobQueue <T> implements Queue <T> {
    private queue: T[] = [];

    enqueue(job: T): void {
        this.queue.push(job);
    }

    dequeue(): T | undefined {
        return this.queue.shift();
    }

    getQueueLength(): number {
        return this.queue.length;
    }
}