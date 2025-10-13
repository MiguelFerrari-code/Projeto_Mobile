import { UpdateUser } from "../../../domain/use-cases/UpdateUser";
import { MockUserRepository } from "../../../infra/repositories/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("UpdateUser", () => {
  it("should be able to update a user", async () => {
    const userRepository = new MockUserRepository();
    const updateUser = new UpdateUser(userRepository);

    const user = User.create(
      "1",
      Name.create("Test User"),
      Email.create("test@example.com"),
      Password.create("password123")
    );

    await userRepository.save(user);

    const updatedUser = User.create(
      "1",
      Name.create("Updated User"),
      Email.create("updated@example.com"),
      Password.create("newpassword123")
    );

    await expect(updateUser.execute(updatedUser)).resolves.not.toThrow();
    const foundUser = await userRepository.findById("1");
    expect(foundUser?.name.value).toBe("Updated User");
    expect(foundUser?.email.value).toBe("updated@example.com");
  });
});