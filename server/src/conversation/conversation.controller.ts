import { Controller, Get, Post, Body, Query } from '@nestjs/common';

@Controller('conversation')
export class ConversationController {
  @Post('save')
  async saveConversation(
    @Body() body: { type: string; title: string; imageUrl?: string }
  ) {
    // 模拟保存对话，返回成功
    const conversation = {
      id: Date.now().toString(),
      type: body.type,
      title: body.title,
      imageUrl: body.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      code: 200,
      msg: 'success',
      data: conversation,
    };
  }

  @Get('recent')
  async getRecentConversations(@Query('limit') limit: string = '5') {
    // 模拟最近对话数据
    const recentConversations = [
      {
        id: '1',
        type: 'knowledge-card',
        title: '光合作用',
        imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test1.png',
        createdAt: '2026-05-08T10:00:00Z',
      },
      {
        id: '2',
        type: 'knowledge-card',
        title: '牛顿定律',
        imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test2.png',
        createdAt: '2026-05-07T15:30:00Z',
      },
      {
        id: '3',
        type: 'knowledge-card',
        title: '勾股定理',
        imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test3.png',
        createdAt: '2026-05-06T09:15:00Z',
      },
    ];
    return {
      code: 200,
      msg: 'success',
      data: recentConversations.slice(0, parseInt(limit) || 5),
    };
  }

  @Get('history')
  async getHistory(@Query('page') page: string = '1', @Query('pageSize') pageSize: string = '10') {
    // 模拟历史记录数据
    const allHistory = [
      { id: '1', title: '光合作用', type: 'knowledge-card', createdAt: '2026-05-08T10:00:00Z', imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test1.png' },
      { id: '2', title: '牛顿定律', type: 'knowledge-card', createdAt: '2026-05-07T15:30:00Z', imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test2.png' },
      { id: '3', title: '勾股定理', type: 'knowledge-card', createdAt: '2026-05-06T09:15:00Z', imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test3.png' },
      { id: '4', title: '化学反应', type: 'knowledge-card', createdAt: '2026-05-05T14:20:00Z', imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test4.png' },
      { id: '5', title: '电磁感应', type: 'knowledge-card', createdAt: '2026-05-04T11:45:00Z', imageUrl: 'https://storage.fonedis.cc/cdn/20260508/test5.png' },
    ];
    const p = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const start = (p - 1) * size;
    return {
      code: 200,
      msg: 'success',
      data: {
        list: allHistory.slice(start, start + size),
        total: allHistory.length,
        page: p,
        pageSize: size,
      },
    };
  }

  @Get('stats')
  async getStats() {
    return {
      code: 200,
      msg: 'success',
      data: {
        totalConversations: 42,
        totalCards: 38,
        thisMonth: 12,
        favoriteCount: 5,
      },
    };
  }
}
