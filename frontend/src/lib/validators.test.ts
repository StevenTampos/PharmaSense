import { describe, expect, it } from "vitest";
import { isValidPhoneNumber } from "@/lib/validators";

const mockPhone = "555-0101";

describe("isValidPhoneNumber", () => {
  it("accepts mock account numbers with hyphens", () => {
    expect(isValidPhoneNumber(mockPhone)).toBe(true);
  });

  it("accepts common phone formatting and surrounding whitespace", () => {
    expect(isValidPhoneNumber(" (555) 010-1234 ")).toBe(true);
  });

  it("rejects empty values and values without digits", () => {
    expect(isValidPhoneNumber(" ")).toBe(false);
    expect(isValidPhoneNumber("()+.- ")).toBe(false);
  });

  it("rejects letters and unsupported characters", () => {
    expect(isValidPhoneNumber("555-ABCD")).toBe(false);
    expect(isValidPhoneNumber("555/0101")).toBe(false);
  });
});
