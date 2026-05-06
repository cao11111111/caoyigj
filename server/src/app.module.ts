import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { KnowledgeCardController } from '@/knowledge-card.controller';
import { KnowledgeCardService } from '@/knowledge-card.service';

@Module({
  imports: [],
  controllers: [AppController, KnowledgeCardController],
  providers: [AppService, KnowledgeCardService],
})
export class AppModule {}
