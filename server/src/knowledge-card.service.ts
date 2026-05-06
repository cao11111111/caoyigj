import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface KnowledgeCard {
  title: string;
  coreConcept: string;
  keyPoints: string[];
  memoryTip: string;
  example: string;
  relatedTopics: string[];
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
  "memoryTip": "一个朗朗上口的记忆口诀或方法，帮助学生记住这个知识点",
  "example": "一个贴近生活的实际应用例子，帮助学生理解这个知识在生活中的应用",
  "relatedTopics": ["相关主题1", "相关主题2", "相关主题3"]
}

要求：
1. 内容要科学准确，适合中小学生理解
2. 语言要通俗易懂，避免过于专业的术语
3. 记忆口诀要押韵、朗朗上口
4. 相关主题要与本知识点有关联性`;
  }

  private parseAIResponse(content: string, topic: string): { code: number; msg: string; data: KnowledgeCard } {
    try {
      // 尝试提取 JSON
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
              memoryTip: parsed.memoryTip || '',
              example: parsed.example || '',
              relatedTopics: parsed.relatedTopics || []
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
    // 根据主题生成示例数据
    const mockData: Record<string, KnowledgeCard> = {
      '光合作用': {
        title: '光合作用',
        coreConcept: '植物利用阳光、二氧化碳和水制造养料的过程，就像植物在"吃饭"，为自己和动物提供能量和氧气。',
        keyPoints: [
          '光合作用需要阳光、二氧化碳和水三种原料',
          '叶绿素是植物捕获阳光的关键物质',
          '光合作用产生氧气，是地球氧气的主要来源',
          '光合作用在叶子的叶绿体中进行'
        ],
        memoryTip: '光合作用：光+水+二氧化碳 → 有机物+氧气（光来水来，吐出养料和氧来）',
        example: '如果晚上把植物放在卧室，由于没有阳光，植物会进行呼吸作用吸收氧气，所以不建议在卧室放太多植物。',
        relatedTopics: ['呼吸作用', '叶绿体', '植物营养', '氧气来源']
      },
      '勾股定理': {
        title: '勾股定理',
        coreConcept: '在直角三角形中，两条直角边的平方和等于斜边的平方。这是几何学中最重要的定理之一。',
        keyPoints: [
          '适用于直角三角形',
          '公式：a² + b² = c²（c是斜边）',
          '3-4-5是最经典的勾股数',
          '古代中国称为"商高定理"'
        ],
        memoryTip: '勾三股四弦五：勾（a）=3，股（b）=4，弦（c）=5，3²+4²=5²',
        example: '如果一个直角三角形的两条直角边分别是3厘米和4厘米，那么斜边就是5厘米（3²+4²=9+16=25，√25=5）。',
        relatedTopics: ['直角三角形', '毕达哥拉斯定理', '平方根', '几何证明']
      }
    };

    const data = mockData[topic] || {
      title: `${topic}知识卡片`,
      coreConcept: `${topic}是学习中的重要知识点，通过理解其核心概念、掌握关键要点，可以更好地理解和应用相关知识。`,
      keyPoints: [
        `了解${topic}的基本定义和概念`,
        `掌握${topic}的核心原理和应用方法`,
        `能够运用${topic}解决实际问题`,
        `将${topic}与其他知识点联系起来`
      ],
      memoryTip: `学习${topic}，要理解原理、多做练习、联系实际！`,
      example: `在日常生活中，我们可以观察到许多与${topic}相关的现象，通过分析这些现象可以加深对知识点的理解。`,
      relatedTopics: [`${topic}的应用`, '相关概念', '拓展知识', '实践案例']
    };

    return { code: 200, msg: 'success', data };
  }
}
