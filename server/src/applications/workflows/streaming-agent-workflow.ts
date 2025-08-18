import { VisionAnalysisAgent } from '../../infrastructures/agents/vision-analysis.agent';
import { DesignStrategyAgent } from '../../infrastructures/agents/design-strategy.agent';
import { PromptEngineeringAgent } from '../../infrastructures/agents/prompt-engineering.agent';
import { MultiProviderRouterAgent } from '../../infrastructures/agents/multi-provider-router.agent';
import { createAgentChatService } from '../../infrastructures/services/chat.service';
import { 
  UserInput, 
  StreamingEvent,
  StreamingWorkflowResult,
  VisionAnalysisResult, 
  DesignStrategy, 
  EnhancedPrompt,
  ProviderOption,
  GenerationResult,
} from '../../domains/types';

export class StreamingAgentWorkflow {
  private visionAnalysisAgent: VisionAnalysisAgent;
  private designStrategyAgent: DesignStrategyAgent;
  private promptEngineeringAgent: PromptEngineeringAgent;
  private multiProviderRouter: MultiProviderRouterAgent;

  private events: StreamingEvent[] = [];
  private totalSteps = 5;
  private completedSteps = 0;

  constructor(openAiApiKey: string, baseURL?: string) {
    const chatService = createAgentChatService(openAiApiKey, baseURL);
    
    this.visionAnalysisAgent = new VisionAnalysisAgent(chatService);
    this.designStrategyAgent = new DesignStrategyAgent(chatService);
    this.promptEngineeringAgent = new PromptEngineeringAgent(chatService);
    this.multiProviderRouter = new MultiProviderRouterAgent(chatService);
  }

  private emitEvent(type: StreamingEvent['type'], step: string, data?: any): StreamingEvent {
    const event: StreamingEvent = {
      type,
      step,
      data,
      timestamp: new Date().toISOString(),
      progress: Math.round((this.completedSteps / this.totalSteps) * 100)
    };
    
    this.events.push(event);
    return event;
  }

  async executeStreamingWorkflow(
    userInput: UserInput,
    onEvent?: (event: StreamingEvent) => void
  ): Promise<StreamingWorkflowResult> {
    this.events = [];
    this.completedSteps = 0;

    let visionAnalysis: VisionAnalysisResult | undefined;
    let designStrategy: DesignStrategy | undefined;
    let enhancedPrompt: EnhancedPrompt | undefined;
    let providerOptions: ProviderOption[] = [];
    let generationResults: GenerationResult[] = [];

    try {
      // Step 1: Vision Analysis
      const step1Event = this.emitEvent('step_start', 'vision_analysis');
      onEvent?.(step1Event);

      visionAnalysis = await this.visionAnalysisAgent.analyzeImages(
        userInput.images,
        userInput.prompt
      );

      this.completedSteps++;
      const step1Complete = this.emitEvent('step_complete', 'vision_analysis', {
        description: visionAnalysis!.description,
        style: visionAnalysis!.style,
        mood: visionAnalysis!.mood,
        elements: visionAnalysis!.elements,
        colors: visionAnalysis!.colors
      });
      onEvent?.(step1Complete);

      // Step 2: Design Strategy
      const step2Event = this.emitEvent('step_start', 'design_strategy');
      onEvent?.(step2Event);

      designStrategy = await this.designStrategyAgent.createStrategy(
        userInput,
        visionAnalysis!
      );

      this.completedSteps++;
      const step2Complete = this.emitEvent('step_complete', 'design_strategy', {
        approach: designStrategy!.approach,
        styleRecommendations: designStrategy!.styleRecommendations,
        targetAudience: designStrategy!.targetAudience
      });
      onEvent?.(step2Complete);

      // Step 3: Prompt Engineering
      const step3Event = this.emitEvent('step_start', 'prompt_engineering');
      onEvent?.(step3Event);

      enhancedPrompt = await this.promptEngineeringAgent.enhancePrompt(
        userInput,
        visionAnalysis!,
        designStrategy!
      );

      this.completedSteps++;
      const step3Complete = this.emitEvent('step_complete', 'prompt_engineering', {
        optimizedPrompt: enhancedPrompt!.optimizedPrompt,
        styleModifiers: enhancedPrompt!.styleModifiers,
        technicalParams: enhancedPrompt!.technicalParams
      });
      onEvent?.(step3Complete);

      // Step 4: Provider Selection
      const step4Event = this.emitEvent('step_start', 'provider_selection');
      onEvent?.(step4Event);

      providerOptions = await this.multiProviderRouter.selectProviders(
        userInput,
        enhancedPrompt!
      );

      this.completedSteps++;
      const step4Complete = this.emitEvent('step_complete', 'provider_selection', {
        selectedProvider: providerOptions[0]?.provider,
        confidence: providerOptions[0]?.confidence,
        estimatedCost: providerOptions[0]?.estimatedCost,
        estimatedTime: providerOptions[0]?.estimatedTime
      });
      onEvent?.(step4Complete);

      // Step 5: Image Generation
      const step5Event = this.emitEvent('step_start', 'image_generation');
      onEvent?.(step5Event);

      const generationPromises = providerOptions.map(option =>
        this.multiProviderRouter.generateWithProvider(
          option.provider,
          enhancedPrompt!,
          userInput
        )
      );

      const generationPromiseResults = await Promise.allSettled(generationPromises);
      generationResults = generationPromiseResults
        .filter((result): result is PromiseFulfilledResult<GenerationResult> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .filter(result => result.images.length > 0);

      if (generationResults.length === 0) {
        throw new Error('No successful image generations from any provider');
      }

      this.completedSteps++;
      const step5Complete = this.emitEvent('step_complete', 'image_generation', {
        provider: generationResults[0]?.provider,
        imagesCount: generationResults[0]?.images.length,
        generationTime: generationResults[0]?.generationTime,
        cost: generationResults[0]?.cost,
        images: generationResults[0]?.images
      });
      onEvent?.(step5Complete);

      // Workflow Complete
      const workflowComplete = this.emitEvent('workflow_complete', 'workflow', {
        totalTime: generationResults.reduce((sum, result) => sum + result.generationTime, 0),
        totalCost: generationResults.reduce((sum, result) => sum + result.cost, 0),
        providersUsed: generationResults.map(result => result.provider)
      });
      onEvent?.(workflowComplete);

      return {
        success: true,
        output: generationResults,
        events: this.events,
        totalSteps: this.totalSteps,
        completedSteps: this.completedSteps
      };

    } catch (error) {
      const errorEvent = this.emitEvent('workflow_error', 'workflow', {
        error: error instanceof Error ? error.message : 'Unknown workflow error'
      });
      onEvent?.(errorEvent);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown workflow error',
        events: this.events,
        totalSteps: this.totalSteps,
        completedSteps: this.completedSteps
      };
    }
  }

