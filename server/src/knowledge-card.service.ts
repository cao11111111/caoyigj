import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface KnowledgeCard {
  title: string;
  coreConcept: string;
  keyPoints: string[];
  memoryTip: string;
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

  async generate(topic: string): Promise<{ code: number; msg: string; data: KnowledgeCard }> {
    // 如果没有配置 Coze Token，返回模拟数据
    if (!this.cozeToken) {
      return this.getMockData(topic);
    }

    try {
      const prompt = this.buildPrompt(topic);
      
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
          return this.parseAIResponse(aiMessage.content, topic);
        }
      }

      return this.getMockData(topic);
    } catch (error: any) {
      console.error('Coze API Error:', error.message);
      return this.getMockData(topic);
    }
  }

  private buildPrompt(topic: string): string {
    return `请为"${topic}"生成一份适合学校师生阅读的知识卡片。

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

  private parseAIResponse(content: string, topic: string): { code: number; msg: string; data: KnowledgeCard } {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.title && parsed.coreConcept) {
          return {
            code: 200,
            msg: 'success',
            data: {
              title: parsed.title || topic,
              coreConcept: parsed.coreConcept || '',
              keyPoints: parsed.keyPoints || [],
              memoryTip: parsed.memoryTip || ''
            }
          };
        }
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
    return this.getMockData(topic);
  }

  private getMockData(topic: string): { code: number; msg: string; data: KnowledgeCard } {
    const mockData: Record<string, KnowledgeCard> = {
      '光合作用': {
        title: '光合作用',
        coreConcept: '植物利用阳光、二氧化碳和水制造养料的过程，就像植物在"吃饭"，为自己和动物提供能量和氧气。',
        keyPoints: [
          '光合作用需要阳光、二氧化碳和水三种原料',
          '叶绿素是植物捕获阳光的关键物质',
          '光合作用产生氧气，是地球氧气的主要来源'
        ],
        memoryTip: '光合作用：光+水+二氧化碳 → 有机物+氧气（光来水来，吐出养料和氧来）'
      },
      '勾股定理': {
        title: '勾股定理',
        coreConcept: '在直角三角形中，两条直角边的平方和等于斜边的平方。这是几何学中最重要的定理之一。',
        keyPoints: [
          '适用于直角三角形',
          '公式：a² + b² = c²（c是斜边）',
          '3-4-5是最经典的勾股数'
        ],
        memoryTip: '勾三股四弦五：勾三、股四、弦五，直角三角形记心头'
      }
    };

    return {
      code: 200,
      msg: 'success',
      data: mockData[topic] || {
        title: topic,
        coreConcept: `${topic}是学习中的重要知识点，通过理解其核心概念，掌握关键要点，可以更好地应用和记忆。`,
        keyPoints: [
          '这是需要掌握的第一个要点',
          '这是需要掌握的关键内容',
          '这是实际应用中的重点'
        ],
        memoryTip: `记住${topic}的核心：理解概念、掌握要点、勤加练习`
      }
    };
  }
}
