const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userInput } = JSON.parse(event.body);

    if (!userInput || userInput.trim().length < 5) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Input too short' })
      };
    }

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('CRITICAL: ANTHROPIC_API_KEY is not set!');
      throw new Error('API key not configured');
    }

    console.log('API Key exists:', process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO');
    console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length || 0);
    console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 7) || 'undefined');

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const systemPrompt = `You are a poetic metaphor generator. Transform the user's emotional state into a single, beautiful metaphor (under 40 words). Use natural imagery: weather, water, light, landscapes, seasons. Be gentle, contemplative, and symbolic. Never be literal or use therapy language.`;

    console.log('Calling Anthropic API with model: claude-3-5-sonnet-20241022');

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      temperature: 0.9,
      system: systemPrompt,
      messages: [{ role: 'user', content: userInput }]
    });

    console.log('API Response received successfully');

    const metaphor = message.content[0].text.trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ metaphor })
    };

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error type:', error.type);
    console.error('Error status:', error.status);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Function error',
        metaphor: 'Like a lantern in the fog — your light is there, just waiting for the mist to clear.',
        debug: error.message,
        errorType: error.name,
        errorStatus: error.status
      })
    };
  }
};