  async *executeStreamingWorkflowGenerator(userInput: UserInput): AsyncGenerator<StreamingEvent, StreamingWorkflowResult> {
    this.events = [];
    this.completedSteps = 0;

    let visionAnalysis: VisionAnalysisResult | undefined;
    let designStrategy: DesignStrategy | undefined;
    let enhancedPrompt: EnhancedPrompt | undefined;
    let providerOptions: ProviderOption[] = [];
    let generationResults: GenerationResult[] = [];

    try {
      // Step 1: Vision Analysis
      console.log(`📤 Yielding step_start: vision_analysis`);
      yield this.emitEvent('step_start', 'vision_analysis');

      visionAnalysis = await this.visionAnalysisAgent.analyzeImages(
        userInput.images,
        userInput.prompt
      );

      this.completedSteps++;
      console.log(`📤 Yielding step_complete: vision_analysis with data:`, {
        description: visionAnalysis.description?.substring(0, 50) + '...',
        hasStyle: !!visionAnalysis.style,
        hasElements: !!visionAnalysis.elements,
      });
      yield this.emitEvent('step_complete', 'vision_analysis', {
        description: visionAnalysis.description,
        style: visionAnalysis.style,
        mood: visionAnalysis.mood,
        elements: visionAnalysis.elements,
        colors: visionAnalysis.colors
      });

      // Step 2: Design Strategy
      console.log(`📤 Yielding step_start: design_strategy`);
      yield this.emitEvent('step_start', 'design_strategy');

      designStrategy = await this.designStrategyAgent.createStrategy(
        userInput,
        visionAnalysis!
      );

      this.completedSteps++;
      yield this.emitEvent('step_complete', 'design_strategy', {
        approach: designStrategy.approach,
        styleRecommendations: designStrategy.styleRecommendations,
        targetAudience: designStrategy.targetAudience
      });

      // Step 3: Prompt Engineering
      yield this.emitEvent('step_start', 'prompt_engineering');

      enhancedPrompt = await this.promptEngineeringAgent.enhancePrompt(
        userInput,
        visionAnalysis!,
        designStrategy!
      );

      this.completedSteps++;
      yield this.emitEvent('step_complete', 'prompt_engineering', {
        optimizedPrompt: enhancedPrompt.optimizedPrompt,
        styleModifiers: enhancedPrompt.styleModifiers,
        technicalParams: enhancedPrompt.technicalParams
      });

      // Step 4: Provider Selection
      yield this.emitEvent('step_start', 'provider_selection');

      providerOptions = await this.multiProviderRouter.selectProviders(
        userInput,
        enhancedPrompt!
      );

      this.completedSteps++;
      yield this.emitEvent('step_complete', 'provider_selection', {
        selectedProvider: providerOptions[0]?.provider,
        confidence: providerOptions[0]?.confidence,
        estimatedCost: providerOptions[0]?.estimatedCost,
        estimatedTime: providerOptions[0]?.estimatedTime
      });

      // Step 5: Image Generation
      yield this.emitEvent('step_start', 'image_generation');

      const generationPromises = providerOptions.map(option =>
        this.multiProviderRouter.generateWithProvider(
          option.provider,
          enhancedPrompt!,
          userInput
        )
      );

      const generationPromiseResults = await Promise.allSettled(generationPromises);
      generationResults = generationPromiseResults
        .filter((result): result is PromiseFulfilledResult<GenerationResult> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .filter(result => result.images.length > 0);

      if (generationResults.length === 0) {
        throw new Error('No successful image generations from any provider');
      }

      this.completedSteps++;
      yield this.emitEvent('step_complete', 'image_generation', {
        provider: generationResults[0]?.provider,
        imagesCount: generationResults[0]?.images.length,
        generationTime: generationResults[0]?.generationTime,
        cost: generationResults[0]?.cost,
        images: generationResults[0]?.images
      });

      // Workflow Complete
      yield this.emitEvent('workflow_complete', 'workflow', {
        totalTime: generationResults.reduce((sum, result) => sum + result.generationTime, 0),
        totalCost: generationResults.reduce((sum, result) => sum + result.cost, 0),
        providersUsed: generationResults.map(result => result.provider)
      });

      return {
        success: true,
        output: generationResults,
        events: this.events,
        totalSteps: this.totalSteps,
        completedSteps: this.completedSteps
      };

    } catch (error) {
      yield this.emitEvent('workflow_error', 'workflow', {
        error: error instanceof Error ? error.message : 'Unknown workflow error'
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown workflow error',
        events: this.events,
        totalSteps: this.totalSteps,
        completedSteps: this.completedSteps
      };
    }
  }
}