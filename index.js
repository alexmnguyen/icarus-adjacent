const Queue = require("bull");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/icarus-adjacent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const expectedMoveProcessor = require("./processors/expectedMove");

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

console.log("Icarus Adjacent");

const expectedMoveQueue = new Queue(
  "writes expected move and date",
  "redis://127.0.0.1:6379"
);

console.log("\nCleaning queues... ");
cleanQueue(expectedMoveQueue);

expectedMoveQueue.process("expectedMove", expectedMoveProcessor);

expectedMoveQueue.on("failed", function (job, err) {
  console.log("expected move error");
  console.log(err);
});

expectedMoveQueue.add("expectedMove");
