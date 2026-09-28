import { describe, expect, it } from "vitest";

import { formatBytes, formatCount } from "./format";

describe("formatBytes", () => {
  it("scales to the largest unit below 1024", () => {
    expect(formatBytes(0, "en")).toBe("0 B");
    expect(formatBytes(1536, "en")).toBe("1.50 KB");
    expect(formatBytes(2.36 * 1024 ** 3, "en")).toBe("2.36 GB");
    expect(formatBytes(480 * 1024 ** 2, "en")).toBe("480 MB");
  });
});

describe("formatCount", () => {
  it("groups thousands", () => {
    expect(formatCount(1284, "zh-Hant")).toBe("1,284");
  });
});
