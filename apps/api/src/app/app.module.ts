import { Module } from '@nestjs/common';
import { MemeModule } from './meme/meme.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MemeModule,
    ThrottlerModule.forRoot({
      ttl: 60 * 5,
      limit: 3,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'sigma-memer'),
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
