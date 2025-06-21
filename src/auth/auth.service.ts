import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { throwError } from 'rxjs';


@Injectable()
export class AuthService {
  /// Inyectado el repositorio de la tabla de usuarios
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create( createUserDto );

      await this.userRepository.save( user );

      return user;
      
    } catch (error) {
      this.handleDBError(error);
    }
  }
  
  private handleDBError(error: any): never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

}
