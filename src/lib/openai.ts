// OpenAI API client utility
// Note: In production, this should be moved to a backend server for security

interface OpenAIResponse {
  projectName: string;
  projectDescription: string;
  contractorRoles: Array<{
    role: string;
    description: string;
    type: 'milestone' | 'timesheet';
    pay: number;
    tasks: Array<{
      name: string;
      description: string;
      deliverables: string;
      price: number;
    }>;
  }>;
}

interface OpenAIError {
  error: {
    message: string;
    type?: string;
    code?: string;
  };
}

export class OpenAIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public type?: string
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export const generateProjectWithOpenAI = async (description: string): Promise<OpenAIResponse> => {
  try {
    // Check if API key is available (should be in .env file)
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new OpenAIError(
        'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.',
        401,
        'MISSING_API_KEY'
      );
    }

    console.log('Making OpenAI API call with description:', description.substring(0, 100) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert project manager and business analyst. Analyze project descriptions and extract structured data for contractor hiring platforms. Always respond with valid JSON only.`
          },
          {
            role: 'user',
            content: `Analyze this project description and extract structured data:

"${description}"

Parse this into a JSON object with the following structure:
{
  "projectName": "string - inferred project name",
  "projectDescription": "string - clean, professional summary",
  "contractorRoles": [
    {
      "role": "string - role name",
      "description": "string - role description", 
      "type": "milestone" or "timesheet",
      "pay": number - hourly rate for timesheet or total for milestone,
      "tasks": [
        {
          "name": "string - task name",
          "description": "string - task description",
          "deliverables": "string - expected deliverables",
          "price": number - task price
        }
      ]
    }
  ]
}

Be intelligent about inferring payment structures from context clues like "paid per hour", "per task", "deliverables", etc. Respond with ONLY the JSON object, no additional text.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData: OpenAIError = await response.json().catch(() => ({
        error: { message: `HTTP ${response.status}: ${response.statusText}` }
      }));

      throw new OpenAIError(
        errorData.error?.message || `OpenAI API error: ${response.status}`,
        response.status,
        errorData.error?.code,
        errorData.error?.type
      );
    }

    const data = await response.json();
    console.log('OpenAI API response data:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new OpenAIError(
        'Invalid response format from OpenAI API',
        500,
        'INVALID_RESPONSE_FORMAT'
      );
    }

    const aiResponse = data.choices[0].message.content;
    console.log('Raw AI response:', aiResponse);

    // Parse the JSON response from AI
    let parsedResponse: OpenAIResponse;
    try {
      // Clean the response - remove any markdown formatting
      const cleanResponse = aiResponse.replace(/```json\s*|\s*```/g, '').trim();
      parsedResponse = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response was:', aiResponse);
      
      // Provide a more detailed error for debugging
      throw new OpenAIError(
        `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}. Raw response: ${aiResponse.substring(0, 200)}...`,
        500,
        'PARSE_ERROR',
        'JSON_PARSE_FAILED'
      );
    }

    // Validate the parsed response structure
    if (!parsedResponse.projectName || !parsedResponse.projectDescription) {
      throw new OpenAIError(
        'AI response missing required fields (projectName, projectDescription)',
        500,
        'INVALID_RESPONSE_STRUCTURE'
      );
    }

    console.log('Successfully parsed OpenAI response:', parsedResponse);
    return parsedResponse;

  } catch (error) {
    console.error('OpenAI API call failed:', error);
    
    // Re-throw OpenAIError instances as-is
    if (error instanceof OpenAIError) {
      throw error;
    }
    
    // Wrap other errors
    throw new OpenAIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}; 