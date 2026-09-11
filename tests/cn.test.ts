import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-text-primary", false && "hidden", "font-sans")).toBe(
      "text-text-primary font-sans",
    );
  });
});
