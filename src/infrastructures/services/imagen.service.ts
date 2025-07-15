import OpenAI from 'openai';
import { CustomInstructions } from '~/domains/entities/generate-image.entity';
import { SYSTEM_PROMPT_GENERATE_IMAGE } from '../data/prompt.data';

export const createImagenService = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

  const magicPromptImageGenerate = async (user_prompt: string, custom_instructions: CustomInstructions) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: SYSTEM_PROMPT_GENERATE_IMAGE(
          custom_instructions.theme_type,
          custom_instructions.section_type,
          user_prompt,
          custom_instructions.aspect_ratio,
          custom_instructions.style,
        ),
      },
    ];
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      messages,
    });

    return response.choices[0].message.content || '';
  };

  const generateImagen = async (prompt: string, aspect_ratio: string = '1:1', model: string = 'imagen4-fast') => {
    const response = await fetch('https://api.yescale.io/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VISION_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        response_format: 'url',
        aspect_ratio: aspect_ratio,
      }),
    });
    const data = await response.json();
    let imageData: {
      value: string;
      type: 'base64' | 'url';
    } = {
      value: '',
      type: 'base64',
    };
    if (data.data) {
      data.data.forEach((item: any) => {
        if (item.b64_json) {
          imageData = {
            value: item.b64_json,
            type: 'base64',
          };
        } else if (item.url) {
          imageData = {
            value: item.url,
            type: 'url',
          };
        }
      });
    }

    return imageData;
  };

  const generateImagePro = async (prompt: string, custom_instructions: CustomInstructions) => {
    const response = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/ideogram/v1/ideogram-v3/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VISION_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: custom_instructions.aspect_ratio.replace(':', 'x'),
        magic_prompt: 'ON',
        num_images: +custom_instructions.number_output,
        rendering_speed: 'QUALITY',
        style_type: custom_instructions.style === 'realistic' ? 'REALISTIC' : 'GENERAL',
      }),
    });

    const data = await response.json();
    return data.data.map((item: any) => item.url);
  };

  const generateImagenMixed = async (prompt: string, custom_instructions: CustomInstructions) => {
    try {
      const formData = new FormData();
      formData.append('image', custom_instructions.reference_image as Blob);
      formData.append('prompt', prompt);
      formData.append('aspect_ratio', custom_instructions.aspect_ratio.replace(':', 'x'));
      formData.append('magic_prompt', 'ON');
      formData.append('num_images', custom_instructions.number_output);
      formData.append('style_type', custom_instructions.style === 'realistic' ? 'REALISTIC' : 'GENERAL');

      const response = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/ideogram/v1/ideogram-v3/remix`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VISION_API_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.data.map((item: any) => item.url);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return {
    magicPromptImageGenerate,
    generateImagen,
    generateImagePro,
    generateImagenMixed,
  };
};

export const imagenService = createImagenService();
