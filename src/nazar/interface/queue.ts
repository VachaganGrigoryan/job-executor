
export interface Queue <T> {
    enqueue(job: T): void | Promise<void>;
    dequeue(): T | undefined | null | Promise<T | undefined | null>;
    getQueueLength(): number | Promise<number>;
}