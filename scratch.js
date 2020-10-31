const helpers = require("./helpers");

(async function () {
  const em = await helpers.getExpectedMove();

  console.log("expected move:", em);
})();
