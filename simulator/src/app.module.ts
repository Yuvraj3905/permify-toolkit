import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PermifyModule } from '@permify-toolkit/nestjs';
import { clientOptionsFromEnv } from '@permify-toolkit/core';

@Module({
  imports: [
    PermifyModule.forRoot({
      client: clientOptionsFromEnv(),
      tenantResolver: () => 'tenant-1',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
