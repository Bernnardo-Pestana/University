import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //criação de usuário:
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const encryptedPassword = await this.hashPassword(createUserDto.password);
      const user = this.usersRepository.create({
        ...createUserDto,
        encryptedPassword,
      });
      if (user.admin === undefined) {
        user.admin = false;
      }
      return this.usersRepository.save(user);
    } catch (error) {
      return error;
    }
  }
  //criptografa a senha do usuário:
  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      return error;
    }
  }
  //busca todos os usuários registrados:
  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      return error;
    }
  }
  //função para o login verificar se o email fornecido existe no banco, e caso exista retorná-lo
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      return error;
    }
  }
  //buscar usuário no banco de dados por id
  async findOne(id: string): Promise<User> {
    try {
      return this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      return error;
    }
  }
  //atualizar/modificar um usuário especificado por id
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const password = updateUserDto.password;
      delete updateUserDto.password;
      Object.assign(user, updateUserDto);
      if (!!password) {
        const encryptedPassword = await this.hashPassword(password);
        Object.assign(user, { encryptedPassword: encryptedPassword });
      }
      return this.usersRepository.save(user);
    } catch (error) {
      return error;
    }
  }
  //soft delete de um usuário
  async remove(id: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.deletedAt = new Date();
      await this.usersRepository.save(user);
    } catch (error) {
      return error;
    }
  }
  //remover o soft delete de um usuário
  async undelete(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id, deletedAt: Not(IsNull()) },
        withDeleted: true,
      });
      if (!user) {
        throw new NotFoundException('User not found or not soft-deleted');
      }
      user.deletedAt = null;
      return this.usersRepository.save(user);
    } catch (error) {
      return error;
    }
  }
}
