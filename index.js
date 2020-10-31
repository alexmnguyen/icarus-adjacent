const Queue = require("bull");
const daedalusProcessor = require("./processors/daedalus");

const cleanQueue = (queue) => {
    //TODO do we need await?
    queue.clean(0, "delayed");
    queue.clean(0, "wait");
    queue.clean(0, "active");
    queue.clean(0, "completed");
    queue.clean(0, "failed");

    let multi = queue.multi();
    multi.del(queue.toKey("repeat"));
    multi.exec();
};

module.exports = { cleanQueue };

console.log("Icarus Adjacent");

const expectedMoveQueue = new Queue(
    "writes expected move and date",
    "redis://127.0.0.1:6379"
);

console.log("\nCleaning queues... ");
cleanQueue(daedalusQueue);

expectedMoveQueue.process("daedalus", daedalusProcessor);

expectedMoveQueue.on("failed", function (job, err) {
    // TODO we should notify via SMS on any error
    console.log("icarus queue error");
    console.log(err);
});

module.exports = { daedalusQueue };