import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskCalendarDto } from './create-task-calendar.dto';

export class UpdateTaskCalendarDto extends PartialType(CreateTaskCalendarDto) {}
