import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersMongoAdapter } from './infra/adapters/user.mongo.adapter';
//import { UsersInMemoryAdapter } from './infra/adapters/user.in-memory.adapter';
import { UsersController } from './infra/controllers/users.controller';
import { Users, UsersSchema } from './infra/models/users.schema';
import { UsersService } from './use-cases/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UsersRepository',
      useClass: UsersMongoAdapter,
    },
  ],
})
export class UsersModule {}
