import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/common';

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

// 模拟数据库
const tempTokens = new Map<string, { openid?: string; username?: string; createdAt: number }>();
const VALID_VERIFY_CODE = '123456';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() body: LoginDto) {
    console.log('登录请求:', body);
    
    // 固定测试账号：111 / 123456
    if (body.username === '111' && body.password === '123456') {
      return {
        code: 200,
        msg: '登录成功',
        data: {
          needVerify: false,
          token: `token_${Date.now()}`,
          user: {
            id: 1,
            username: '111',
            nickname: '用户111',
            avatar: '',
          },
        },
      };
    }
    
    // 演示模式：任意账号密码都能登录
    const isNewUser = body.username.includes('new') || body.username.includes('test');
    
    if (isNewUser) {
      // 新用户需要验证
      const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      tempTokens.set(tempToken, { username: body.username, createdAt: Date.now() });
      
      return {
        code: 200,
        msg: '需要验证',
        data: {
          needVerify: true,
          tempToken: tempToken,
        },
      };
    }
    
    // 老用户直接登录
    return {
      code: 200,
      msg: '登录成功',
      data: {
        needVerify: false,
        token: `token_${Date.now()}`,
        user: {
          id: 1,
          username: body.username,
          nickname: body.username,
          avatar: '',
        },
      },
    };
  }

  @Post('wechat-login')
  @ApiOperation({ summary: '微信登录' })
  async wechatLogin(@Body() body: WechatLoginDto) {
    console.log('微信登录请求, code:', body.code);
    
    try {
      // 实际项目中需要调用微信接口获取 openid
      // const wxRes = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
      //   params: {
      //     appid: 'YOUR_APPID',
      //     secret: 'YOUR_SECRET',
      //     js_code: body.code,
      //     grant_type: 'authorization_code'
      //   }
      // });
      // const openid = wxRes.data.openid;
      
      // 演示模式：使用 code 模拟 openid
      const openid = `mock_openid_${body.code}`;
      
      // 模拟判断是否为新用户（演示：code 长度 < 20 为新用户）
      const isNewUser = body.code.length < 20;
      
      if (isNewUser) {
        const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        tempTokens.set(tempToken, { openid, createdAt: Date.now() });
        
        return {
          code: 200,
          msg: '需要验证',
          data: {
            needVerify: true,
            tempToken: tempToken,
          },
        };
      }
      
      return {
        code: 200,
        msg: '登录成功',
        data: {
          needVerify: false,
          token: `token_${Date.now()}_${openid}`,
          user: {
            id: 1,
            username: '微信用户',
            nickname: '微信用户',
            avatar: '',
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
  @ApiOperation({ summary: '验证码验证' })
  verify(@Body() body: VerifyDto) {
    console.log('验证请求:', body);
    
    const tempData = tempTokens.get(body.tempToken);
    
    if (!tempData) {
      return {
        code: 400,
        msg: '无效的临时令牌',
        data: null,
      };
    }
    
    // 检查临时令牌是否过期（10分钟）
    if (Date.now() - tempData.createdAt > 10 * 60 * 1000) {
      tempTokens.delete(body.tempToken);
      return {
        code: 400,
        msg: '临时令牌已过期，请重新登录',
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
    
    // 验证成功，删除临时令牌
    tempTokens.delete(body.tempToken);
    
    return {
      code: 200,
      msg: '验证成功',
      data: {
        token: `token_${Date.now()}_verified`,
        user: {
          id: 1,
          username: tempData.username || tempData.openid || '新用户',
          nickname: '新用户',
          avatar: '',
        },
      },
    };
  }

  @Post('logout')
  @ApiOperation({ summary: '用户登出' })
  logout() {
    return {
      code: 200,
      msg: '登出成功',
      data: null,
    };
  }
}
