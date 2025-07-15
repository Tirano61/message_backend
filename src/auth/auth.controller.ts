import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create_user.dto';
import { LoginUserDto } from './dto/login_user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.loginUser( loginUserDto );
  }

  // @Get('private')
  // @UseGuards( AuthGuard() )
  // testingPrivateRout( 
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,
  //   @GetRawHeaders() rawHeaders: string[]
  // ){
  //   return {
  //     ok: true,
  //     user: user,
  //     userEmail,
  //     rawHeaders
  //   }
  // }

  // @Get('private2')
  // //@SetMetadata('roles', ['admin', 'super-user'])
  // @RoleProtected( ValidRoles.admin )
  // @UseGuards( AuthGuard(), UserRoleGuard )
  // private2(
  //   @GetUser() user: User,
  // ){
  //   return{
  //     ok: true,
  //     user
  //   }
  // }

  /// Uso de Decorator composition
  @Get('private3')
  @Auth( ValidRoles.admin ) /// El Auth se debe llamar en las rutas para comprobar el acceso, si es publica Auth()
  private3(
    @GetUser() user: User,
  ){
    return{
      ok: true,
      user
    }
  }

}
