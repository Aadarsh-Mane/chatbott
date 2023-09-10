import openai from "./config/open-ai.js";
import readLineSync from "readline-sync";
import colors from "colors";

async function main() {
  const chatHistory = [];
  let defaultLanguage = "en"; // Default to English

  console.log(
    " Hindi (hi), Bengali (bn), Telugu (te), Tamil (ta), Marathi (mr), Urdu (ur), Gujarati (gu), Kannada (kn), Malayalam (ml), and Punjabi (pa)"
  );
  while (true) {
    const userInput = readLineSync.question(colors.red("You: "));

    if (userInput.toLowerCase() === "exit") {
      console.log(colors.green("Bot: Goodbye!"));
      return;
    }

    const validLanguages = [
      "en",
      "es",
      "fr",
      "de",
      "it",
      "pt",
      "nl",
      "ru",
      "ja",
      "zh",
      "ko",
      "hi",
      "bn",
      "te",
      "ta",
      "mr",
      "ur",
      "gu",
      "kn",
      "ml",
      "pa",
    ];
    if (validLanguages.includes(userInput.toLowerCase())) {
      defaultLanguage = userInput.toLowerCase();
      console.log(
        colors.green(
          `Bot: Language set to ${userInput}. You can now communicate in ${userInput}.`
        )
      );
      continue;
    }

    try {
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));
      messages.push({ role: "system", content: `language:${defaultLanguage}` }); // Set default language
      messages.push({ role: "user", content: userInput });

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });

      const completionText = chatCompletion.choices[0].message.content;

      // Extract language from the response and set it as the default for the next message
      const responseLanguage =
        chatCompletion.choices[0].message.content.language || defaultLanguage;
      defaultLanguage = responseLanguage;

      console.log(colors.green(`Bot (${responseLanguage}): ` + completionText));
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      console.log(colors.red("Error: " + error.message));
    }
  }
}

main();
