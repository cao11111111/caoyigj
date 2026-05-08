import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/common';

interface LoginDto {
  username: string;
  password: string;
}

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() body: LoginDto) {
    console.log('登录请求:', body);
    
    // 演示模式：任意账号密码都能登录
    // 实际项目中应该连接公司用户系统验证
    return {
      code: 200,
      msg: '登录成功',
      data: {
        token: `mock-token-${Date.now()}`,
        user: {
          id: 1,
          username: body.username,
          nickname: body.username,
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
