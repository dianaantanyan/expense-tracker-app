import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
    public constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,) {
    }

    /**
     * Registers a new user with hashed password and automatically adds predefined categories.
     *
     * @param createUserDto - DTO containing user registration data
     * @returns Promise<User>
     */
    public async register(createUserDto: RegisterUserDto): Promise<User> {
        const email = createUserDto.email.trim().toLowerCase();

        const existing = await this.userRepository.findOne({ where: { email } });
        if (existing) throw new ConflictException('Email already in use.');

        const hashedPassword = await this.hashPassword(createUserDto.password);

        const user = this.userRepository.create({
            fullName: createUserDto.fullName.trim(),
            email,
            phone: createUserDto.phone?.trim() || undefined,
            password: hashedPassword,
        });

        return await this.userRepository.save(user);
    }


    /**
     * Finds a user by email.
     *
     * @param email - User's email
     * @returns Promise<User | null>
     */
    public async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) throw new NotFoundException(`User with email '${email}' not found.`);
        
        return user;
    }

    /**
     * Hashes a plain password using bcrypt.
     *
     * @param password - The password to hash
     * @returns Promise<string>
     */
    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }
}