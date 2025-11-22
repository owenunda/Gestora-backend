import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor() {}

  create(createUserDto: CreateUserDto): Promise<any> {
    // TODO: Implement persistence layer
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<any[]> {
    // TODO: Implement persistence layer
    throw new Error('Method not implemented.');
  }

  findOne(id: number): Promise<any> {
    // TODO: Implement persistence layer
    throw new Error('Method not implemented.');
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    // TODO: Implement persistence layer
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<any> {
    // TODO: Implement persistence layer
    throw new Error('Method not implemented.');
  }
}
