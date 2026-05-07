import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KnowledgeCardService {
  private readonly imageApiBase = process.env.IMAGE_API_BASE || 'https://api.suchuang.vip/v1';
  private readonly imageApiKey = process.env.IMAGE_API_KEY || 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  private readonly promptPrefix = `请仔细阅读以下培训内容，完成两个任务：

任务一【内容总结】：将原文内容提炼为结构化的知识要点，包括：
- 标题：简洁明了的课程主题
- 核心概念：1-2句话的专业定义
- 关键要点：3-4个核心知识点
- 记忆口诀：一句朗朗上口的口诀

任务二【设计知识卡片】：基于总结内容，设计一张图文结合的知识卡片，要求：
1. 卡片整体为简约专业风格，色调稳重舒适
2. 包含任务一的所有文字内容
3. 配上简洁的图标或插图装饰
4. 布局清晰美观，像一张精美的教学知识卡片
5. 卡片比例建议16:9或4:3`;

  async generate(topic: string): Promise<string> {
    const fullPrompt = `${topic}\n\n${this.promptPrefix}`;
    console.log('[KnowledgeCard] Generating with prompt:', fullPrompt);
    
    const imageUrl = await this.generateImage(fullPrompt);
    console.log('[KnowledgeCard] Generated image URL:', imageUrl);
    
    return imageUrl;
  }

  private async generateImage(prompt: string): Promise<string> {
    console.log('[KnowledgeCard] Generating image...');
    
    try {
      // 速创 API 图像生成
      // 添加 response_format: "url" 获取 URL 而不是 b64_json
      const response = await axios.post(
        `${this.imageApiBase}/images/generations/`,
        {
          model: 'gpt-image-2',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.imageApiKey}`
          },
          timeout: 300000, // 5分钟
          maxContentLength: 50 * 1024 * 1024, // 50MB
          maxBodyLength: 50 * 1024 * 1024 // 50MB
        }
      );

      // 移除大数据日志输出，避免超时
      console.log('[KnowledgeCard] API Response status:', response.status);

      // 解析标准 OpenAI 格式的响应
      // {"created":123,"data":[{"url":"..."}],"usage":{...}}
      const imageData = response.data?.data;
      if (imageData && Array.isArray(imageData) && imageData.length > 0) {
        const imageUrl = imageData[0]?.url || imageData[0]?.b64_json;
        if (imageUrl) {
          return imageUrl;
        }
      }

      // 备选：直接返回 data 字段
      if (response.data?.url) {
        return response.data.url;
      }

      throw new Error('No image URL in response');
    } catch (error) {
      console.error('[KnowledgeCard] Image generation error:', error.message);
      if (error.response) {
        console.error('[KnowledgeCard] Response status:', error.response?.status);
      }
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}
