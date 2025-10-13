import { FindUser } from "../../../domain/use-cases/FindUser";
import { MockUserRepository } from "../../../infra/repositories/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("FindUser", () => {
  it("should be able to find a user by id", async () => {
    const userRepository = new MockUserRepository();
    const findUser = new FindUser(userRepository);

    const user = User.create(
      "1",
      Name.create("Test User"),
      Email.create("test@example.com"),
      Password.create("password123")
    );

    await userRepository.save(user);

    const foundUser = await findUser.execute("1");
    expect(foundUser).toBeInstanceOf(User);
    expect(foundUser?.id).toBe("1");
  });

  it("should return null if user is not found", async () => {
    const userRepository = new MockUserRepository();
    const findUser = new FindUser(userRepository);

    const foundUser = await findUser.execute("non-existent-id");
    expect(foundUser).toBeNull();
  });
});