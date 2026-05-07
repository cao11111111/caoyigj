import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KnowledgeCardService {
  private readonly imageApiBase = process.env.IMAGE_API_BASE || 'https://api.suchuang.vip/v1';
  private readonly imageApiKey = process.env.IMAGE_API_KEY || 'sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt';

  async generate(userContent: string): Promise<string> {
    // GPT Image 2 提示词结构：
    // [场景/用途], [主体描述], [具体细节：光线/材质/颜色/文字], [风格参考], [约束条件：比例/背景]
    const prompt = `Educational knowledge card design for school teachers.
    
[Scene] Clean white background knowledge card layout

[Subject] Cartoon-style hand-drawn educational illustration with:
- "标题" area for main title (Chinese text)
- "核心概念" area for core concept explanation (Chinese text)  
- "关键要点" area for 3-4 key points (Chinese text)
- "记忆口诀" area for fun memory rhyme (Chinese text)

[Details]
- Vibrant pastel colors, cute round characters
- Hand-drawn doodle style with soft edges
- Adorable cartoon icons and decorations
- Clear text rendering, Chinese characters must be readable and accurate
- No spelling errors in Chinese text

[Style]
- Whimsical children's book illustration style
- Bright and cheerful color palette
- Clean professional layout with comfortable spacing
- Paper texture feel, like a beautiful crafted card

[Constraints]
- Portrait 3:4 ratio
- High detail, sharp edges
- No watermark, no extra text outside designated areas`;

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
