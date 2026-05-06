import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface KnowledgeCard {
  imageUrl: string;
}

@Injectable()
export class KnowledgeCardService {
  // 图像生成 API 配置
  private readonly imageApiBase = 'https://ark.cn-beijing.volces.com/api/v3';
  private readonly imageApiKey = 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  async generate(userContent: string): Promise<{ code: number; msg: string; data: KnowledgeCard }> {
    const prompt = this.buildPrompt(userContent);
    
    try {
      const imageUrl = await this.generateImage(prompt);
      return {
        code: 200,
        msg: 'success',
        data: { imageUrl }
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      return {
        code: 500,
        msg: '生成失败，请稍后重试',
        data: { imageUrl: '' }
      };
    }
  }

  private buildPrompt(userContent: string): string {
    return `${userContent}

请将以上内容生成一份适合学校师生阅读的知识卡片，要求：
1. 内容科学准确，适合中小学生理解
2. 卡片设计为卡通风格，色彩鲜艳活泼
3. 包含标题、核心概念、关键要点、记忆口诀等板块
4. 布局清晰美观，像一张精美的学习卡片`;
  }

  private async generateImage(prompt: string): Promise<string> {
    const response = await axios.post(
      `${this.imageApiBase}/images/generations/`,
      {
        model: 'gpt-image-2',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.imageApiKey}`
        },
        timeout: 60000
      }
    );

    if (response.data?.data?.[0]?.url) {
      return response.data.data[0].url;
    }

    throw new Error('Failed to generate image');
  }
}
