import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule,
    ],
    exports: [TypeOrmModule]
})
export class UserModule {
}