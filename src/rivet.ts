import {
  runGraphInFile,
  startDebuggerServer,
  NodeDatasetProvider,
  RunGraphOptions,
} from '@ironclad/rivet-node';
// Start debugger server

import express from 'express';

const debuggerServer = await startDebuggerServer({});

let project = './example.rivet-project';
// let project = './Bald01.rivet-project';
let graph = 'example-graph';
// let graph = 'romanian-loop';

const app = express();
const port = 3000; // Default port for Express

// Get OPEN_API_KEY from environment
let openAiKey = process.env.OPEN_API_KEY;

let i = 0;
let currentPrompt: string;
let maxSentences: number = 5;

function setCurrentPrompt(
  currentDialog: string = `Who's your daddy?`
) {
  // console.log('currentDialog:');
  // console.log(currentDialog);
  //if i is even, currentPrompt is femalePrompt, if i is odd, currentPrompt is malePrompt
  let femalePrompt: string = `You are a wife speaking to your husband. You respond only to the emotional words from your husband. You feel very angry about how fat you are. You are depressed about how stupid your husband is and speak about it vaguely, hoping he doesn't understand you are talking about him. You mostly speak in english but sometimes slip in romanian words by accident, but don't want to admit it. You never say more than a couple sentances. You've never been more angry. Your husband says to you: ${currentDialog}. Respond to what he says in no more than ${maxSentences} sentences.`;
  let malePrompt: string = `You are a husband speaking to your wife. You are really mad so you keep your responses brief and focused on the topic, not the emotion. When she talks about her body you don't understand her and get absolutely furious. You switch topics to focus on one of your many hobbies in the garage. You mostly speak in english but sometimes slip in romanian words by accident, but don't want to admit it. You never say more than a couple sentances. You've never been more angry. Your wife says to you: ${currentDialog}. Respond to what he says in no more than ${maxSentences} sentences`;

  if (i % 2 === 0) {
    currentPrompt = femalePrompt;
  } else {
    currentPrompt = malePrompt;
  }
  console.log('current prompt');
  console.log(currentPrompt);
}

async function getGraphResult() {
  let result = await runGraphInFile(project, {
    graph: graph,
    remoteDebugger: debuggerServer,
    inputs: {
      prompt: currentPrompt,
    },
    context: {},
    externalFunctions: {},
    onUserEvent: {},
    openAiKey: openAiKey,
  } as RunGraphOptions);

  // Return graph output of the run
  // console.log(result.response.value);
  return result.response.value;

  // Force the application to exit (otherwise it keeps running as debugger still runs and does not have a close function)
  // process.exit();
}

app.use(express.static('public'));

app.get('/api/result', async (req, res) => {
  try {
    const result = await getGraphResult();

    console.log(result);
    if (typeof result === 'string') {
      setCurrentPrompt(result);
    } else {
      console.error(
        'Expected result to be a string, received:',
        typeof result
      );
      // Handle the error appropriately, maybe set currentPrompt to a default string or return an error
    }
    res.json({ result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  setCurrentPrompt(); //set initial prompt (maybe should do this when server starts?)
});
