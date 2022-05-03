import { Module } from '@nestjs/common';
import { MemeModule } from './meme/meme.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MemeModule,
    ThrottlerModule.forRoot({
      ttl: 60 * 5,
      limit: 3,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
