import { describe, expect, it } from "vitest";
import { getAccountSearchText, upsertAccount } from "@/lib/accounts";
import type { Account } from "@/types/account";

const sampleAccounts: Account[] = [
  {
    id: "account-1",
    firstName: "Jordan",
    lastName: "Hayes",
    email: "jordan.hayes@example.com",
    phone: "555-0103",
    role: "cashier_pharmacist",
    status: "active",
  },
];

describe("account helpers", () => {
  it("searches the role label shown in the account table", () => {
    expect(getAccountSearchText(sampleAccounts[0])).toContain("cashier/pharmacist");
  });

  it("adds a new account to the list", () => {
    const newAccount: Account = { ...sampleAccounts[0], id: "account-2", email: "new@example.com" };

    expect(upsertAccount(sampleAccounts, newAccount)).toEqual([...sampleAccounts, newAccount]);
  });

  it("updates an existing account without duplicating it", () => {
    const updatedAccount: Account = { ...sampleAccounts[0], firstName: "Updated" };

    expect(upsertAccount(sampleAccounts, updatedAccount)).toEqual([updatedAccount]);
  });
});
