const express = require('express');
const { setupVectorStore } = require('./vectoring');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');

const app = express();
const port = 5000;

var cors = require('cors')

app.use(cors()) 

let agentExecutor;

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    console.log("selam")
    
    const setupResult = await setupVectorStore();
    agentExecutor = setupResult.retrievalChain;
    

    const input = req.body.message;

    console.log("Input: ", input)

    const result = await agentExecutor.invoke({
        question: input
    });
    console.log("result: ", result)

    res.json({ result });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
