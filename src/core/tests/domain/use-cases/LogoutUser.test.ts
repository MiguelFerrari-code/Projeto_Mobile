import { LogoutUser } from "../../../domain/use-cases/LogoutUser";

describe("LogoutUser", () => {
  it("should be able to logout a user", async () => {
    const logoutUser = new LogoutUser();
    await expect(logoutUser.execute()).resolves.not.toThrow();
  });
});
