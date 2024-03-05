import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";
import chalk from "npm:chalk@5";
import boxen from "npm:boxen";

// const fetchOpenAIResponse = async (userQuery, role) => {
//   const prompt =
//     `You are an empathetic and intelligent ${role}. Guide the children go through reflections and generate a simple and creative art project instruction`;

//   const response = await fetch("https://api.openai.com/v1/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
//     },
//     body: JSON.stringify({
//       model: "text-davinci-003",
//       prompt: prompt,
//       temperature: 0.7,
//       max_tokens: 150,
//       top_p: 1.0,
//       frequency_penalty: 0.0,
//       presence_penalty: 0.0,
//     }),
//   });

//   const data = await response.json(); // Parsing the JSON response from the API
//   return data.choices[0].text.trim(); // Returning the text of the first choice
// };

// const role = "art muse and instructor for children";

// fetchOpenAIResponse(userQuery, role)
//   .then((response) => console.log(response))
//   .catch((error) => console.error("Error fetching OpenAI response:", error));

main();

async function main() {
  console.log(
    boxen(chalk.blue.bold("Hey there!") + chalk.cyan.bold(" Welcome :)"), {
      padding: 1,
      margin: 1,
      borderStyle: "double",
    }),
  );

  //intro, an art muse that is empathetic and knowledge about different artworks
  say(
    "I am your personal art muse :p Ready to create something fun together? \n Now, think about an artwork you recently saw or your all-time fav. \n When you're ready, tell me what it is!",
  );

  //step 1. reflecting on and examining a chosen artwork

  //only able to take accurate name
  //maybe include function where gpt can identify an artwork based on description?
  const artwork = await ask(chalk.bgYellow("what is the artwork?"));
  const artist = await ask(chalk.bgCyan("who is the artist?"));

  //create guideline template for the artwork reflection
  let reflectionGuide = [
    boxen("Step 1 - the Physical", {
      padding: 0.5,
      margin: 0.5,
      borderStyle: "double",
    }) +
    "\n Observe closely and describe the artwork's " +
    chalk.yellow("colors") + ", " + chalk.magenta("shapes") + ", " +
    chalk.green("lines") + ", " + chalk.blue("textures") + ", " +
    chalk.cyan("composition") +
    chalk.bgGreen("\n Enter here: "),
    boxen("Step 2 - the Emotional", {
      padding: 0.5,
      margin: 0.5,
      borderStyle: "double",
    }) +
    "\n Feel it with" + chalk.red("heart") + " and" + chalk.yellow(" body") +
    chalk.bgGreen("\n Enter words or phrases that describe how you feel: "),

    boxen("Step 3 - the Idea", {
      padding: 0.5,
      margin: 0.5,
      borderStyle: "double",
    }) +
    "\n What is the artist trying to communicate? How did they do so? Think about " +
    chalk.yellow("\n artistic style, ") + chalk.cyan("individuality, ") +
    chalk.green("uniqueness, etc.") +
    "\n what are some memories or experiences it pulls out from you?" +
    chalk.bgGreen("\n Enter here: "),
  ];

  // "step 1.2 the Emotional: the immediate, instinctive or intuitive feelings the artwork evoke. enter the words or phrases describing the emotions here:",
  //   "step 1.3 the Structure of Thought: what the artist is trying to communicate in your opinion? consider the symbols, motifs, or narratives present in the piece. what guided their decisions? enter here:",
  //   "step 1.4 the Soul: what is the artistic style that contribute to the individuality and uniqueness of this work? think about the historical, social, and personal context. enter here:",
  //   "step 1.5 the Spirit: how does it speak to transcendence? how the artwork provokes certain experience/feelings/thoughts in its audience (you). enter here:",

  const reflectionSummary = [];

  for (const r of reflectionGuide) {
    const a = await ask(r);
    const response = await gptPrompt(
      `
      The prompt was '${r}'.
      The user's reflection was '${a}'.

      You are an empathetic and intelligent art expert for children. You don't talk a lot but point out the core message.
      Express empathy and praise each answer in one sentence.
      Then for each step, generate an 50-words summary that consider both ${a} and your knowledge of ${artwork} by ${artist}.
      `,
      { max_tokens: 1024, temperature: 0.75 },
    );
    say(response);
    reflectionSummary.push(response);
    say("");
  }

  //console.log(reflectionSummary);

  //step 2. choosing a physical object to base on
  say("");
  const prototype = await ask(
    "Think of an object, it can be anything. \n" +
      chalk.bgCyan("What is it? "),
  );

  say(prototype);

  //step 3. choosing the artistic form, at most three, or randomly generate
  const list = [
    "stop-motion",
    "clay/ceramic",
    "physical computation",
    "3d printing",
    "zine",
    "collage",
    "weaving",
    "crocheting",
    "painting",
    "origami",
    "dancing",
    "poem",
    "screenplay",
    "casting",
    "dyeing",
    "print-making",
    "glass art",
    "paper cutting",
    "random combination",
  ];

  const formChoice = await ask(
    "Now choose at most 3 artistic forms from below, or enter " +
      chalk.green("'generate a random combo'") +
      "\n'stop-motion' \n'clay/ceramic' \n'physical computation' \n'3d printing' \n'zine' \n'collage' \n'weaving' \n'crocheting' \n'painting' \n'origami' \n'dancing' \n'poem' \n'screenplay' \n'casting' \n'dyeing' \n'print-making' \n'glass art' \n'paper cutting'" +
      chalk.bgMagenta("\nWhat are your picks?"),
  );

  const formArray = [];
  if (formChoice == "generate a random combo") {
    //const formArray = [];

    while (formArray.length < 3) {
      const randomIndex = Math.floor(Math.random() * list.length);
      const randomOption = list[randomIndex];

      if (!formArray.includes(randomOption)) {
        formArray.push(randomOption);
      }
    }

    //console.log(formArray);
  } else {
    const formArray = formChoice.split(",");
    //console.log(formArray);
  }

  //please wait, MAGIC generating...

  //step 5. the MAGIC, generate a step-by-step instruction for a unique artpiece inspired by the reflection on the artwork and chosen mediums
  //with material, tools, tutorials, and (maybe: artist statement)
  //need to decide step by step or all-at-once
  const instruction = await gptPrompt(
    `
    Use ${reflectionSummary} to inform the concept and ideation of the new artwork, 
    take the ${prototype} as the main physical object,
    in the form of the mix of everything in ${formArray}, with a style drawn from ${artwork} by ${artist}.
    
    Generate a concise and creative, step-by-step instruction guideline for a DIY art project.
    Keep it to no longer than 8 steps.
    List the necessary material and tools.
    `,
    { max_tokens: 1024, temperature: 0.75 },
  );

  say(instruction);
}
