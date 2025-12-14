import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateOAuthLogin', () => {
    const mockProfile = {
      providerId: 'google_123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/photo.jpg',
      provider: 'google',
    };

    it('should return existing user and generate token', async () => {
      const existingUser = {
        id: '1',
        email: mockProfile.email,
        name: mockProfile.name,
        picture: mockProfile.picture,
        provider: mockProfile.provider,
        providerId: mockProfile.providerId,
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockJwtService.sign.mockReturnValue('mock_token');

      const result = await service.validateOAuthLogin(mockProfile);

      expect(result.user).toEqual(existingUser);
      expect(result.token).toBe('mock_token');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { providerId: mockProfile.providerId },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: existingUser.email,
        sub: existingUser.id,
        name: existingUser.name,
      });
    });

    it('should create new user if not exists', async () => {
      const newUser = {
        id: '2',
        email: mockProfile.email,
        name: mockProfile.name,
        picture: mockProfile.picture,
        provider: mockProfile.provider,
        providerId: mockProfile.providerId,
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);
      mockJwtService.sign.mockReturnValue('new_token');

      const result = await service.validateOAuthLogin(mockProfile);

      expect(result.user).toEqual(newUser);
      expect(result.token).toBe('new_token');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: mockProfile.email,
        name: mockProfile.name,
        picture: mockProfile.picture,
        provider: mockProfile.provider,
        providerId: mockProfile.providerId,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        picture: null,
        provider: 'google',
        providerId: 'google_123',
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserById('999');

      expect(result).toBeNull();
    });
  });
});
