import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatOptions {
  model?: string;
  temperature?: number;
  apiKey?: string;
  baseURL?: string;
}

const createChatService = (options?: ChatOptions) => {
  const chatOpenAI = new OpenAI({
    apiKey: options?.apiKey || process.env.OPENAI_API_KEY,
    baseURL: options?.baseURL || process.env.OPENAI_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

  const createChatCompletion = async (messages: ChatCompletionMessageParam[], overrideOptions?: ChatOptions) => {
    const response = await chatOpenAI.chat.completions.create({
      model: overrideOptions?.model || options?.model || 'gpt-4o-2024-08-06',
      messages,
      temperature: overrideOptions?.temperature ?? options?.temperature ?? 0.7,
    });

    return response.choices[0].message.content;
  };

  const createVisionCompletion = async (messages: ChatCompletionMessageParam[], overrideOptions?: ChatOptions) => {
    const response = await chatOpenAI.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages,
      temperature: overrideOptions?.temperature ?? 0.3,
    });

    return response.choices[0].message.content;
  };

  return {
    createChatCompletion,
    createVisionCompletion,
  };
};

// Default chat service
export const chatService = createChatService();

// Factory function for creating chat services with custom options
export const createAgentChatService = (apiKey?: string, baseURL?: string) => {
  return createChatService({
    apiKey,
    baseURL,
  });
};

// Export the factory function for creating custom instances
export { createChatService };
