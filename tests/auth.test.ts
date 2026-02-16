import { hashPassword, verifyPassword } from "@/lib/auth";

describe("password hashing", () => {
  it("hashes and verifies password", async () => {
    const hash = await hashPassword("password123");
    await expect(verifyPassword("password123", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong", hash)).resolves.toBe(false);
  });
});
