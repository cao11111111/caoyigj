import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KnowledgeCardService {
  private readonly imageApiBase = process.env.IMAGE_API_BASE || 'https://api.suchuang.vip/v1';
  private readonly imageApiKey = process.env.IMAGE_API_KEY || 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  async generate(userContent: string): Promise<string> {
    console.log('[KnowledgeCard] Generating with user content:', userContent.substring(0, 200));
    
    // 手绘风格知识卡片
    const stylePrompt = 'Hand-drawn style knowledge card, Chinese text with sketched pencil style and soft watercolor touches on warm beige paper background. Include hand-drawn icons, notebook sketch style with arrows and bullet points. Educational and supportive tone.';
    
    // 用户内容 + 风格描述
    const fullPrompt = `${userContent}\n\n${stylePrompt}`;
    
    console.log('[KnowledgeCard] Full prompt length:', fullPrompt.length);

    try {
      const response = await axios.post(
        `${this.imageApiBase}/images/generations`,
        {
          model: 'gpt-image-2',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url'
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
          console.log('[KnowledgeCard] Generated image URL:', imageUrl);
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
