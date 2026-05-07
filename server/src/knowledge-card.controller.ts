import { Controller, Post, Body, Logger } from '@nestjs/common';
import { KnowledgeCardService } from './knowledge-card.service';

interface GenerateDto {
  userContent: string;
}

@Controller('knowledge-card')
export class KnowledgeCardController {
  private logger = new Logger(KnowledgeCardController.name);

  constructor(private readonly knowledgeCardService: KnowledgeCardService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateDto) {
    this.logger.log('Received request:', JSON.stringify(dto));
    return this.knowledgeCardService.generate(dto.userContent || '');
  }
}
