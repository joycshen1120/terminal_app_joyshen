import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";
import chalk from "npm:chalk@5";
import boxen from "npm:boxen";
import { checkbox } from "npm:@inquirer/prompts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

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
    "I am your personal art muse :p Ready to create something fun together? \n Now, think about an artwork. \n When you're ready, tell me what it is!",
  );

  //step 1. reflecting on and examining a chosen artwork
  const artwork = await ask(chalk.bgYellow("what is the artwork?"));
  const artist = await ask(chalk.bgCyan("who is the artist?"));

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
    "\n Feel it with " + chalk.red("heart") + " and" + chalk.yellow(" body") +
    chalk.bgGreen("\n Enter words or phrases that describe how you feel: "),

    boxen("Step 3 - the Idea", {
      padding: 0.5,
      margin: 0.5,
      borderStyle: "double",
    }) +
    "\n What is the artist trying to communicate? How did they do so? Think about " +
    chalk.yellow("\n artistic style, ") + chalk.cyan("individuality, ") +
    chalk.green("uniqueness, etc.") +
    "\n what are some " + chalk.blue("memories") + " or " +
    chalk.yellow("experiences") + " it pulls out from you?" +
    chalk.bgGreen("\n Enter here: "),
  ];

  const reflectionSummary = [];

  for (const r of reflectionGuide) {
    const a = await ask(r);
    const response = await gptPrompt(
      `
      The prompt was '${r}'.
      You are an empathetic and intelligent art expert. 
      You will generate a summary of ${artwork} by ${artist} considering both your knowledge and user's reflection '${a}'. 
      Express empathy and validate the user input. The summary should be brief and as if talking to a 10-year-old kid. It should be in short 3 to 4 sentences.
      An examples is:

      You made a great point and the observation is sensitive.
      Monet's "Water Lilies" is like a rainbow puddle, with soft blues, pinks, and greens all mixed up. The paint is thick and squishy, making everything look dreamy. The lilies float like tiny boats, scattered across the water in a fun pattern.

      The prompt was '${r}'.
      You are an empathetic and intelligent art expert. 
      You will generate a summary of ${artwork} by ${artist} considering both your knowledge and user's reflection '${a}'. 
      Express empathy and validate the user input. The summary should be brief and as if talking to a 10-year-old kid. It should be in short 3 to 4 sentences:
      `,
      { max_tokens: 1024, temperature: 0.5 },
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
  const formChoice = await checkbox({
    message: "Now, what is your artistic form? Choose at most 3",
    choices: [
      { name: "stop-motion", value: "stop-motion" },
      { name: "ceramics", value: "ceramics" },
      { name: "physical computation", value: "physical computation" },
      { name: "3d printing", value: "3d printing" },
      { name: "zine", value: "zine" },
      { name: "collage", value: "collage" },
      { name: "weaving", value: "weaving" },
      { name: "crocheting", value: "crocheting" },
      { name: "painting", value: "painting" },
      { name: "origami", value: "origami" },
      { name: "dancing", value: "dancing" },
      { name: "poem", value: "poem" },
      { name: "casting", value: "casting" },
      { name: "dyeing", value: "dyeing" },
      { name: "print-making", value: "print-making" },
      { name: "glass art", value: "glass art" },
      { name: "paper cutting", value: "paper cutting" },
    ],
  });

  const formArray = JSON.stringify(formChoice);

  //please wait, MAGIC generating...

  //step 5. the MAGIC, generate a step-by-step instruction for a unique artpiece inspired by the reflection on the artwork and chosen mediums
  //prompt step by step?

  const instructionFormat = `
{
    "title": "Watery Cloud",
    "concept": "Let's make a super cool art project, like a mix of Monet's "Water Lilies" and the fluffy clouds in the sky! We'll use fun stuff like clay, paper, and weaving to create something peaceful and pretty, just like Monet's dreamy paintings and the soft, calm skies.",
    "materials": "
      - Air-dry clay
      - Heavy paper for zine creation
      - Yarn (various textures and colors matching Monet's palette)
      - Weaving loom (or DIY loom made with a sturdy frame and nails)
      - Scissors
      - Needle and thread (for weaving)
      - Glue
      - Other decorations, such as acrylic paints (tranquil greens, blues, purples, pinks), gloss varnish
    ",
    "step1": "Step 1: Making Clouds with Clay
    - First, let's play with some air-dry clay and squish it into fluffy cloud shapes. Make sure they're soft and puffy around the edges!
    - Leave them to dry so they become hard.
    - Once they're dry, it's painting time! Mix the colors that remind you of Monet's paintings to make your clouds look dreamy and super pretty.",
    "step2": "Step 2: Making a Mini Sky Book
    - Grab a piece of paper and make a 8-folds. This is going to be our very own zine about clouds using colors like Monet did!
    - Draw some cloud pictures on the pages with pencils. Think about all the pretty colors you can see in the sky and clouds.
    - It's time to paint! Use acrylic paints, try mixing the colors right on the paper to make it look like Monet's abstract and soft brushstrokes.
    - After your painting is dry, your sky book is ready to show off!",
    "step3": "Step 3: Weaving a Dreamy Picture
    - Let's set up our weaving loom with some strong thread that can hold up all the yarn.
    - Pick yarn colors that look good with your clay clouds and the colors in your mini sky book. We're going to weave something that feels like a dream.
    - As you weave, mix in different kinds of yarn to make cool textures. It's okay to leave some threads hanging out; it'll make our weaving look like it's moving, just like clouds floating in the sky!",
    "final": "Final Touch: Put It All Together and Love It!
    - Find a sunny spot to hang your cool cloud art where the light can make the colors and textures look even more amazing.
    - Enjoy looking at your beautiful creation and feel proud and calm :)"
  }`;

  const prompt = `
    Use ${reflectionSummary} to inform the concept and ideation of the DIY art project, 
    take the ${prototype} as the main physical object,
    in the form of the mix of ${formArray}, with a style drawn from ${artwork} by ${artist}.
    Generate a concise and creative instruction guideline for a DIY art project with 3 steps. Use clear and encouraging language as if talking to a 10-year-old kid.
    Respond with JSON. Use this format: ${instructionFormat}. Format it properly, such as change lines.
    Return only the JSON, starting with { and end with }.
  `;

  const instruction = await gptPrompt(
    prompt,
    {
      temperature: 0.6,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    },
  );

  //say(instruction);

  try {
    const data = JSON.parse(instruction);
    const title = data.title;
    say(`${title}`);
  } catch (e) {
    console.log("the json did not parse");
  }

  let data;
  try {
    data = JSON.parse(instruction);
  } catch (e) {
    console.error("The JSON did not parse");
    Deno.exit(1);
  }

  //display instruction step by step
  async function displayNextStep(index) {
    const steps = ["concept", "step1", "step2", "step3", "final"];
    if (index < steps.length) {
      const stepKey = steps[index];
      console.log(data[stepKey]);

      // Prompt the user if they are ready to go to the next step
      const confirm = await Select.prompt({
        message: chalk.bgCyan("Are you ready to go to the next step?"),
        options: ["yes", "no"],
      });

      switch (confirm) {
        case "yes":
          await displayNextStep(index + 1);
          break;
        case "no":
          Deno.exit(0);
          break;
      }
    } else {
      console.log(
        boxen("YAY! You've got your ART. Bye and see you next time :p", {
          padding: 0.5,
          margin: 0.5,
          borderStyle: "double",
        }),
      );
    }
  }

  await displayNextStep(0);
}
