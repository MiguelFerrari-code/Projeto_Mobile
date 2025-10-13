import { DeleteUser } from "../../../domain/use-cases/DeleteUser";
import { MockUserRepository } from "../../../infra/repositories/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("DeleteUser", () => {
  it("should be able to delete a user", async () => {
    const userRepository = new MockUserRepository();
    const deleteUser = new DeleteUser(userRepository);

    const user = User.create(
      "1",
      Name.create("Test User"),
      Email.create("test@example.com"),
      Password.create("password123")
    );

    await userRepository.save(user);

    await expect(deleteUser.execute("1")).resolves.not.toThrow();
    const foundUser = await userRepository.findById("1");
    expect(foundUser).toBeNull();
  });
});
