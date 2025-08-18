import { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Text,
  ProgressBar,
  Badge,
  Divider,
  Frame,
  InlineStack,
} from "@shopify/polaris";
import { AgentStreamingInterface } from "../agent-streaming-interface";
import "./agent-workflow-container.module.css";

interface StreamingEvent {
  type: "step_start" | "step_complete" | "workflow_complete" | "workflow_error";
  step: string;
  data?: any;
  timestamp: string;
  progress: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  data?: any;
  startTime?: string;
  endTime?: string;
}

const DEFAULT_DATA = {
  prompt: "Thêm bé gái vào trong ảnh",
  images: ["https://s3.awe7.com/hai-imagegen/reference_medlycb55ua6.jpg"],
  preferences: {
    quality: "high",
  },
};

const WORKFLOW_STEPS: Omit<WorkflowStep, "status" | "startTime" | "endTime">[] =
  [
    {
      id: "vision_analysis",
      name: "Vision Analysis",
      description: "Analyzing input images and understanding visual elements",
    },
    {
      id: "design_strategy",
      name: "Design Strategy",
      description: "Creating strategic approach based on analysis",
    },
    {
      id: "prompt_engineering",
      name: "Prompt Engineering",
      description: "Enhancing prompts for optimal results",
    },
    {
      id: "provider_selection",
      name: "Provider Selection",
      description: "Selecting best providers for the task",
    },
    {
      id: "image_generation",
      name: "Image Generation",
      description: "Generating images with selected providers",
    },
  ];

export function AgentWorkflowContainer() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>(
    WORKFLOW_STEPS.map((step) => ({ ...step, status: "pending" }))
  );
  const [events, setEvents] = useState<StreamingEvent[]>([]);
  const [results, setResults] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startWorkflow = async () => {
    setIsRunning(true);
    setProgress(0);
    setEvents([]);
    setResults(null);
    setSteps(WORKFLOW_STEPS.map((step) => ({ ...step, status: "pending" })));

    try {
      // Create abort controller for cancellation
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      console.log('🚀 Starting streaming request to server...');
      
      // Start Server-Sent Events streaming with POST request
      const response = await fetch(
        "http://localhost:4001/api/v1/data/agent/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(DEFAULT_DATA),
          signal: abortController.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Got response from server, starting to read stream...');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body reader available");
      }

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream completed");
            setIsRunning(false);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim() === "") continue;

            // Parse Server-Sent Events format
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.substring(6); // Remove 'data: ' prefix
                const streamingEvent: StreamingEvent = JSON.parse(jsonStr);
                console.log("Received streaming event:", streamingEvent);
                console.log("Available step IDs:", WORKFLOW_STEPS.map(s => s.id));

                setEvents((prev) => [...prev, streamingEvent]);
                setProgress(streamingEvent.progress || 0);

                // Update step status
                setSteps((prev) => {
                  const updated = prev.map((step) => {
                    if (step.id === streamingEvent.step) {
                      console.log(`🎯 Matching step found: ${step.id} -> ${streamingEvent.type}`);
                      if (streamingEvent.type === "step_start") {
                        return {
                          ...step,
                          status: "running" as const,
                          startTime: streamingEvent.timestamp,
                        };
                      } else if (streamingEvent.type === "step_complete") {
                        return {
                          ...step,
                          status: "completed" as const,
                          endTime: streamingEvent.timestamp,
                          data: streamingEvent.data,
                        };
                      }
                    }
                    return step;
                  });
                  
                  console.log(`📊 Step statuses after update:`, updated.map(s => `${s.id}: ${s.status}`));
                  return updated;
                });
                
                console.log(`📊 Updated step ${streamingEvent.step} to ${streamingEvent.type}`);

                // Handle workflow completion
                if (streamingEvent.type === "workflow_complete") {
                  setResults(streamingEvent.data || streamingEvent);
                  setIsRunning(false);
                  break;
                }
              } catch (parseError) {
                console.error(
                  "Error parsing event data:",
                  parseError,
                  "Line:",
                  line
                );
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Failed to start workflow:", error);
      setIsRunning(false);
    }
  };

  const stopWorkflow = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
  };

  return (
    <Frame>
      <Box padding="600">
        <InlineStack>
          {/* Header */}
          <Card>
            <Box padding="400">
              <InlineStack>
                <InlineStack>
                  <Text as="h1" variant="headingLg">
                    AI Agent Workflow
                  </Text>
                  <Text as="span" variant="bodyMd" tone="subdued">
                    Advanced image generation with multi-step AI analysis
                  </Text>
                </InlineStack>
                <InlineStack>
                  <Button
                    variant="primary"
                    onClick={startWorkflow}
                    disabled={isRunning}
                    loading={isRunning}
                  >
                    {isRunning ? "Running..." : "Start Workflow"}
                  </Button>
                  {isRunning && <Button onClick={stopWorkflow}>Stop</Button>}
                </InlineStack>
              </InlineStack>
            </Box>
          </Card>

          {/* Progress */}
          {isRunning && (
            <Card>
              <Box padding="400">
                <InlineStack>
                  <InlineStack>
                    <Text as="h2" variant="headingMd">
                      Progress
                    </Text>
                    <Text as="span" variant="bodyMd" tone="subdued">
                      {progress.toFixed(2)}% Complete
                    </Text>
                  </InlineStack>
                  <ProgressBar
                    progress={progress}
                    size="small"
                    tone="success"
                  />
                </InlineStack>
              </Box>
            </Card>
          )}

          {/* Workflow Steps */}
          <Card>
            <Box padding="400">
              <InlineStack>
                <Text as="h2" variant="headingMd">
                  Workflow Steps
                </Text>
                <Divider />
                {steps.map((step, index) => (
                  <Box key={step.id}>
                    <InlineStack>
                      <InlineStack>
                        <Box
                          padding="100"
                          borderRadius="full"
                          minWidth="24px"
                          minHeight="24px"
                        >
                          <Text as="span" variant="bodyMd" alignment="center">
                            {index + 1}
                          </Text>
                        </Box>
                        <InlineStack>
                          <Text
                            as="span"
                            variant="bodySm"
                            fontWeight="semibold"
                          >
                            {step.name}
                          </Text>
                          <Text as="span" variant="bodyXs" tone="subdued">
                            {step.description}
                          </Text>
                        </InlineStack>
                      </InlineStack>
                      <Badge>
                        {step.status === "pending"
                          ? "Pending"
                          : step.status === "running"
                          ? "Running..."
                          : step.status === "completed"
                          ? "Completed"
                          : "Error"}
                      </Badge>
                    </InlineStack>
                    {index < steps.length - 1 && <Divider />}
                  </Box>
                ))}
              </InlineStack>
            </Box>
          </Card>

          {/* Real-time Streaming Interface */}
          <AgentStreamingInterface events={events} steps={steps} />

          {/* Results */}
          {results && (
            <Card>
              <Box padding="400">
                <InlineStack>
                  <Text as="h2" variant="headingMd">
                    Results
                  </Text>
                  <Divider />
                  <Box background="bg-surface" padding="300" borderRadius="200">
                    <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </Box>
                </InlineStack>
              </Box>
            </Card>
          )}
        </InlineStack>
      </Box>
    </Frame>
  );
}
