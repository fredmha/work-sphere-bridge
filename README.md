# Project Wizard with OpenAI & Supabase Integration

This project integrates OpenAI API for project generation and Supabase for data persistence within the wizard flow.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (Frontend - for development only)
# Note: In production, this should be moved to a backend server for security
VITE_OPENAI_API_KEY=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
```

### 2. Supabase Database Setup

Create a `projects` table in your Supabase database with the following schema:

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_description TEXT,
  category TEXT[],
  duration TEXT,
  weekly_hours INTEGER,
  incentive TEXT[],
  contractor_roles JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Workflow

1. **User Input**: User describes their project in the AI Describe Step
2. **OpenAI Processing**: Project description is sent directly to OpenAI API from frontend
3. **State Management**: AI response is stored in ProjectContext state with detailed error handling
4. **Wizard Flow**: User reviews and edits the generated project through wizard steps
5. **Completion**: When user clicks "Launch Project", data is synced to Supabase
6. **Reset**: Wizard resets and user can start a new project

## Key Components

### ProjectContext.tsx
- Manages all wizard state including OpenAI responses and error states
- Handles project generation via `generateProjectWithAI()` with detailed error handling
- Manages project completion and Supabase sync via `completeProject()`
- Provides `lastError` state for displaying detailed error messages

### AiDescribeStep.tsx
- Replaced `invokellm` with `actions.generateProjectWithAI()`
- Integrates with OpenAI API through ProjectContext
- Displays detailed error messages instead of generic alerts
- Clears errors when user starts typing or selects suggestions

### src/lib/openai.ts (New)
- Direct OpenAI API integration with comprehensive error handling
- Custom `OpenAIError` class for detailed error information
- Environment variable validation and API key checking
- JSON response parsing with fallback handling

## Error Handling

### Backend Error Surfacing
- **OpenAI API Errors**: Detailed error messages including status codes, error types, and specific failure reasons
- **Network Errors**: HTTP status codes and connection issues
- **Parsing Errors**: JSON parsing failures with raw response debugging
- **Environment Errors**: Missing API key notifications

### Frontend Error Display
- **Real Error Messages**: Instead of "Something went wrong", users see specific error details
- **Error Categories**: Different error types (API, network, parsing, etc.) are clearly identified
- **Debugging Information**: Console logs provide detailed error context for developers
- **User-Friendly**: Errors are displayed in styled alert components with clear messaging

## Security Notes

⚠️ **Development Only**: This implementation uses the OpenAI API key in the frontend for development purposes. In production:

1. Move OpenAI API calls to a backend server
2. Store API key server-side only
3. Create secure API endpoints for project generation
4. Implement proper authentication and rate limiting

## Usage

1. Navigate to `/ProjectWizard`
2. Select "AI-Assisted Setup"
3. Describe your project in detail
4. Review and edit the AI-generated structure
5. Click "Launch Project" to save to database

## Troubleshooting

### Common Error Messages and Solutions:

- **"OpenAI API key not configured"**: Add `VITE_OPENAI_API_KEY` to your `.env` file
- **"OpenAI API error: 401"**: Invalid or expired API key
- **"OpenAI API error: 429"**: Rate limit exceeded, wait and retry
- **"Failed to parse AI response"**: AI returned invalid JSON, check console for raw response
- **"Database error"**: Supabase connection or table issues

### Debug Mode
Enable detailed logging by checking the browser console for:
- API request/response details
- Error stack traces
- Raw AI responses
- State changes and context updates
