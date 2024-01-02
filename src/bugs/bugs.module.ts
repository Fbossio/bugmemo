import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bugs, BugsSchema } from '../users/infra/models/bugs.schema';
import { UsersModule } from '../users/users.module';
import { BugsMongoAdapter } from './infra/adapters/bug.mongo.adapter';
import { BugsController } from './infra/controllers/bugs.controller';
import { BugsService } from './use-cases/bugs.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Bugs.name, schema: BugsSchema }]),
  ],
  providers: [
    BugsService,
    {
      provide: 'BugsRepository',
      useClass: BugsMongoAdapter,
    },
  ],
  controllers: [BugsController],
})
export class BugsModule {}
