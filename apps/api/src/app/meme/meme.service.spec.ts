import { Test, TestingModule } from '@nestjs/testing';
import { MemeService } from './meme.service';

describe('MemeService', () => {
  let service: MemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemeService],
    }).compile();

    service = module.get<MemeService>(MemeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
