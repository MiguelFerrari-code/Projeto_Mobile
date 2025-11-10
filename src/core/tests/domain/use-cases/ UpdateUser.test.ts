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

    const result = await updateUser.execute("1", {
      name: "Updated User",
      email: "updated@example.com",
      password: "newpassword123",
    });

    expect(result.name.value).toBe("Updated User");
    expect(result.email.value).toBe("updated@example.com");
  });
});
