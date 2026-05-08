import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { KnowledgeCardController } from '@/knowledge-card.controller';
import { KnowledgeCardService } from '@/knowledge-card.service';
import { ConversationController } from '@/conversation/conversation.controller';

@Module({
  imports: [],
  controllers: [AppController, KnowledgeCardController, ConversationController],
  providers: [AppService, KnowledgeCardService],
})
export class AppModule {}
