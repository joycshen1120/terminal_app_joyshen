import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

main();

async function main() {
  //intro, an art spirit that is empathetic and knowledge about different artworks
  say(
    "hey there! i am your personal art spirit. ready to create something fun together? now, think about an artwork you recently encountered or one of your all-time favs, tell me what when ready.",
  );

  //step 1. reflecting on and examining a chosen artwork

  //only able to take accurate name
  //maybe include function where gpt can identify an artwork based on description?
  const artwork = await ask("what is the artwork?");
  const artist = await ask("who is the artist?");

  //create guideline template for the artwork reflection
  let reflectionGuide = [
    "step 1.1 the Physical: observe without judgements and describe the artwork literally - colors, shapes, lines, textures, and the composition, or balance, contrast, emphasis, movement, pattern, rhythm. enter here: ",
    "step 1.2 the Emotional: the immediate, instinctive or intuitive feelings the artwork evoke. enter the words or phrases describing the emotions here:",
    "step 1.3 the Structure of Thought: what the artist is trying to communicate in your opinion? consider the symbols, motifs, or narratives present in the piece. what guided their decisions? enter here:",
    "step 1.4 the Soul: what is the artistic style that contribute to the individuality and uniqueness of this work? think about the historical, social, and personal context. enter here:",
    "step 1.5 the Spirit: how does it speak to transcendence? how the artwork provokes certain experience/feelings/thoughts in its audience (you). enter here:",
  ];

  const reflectionSummary = [];

  for (const r of reflectionGuide) {
    const a = await ask(r);
    const response = await gptPrompt(
      `
      The prompt was '${r}'.
      The user's reflection was '${a}'.
      Express empathy and praise each answer.
      Then for each step, generate an 80-words summary that consider both ${a} and your knowledge of ${artwork} by ${artist}.
      `,
      { max_tokens: 1024, temperature: 0.75 },
    );
    say(response);
    reflectionSummary.push(response);
    say("");
  }

  console.log(reflectionSummary);

  //step 2. choosing a physical object to base on
  say("");
  const prototype = await ask(
    "think of an object, it can be anything. what is it? ",
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
    "please choose at most 3 artistic forms from below, or enter 'generate a random combo': 'stop-motion', 'clay/ceramic', 'physical computation', '3d printing', 'zine', 'collage'",
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

    console.log(formArray);
  } else {
    const formArray = formChoice.split(",");
    console.log(formArray);
  }

  //step 4. choosing the style
  const styleChoice = await ask(
    "then, choose a desired style from this list: Surreal and Dreamlike, Ethereal and Mystical, Retro and Nostalgic, Bold and Vibrant, Minimalist and Sparse, Gritty and Raw, Whimsical and Playful, Dark and Gothic, Urban and Street, Abstract and Conceptual, Romantic and Sentimental, Psychedelic and Trippy, Steampunk and Retrofuturistic, Eclectic and Mixed Media, Geometric and Patterned",
  );

  console.log(styleChoice);

  //please wait, MAGIC generating...

  //step 5. the MAGIC, generate a step-by-step instruction for a unique artpiece inspired by the reflection on the artwork and chosen mediums
  //with material, tools, tutorials, and (maybe: artist statement)
  //need to decide step by step or all-at-once
  const instruction = await gptPrompt(
    `
    Use ${reflectionSummary} to inform the concept and ideation of the new artwork, 
    take the ${prototype} as the main physical object,
    in the form of the mix of everything in ${formArray}, with a ${styleChoice} style.
    
    Generate a concise yet creative, step-by-step instruction guideline for a DIY art project.
    List the necessary material and tools.
    `,
    { max_tokens: 1024, temperature: 0.75 },
  );

  say(instruction);
}
