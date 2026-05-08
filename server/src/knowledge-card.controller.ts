import { Controller, Post, Body, Get, Headers, Logger } from '@nestjs/common';
import { KnowledgeCardService } from './knowledge-card.service';
import { getSupabaseClient } from './storage/database/supabase-client';

interface GenerateDto {
  userContent: string;
  token?: string;
}

@Controller('knowledge-card')
export class KnowledgeCardController {
  private logger = new Logger(KnowledgeCardController.name);

  constructor(private readonly knowledgeCardService: KnowledgeCardService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateDto, @Headers('authorization') auth: string) {
    this.logger.log('Received request:', JSON.stringify(dto));
    
    const supabase = getSupabaseClient();
    
    // 从token获取用户ID
    let userId = 0;
    if (dto.token || auth) {
      const token = dto.token || auth.replace('Bearer ', '');
      const userResult = await supabase
        .from('users')
        .select('id')
        .eq('token', token)
        .single();
      if (userResult.data) {
        userId = userResult.data.id;
      }
    }

    // 生成图片
    const imageUrl = await this.knowledgeCardService.generate(dto.userContent || '');

    // 保存到数据库
    if (userId > 0) {
      const title = dto.userContent.length > 30 
        ? dto.userContent.substring(0, 30) + '...' 
        : dto.userContent;
      
      await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: title,
          type: 'knowledge-card',
          preview: dto.userContent,
          image_url: imageUrl
        });
      this.logger.log('对话已保存到数据库');
    }

    return {
      code: 200,
      msg: 'success',
      data: { imageUrl }
    };
  }

  @Get('test-db')
  async testDb() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .limit(5);
    
    return {
      code: 200,
      msg: 'success',
      data: { conversations: data, error }
    };
  }
}
