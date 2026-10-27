import { describe, expect, it } from "vitest";
import { isValidLoginIdentifier, isValidPhoneNumber } from "@/lib/validators";

const mockPhone = "555-0101";

describe("isValidLoginIdentifier", () => {
  it("accepts 'admin' as a valid login identifier", () => {
    expect(isValidLoginIdentifier("admin")).toBe(true);
    expect(isValidLoginIdentifier(" admin ")).toBe(true);
    expect(isValidLoginIdentifier("ADMIN")).toBe(true);
  });

  it("accepts valid email addresses", () => {
    expect(isValidLoginIdentifier("admin@pharmasense.local")).toBe(true);
    expect(isValidLoginIdentifier("user@example.com")).toBe(true);
  });

  it("rejects non-email strings other than 'admin'", () => {
    expect(isValidLoginIdentifier("pharmacist")).toBe(false);
    expect(isValidLoginIdentifier("not-an-email")).toBe(false);
    expect(isValidLoginIdentifier("")).toBe(false);
  });
});

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
