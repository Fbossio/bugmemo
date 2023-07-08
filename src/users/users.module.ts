import { Module } from '@nestjs/common';
import { UsersController } from './infra/controllers/users.controller';
import { UsersService } from './use-cases/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
