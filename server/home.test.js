const { print_json, math_operations } = require("./home");

describe("server json js test", () => {
  it("should test json  ",  () => {
    expect( print_json()).toBe(true);
  });
});

describe("server math js test", () => {
  it("should test arithmetic", () => {
    expect(math_operations(2, 2, 2, 2)).toBe(10)
  });
});