import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { KnowledgeCardController } from './knowledge-card.controller';
import { KnowledgeCardService } from './knowledge-card.service';
import { ConversationController } from './conversation/conversation.controller';

@Module({
  controllers: [AuthController, UserController, KnowledgeCardController, ConversationController],
  providers: [KnowledgeCardService],
})
export class AppModule {}
