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

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const systemPrompt = `You are a poetic metaphor generator. Transform the user's emotional state into a single, beautiful metaphor (under 40 words). Use natural imagery: weather, water, light, landscapes, seasons. Be gentle, contemplative, and symbolic. Never be literal or use therapy language.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      temperature: 0.9,
      system: systemPrompt,
      messages: [{ role: 'user', content: userInput }]
    });

    const metaphor = message.content[0].text.trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ metaphor })
    };

  } catch (error) {
    console.error('ERROR:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Function error',
        metaphor: 'Like a lantern in the fog — your light is there, just waiting for the mist to clear.',
        debug: error.message
      })
    };
  }
};
