const generateUniqueId = require("../../src/utils/generateUniqueId");

describe("Generate Unique ID", () => {
  it("should generate an ID with length 8", () => {
    let id = generateUniqueId();
    expect(id).toHaveLength(8);
  });
});
