Created an interface similar to that of ChatGPT with the function of chating with PDFs that can be uploaded.
The front-end is created with React and the queries are passed on to the backend to a python script.
The python script utilizes the Llama model used from Hugging Face.
The script utilises Retrieval-Augmented Generation to create and retrive information from the vector store.
The vector store is created using the document uploaded by the user using chromadb.
