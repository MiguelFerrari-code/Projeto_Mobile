import { LogoutUser } from "../../../domain/use-cases/LogoutUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

describe("LogoutUser", () => {
  it("should call repository signOut", async () => {
    const mockUserRepository: jest.Mocked<IUserRepository> = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      loginUser: jest.fn(),
      signUpUser: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      updateUser: jest.fn(),
    };

    const logoutUser = new LogoutUser(mockUserRepository);
    await logoutUser.execute();

    expect(mockUserRepository.signOut).toHaveBeenCalledTimes(1);
  });
});
