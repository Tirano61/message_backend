import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import  * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login_user.dto';


@Injectable()
export class AuthService {
  /// Inyectado el repositorio de la tabla de usuarios
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
      });

      await this.userRepository.save( user );

      return user;
      
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto){
    
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if( !user )
      throw new UnauthorizedException('Credentials are not valid');

    if( !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid')

    return user;
  }

  private handleDBError(error: any): never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

}
