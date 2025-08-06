import OpenAI from 'openai';
import { CustomInstructions } from '~/domains/entities/generate-image.entity';
import { SYSTEM_PROMPT_GENERATE_IMAGE, SYSTEM_PROMPT_USER_IMAGE_REFERENCE } from '../data/prompt.data';

export const createImagenService = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

  const magicPromptImageGenerate = async (user_prompt: string, custom_instructions: CustomInstructions) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT_GENERATE_IMAGE,
      },
      {
        role: 'user',
        content: `Generate an prompt for "${user_prompt}" with ${custom_instructions.style} style and ${custom_instructions.aspect_ratio} aspect ratio`,
      },
    ];
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      messages,
    });

    return response.choices[0].message.content || '';
  };

  const magicPromptUserImageReference = async (user_prompt: string, imageReference: string[]) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT_USER_IMAGE_REFERENCE,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: user_prompt,
          },
        ],
      },
    ];

    imageReference.forEach(image => {
      (messages[1].content as OpenAI.Chat.Completions.ChatCompletionContentPart[]).push({
        type: 'image_url',
        image_url: { url: image, detail: 'high' },
      });
    });

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      messages,
    });

    return response.choices[0].message.content || '';
  };

  const generateImagen = async (prompt: string, aspect_ratio: string = '1:1', n: number = 1) => {
    try {
      // Create an array of n requests to be executed in parallel
      const requests = Array.from({ length: n }, () =>
        fetch(`${process.env.OPENAI_BASE_URL}/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VISION_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'imagen4-fast',
            prompt,
            response_format: 'url',
            aspect_ratio: aspect_ratio,
          }),
        }).then(async res => await res.json()),
      );

      // Execute all requests in parallel
      const responses = await Promise.all(requests);

      // Process all responses and collect image data
      const images: Array<{ value: string; type: 'base64' | 'url' }> = [];
      responses.forEach((data, index) => {
        try {
          if (data.data) {
            data.data.forEach((item: any) => {
              if (item.b64_json) {
                images.push({
                  value: item.b64_json,
                  type: 'base64',
                });
              } else if (item.url) {
                images.push({
                  value: item.url,
                  type: 'url',
                });
              }
            });
          }
        } catch (error) {
          console.error(`Error processing response ${index + 1}:`, error);
        }
      });

      // If only one image was requested, return single object for backward compatibility
      return images;
    } catch (error) {
      console.error('Error in generateImagen:', error);
      return [];
    }
  };

  const generateImagenMixed = async (prompt: string, aspect_ratio: string = '1:1', imageReference: string[]) => {
    try {
      const imageUrls: Array<{ value: string; type: 'base64' | 'url' }> = [];

      const image = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/submit/imagine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VISION_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `${imageReference.join(' ')} ${prompt} --aspect ${aspect_ratio}`,
          botType: 'MID_JOURNEY',
        }),
      }).then(async res => await res.json());

      let status = 'IN_PROGRESS';

      await new Promise(resolve => setTimeout(resolve, 30000));

      while (status === 'IN_PROGRESS') {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const statusCheck = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/task/${image.result}/fetch`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VISION_API_KEY}`,
          },
        }).then(res => res.json());

        console.log('statusCheck: ', statusCheck);

        status = statusCheck.status || 'IN_PROGRESS';
        if (status === 'SUCCESS') {
          imageUrls.push({ value: statusCheck.imageUrl, type: 'url' });
        }
      }

      return { images: imageUrls, taskId: image.result };
    } catch (error) {
      console.error(error);
      return { images: [], taskId: '' };
    }
  };

  const downloadImageGenerated = async (taskId: string, index: number) => {
    let image = '';

    const dataUpscaleImagenMixed = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/submit/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VISION_API_KEY}`,
      },
      body: JSON.stringify({
        action: 'UPSCALE',
        index,
        taskId,
      }),
    }).then(async res => await res.json());

    let status = 'IN_PROGRESS';

    await new Promise(resolve => setTimeout(resolve, 30000));

    while (status === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const statusCheck = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/task/${dataUpscaleImagenMixed.result}/fetch`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VISION_API_KEY}`,
        },
      }).then(res => res.json());

      status = statusCheck.status || 'IN_PROGRESS';
      if (status === 'SUCCESS') {
        image = statusCheck.imageUrl;
      }
    }

    return image;
  };

  return {
    magicPromptImageGenerate,
    magicPromptUserImageReference,
    generateImagen,
    generateImagenMixed,
    downloadImageGenerated,
  };
};

export const imagenService = createImagenService();
