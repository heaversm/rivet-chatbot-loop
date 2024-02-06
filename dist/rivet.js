import { runGraphInFile, startDebuggerServer, } from '@ironclad/rivet-node';
// Start debugger server
const debuggerServer = await startDebuggerServer({});
// let project = './example.rivet-project';
let project = './Bald01.rivet-project';
// let graph = 'example-graph';
let graph = 'romanian-loop';
console.log(graph);
// Get OPEN_API_KEY from environment
let openAiKey = process.env.OPEN_API_KEY;
let result = await runGraphInFile(project, {
    graph: graph,
    remoteDebugger: debuggerServer,
    inputs: {
        // prompt: 'Please write me a short poem about a dog.',
        prompt: `You are a husband speaking to your wife. You are really mad so you keep your responses brief and focused on the topic, not the emotion. When she talks about her body you don't understand her and get absolutely furious. You switch topics to focus on one of your many hobbies in the garage. You mostly speak in english but sometimes slip in romanian words by accident, but don't want to admit it. You never say more than a couple sentances. You've never been more angry. Your wife says to you:`,
    },
    context: {},
    externalFunctions: {},
    onUserEvent: {},
    openAiKey: openAiKey,
});
// Return graph output of the run
console.log(result.response.value);
// Force the application to exit (otherwise it keeps running as debugger still runs and does not have a close function)
process.exit();
//# sourceMappingURL=rivet.js.map