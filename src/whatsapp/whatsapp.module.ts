import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { HttpModule } from '@nestjs/axios'; // Assuming @nestjs/axios is available

@Module({
  imports: [HttpModule],
  providers: [WhatsappService],
  exports: [WhatsappService], // Export so other modules (e.g., OrderModule) can use it
})
export class WhatsappModule {}
