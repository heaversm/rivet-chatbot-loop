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
console.log(graph);

const app = express();
const port = 3000; // Default port for Express

// Get OPEN_API_KEY from environment
let openAiKey = process.env.OPEN_API_KEY;

async function getGraphResult() {
  let result = await runGraphInFile(project, {
    graph: graph,
    remoteDebugger: debuggerServer,
    inputs: {
      prompt: 'Please write me a short poem about a dog.',
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
    res.json({ result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
