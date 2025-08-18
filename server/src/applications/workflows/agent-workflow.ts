import { VisionAnalysisAgent } from '../../infrastructures/agents/vision-analysis.agent';
import { DesignStrategyAgent } from '../../infrastructures/agents/design-strategy.agent';
import { PromptEngineeringAgent } from '../../infrastructures/agents/prompt-engineering.agent';
import { MultiProviderRouterAgent } from '../../infrastructures/agents/multi-provider-router.agent';
import { createAgentChatService } from '../../infrastructures/services/chat.service';
import {
  UserInput,
  AgentWorkflowResult,
  VisionAnalysisResult,
  DesignStrategy,
  EnhancedPrompt,
  ProviderOption,
  GenerationResult,
} from '../../domains/types';

export class AgentWorkflow {
  private visionAnalysisAgent: VisionAnalysisAgent;
  private designStrategyAgent: DesignStrategyAgent;
  private promptEngineeringAgent: PromptEngineeringAgent;
  private multiProviderRouter: MultiProviderRouterAgent;

  constructor(openAiApiKey: string, baseURL?: string) {
    const chatService = createAgentChatService(openAiApiKey, baseURL);

    this.visionAnalysisAgent = new VisionAnalysisAgent(chatService);
    this.designStrategyAgent = new DesignStrategyAgent(chatService);
    this.promptEngineeringAgent = new PromptEngineeringAgent(chatService);
    this.multiProviderRouter = new MultiProviderRouterAgent(chatService);
  }

  async executeWorkflow(userInput: UserInput): Promise<AgentWorkflowResult> {
    const workflowSteps: AgentWorkflowResult['steps'] = {};

    try {
      console.log('Starting AI Agent Workflow...');

      // Step 1: Vision Analysis
      console.log('Step 1: Analyzing images...');
      const visionAnalysis = await this.visionAnalysisAgent.analyzeImages(userInput.images, userInput.prompt);
      workflowSteps.visionAnalysis = visionAnalysis;
      console.log('Vision analysis completed');

      // Step 2: Design Strategy
      console.log('Step 2: Creating design strategy...');
      const designStrategy = await this.designStrategyAgent.createStrategy(userInput, visionAnalysis);
      workflowSteps.designStrategy = designStrategy;
      console.log('Design strategy completed');

      // Step 3: Prompt Engineering
      console.log('Step 3: Engineering optimal prompt...');
      const enhancedPrompt = await this.promptEngineeringAgent.enhancePrompt(userInput, visionAnalysis, designStrategy);
      workflowSteps.enhancedPrompt = enhancedPrompt;
      console.log('Prompt engineering completed');

      // Step 4: Provider Selection
      console.log('Step 4: Selecting optimal providers...');
      const providerOptions = await this.multiProviderRouter.selectProviders(userInput, enhancedPrompt);
      workflowSteps.providerSelection = providerOptions;
      console.log('Provider selection completed: ', providerOptions);
      console.log(`Selected ${providerOptions.length} providers`);

      // Step 5: Multi-Provider Generation
      console.log('Step 5: Generating images with selected providers...');
      const generationPromises = providerOptions.map(option =>
        this.multiProviderRouter.generateWithProvider(option.provider, enhancedPrompt, userInput),
      );

      const generationResults = await Promise.allSettled(generationPromises);
      const successfulResults = generationResults
        .filter((result): result is PromiseFulfilledResult<GenerationResult> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(result => result.images.length > 0);

      workflowSteps.generation = successfulResults;
      console.log(`Generated ${successfulResults.length} successful results`);

      if (successfulResults.length === 0) {
        throw new Error('No successful image generations from any provider');
      }

      console.log('AI Agent Workflow completed successfully');

      return {
        success: true,
        output: successfulResults,
        steps: workflowSteps,
      };
    } catch (error) {
      console.error('Agent workflow failed:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown workflow error',
        steps: workflowSteps,
      };
    }
  }

  async executeStepByStep(userInput: UserInput): Promise<{
    visionAnalysis: VisionAnalysisResult;
    designStrategy: DesignStrategy;
    enhancedPrompt: EnhancedPrompt;
    providerOptions: ProviderOption[];
  }> {
    console.log('Executing workflow step by step for preview...');

    // Execute first 4 steps for preview/debugging
    const visionAnalysis = await this.visionAnalysisAgent.analyzeImages(userInput.images, userInput.prompt);

    const designStrategy = await this.designStrategyAgent.createStrategy(userInput, visionAnalysis);

    const enhancedPrompt = await this.promptEngineeringAgent.enhancePrompt(userInput, visionAnalysis, designStrategy);

    const providerOptions = await this.multiProviderRouter.selectProviders(userInput, enhancedPrompt);

    return {
      visionAnalysis,
      designStrategy,
      enhancedPrompt,
      providerOptions,
    };
  }
}
