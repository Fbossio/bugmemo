import * as bcrypt from 'bcrypt';
import { EncryptPort } from '../../domain/ports/encrypt.port';

export class BcryptAdapter implements EncryptPort {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
