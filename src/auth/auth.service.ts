import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger 
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){

  }

  async create(createAuthDto: CreateUserDto) {
    try {

      const {password, ...userData} = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password : bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      return user;

    } catch (error) {

      this.handleDBExceptions(error);
      
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
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
