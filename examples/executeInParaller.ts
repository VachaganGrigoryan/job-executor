import {Worker} from "worker_threads";
import {JobQueue, NazarParallelExecutor} from "../src";

function createWorker(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const worker = new Worker('examples/worker.ts', {
            workerData: {
                jobData: data,
            }
        });
        worker.on('message', (message) => {
            console.log('Worker Message:', message);
            resolve();
        });
        worker.on('error', (error) => {
            console.error('Worker Error:', error);
            reject(error);
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error('Worker Stopped with Exit Code:', code);
                reject(code);
            }
        });
    });
}


const jobQueue = new JobQueue<string>();
const executor = new NazarParallelExecutor<string>(jobQueue, createWorker);

executor.start();

// Example to add jobs to the queue for testing
async function addJobsToQueue() {
    for (let i = 0; i < 100; i++) {
        await jobQueue.enqueue(`Job ${i}`);
    }
    console.log('Added 100 jobs to the queue');
}

addJobsToQueue();
