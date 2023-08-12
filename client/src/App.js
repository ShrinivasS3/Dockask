import logo from './logo.svg';
import './App.css';
import './normalise.css';
import { useState } from 'react';
import axios from 'axios';


function App() {

  const [input, setInput] = useState("");
  const [quesLog, setQuesLog] = useState([{
    user: "gpt",
    message: "How can I help you today?"
  },{
    user: "me",
    message: "I would like to ask a question"
  }]);

  // clear
  function clearChat(){
    setQuesLog([]);
  }

  //UPLAOD FILES
    const [selectedFile, setSelectedFile] = useState(null);
    const [ progress, setProgress ] = useState({ started: false,pc: 0 });
    const [ msg, setMsg ] = useState(null);

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {

      if (!selectedFile) {
        setMsg("No File Selected");
        return;
      }

      const formData = new FormData();
      formData.append('pdfFile', selectedFile);

      setMsg("Uploading...");
      setProgress(prevState => {
        return {...prevState, started: true}
      })
      axios.post('http://localhost:3080/upload-pdf', formData, {
        onUploadProgress: (progressEvent) => { setProgress(prevState => {
          return { ...prevState, pc: progressEvent.progress*100}
        }) },
        headers: {
          "Custom-Header": "value",
        }
      })
        .then(response => {
          setMsg("File Uploaded Succesfully.")
          console.log('PDF uploaded successfully:', response.data);
        })
        .catch(error => {
          setMsg("File Upload Failed.")
          console.error('Error uploading PDF:', error);
        });
    };


  // TO LOAD THE THE STUFF FROM THE SEARCH BOX
  async function handleSubmit(e){
    e.preventDefault();
    const quesLogNew = [...quesLog, { user: "me", message: `${input}`}] 
    // setQuesLog([...quesLog, { user: "me", message: `${input}` } ])
    setInput("");
    setQuesLog(quesLogNew);
    // fetch  request to the api combine the chat log array of messages 
    const messages = quesLogNew.map((message) => message.message).join("\n")
    console.log("app ",messages);
    const response = await fetch("http://localhost:3080/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          message: messages
      })
    });
    const data = await response.json();
    setQuesLog([...quesLogNew, { user: "gpt", message: `${data.message}`} ])
    console.log(data.message);
  }

  //TO DISPLAY THE MESSAGE IN THE CHAT AREA

  const QuesMessage = ({ message }) => {
    // 'avatar {message.user == "gpt" && "docask"}'
      return(
        <div className= {`question ${message.user === "gpt" && "docask"}`} >
          <div className='question-center'>
            <div className={`avatar ${message.user === "gpt" && "docask"}`}>
            </div>
            <div className="qna">
              {message.message}
            </div>
          </div>
        </div>
      )
    }
  return (
    <div className="App">
      <aside className="sidemenu"> {/*SIDEBAR*/}
        <div className="sidemenu-button" onClick={clearChat}>
          <span>+</span>
          New Question
        </div>
        
      </aside>
      <section className="questionbox">{/*SEARCH BAR*/}
        <div className="question-log">{/*CHAT LOG*/}
          {quesLog.map((message, index) => (
            <QuesMessage key={index} message={message} />
          ))}
          
        </div>
        <div className="input">
          <form onSubmit={handleSubmit}>{/*TO HANDLE ENTER IN SEARCH BAR*/}
          <input
          rows="1"
          value={input}
          onChange={(e) => setInput(e.target.value) }
          className="qinput" placeholder="Ask Your Question Here"></input>
          </form>
        </div>
        <div className="uploadComp">
          <label htmlFor="file-upload" className="custom-file-upload">
          Choose Files
          </label>
          <input id="file-upload" onChange={handleFileChange} type="file"/>
          {selectedFile && (
            <p className="selfile">Selected File: {selectedFile.name}</p>
          )}
          <button className="Upload" onClick={handleUpload}>Upload PDF</button>
          { progress.started && <progress max="100" value={progress.pc}></progress> }
          {msg && <span>{msg} </span>}
        </div>
      </section>
    </div>
  );
}

export default App;
