export interface EncryptPort {
  hashPassword(password: string): Promise<string>;
  checkPassword(password: string, hashedPassword: string): Promise<boolean>;
}
