import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { getSupabaseClient } from './storage/database/supabase-client';
import axios from 'axios';

interface LoginDto {
  username: string;
  password: string;
}

interface WechatLoginDto {
  code: string;
  avatar?: string;
  nickname?: string;
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
      // 从环境变量获取微信配置
      const appId = process.env.WX_APP_ID;
      const secret = process.env.WX_APP_SECRET;
      
      if (!appId || !secret) {
        throw new Error('微信配置缺失：请在 .env 中配置 WX_APP_ID 和 WX_APP_SECRET');
      }
      
      // 调用微信 API 换取 openid
      const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${body.code}&grant_type=authorization_code`;
      const wxResponse = await axios.get(wxUrl);
      const { openid, session_key, errcode, errmsg } = wxResponse.data;
      
      if (errcode) {
        throw new Error(`微信登录失败: ${errmsg}`);
      }
      
      console.log('微信 API 返回 openid:', openid);
      
      // 使用 openid 查找用户
      const { data: existingUser, error: findError } = await client
        .from('users')
        .select('*')
        .eq('username', `wechat_${openid}`)
        .maybeSingle();
      
      if (findError) {
        console.error('查询用户失败:', findError);
      }
      
      const token = `token_${Date.now()}_${openid.substring(0, 8)}`;
      
      if (existingUser) {
        // 老用户：更新 token 和头像昵称
        const updateData: any = { token, session_key };
        if (body.avatar) updateData.avatar = body.avatar;
        if (body.nickname) updateData.nickname = body.nickname;
        
        await client
          .from('users')
          .update(updateData)
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
              school: existingUser.school || '',
              subject: existingUser.subject || '',
              avatar: existingUser.avatar || '',
              quota: existingUser.quota || 0,
            },
          },
        };
      }
      
      // 新用户：创建临时用户，需要验证
      const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: newUser, error: insertError } = await client
        .from('users')
        .insert({
          username: `wechat_${openid}`,
          password: 'wechat_oauth',
          token: tempToken,
          openid,
          session_key,
          nickname: body.nickname || '微信用户',
          avatar: body.avatar || null,
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
        msg: '需要验证',
        data: {
          needVerify: true,
          tempToken: newUser.token,
          userId: newUser.id,
        },
      };
    } catch (err: any) {
      console.error('微信登录失败:', err);
      return {
        code: 500,
        msg: err.message || '微信登录失败',
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
