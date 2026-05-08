import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { KnowledgeCardController } from './knowledge-card.controller';
import { ConversationController } from './conversation/conversation.controller';

@Module({
  controllers: [AuthController, KnowledgeCardController, ConversationController],
})
export class AppModule {}
