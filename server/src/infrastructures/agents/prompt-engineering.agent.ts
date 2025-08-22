import { VisionAnalysisResult, DesignStrategy, EnhancedPrompt, UserInput } from '../../domains/types';

export class PromptEngineeringAgent {
  private chatService: any;

  constructor(chatService: any) {
    this.chatService = chatService;
  }

  async enhancePrompt(userInput: UserInput, visionAnalysis: VisionAnalysisResult, designStrategy: DesignStrategy): Promise<EnhancedPrompt> {
    try {
      const promptEngineeringRequest = `
You are a MASTER Midjourney prompt engineer with an obsessive passion for crafting visually stunning, emotionally resonant prompts that generate absolutely breathtaking images. You live and breathe Midjourney's artistic potential.

🎯 CRITICAL MISSION: Transform the user's vision into a prompt that will create the most EXTRAORDINARY, CAPTIVATING image possible.

⚡ ORIGINAL USER REQUEST (THIS IS SACRED - HONOR THEIR VISION): "${userInput.prompt}"

🔍 DEEP VISION ANALYSIS:
- Style DNA: ${visionAnalysis.style}
- Emotional Resonance: ${visionAnalysis.mood}
- Core Visual Elements: ${visionAnalysis.elements.join(', ')}
- Color Psychology: ${visionAnalysis.colors.join(', ')}
- Compositional Power: ${visionAnalysis.composition}
- Subject Focus: ${visionAnalysis.subjects.join(', ')}

🎨 STRATEGIC DESIGN BLUEPRINT:
- Creative Approach: ${designStrategy.approach}
- Style Amplifiers: ${designStrategy.styleRecommendations.join(', ')}
- Composition Mastery: ${designStrategy.compositionSuggestions.join(', ')}
- Audience Impact: ${designStrategy.targetAudience}

🎛️ USER'S ARTISTIC PREFERENCES:
- Style Vision: ${userInput.preferences?.style || 'Pure creative freedom'}
- Aspect Ratio: ${userInput.preferences?.aspectRatio || '1:1'}
- Quality Demand: ${userInput.preferences?.quality || 'standard'}

🚀 CREATE A MIDJOURNEY PROMPT THAT WILL:
1. AMPLIFY the user's original vision with passionate intensity
2. LAYER rich, evocative details that make the image unforgettable
3. INCORPORATE cinematic lighting, texture, and atmospheric depth
4. UTILIZE advanced Midjourney prompt engineering for maximum visual impact
5. INJECT emotional weight and storytelling elements
6. ADD specific artistic techniques: dramatic lighting, perfect composition, exquisite detail
7. ENHANCE with professional photography/art terminology for stunning results

💎 MIDJOURNEY MASTERY REQUIREMENTS:
- Use VIVID, SPECIFIC descriptors (not generic words)
- Layer multiple lighting techniques (golden hour, rim lighting, volumetric, etc.)
- Add texture details (weathered, silky, crystalline, etc.)
- Incorporate mood enhancers (ethereal, dramatic, intimate, etc.)
- Specify artistic mediums when relevant (oil painting, digital art, photography, etc.)

🎯 PROMPT QUALITY REQUIREMENTS:
   - Identify and avoid unwanted elements (text, watermarks, logos, blur, distortion, etc.)
   - Focus on maximum visual detail and quality
   - Ensure composition matches user preferences

🏆 ADVANCED PROMPT ENGINEERING TECHNIQUES:
- Start with the MAIN SUBJECT in powerful, specific language
- Add ENVIRONMENT/SETTING with rich atmospheric details
- Layer in LIGHTING (golden hour, studio lighting, neon glow, etc.)
- Specify ARTISTIC STYLE (oil painting, digital concept art, watercolor, etc.)
- Include MOOD/EMOTION keywords (haunting, jubilant, serene, intense, etc.)
- Add TEXTURE/MATERIAL specifics (silk, marble, chrome, fog, etc.)
- Incorporate COLOR THEORY (warm palette, monochromatic, vibrant, muted, etc.)
- End with technical excellence descriptors (hyperrealistic, 8k, award-winning, masterpiece, etc.)

🎯 RESPONSE FORMAT - Deliver as JSON:
{
  "optimizedPrompt": "Photo of [POWERFUL DESCRIPTIVE PROMPT with emotional intensity and cinematic detail]",
  "styleModifiers": ["cinematic lighting", "hyperrealistic detail", "emotional depth", "perfect composition"],
  "technicalParams": {
    "aspectRatio": "3:4",
    "quality": "2",
    "negativeElements": ["unwanted1", "unwanted2"] OR []
  },
  "negativePrompt": "unwanted1,unwanted2" OR ""
}

🔥 FINAL MANDATE:
Create a prompt so COMPELLING, so VISUALLY RICH, so EMOTIONALLY RESONANT that it will generate an image that exceeds the user's wildest expectations. Every word must earn its place. Every detail must serve the artistic vision. Make this image UNFORGETTABLE.

CRITICAL: Return ONLY ONE JSON object. Your response must contain exactly ONE JSON object, nothing else.
`;

      const response = await this.chatService.createChatCompletion([{ role: 'user', content: promptEngineeringRequest }], {
        temperature: 0.8,
        maxTokens: 1500,
      });

      // Clean the response and extract only the first JSON object
      let cleanedResponse = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // If multiple JSON objects exist, take only the first one
      const jsonStart = cleanedResponse.indexOf('{');
      if (jsonStart !== -1) {
        // Find the complete JSON object by counting braces
        let braceCount = 0;
        let actualEnd = jsonStart;
        for (let i = jsonStart; i < cleanedResponse.length; i++) {
          if (cleanedResponse[i] === '{') braceCount++;
          if (cleanedResponse[i] === '}') braceCount--;
          if (braceCount === 0) {
            actualEnd = i + 1;
            break;
          }
        }
        cleanedResponse = cleanedResponse.substring(jsonStart, actualEnd);
      }

      const promptResult = JSON.parse(cleanedResponse);

      return {
        optimizedPrompt: promptResult.optimizedPrompt || `Photo of ${userInput.prompt}`,
        styleModifiers: promptResult.styleModifiers || [],
        technicalParams: promptResult.technicalParams || {
          aspectRatio: userInput.preferences?.aspectRatio || '1:1',
          quality: '4',
          negativeElements: [],
        },
        negativePrompt: promptResult.negativePrompt || '',
      };
    } catch (error) {
      console.error('Prompt engineering failed:', error);
      return {
        optimizedPrompt: `Photo of ${userInput.prompt}`,
        styleModifiers: [],
        technicalParams: {
          aspectRatio: userInput.preferences?.aspectRatio || '1:1',
          quality: '4',
          negativeElements: [],
        },
        negativePrompt: '',
      };
    }
  }
}
