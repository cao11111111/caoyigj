import { Controller, Post, Body } from '@nestjs/common';
import { KnowledgeCardService } from './knowledge-card.service';

interface GenerateDto {
  userContent: string;
}

@Controller('knowledge-card')
export class KnowledgeCardController {
  constructor(private readonly knowledgeCardService: KnowledgeCardService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateDto) {
    return this.knowledgeCardService.generate(dto.userContent);
  }
}
