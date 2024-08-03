import {Redis} from "ioredis";
import type {Queue} from "../interface";

export class JobQueueRedis <T> implements Queue <T> {
    private redis: Redis;
    private readonly parser: (job: string) => T = JSON.parse;
    private readonly stringifier: (job: T) => string = JSON.stringify;

    constructor(
        parser: (job: string) => T = JSON.parse,
        stringifier: (job: T) => string = JSON.stringify,
    ){
        this.redis = new Redis();
        this.parser = parser;
        this.stringifier = stringifier;
    }

    async enqueue(job: T): Promise<void> {
        await this.redis.lpush('jobQueue', this.stringifier(job));
    }

    async dequeue(): Promise<T | null> {
        const data = await this.redis.rpop('jobQueue');
        return data ? this.parser(data) : null;
    }

    async getQueueLength(): Promise<number> {
        return this.redis.llen('jobQueue');
    }
}