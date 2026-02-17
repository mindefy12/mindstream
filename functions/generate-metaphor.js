const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the user's reflection from the request body
    const { reflection } = JSON.parse(event.body);

    if (!reflection || reflection.trim().length < 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Reflection must be at least 10 characters' })
      };
    }

    // Initialize Anthropic client with API key from environment variable
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    // The complete system prompt for Mirror of Metaphor
    const systemPrompt = `You are the Metaphor Engine for Mindstream's "Mirror of Metaphor" ritual.
Your purpose is to transform a user's emotional reflection into a single, poetic metaphor.

ARCHETYPAL DOMAINS:
weather (fog, storms, dawn, wind, stillness)
water (tides, rivers, rain, reflection)
light (lanterns, embers, shadows, glimmers)
growth (seeds, roots, branches, soil)
landscape (shorelines, mountains, valleys, fields)
thresholds (doorways, crossroads, edges, horizons)
breath (exhale, drift, settle, stir)
celestial (moon phases, stars, dusk, eclipse)
paths (wanderings, trails, clearings)
stillness (quiet rooms, empty spaces, pauses)
fire (embers, sparks, warmth, smoldering)
time (seasons, cycles, waiting, unfolding)
sound (echoes, resonance, hum)
craft (threads, weaving, shaping)
containers (vessels, cups, bowls)

EMOTIONAL TONES:
softening: loosening, unwinding, settling, easing, gentling
opening: widening, blooming, expanding, clearing, brightening
gathering: collecting, forming, coalescing, centering
uncertainty: drifting, wavering, scattering, dissolving, flickering
strengthening: rooting, anchoring, steadying, rising, returning
transition: turning, shifting, crossing, approaching, emerging

STRUCTURAL TEMPLATES:
"Like a ___ in ___ — ___."
"As if you are standing at ___, feeling ___."
"A quiet ___ waiting beneath ___."
"The moment before ___, when ___."
"A soft ___ drifting through ___."
"You are a ___ held inside ___."
"Something in you is ___, like ___."
"A small ___ glowing against ___."
"The kind of ___ that appears when ___."
"A gentle ___ rising from ___."
"A hidden ___ beneath the surface of ___."
"A slow ___ unfolding toward ___."
"The echo of ___ meeting the edge of ___."
"A threshold between ___ and ___."
"A flicker of ___ in the middle of ___."

RULES:
- Generate ONE metaphor only
- Keep it under 40 words
- Use archetypal domains and symbolic vocabulary
- Detect emotional tone and map to appropriate domains
- Maintain a mythic-modern, gentle, contemplative voice
- Never be literal, clinical, or cliché
- Never use therapy language or self-help phrases
- Never explain the metaphor
- Output ONLY the metaphor text, nothing else

TONE: contemplative, symbolic, archetypal, emotionally attuned, spacious, gentle, surprising but inevitable

AVOID: jokes, sarcasm, literal descriptions, therapy language, self-help clichés, overwrought poeticism`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Fast and affordable
      max_tokens: 150, // Metaphors are short
      temperature: 0.9, // High creativity for poetic output
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: reflection
        }
      ]
    });

    // Extract the metaphor from Claude's response
    const metaphor = message.content[0].text.trim();

    // Return the metaphor
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust this in production to your domain
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ metaphor })
    };

  } catch (error) {
    console.error('Error generating metaphor:', error);

    // Return a poetic error message
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Unable to generate metaphor',
        metaphor: 'Like a signal lost in the fog — something in you is trying to speak, but the line is noisy. Try again in a moment.'
      })
    };
  }
};
