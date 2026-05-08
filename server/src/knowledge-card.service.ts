import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KnowledgeCardService {
  private readonly imageApiBase = process.env.IMAGE_API_BASE || 'https://api.suchuang.vip/v1';
  private readonly imageApiKey = process.env.IMAGE_API_KEY || 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  async generate(userContent: string): Promise<string> {
    // GPT Image 2 - 手绘风格知识卡片
    const prompt = `Hand-drawn style knowledge card`;

    console.log('[KnowledgeCard] Generating with user content:', userContent.substring(0, 100));
    
    const imageUrl = await this.generateImage(userContent, prompt);
    console.log('[KnowledgeCard] Generated image URL:', imageUrl);
    
    return imageUrl;
  }

  private async generateImage(userContent: string, stylePrompt: string): Promise<string> {
    console.log('[KnowledgeCard] Generating image...');
    
    try {
      // 先总结用户内容，再生成图片
      const fullPrompt = `${userContent}

${stylePrompt}`;
      
      console.log('[KnowledgeCard] Full prompt length:', fullPrompt.length);

      const response = await axios.post(
        `${this.imageApiBase}/images/generations`,
        {
          model: 'gpt-image-2',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1536',  // 竖版 3:4 比例
          quality: 'medium',   // medium 质量，文字渲染更准确
          response_format: 'url',
          format: 'png'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.imageApiKey}`
          },
          timeout: 600000,
          maxContentLength: 50 * 1024 * 1024,
          maxBodyLength: 50 * 1024 * 1024
        }
      );

      console.log('[KnowledgeCard] API Response status:', response.status);

      const imageData = response.data?.data;
      if (imageData && Array.isArray(imageData) && imageData.length > 0) {
        const imageUrl = imageData[0]?.url || imageData[0]?.b64_json;
        if (imageUrl) {
          return imageUrl;
        }
      }

      if (response.data?.url) {
        return response.data.url;
      }

      throw new Error('No image URL in response');
    } catch (error) {
      console.error('[KnowledgeCard] Image generation error:', error.message);
      if (error.response) {
        console.error('[KnowledgeCard] Response status:', error.response?.status);
        console.error('[KnowledgeCard] Response data:', JSON.stringify(error.response?.data)?.substring(0, 500));
      }
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}
