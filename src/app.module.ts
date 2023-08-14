import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './Auth/auth.module';
import { RolesGuard } from './Auth/admin/admin.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { AuthMiddleware } from './Auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'server',
      password: '123456',
      database: 'lsbu',
      entities: [User, Task],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard, JwtService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        // Especifique as rotas do PublicController que você deseja excluir da verificação
        { path: '/auth', method: RequestMethod.ALL },
        // Adicione mais objetos { path, method } se necessário
      )
      .forRoutes('*'); // Aplica o middleware a todas as rotas
  }
}