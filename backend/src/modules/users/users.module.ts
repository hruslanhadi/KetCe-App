import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, User } from '@/common/database/entities';
import { UserService } from '@/modules/users/services/user.service';
import { CustomerService } from '@/modules/users/services/customer.service';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { CustomerRepository } from '@/modules/users/repositories/customer.repository';
import { UserController } from '@/modules/auth/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, User])],
  providers: [UserService, CustomerService, UserRepository, CustomerRepository],
  controllers: [UserController],
  exports: [UserService, CustomerService, UserRepository, CustomerRepository],
})
export class UsersModule {}
