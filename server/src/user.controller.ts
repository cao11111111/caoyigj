import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { getSupabaseClient } from './storage/database/supabase-client';

interface ProfileDto {
  nickname: string;
  school: string;
  subject: string;
  token?: string;
}

interface WatchAdDto {
  token: string;
}

interface UseQuotaDto {
  token: string;
}

@Controller('user')
export class UserController {
  private getClient() {
    return getSupabaseClient();
  }

  @Post('profile')
  async saveProfile(@Body() body: ProfileDto) {
    console.log('保存用户信息:', body);
    const client = this.getClient();
    const token = body.token;
    
    if (!token) {
      return {
        code: 400,
        msg: '未登录',
        data: null,
      };
    }
    
    // 查找用户
    const { data: user, error: findError } = await client
      .from('users')
      .select('*')
      .eq('token', token)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    if (!user) {
      return {
        code: 400,
        msg: '用户不存在',
        data: null,
      };
    }
    
    // 更新用户信息
    const { error: updateError } = await client
      .from('users')
      .update({
        nickname: body.nickname,
        school: body.school,
        subject: body.subject,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('更新用户信息失败:', updateError);
      throw new Error(`更新失败: ${updateError.message}`);
    }
    
    return {
      code: 200,
      msg: '保存成功',
      data: {
        nickname: body.nickname,
        school: body.school,
        subject: body.subject,
      },
    };
  }

  @Get('info')
  async getUserInfo(@Headers('authorization') auth: string) {
    const client = this.getClient();
    const token = auth?.replace('Bearer ', '');
    
    if (!token) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }
    
    // 查找用户
    const { data: user, error: findError } = await client
      .from('users')
      .select('*')
      .eq('token', token)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    if (!user) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null,
      };
    }
    
    // 统计对话数量
    const { count: cardCount, error: cardError } = await client
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'knowledge_card');
    
    const { count: chatCount, error: chatError } = await client
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    return {
      code: 200,
      msg: 'success',
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname || user.username,
        school: user.school || '',
        subject: user.subject || '',
        avatar: user.avatar || '',
        name: user.nickname || user.username,
        totalCards: cardCount || 0,
        totalChats: chatCount || 0,
        quota: user.quota || 0,
      },
    };
  }

  @Get('quota')
  async getQuota(@Headers('authorization') auth: string) {
    const client = this.getClient();
    const token = auth?.replace('Bearer ', '');
    
    if (!token) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }
    
    // 查找用户
    const { data: user, error: findError } = await client
      .from('users')
      .select('quota')
      .eq('token', token)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    if (!user) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null,
      };
    }
    
    return {
      code: 200,
      msg: 'success',
      data: {
        quota: user.quota || 0,
      },
    };
  }

  @Post('watch-ad')
  async watchAd(@Body() body: WatchAdDto) {
    const client = this.getClient();
    const { token } = body;
    
    if (!token) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }
    
    // 查找用户
    const { data: user, error: findError } = await client
      .from('users')
      .select('quota')
      .eq('token', token)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    if (!user) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null,
      };
    }
    
    // 增加额度：看一个广告增加2次
    const currentQuota = user.quota || 0;
    const newQuota = currentQuota + 2;
    
    const { error: updateError } = await client
      .from('users')
      .update({ quota: newQuota })
      .eq('token', token);
    
    if (updateError) {
      console.error('更新额度失败:', updateError);
      throw new Error(`更新失败: ${updateError.message}`);
    }
    
    return {
      code: 200,
      msg: '观看成功，额度+2',
      data: {
        quota: newQuota,
      },
    };
  }

  @Post('use-quota')
  async useQuota(@Body() body: UseQuotaDto) {
    const client = this.getClient();
    const { token } = body;
    
    if (!token) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }
    
    // 查找用户
    const { data: user, error: findError } = await client
      .from('users')
      .select('quota')
      .eq('token', token)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    if (!user) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null,
      };
    }
    
    // 检查额度
    const currentQuota = user.quota || 0;
    if (currentQuota <= 0) {
      return {
        code: 400,
        msg: '额度不足，请观看广告',
        data: {
          quota: 0,
          enough: false,
        },
      };
    }
    
    // 扣减1次额度
    const newQuota = currentQuota - 1;
    
    const { error: updateError } = await client
      .from('users')
      .update({ quota: newQuota })
      .eq('token', token);
    
    if (updateError) {
      console.error('更新额度失败:', updateError);
      throw new Error(`更新失败: ${updateError.message}`);
    }
    
    return {
      code: 200,
      msg: '额度使用成功',
      data: {
        quota: newQuota,
        enough: newQuota > 0,
      },
    };
  }
}
