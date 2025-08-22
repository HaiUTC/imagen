import OpenAI from 'openai';
import { LRUCache } from 'lru-cache';
import { CustomInstructions } from '~/domains/entities/imagen.entity';
import { SYSTEM_PROMPT_CAMERA_VIEW, SYSTEM_PROMPT_GENERATE_IMAGE, SYSTEM_PROMPT_USER_IMAGE_REFERENCE } from '../data/prompt.data';

// API key status cache using LRU cache
const apiKeyStatusCache = new LRUCache<string, boolean>({
  max: 10, // Maximum number of API keys
  ttl: 1000 * 60 * 60, // 1 hour TTL
});

export const createImagenService = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

  // Initialize cache with all API keys set to false
  const initializeApiKeyCache = () => {
    const apiKeys = [
      process.env.VISION_API_KEY!,
      process.env.VISION_API_KEY1!,
      process.env.VISION_API_KEY2!,
      process.env.VISION_API_KEY3!,
      process.env.VISION_API_KEY4!,
    ];

    apiKeys.forEach(key => {
      if (key && !apiKeyStatusCache.has(key)) {
        apiKeyStatusCache.set(key, false);
      }
    });
  };

  // Get available API key (not currently active)
  const getAvailableApiKey = () => {
    const apiKeys = [
      process.env.VISION_API_KEY!,
      process.env.VISION_API_KEY1!,
      process.env.VISION_API_KEY2!,
      process.env.VISION_API_KEY3!,
      process.env.VISION_API_KEY4!,
    ];

    // Find first available (inactive) API key
    const availableKey = apiKeys.find(key => key && !apiKeyStatusCache.get(key));

    // If all keys are active, use the first one
    return availableKey || apiKeys[0];
  };

  // Tạo magic prompt cho việc generate ảnh từ prompt mà không có image reference
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

  // Tạo magic prompt cho việc generate ảnh từ prompt và image reference
  const magicPromptUserImageReference = async (user_prompt: string, cameraViewPrompt: string, imageReference: string[]) => {
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
            text: `${user_prompt} ${cameraViewPrompt ? ` with ${cameraViewPrompt}` : ''}`,
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

  // Tạo prompt camera view cho image reference
  const magicPromptPerspectives = async (imageReference: string) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT_CAMERA_VIEW,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageReference,
              detail: 'high',
            },
          },
        ],
      },
    ];
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      temperature: 0.8,
      messages,
    });

    return response.choices[0].message.content || '';
  };

  // Generate ảnh từ prompt
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

  // Generate ảnh từ prompt và image reference
  const generateImagenMixed = async (prompt: string, imageReference: string[], onEvent?: (process: number) => void) => {
    try {
      // Initialize cache if not already done
      initializeApiKeyCache();

      // Get available API key
      const selectedApiKey = getAvailableApiKey();

      // Set selected API key as active
      apiKeyStatusCache.set(selectedApiKey, true);

      const image = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/submit/imagine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${selectedApiKey}`,
        },
        body: JSON.stringify({
          prompt: `${imageReference.join(' ')} ${prompt}`,
          botType: 'MID_JOURNEY',
        }),
      }).then(async res => await res.json());

      if (!image.result) {
        return { images: [], taskId: '' };
      }

      const { images } = await poolImageTask(image.result, selectedApiKey, onEvent);

      // Set API key as inactive after request is complete
      apiKeyStatusCache.set(selectedApiKey, false);

      return { images, taskId: image.result as string };
    } catch (error) {
      // Ensure API key is set to inactive even if request fails
      const selectedApiKey = getAvailableApiKey();
      if (selectedApiKey) {
        apiKeyStatusCache.set(selectedApiKey, false);
      }

      console.error(error);
      return { images: [], taskId: '' };
    }
  };

  // Edit ảnh từ prompt và image reference
  const editImage = async (prompt: string, imageTarget: string) => {
    try {
      const selectedApiKey = getAvailableApiKey();

      const image = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/fal-ai/bytedance/seededit/v3/edit-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${selectedApiKey}`,
        },
        body: JSON.stringify({
          image_url: imageTarget,
          prompt: prompt,
        }),
      }).then(async res => await res.json());

      let status = 'IN_PROGRESS';

      const imageUrls: Array<{ value: string; type: 'base64' | 'url' }> = [];

      if (image.result) {
        await new Promise(resolve => setTimeout(resolve, 20000));

        while (status === 'IN_PROGRESS') {
          await new Promise(resolve => setTimeout(resolve, 3000));

          const statusCheck = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/task/${image.result}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${selectedApiKey}`,
            },
          }).then(res => res.json());

          status = statusCheck.status !== 'SUCCESS' ? 'IN_PROGRESS' : 'SUCCESS';
          if (status === 'SUCCESS') {
            imageUrls.push({ value: statusCheck.task_result.images[0].url, type: 'url' });
          }
        }

        // Set API key as inactive after request is complete
        apiKeyStatusCache.set(selectedApiKey, false);

        return { images: imageUrls, taskId: image.result as string };
      }

      return { images: [], taskId: '' };
    } catch (error) {
      const selectedApiKey = getAvailableApiKey();
      if (selectedApiKey) {
        apiKeyStatusCache.set(selectedApiKey, false);
      }

      console.error(error);
      return { images: [], taskId: '' };
    }
  };

  const upscaleImage = async (taskId: string, index: number, apiKey: string) => {
    // Initialize cache if not already done
    initializeApiKeyCache();

    // Get available API key
    const selectedApiKey = getAvailableApiKey();

    // Set selected API key as active
    apiKeyStatusCache.set(selectedApiKey, true);

    let image = '';

    const imageUpscale = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/submit/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        action: 'UPSCALE',
        index,
        taskId,
      }),
    }).then(async res => await res.json());

    if (!imageUpscale.result) {
      return '';
    }

    const { images } = await poolImageTask(imageUpscale.result, apiKey);
    if (images[0].value) {
      image = images[0].value;
    }

    return image;
  };

  // Download ảnh từ taskId
  const downloadImageGenerated = async (taskId: string, index: number, apiKey: string) => {
    let image = '';

    const dataUpscaleImagenMixed = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/mj/submit/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        action: 'UPSCALE',
        index,
        taskId,
      }),
    }).then(async res => await res.json());

    console.log('dataUpscaleImagenMixed: ', dataUpscaleImagenMixed);

    if (!dataUpscaleImagenMixed.result) {
      return '';
    }

    let status = 'IN_PROGRESS';

    await new Promise(resolve => setTimeout(resolve, 30000));

    while (status === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const statusCheck = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/task/${dataUpscaleImagenMixed.result}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VISION_API_KEY}`,
        },
      }).then(res => res.json());
      console.log('statusCheck: ', statusCheck);
      if (statusCheck.status === 'FAILURE') {
        return '';
      }

      status = statusCheck.status !== 'SUCCESS' ? 'IN_PROGRESS' : 'SUCCESS';
      if (status === 'SUCCESS') {
        image = statusCheck.task_result.images[0].url;
      }
    }

    return image;
  };

  const poolImageTask = async (taskId: string, apiKey: string, onEvent?: (progress: number) => void) => {
    let status = 'IN_PROGRESS';
    let failCount = 0;
    const maxFailures = 5;

    const imageUrls: Array<{ value: string; type: 'base64' | 'url' }> = [];

    if (taskId) {
      await new Promise(resolve => setTimeout(resolve, 20000));

      while (status === 'IN_PROGRESS') {
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
          const statusCheck = await fetch(`${process.env.OPENAI_BASE_URL?.replace('/v1', '')}/task/${taskId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          }).then(res => res.json());

          status = statusCheck.status !== 'SUCCESS' ? 'IN_PROGRESS' : 'SUCCESS';

          const progress = Number.parseInt(statusCheck.progress) || 0;

          if (progress && onEvent) {
            onEvent(progress);
          }
          if (status === 'SUCCESS') {
            imageUrls.push({ value: statusCheck.task_result.images[0].url, type: 'url' });
          }
        } catch (error) {
          failCount++;
          if (failCount >= maxFailures) {
            throw new Error(
              `Failed to pool image task after ${maxFailures} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
          }
        }
      }

      // Set API key as inactive after request is complete
      apiKeyStatusCache.set(apiKey, false);

      return { images: imageUrls };
    }

    return { images: [] };
  };

  return {
    magicPromptImageGenerate,
    magicPromptUserImageReference,
    magicPromptPerspectives,
    generateImagen,
    editImage,
    upscaleImage,
    generateImagenMixed,
    downloadImageGenerated,
  };
};

export const imagenService = createImagenService();
