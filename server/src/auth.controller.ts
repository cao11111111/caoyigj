import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { getSupabaseClient } from './storage/database/supabase-client';

interface LoginDto {
  username: string;
  password: string;
}

interface WechatLoginDto {
  code: string;
}

interface VerifyDto {
  tempToken: string;
  verifyCode: string;
}

interface ProfileDto {
  nickname: string;
  school: string;
  subject: string;
}

interface WatchAdDto {
  token: string;
}

interface UseQuotaDto {
  token: string;
}

const VALID_VERIFY_CODE = '123456';

@Controller('auth')
export class AuthController {
  // 获取 Supabase 客户端
  private getClient() {
    return getSupabaseClient();
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    console.log('登录请求:', body);
    const client = this.getClient();
    
    // 查找用户
    const { data: existingUser, error: findError } = await client
      .from('users')
      .select('*')
      .eq('username', body.username)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    // 固定测试账号：111 / 123456
    if (body.username === '111' && body.password === '123456') {
      const token = `token_${Date.now()}`;
      
      if (existingUser) {
        // 更新 token
        await client
          .from('users')
          .update({ token })
          .eq('id', existingUser.id);
        
        return {
          code: 200,
          msg: '登录成功',
          data: {
            needVerify: false,
            token,
            user: {
              id: existingUser.id,
              username: existingUser.username,
              nickname: existingUser.nickname,
              school: existingUser.school,
              subject: existingUser.subject,
              avatar: existingUser.avatar,
              quota: existingUser.quota || 0,
            },
          },
        };
      } else {
        // 创建新用户，默认给10次额度
        const { data: newUser, error: insertError } = await client
          .from('users')
          .insert({
            username: body.username,
            password: body.password,
            token,
            nickname: '用户111',
            quota: 10, // 新用户默认10次额度
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('创建用户失败:', insertError);
          throw new Error(`创建用户失败: ${insertError.message}`);
        }
        
        return {
          code: 200,
          msg: '登录成功',
          data: {
            needVerify: false,
            token,
            user: {
              id: newUser.id,
              username: newUser.username,
              nickname: newUser.nickname,
              school: newUser.school,
              subject: newUser.subject,
              avatar: newUser.avatar,
              quota: newUser.quota,
            },
          },
        };
      }
    }
    
    // 演示模式：任意账号密码都能登录
    if (existingUser) {
      const token = `token_${Date.now()}`;
      await client
        .from('users')
        .update({ token })
        .eq('id', existingUser.id);
      
      return {
        code: 200,
        msg: '登录成功',
        data: {
          needVerify: false,
          token,
          user: {
            id: existingUser.id,
            username: existingUser.username,
            nickname: existingUser.nickname,
            school: existingUser.school,
            subject: existingUser.subject,
            avatar: existingUser.avatar,
            quota: existingUser.quota || 0,
          },
        },
      };
    }
    
    // 新用户需要验证
    const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建临时用户记录
    const { data: tempUser, error: tempError } = await client
      .from('users')
      .insert({
        username: body.username,
        password: body.password,
        token: tempToken,
        quota: 10, // 新用户默认10次额度
      })
      .select()
      .single();
    
    if (tempError) {
      console.error('创建临时用户失败:', tempError);
      throw new Error(`创建临时用户失败: ${tempError.message}`);
    }
    
    return {
      code: 200,
      msg: '需要验证',
      data: {
        needVerify: true,
        tempToken: tempUser.token,
        userId: tempUser.id,
      },
    };
  }

  @Post('wechat-login')
  async wechatLogin(@Body() body: WechatLoginDto) {
    console.log('微信登录请求, code:', body.code);
    const client = this.getClient();
    
    try {
      // 演示模式：使用 code 模拟 openid
      const openid = `mock_openid_${body.code}`;
      
      // 模拟判断是否为新用户（演示：code 长度 < 20 为新用户）
      const isNewUser = body.code.length < 20;
      
      if (isNewUser) {
        const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 创建临时微信用户
        const { data: tempUser, error: tempError } = await client
          .from('users')
          .insert({
            username: `wechat_${openid}`,
            token: tempToken,
            nickname: '微信用户',
            quota: 10, // 新用户默认10次额度
          })
          .select()
          .single();
        
        if (tempError) {
          console.error('创建微信用户失败:', tempError);
          throw new Error(`创建微信用户失败: ${tempError.message}`);
        }
        
        return {
          code: 200,
          msg: '需要验证',
          data: {
            needVerify: true,
            tempToken: tempUser.token,
            userId: tempUser.id,
          },
        };
      }
      
      // 老用户直接登录
      const token = `token_${Date.now()}_${openid}`;
      
      // 查找或创建微信用户
      const { data: existingWxUser, error: findError } = await client
        .from('users')
        .select('*')
        .eq('username', `wechat_${openid}`)
        .maybeSingle();
      
      if (findError) {
        console.error('查询微信用户失败:', findError);
      }
      
      if (existingWxUser) {
        await client
          .from('users')
          .update({ token })
          .eq('id', existingWxUser.id);
        
        return {
          code: 200,
          msg: '登录成功',
          data: {
            needVerify: false,
            token,
            user: {
              id: existingWxUser.id,
              username: existingWxUser.username,
              nickname: existingWxUser.nickname,
              school: existingWxUser.school,
              subject: existingWxUser.subject,
              avatar: existingWxUser.avatar,
              quota: existingWxUser.quota || 0,
            },
          },
        };
      }
      
      const { data: newWxUser, error: insertError } = await client
        .from('users')
        .insert({
          username: `wechat_${openid}`,
          token,
          nickname: '微信用户',
          quota: 10, // 新用户默认10次额度
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('创建微信用户失败:', insertError);
        throw new Error(`创建微信用户失败: ${insertError.message}`);
      }
      
      return {
        code: 200,
        msg: '登录成功',
        data: {
          needVerify: false,
          token,
          user: {
            id: newWxUser.id,
            username: newWxUser.username,
            nickname: newWxUser.nickname,
            school: newWxUser.school,
            subject: newWxUser.subject,
            avatar: newWxUser.avatar,
            quota: newWxUser.quota,
          },
        },
      };
    } catch (err) {
      console.error('微信登录失败:', err);
      return {
        code: 500,
        msg: '微信登录失败',
        data: null,
      };
    }
  }

  @Post('verify')
  async verify(@Body() body: VerifyDto) {
    console.log('验证请求:', body);
    const client = this.getClient();
    
    // 查找临时用户
    const { data: tempUser, error: findError } = await client
      .from('users')
      .select('*')
      .eq('token', body.tempToken)
      .maybeSingle();
    
    if (findError) {
      console.error('查询用户失败:', findError);
      throw new Error(`查询失败: ${findError.message}`);
    }
    
    if (!tempUser) {
      return {
        code: 400,
        msg: '无效的临时令牌',
        data: null,
      };
    }
    
    // 验证验证码
    if (body.verifyCode !== VALID_VERIFY_CODE) {
      return {
        code: 400,
        msg: '验证码错误',
        data: null,
      };
    }
    
    // 验证成功，生成新的正式 token
    const newToken = `token_${Date.now()}_verified`;
    
    // 更新用户 token
    const { error: updateError } = await client
      .from('users')
      .update({ token: newToken })
      .eq('id', tempUser.id);
    
    if (updateError) {
      console.error('更新token失败:', updateError);
      throw new Error(`更新token失败: ${updateError.message}`);
    }
    
    return {
      code: 200,
      msg: '验证成功',
      data: {
        token: newToken,
        user: {
          id: tempUser.id,
          username: tempUser.username,
          nickname: tempUser.nickname || '',
          school: tempUser.school || '',
          subject: tempUser.subject || '',
          avatar: tempUser.avatar || '',
          quota: tempUser.quota || 0,
        },
      },
    };
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    const client = this.getClient();
    const token = auth?.replace('Bearer ', '');
    
    if (token) {
      await client
        .from('users')
        .update({ token: null })
        .eq('token', token);
    }
    
    return {
      code: 200,
      msg: '登出成功',
      data: null,
    };
  }
}

// 用户信息控制器
@Controller('user')
export class UserController {
  private getClient() {
    return getSupabaseClient();
  }

  @Post('profile')
  async saveProfile(@Body() body: ProfileDto & { token?: string }) {
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
        quota: user.quota || 0, // 返回额度
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
