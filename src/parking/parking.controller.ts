import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  create(@Request() req, @Body() createParkingDto: CreateParkingDto) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'dr6XXiu71Zq4&gO7KejpHNabp',
    ) as JwtPayload;
    const userid = decodedToken.id;
    return this.parkingService.create(userid, createParkingDto);
  }

  @Get(':day')
  findAll(@Param('day') day: Date) {
    return this.parkingService.findAllToday(day);
  }

  @Get(':id/:day')
  findOne(@Param('id') id: string, @Param('day') day: Date) {
    return this.parkingService.findMyTickets(id, day);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingService.remove(id);
  }
}
