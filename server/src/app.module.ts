import { Module } from '@nestjs/common';
import { AuthController, UserController } from './auth.controller';
import { KnowledgeCardController } from './knowledge-card.controller';
import { KnowledgeCardService } from './knowledge-card.service';
import { ConversationController } from './conversation/conversation.controller';

@Module({
  controllers: [AuthController, UserController, KnowledgeCardController, ConversationController],
  providers: [KnowledgeCardService],
})
export class AppModule {}
