import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class WebhookEventDto {
  @IsString()
  @IsNotEmpty()
  id: string; // Event ID

  @IsString()
  @IsNotEmpty()
  type: string; // Event type (e.g., 'payment.succeeded', 'charge.failed')

  @IsObject()
  @IsNotEmpty()
  data: any; // Event data, structure depends on the provider and event type

  @IsString()
  @IsNotEmpty()
  object: string; // 'event'
}
