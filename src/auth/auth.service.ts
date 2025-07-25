import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger,
  UnauthorizedException, 
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { 
  CreateUserDto, 
  LoginUserDto, 
  UpdateUserDto 
} from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try {

      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password : bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token : this.getJwtToken({ email : user.email })
      }

    } catch (error) {

      this.handleDBExceptions(error);
      
    }
  }

  async login(loginUserDto : LoginUserDto){
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where : {email},
      select : {
        email : true,
        password : true,
      }
      });

    if(!user) 
      throw new UnauthorizedException('Credentials are not valid (email)');

    if(!bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token : this.getJwtToken({ email : user.email })
    }
    //TODO : RETURN JWT
  }

  private getJwtToken(payload : JwtPayload){
    const token = this.jwtService.sign(payload);

    return token
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private handleDBExceptions(error: any) {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(`Error creating product: ${error.message}`, error.stack);

    throw new InternalServerErrorException(`Unexpected error, check server logs`);
  }
}
