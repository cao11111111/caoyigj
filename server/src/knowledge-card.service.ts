import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface KnowledgeCard {
  title: string;
  coreConcept: string;
  keyPoints: string[];
  memoryTip: string;
  imageUrl?: string;
}

interface CozeResponse {
  code: number;
  msg: string;
  data: {
    conversation_id: string;
    id: string;
    role: string;
    content: string;
    type: number;
  }[];
}

@Injectable()
export class KnowledgeCardService {
  private readonly cozeApiBase = process.env.COZE_API_BASE_URL || 'https://api.coze.cn';
  private readonly cozeToken = process.env.COZE_API_TOKEN;
  
  // 图像生成 API 配置
  private readonly imageApiBase = 'https://ark.cn-beijing.volces.com/api/v3';
  private readonly imageApiKey = 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  async generate(userContent: string): Promise<{ code: number; msg: string; data: KnowledgeCard }> {
    // 生成知识卡片内容
    let cardData: KnowledgeCard;
    
    if (this.cozeToken) {
      cardData = await this.generateFromCoze(userContent);
    } else {
      cardData = this.getMockData(userContent);
    }

    // 生成配图
    try {
      const imageUrl = await this.generateImage(userContent, cardData.title);
      cardData.imageUrl = imageUrl;
    } catch (error) {
      console.error('Image generation failed:', error);
      cardData.imageUrl = '';
    }

    return {
      code: 200,
      msg: 'success',
      data: cardData
    };
  }

  private async generateFromCoze(userContent: string): Promise<KnowledgeCard> {
    const prompt = this.buildPrompt(userContent);
    
    try {
      const response = await axios.post(
        `${this.cozeApiBase}/v3/chat`,
        {
          bot_id: process.env.COZE_BOT_ID || '',
          user_id: 'user_' + Date.now(),
          stream: false,
          auto_save_history: true,
          additional_messages: [
            {
              role: 'user',
              content: prompt,
              content_type: 'text'
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.cozeToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resData = response.data as CozeResponse;
      
      if (resData.code === 0 && resData.data && resData.data.length > 0) {
        const aiMessage = resData.data.find(msg => msg.role === 'assistant');
        if (aiMessage) {
          return this.parseAIResponse(aiMessage.content, userContent);
        }
      }
    } catch (error: any) {
      console.error('Coze API Error:', error.message);
    }
    
    return this.getMockData(userContent);
  }

  private buildPrompt(userContent: string): string {
    return `${userContent}

根据以上内容生成知识卡片，用于给师生看的卡通风格。

请严格按照以下 JSON 格式返回（不要添加任何额外的解释说明，直接返回 JSON）：
{
  "title": "知识卡片标题",
  "coreConcept": "用简洁通俗的语言解释这个概念，适合中小学学生理解，50-80字",
  "keyPoints": ["要点1", "要点2", "要点3", "要点4"],
  "memoryTip": "一个朗朗上口的记忆口诀或方法，帮助学生记住这个知识点"
}

要求：
1. 内容要科学准确，适合中小学生理解
2. 语言要通俗易懂，避免过于专业的术语
3. 记忆口诀要押韵、朗朗上口`;
  }

  private parseAIResponse(content: string, userContent: string): KnowledgeCard {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.title && parsed.coreConcept) {
          return {
            title: parsed.title || this.extractTitle(userContent),
            coreConcept: parsed.coreConcept || '',
            keyPoints: parsed.keyPoints || [],
            memoryTip: parsed.memoryTip || ''
          };
        }
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
    return this.getMockData(userContent);
  }

  private extractTitle(content: string): string {
    // 取内容前20个字符作为标题
    const firstLine = content.split('\n')[0].trim();
    return firstLine.length > 20 ? firstLine.substring(0, 20) + '...' : firstLine;
  }

  private async generateImage(userContent: string, title: string): Promise<string> {
    const imagePrompt = `卡通风格知识卡片插图，主题：${title}，内容相关：${userContent.substring(0, 100)}，适合中小学生，清新可爱，教育风格，简洁背景`;

    const response = await axios.post(
      `${this.imageApiBase}/images/generations/`,
      {
        model: 'gpt-image-2',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024'
      },
      {
        headers: {
          'Authorization': `Bearer ${this.imageApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data?.data?.[0]?.url) {
      return response.data.data[0].url;
    }

    throw new Error('Image URL not found');
  }

  private getMockData(userContent: string): KnowledgeCard {
    const title = this.extractTitle(userContent);
    
    return {
      title: title,
      coreConcept: `${title}是学习中的重要知识点，通过理解其核心概念，掌握关键要点，可以更好地应用和记忆。`,
      keyPoints: [
        '这是需要掌握的第一个要点',
        '这是需要掌握的关键内容',
        '这是实际应用中的重点'
      ],
      memoryTip: `记住${title}的核心：理解概念、掌握要点、勤加练习`
    };
  }
}
