import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KnowledgeCardService {
  private readonly imageApiBase = process.env.IMAGE_API_BASE || 'https://api.suchuang.vip/v1';
  private readonly imageApiKey = process.env.IMAGE_API_KEY || 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  // 简洁英文 prompt，让 AI 专注于图片生成
  private readonly promptStyle = `A beautiful cartoon-style educational knowledge card for school teachers. Hand-drawn illustration style with vibrant colors, cute round characters, clean white background. Card layout includes: Main title, Core concepts, Key points, Fun memory rhyme. Adorable cartoon illustrations, simple icons. Clean design with comfortable spacing, professional quality, high resolution, detailed, sharp.`;

  async generate(topic: string): Promise<string> {
    const fullPrompt = `${topic}\n\n${this.promptStyle}`;
    console.log('[KnowledgeCard] Generating with prompt:', fullPrompt);
    
    const imageUrl = await this.generateImage(fullPrompt);
    console.log('[KnowledgeCard] Generated image URL:', imageUrl);
    
    return imageUrl;
  }

  private async generateImage(prompt: string): Promise<string> {
    console.log('[KnowledgeCard] Generating image...');
    
    try {
      const response = await axios.post(
        `${this.imageApiBase}/images/generations`,
        {
          model: 'image-2',
          prompt: prompt,
          n: 1,
          size: 'auto',
          quality: 'hd',
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
      }
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}
