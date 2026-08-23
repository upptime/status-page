jest.mock("@octokit/rest", () => ({
  Octokit: jest.fn(),
}));

jest.mock(
  "../data/config.json",
  () => ({
    path: "/status",
    "status-website": {},
  }),
  { virtual: true }
);

const { getErrorPath, handleError } = require("./createOctokit");

describe("status-page GitHub API error routing", () => {
  beforeEach(() => {
    delete global.window;
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("routes secondary rate-limit errors to the rate-limit page", () => {
    expect(
      getErrorPath({
        status: 403,
        message: "You have exceeded a secondary rate limit. Please wait a few minutes before you try again.",
      })
    ).toBe("/rate-limit-exceeded");
  });

  it("routes header-only primary rate-limit errors to the rate-limit page", () => {
    expect(
      getErrorPath({
        status: 403,
        message: "API request failed",
        response: {
          headers: {
            "x-ratelimit-remaining": "0",
          },
        },
      })
    ).toBe("/rate-limit-exceeded");
  });

  it("keeps bad credentials on the generic error page", () => {
    expect(getErrorPath({ status: 401, message: "Bad credentials" })).toBe("/error");
  });

  it("uses the rate-limit route when redirecting", () => {
    global.window = { location: { href: "" } };

    handleError({
      status: 403,
      message: "You have exceeded a secondary rate limit.",
    });

    expect(global.window.location.href).toBe("/status/rate-limit-exceeded");
  });
});
