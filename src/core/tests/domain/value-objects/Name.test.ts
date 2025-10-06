import { Name } from '../../../domain/value-objects/Name';

describe('Name Value Object', () => {
  it('should create a valid name', () => {
    const name = Name.create('Valid Name');
    expect(name).toBeInstanceOf(Name);
    expect(name.value).toBe('Valid Name');
  });

  it('should throw an error for an invalid name', () => {
    expect(() => Name.create('')).toThrow('Invalid name');
  });
});
