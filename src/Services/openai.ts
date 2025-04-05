const OPENAI_API_KEY = "your_OPENAI_API_KEY"; // Replace with your actual API key

/**

 * @param prompt - The prompt to send to OpenAI.
 * @returns The generated reply text.
 * @throws Error if no reply is generated.
 */
export async function generateReply(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not set.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant. You generate comments based on posts nature" },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (
    data &&
    data.choices &&
    data.choices.length > 0 &&
    data.choices[0].message?.content
  ) {
    return data.choices[0].message.content;
  }
  throw new Error("No reply generated from OpenAI.");
}