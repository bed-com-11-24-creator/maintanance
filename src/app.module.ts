import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'oracle',
      username: 'system',
      password: '123',
      connectString: 'localhost:1521/XEPDB1',
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    RequestsModule, 
  ],
})
export class AppModule {}