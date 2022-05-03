import { Module } from '@nestjs/common';
import { MemeService } from './meme.service';
import { MemeController } from './meme.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MemeController],
  providers: [MemeService],
  imports: [HttpModule],
})
export class MemeModule {}
