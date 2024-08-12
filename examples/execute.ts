import {JobQueue, NazarAsyncExecutor} from "../src";
import {JobHandlerExample} from "./handler.ts";

const jobQueue = new JobQueue<string>();
const executor = new NazarAsyncExecutor<string>(jobQueue, JobHandlerExample);

executor.start();

// Example to add jobs to the queue for testing
async function addJobsToQueue() {
    for (let i = 0; i < 100; i++) {
        await jobQueue.enqueue(`Job ${i}`);
    }
    console.log('Added 100 jobs to the queue');
}

addJobsToQueue();
