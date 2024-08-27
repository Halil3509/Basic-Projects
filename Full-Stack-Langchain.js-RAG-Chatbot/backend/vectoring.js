const { OpenAIEmbeddings } = require('@langchain/openai');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { createRetrieverTool } = require('langchain/tools/retriever');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { pull } = require('langchain/hub');
const { createOpenAIFunctionsAgent } = require('langchain/agents');
const { AgentExecutor } = require('langchain/agents');
const { ChatOpenAI } = require ("@langchain/openai");
const { RunnableSequence } = require("@langchain/core/runnables"); 
const { StringOutputParser } = require("@langchain/core/output_parsers"); 
require('dotenv').config();


async function setupVectorStore() {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  const loader = new PDFLoader('./OpenAI GPT-4o Miniyle Yine Çığır Açtı.pdf');
  console.log("PDF Loading...");
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 256,
    chunkOverlap: 64
  });

  const splitDocs = await splitter.splitDocuments(rawDocs);
  const vectorstore = new MemoryVectorStore(embeddings);
  await vectorstore.addDocuments(splitDocs);

  const retriever = vectorstore.asRetriever();


    const convertDocsToString = (documents)  => {
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n");
    };


    const documentRetrievalChain = RunnableSequence.from([
        (input) => input.question,
        retriever,
        convertDocsToString
    ]);
    
    

    const TEMPLATE_STRING = `Sen arkadaş canlısı bir chatbotsun. 
    

    <context>

    {context}

    </context>

    Yukarıdaki kaynağa göre aşağıdaki soruyu yanıtla

    {question}`;

    const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(
        TEMPLATE_STRING
    );

    
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo-1106"
    });

    console.log("Bitmek üzere")
    
    const retrievalChain = RunnableSequence.from([
        {
          context: documentRetrievalChain,
          question: (input) => input.question,
        },
        answerGenerationPrompt,
        model,
        new StringOutputParser(),
      ]);



  return { retrievalChain };
}

module.exports = { setupVectorStore };
