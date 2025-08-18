import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Text,
  InlineStack,
  Badge,
  Divider,
  Collapsible,
  Button,
  Icon,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import "./agent-streaming-interface.module.css";

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

interface AgentStreamingInterfaceProps {
  events: StreamingEvent[];
  steps: WorkflowStep[];
}

interface StepDetailProps {
  step: WorkflowStep;
  isExpanded: boolean;
  onToggle: () => void;
}

function StepDetail({ step, isExpanded, onToggle }: StepDetailProps) {
  const renderStepData = (data: any) => {
    if (!data) return null;

    switch (step.id) {
      case "vision_analysis":
        return (
          <InlineStack>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Description:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.description}
            </Text>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Style:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.style}
            </Text>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Mood:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.mood}
            </Text>

            {data.elements && (
              <>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Elements:
                </Text>
                <Box>
                  {data.elements.map((element: string, index: number) => (
                    <Badge key={index}>{element}</Badge>
                  ))}
                </Box>
              </>
            )}

            {data.colors && (
              <>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Colors:
                </Text>
                <Box>
                  {data.colors.map((color: string, index: number) => (
                    <Badge key={index}>{color}</Badge>
                  ))}
                </Box>
              </>
            )}
          </InlineStack>
        );

      case "design_strategy":
        return (
          <InlineStack>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Approach:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.approach}
            </Text>

            {data.styleRecommendations && (
              <>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Style Recommendations:
                </Text>
                <InlineStack>
                  {data.styleRecommendations.map(
                    (rec: string, index: number) => (
                      <Text as="span" key={index} variant="bodyMd">
                        • {rec}
                      </Text>
                    )
                  )}
                </InlineStack>
              </>
            )}

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Target Audience:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.targetAudience}
            </Text>
          </InlineStack>
        );

      case "prompt_engineering":
        return (
          <InlineStack>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Optimized Prompt:
            </Text>
            <Box background="bg-surface" padding="300" borderRadius="200">
              <Text as="span" variant="bodyMd">
                {data.optimizedPrompt}
              </Text>
            </Box>

            {data.styleModifiers && (
              <>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Style Modifiers:
                </Text>
                <Box>
                  {data.styleModifiers.map(
                    (modifier: string, index: number) => (
                      <Badge key={index}>{modifier}</Badge>
                    )
                  )}
                </Box>
              </>
            )}

            {data.technicalParams && (
              <>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Technical Parameters:
                </Text>
                <Box background="bg-surface" padding="200" borderRadius="200">
                  <pre style={{ fontSize: "12px", margin: 0 }}>
                    {JSON.stringify(data.technicalParams, null, 2)}
                  </pre>
                </Box>
              </>
            )}
          </InlineStack>
        );

      case "provider_selection":
        return (
          <InlineStack>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Selected Provider:
            </Text>
            <Badge>{data.selectedProvider}</Badge>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Confidence:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.confidence}%
            </Text>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Estimated Cost:
            </Text>
            <Text as="span" variant="bodyMd">
              ${data.estimatedCost}
            </Text>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Estimated Time:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.estimatedTime}s
            </Text>
          </InlineStack>
        );

      case "image_generation":
        return (
          <InlineStack>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Provider:
            </Text>
            <Badge>{data.provider}</Badge>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Images Generated:
            </Text>
            <Text as="span" variant="bodyMd">
              {data.imagesCount} images
            </Text>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Generation Time:
            </Text>
            <Text as="span" variant="bodyMd">
              {(data.generationTime / 1000).toFixed(2)}s
            </Text>

            <Text as="span" variant="bodyMd" fontWeight="semibold">
              Cost:
            </Text>
            <Text as="span" variant="bodyMd">
              ${data.cost}
            </Text>

            {data.images && data.images.length > 0 && (
              <>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Generated Images:
                </Text>
                <InlineStack>
                  {data.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Generated image ${index + 1}`}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid var(--p-color-border-subdued)",
                      }}
                    />
                  ))}
                </InlineStack>
              </>
            )}
          </InlineStack>
        );

      default:
        return (
          <Box background="bg-surface" padding="300" borderRadius="200">
            <pre
              style={{ fontSize: "12px", margin: 0, whiteSpace: "pre-wrap" }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          </Box>
        );
    }
  };

  return (
    <Card>
      <Box padding="400">
        <InlineStack>
          <div onClick={onToggle}>
            <InlineStack>
              <InlineStack>
                <Box padding="100">
                  <Text
                    as="span"
                    variant="bodyMd"
                    alignment="center"
                    fontWeight="semibold"
                  >
                    {step.status === "completed"
                      ? "✓"
                      : step.status === "running"
                      ? "⟳"
                      : step.status === "error"
                      ? "✗"
                      : "○"}
                  </Text>
                </Box>
                <InlineStack>
                  <Text as="span" variant="bodyLg" fontWeight="semibold">
                    {step.name}
                  </Text>
                  <Text as="span" variant="bodyMd" tone="subdued">
                    {step.description}
                  </Text>
                </InlineStack>
              </InlineStack>
              <InlineStack>
                <Badge>
                  {step.status === "pending"
                    ? "Pending"
                    : step.status === "running"
                    ? "Running..."
                    : step.status === "completed"
                    ? "Completed"
                    : "Error"}
                </Badge>
                <Icon source={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
              </InlineStack>
            </InlineStack>
          </div>

          <Collapsible id={step.id} open={isExpanded}>
            <Box paddingBlockStart="400">
              <Divider />
              <Box paddingBlockStart="400">
                {step.status === "completed" && step.data ? (
                  renderStepData(step.data)
                ) : step.status === "running" ? (
                  <InlineStack>
                    <div className="spinner" />
                    <Text as="span" variant="bodyMd" tone="subdued">
                      Processing...
                    </Text>
                  </InlineStack>
                ) : (
                  <Text as="span" variant="bodyMd" tone="subdued">
                    Waiting to start...
                  </Text>
                )}
              </Box>
            </Box>
          </Collapsible>
        </InlineStack>
      </Box>
    </Card>
  );
}

export function AgentStreamingInterface({
  events,
  steps,
}: AgentStreamingInterfaceProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // Auto-expand completed steps
  useEffect(() => {
    steps.forEach((step) => {
      if (step.status === "completed" && !expandedSteps.has(step.id)) {
        setExpandedSteps((prev) => new Set([...prev, step.id]));
      }
    });
  }, [steps, expandedSteps]);

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <Card>
      <Box padding="400">
        <InlineStack>
          <Text as="span" variant="headingMd">
            Live Workflow Execution
          </Text>
          <Text as="span" variant="bodyMd" tone="subdued">
            Watch the AI agent work through each step in real-time
          </Text>
          <Divider />

          <InlineStack>
            {steps.map((step) => (
              <StepDetail
                key={step.id}
                step={step}
                isExpanded={expandedSteps.has(step.id)}
                onToggle={() => toggleStepExpansion(step.id)}
              />
            ))}
          </InlineStack>

          {/* Live Events Log */}
          <Box>
            <Text as="span" variant="headingMd">
              Live Events Log
            </Text>
            <Box background="bg-surface" padding="300" borderRadius="200">
              {events.map((event, index) => (
                <Box key={index} paddingBlockEnd="100">
                  <Text
                    as="span"
                    variant="bodyXs"
                    fontWeight="semibold"
                    tone="subdued"
                  >
                    [{new Date(event.timestamp).toLocaleTimeString()}]
                  </Text>
                  <Text as="span" variant="bodyXs">
                    {" "}
                    {event.type === "step_start" && "🔄 Started: "}
                    {event.type === "step_complete" && "✅ Completed: "}
                    {event.type === "workflow_complete" &&
                      "🎉 Workflow Complete"}
                    {event.type === "workflow_error" && "❌ Error: "}
                    {event.step && event.step.replace("_", " ")}
                    {event.progress !== undefined && ` (${event.progress}%)`}
                  </Text>
                </Box>
              ))}
              <div ref={eventsEndRef} />
            </Box>
          </Box>
        </InlineStack>
      </Box>
    </Card>
  );
}
