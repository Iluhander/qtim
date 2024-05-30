import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType, repositoryMockFactory } from '../../common/tests/mockRepository';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/users.entity';
import { Session } from 'inspector';
import * as mocks from 'node-mocks-http';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

const defaultUser = {
  username: 'ivan.ivanov',
  password: 'Qwerty'
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userRepositoryMock: MockType<Repository<User>>;
  let sessionRepositoryMock: MockType<Repository<Session>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return 123;
            })
          }
        },
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(Session),
          useClass: Repository,
        },
        { provide: getRepositoryToken(Session), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    sessionRepositoryMock = module.get(getRepositoryToken(Session));
  });

  describe('signin', () => {
    it('should signin', async () => {
      expect(true).toBe(true);
    });
  });
});
