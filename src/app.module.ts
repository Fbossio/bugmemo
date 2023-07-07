import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './frameworks/config/config.module';
import { MongoDataServicesModule } from './frameworks/data-services/mongo/mongo-data-services.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AppConfigModule, MongoDataServicesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
