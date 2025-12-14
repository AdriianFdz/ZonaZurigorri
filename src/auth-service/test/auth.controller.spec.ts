import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateOAuthLogin: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3000'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthRedirect', () => {
    it('should redirect with token on successful authentication', async () => {
      const mockReq: any = {
        user: { email: 'test@example.com', name: 'Test' },
      };
      const mockRes = {
        redirect: jest.fn(),
      } as any;

      mockAuthService.validateOAuthLogin.mockResolvedValue({ token: 'mock_jwt_token' });

      await controller.googleAuthRedirect(mockReq, mockRes);

      expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(mockReq.user);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback?token=mock_jwt_token'
      );
    });
  });

  describe('twitterAuthRedirect', () => {
    it('should redirect with token on successful authentication', async () => {
      const mockReq: any = {
        user: { email: 'test@example.com', name: 'Test' },
      };
      const mockRes = {
        redirect: jest.fn(),
      } as any;

      mockAuthService.validateOAuthLogin.mockResolvedValue({ token: 'twitter_jwt_token' });

      await controller.twitterAuthRedirect(mockReq, mockRes);

      expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(mockReq.user);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback?token=twitter_jwt_token'
      );
    });
  });

  describe('discordAuthRedirect', () => {
    it('should redirect with token on successful authentication', async () => {
      const mockReq: any = {
        user: { email: 'test@example.com', name: 'Test' },
      };
      const mockRes = {
        redirect: jest.fn(),
      } as any;

      mockAuthService.validateOAuthLogin.mockResolvedValue({ token: 'discord_jwt_token' });

      await controller.discordAuthRedirect(mockReq, mockRes);

      expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(mockReq.user);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback?token=discord_jwt_token'
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockReq = {
        user: {
          userId: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      const result = controller.getProfile(mockReq);

      expect(result).toEqual(mockReq.user);
    });
  });
});
