import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
  ) {}

  async create(userid: string, createParkingDto: CreateParkingDto) {
    const { slot, day, hour } = createParkingDto;
    const count = await this.parkingRepository.count({
      where: { slot, day, hour },
    });
    if (count) {
      throw new ForbiddenException('Spot occupied, please select another spot');
    }
    const parking = new Parking();
    parking.userid = userid;
    parking.slot = slot;
    parking.day = day;
    parking.hour = hour;
    const newParking = await this.parkingRepository.save(parking);

    return newParking;
  }

  async findAllToday(day: Date) {
    return this.parkingRepository.find({ where: { day } });
  }

  findMyTickets(id: string, day: Date) {
    return this.parkingRepository.find({ where: { userid: id, day } });
  }

  async remove(ticketParkid: string): Promise<void> {
    try {
      const parkingTicket = await this.parkingRepository.findOne({
        where: { ticketParkid },
      });
      if (!parkingTicket) {
        throw new NotFoundException('Packing Ticket not found');
      }
      parkingTicket.deletedAt = new Date();
      await this.parkingRepository.save(parkingTicket);
    } catch (error) {
      return error;
    }
  }
}
