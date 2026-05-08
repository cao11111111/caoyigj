import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@ApiTags('对话')
@Controller('conversations')
export class ConversationController {
  private getClient() {
    return getSupabaseClient();
  }

  // 获取用户ID
  private async getUserId(token: string): Promise<number | null> {
    const client = this.getClient();
    const { data: user, error } = await client
      .from('users')
      .select('id')
      .eq('token', token)
      .maybeSingle();
    
    if (error || !user) {
      return null;
    }
    return user.id;
  }

  @Post('save')
  @ApiOperation({ summary: '保存对话' })
  async saveConversation(
    @Body() body: { type: string; title: string; preview?: string; imageUrl?: string; token?: string },
    @Headers('authorization') auth: string
  ) {
    console.log('保存对话:', body);
    const client = this.getClient();
    const token = body.token || auth?.replace('Bearer ', '');
    
    const userId = await this.getUserId(token || '');
    
    if (!userId) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }
    
    const { data: conversation, error } = await client
      .from('conversations')
      .insert({
        user_id: userId,
        type: body.type || 'chat',
        title: body.title,
        preview: body.preview || '',
        image_url: body.imageUrl || '',
      })
      .select()
      .single();
    
    if (error) {
      console.error('保存对话失败:', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    return {
      code: 200,
      msg: 'success',
      data: conversation,
    };
  }

  @Get('recent')
  @ApiOperation({ summary: '获取最近对话' })
  async getRecentConversations(
    @Query('limit') limit: string = '5',
    @Headers('authorization') auth: string
  ) {
    const client = this.getClient();
    const token = auth?.replace('Bearer ', '');
    
    const userId = await this.getUserId(token || '');
    
    if (!userId) {
      return {
        code: 401,
        msg: '未登录',
        data: [],
      };
    }
    
    const { data: conversations, error } = await client
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit) || 5);
    
    if (error) {
      console.error('查询最近对话失败:', error);
      throw new Error(`查询失败: ${error.message}`);
    }
    
    // 转换为前端期望的格式
    const result = (conversations || []).map((c: any) => ({
      id: c.id,
      type: c.type,
      title: c.title,
      preview: c.preview,
      imageUrl: c.image_url,
      time: c.created_at,
    }));
    
    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }

  @Get('history')
  @ApiOperation({ summary: '获取历史记录' })
  async getHistory(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Headers('authorization') auth: string
  ) {
    const client = this.getClient();
    const token = auth?.replace('Bearer ', '');
    
    const userId = await this.getUserId(token || '');
    
    if (!userId) {
      return {
        code: 401,
        msg: '未登录',
        data: { list: [], total: 0, page: 1, pageSize: 10 },
      };
    }
    
    const p = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const start = (p - 1) * size;
    
    // 获取总数
    const { count, error: countError } = await client
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) {
      console.error('统计失败:', countError);
    }
    
    // 获取分页数据
    const { data: conversations, error } = await client
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + size - 1);
    
    if (error) {
      console.error('查询历史失败:', error);
      throw new Error(`查询失败: ${error.message}`);
    }
    
    const list = (conversations || []).map((c: any) => ({
      id: c.id,
      type: c.type,
      title: c.title,
      preview: c.preview,
      imageUrl: c.image_url,
      time: c.created_at,
    }));
    
    return {
      code: 200,
      msg: 'success',
      data: {
        list,
        total: count || 0,
        page: p,
        pageSize: size,
      },
    };
  }

  @Get('stats')
  @ApiOperation({ summary: '获取统计数据' })
  async getStats(@Headers('authorization') auth: string) {
    const client = this.getClient();
    const token = auth?.replace('Bearer ', '');
    
    const userId = await this.getUserId(token || '');
    
    if (!userId) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }
    
    // 统计总数
    const { count: totalCount, error: totalError } = await client
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    // 统计知识卡片
    const { count: cardCount, error: cardError } = await client
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('type', 'knowledge_card');
    
    // 统计本月
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count: monthCount, error: monthError } = await client
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());
    
    return {
      code: 200,
      msg: 'success',
      data: {
        totalConversations: totalCount || 0,
        totalCards: cardCount || 0,
        thisMonth: monthCount || 0,
        favoriteCount: 0,
      },
    };
  }
}
