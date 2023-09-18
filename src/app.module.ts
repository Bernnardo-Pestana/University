import {
  MiddlewareConsumer,
  Module,
  NestModule,
  
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
import { TaskCalendarModule } from './task-calendar/task-calendar.module';
import { TaskCalendar } from './task-calendar/entities/task-calendar.entity';
import { ParkingModule } from './parking/parking.module';
import { Parking } from './parking/entities/parking.entity';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Txai1990',
      database: 'lsbu',
      entities: [User, Task, TaskCalendar, Parking],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    TasksModule,
    TaskCalendarModule,
    ParkingModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard, JwtService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth', method: RequestMethod.ALL },
        { path: '/users/create', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
