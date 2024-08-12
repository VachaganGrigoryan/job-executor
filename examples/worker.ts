import {workerData, parentPort} from 'worker_threads';
import {JobHandlerExample} from "./handler.ts";

const { jobData, handlerName } = workerData;

(async () => {
    // const Handler = handlerRoutes[handlerName] || handlerRoutes.default;

    const job = new JobHandlerExample(jobData);
    await job.execute();
    // Add your job logic here
    // const timeout = Math.floor(Math.random() * 5000);
    //
    // await new Promise(resolve => setTimeout(resolve, timeout)); // Simulate async work
    // console.log(`Example ${job} Completed`);
    parentPort?.postMessage({
        message: `Example ${jobData} Completed`,
        success: true,
    });
})();
