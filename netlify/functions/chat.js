exports.handler = async function(event) {
    const { message, history } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant on Oliver Olsons personal website.' },
                ...history,
                { role: 'user', content: message }
            ]
        })
    });

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!data.choices) {
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: 'OpenAI error: ' + JSON.stringify(data) })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ reply: data.choices[0].message.content })
    };
};
