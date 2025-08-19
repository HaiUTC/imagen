export type StreamingEventType = 'start' | 'complete' | 'progress';

export type StreamingStep = 'analytic_image' | 'magic_processing' | 'generate_image';

export interface StreamingEventData {
  type: StreamingEventType;
  step: StreamingStep;
  progress: number;
  process?: number; // Only exists during image generation pooling
  data?: any;
}

export class StreamingEvent {
  private static readonly STEP_MESSAGES: Record<StreamingStep, Record<StreamingEventType, string>> = {
    analytic_image: {
      start: 'analytic_image',
      complete: 'analytic_image',
      progress: 'analytic_image',
    },
    magic_processing: {
      start: 'magic_processing',
      complete: 'magic_processing',
      progress: 'magic_processing',
    },
    generate_image: {
      start: 'generate_image',
      complete: 'generate_image',
      progress: 'generate_image',
    },
  };

  public readonly type: StreamingEventType;
  public readonly step: StreamingStep;
  public readonly progress: number;
  public readonly process?: number;
  public readonly data?: any;

  constructor(
    type: StreamingEventType,
    step: StreamingStep,
    progress: number,
    options: {
      process?: number;
      data?: any;
    } = {},
  ) {
    this.type = type;
    this.step = step;
    this.progress = Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
    this.process = options.process;
    this.data = options.data;
  }

  /**
   * Create a step start event
   */
  static stepStart(step: StreamingStep, progress: number = 0, data?: any): StreamingEvent {
    return new StreamingEvent('start', step, progress, { data });
  }

  /**
   * Create a step complete event
   */
  static stepComplete(step: StreamingStep, progress: number = 0, data?: any): StreamingEvent {
    return new StreamingEvent('complete', step, progress, { data });
  }

  /**
   * Create a step progress event (only used during image generation with process)
   */
  static stepProgress(step: StreamingStep, progress: number, data?: any): StreamingEvent {
    return new StreamingEvent('progress', step, progress);
  }

  /**
   * Convert to plain object for JSON serialization
   */
  toJSON(): StreamingEventData {
    const result: StreamingEventData = {
      type: this.type,
      step: this.step,
      progress: this.progress,
    };

    // Only include process field if it exists (during image generation)
    if (this.process !== undefined) {
      result.process = this.process;
    }

    // Only include data field if it exists
    if (this.data !== undefined) {
      result.data = this.data;
    }

    return result;
  }
}
