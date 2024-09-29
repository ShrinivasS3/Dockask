import sys
import os
os.environ["OPENAI_API_KEY"] = "api_key"

from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
embeddings = OpenAIEmbeddings()
from langchain.chains import RetrievalQA

#to read pdf 
doc_reader = PdfReader(sys.argv[2])

raw_text = ''
for i, page in enumerate(doc_reader.pages):
    text = page.extract_text()
    if text:
        raw_text += text

# Splitting up the text into smaller chunks for indexing
text_splitter = CharacterTextSplitter(
    separator = "\n",
    chunk_size = 1000,
    chunk_overlap  = 200, #striding over the text
    length_function = len,
)
texts = text_splitter.split_text(raw_text)

# Download embeddings from OpenAI

docsearch = FAISS.from_texts(texts, embeddings)

# set up FAISS as a generic retriever
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k":4})

# create the chain to answer questions
rqa = RetrievalQA.from_chain_type(llm=OpenAI(),
                                  chain_type="stuff",
                                  retriever=retriever,
                                  return_source_documents=True)

# 
query = sys.argv[1]
print(rqa(query)['result'])