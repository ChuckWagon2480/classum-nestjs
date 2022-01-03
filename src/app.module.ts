import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SpaceModule } from './space/space.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'classum1234',
      database: 'classum',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    SpaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
