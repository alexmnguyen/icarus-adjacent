const ExpectedMove = require("../models/ExpectedMove");

/**
 * gets em
 */
const helpers = require("../helpers");
module.exports = async function () {
  const em = await helpers.getExpectedMove();
  const expectedMove = new ExpectedMove({ date: new Date(), em });
  expectedMove.save();
  console.log(em);
};
