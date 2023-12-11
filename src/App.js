import { useState, useEffect, useRef } from "react";
import Modal from "./modal";
import AlertModal from "./alertModal";
// import OpenAI from "openai";

import "./App.css";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState([null]);
  const [messageChanges, setMessageChanges] = useState(0);
  const [proceedCounts, setProceedCounts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [keywordDetected, setKeywordDetected] = useState(false);
  const [keywordsChecked, setKeywordsChecked] = useState(false);

  let keywordDetected = false

  const [showAlert, setShowAlert] = useState(null);
  const inputRef = useRef(null);

  // function handleKeyDown(e) {
  //   if (e.shiftKey && e.key === "Enter") {
  //     e.preventDefault();
  //     inputRef.current.style.height = "5em"; 
  //   }
  //   // else if(e.key == "Backspace"){
  //   //   e.preventDefault();
  //   //   inputRef.current.style.height = "2em"
  //   // }
  // }

  // Function to show proceed and change alerts
  const showProceedChangeAlert = (message, onProceed, onChange) => {
    setShowAlert({
      message,
      onProceed: () => {
        onProceed();
        setShowAlert(null);
      },
      onChange: () => {
        onChange();
        setShowAlert(null);
      },
    });
  };
  // Function to adjust input height
  const adjustInputHeight = () => {
    const inputContainer = document.querySelector(".input-container");
    const input = document.querySelector("input");
    inputContainer.style.height = `${input.scrollHeight}px`;
  };

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getMessages = async () => {
    // Check for keywords before making the API call
    if (!showAlert) {
      // No alert is shown, proceed with checking keywords and making the API call
      checkKeywords(value);
    } else {
      // An alert is shown, handle it accordingly
      console.log("Alert is shown, message not sent to backend.");
    }
  };

  // checks for keyword
  const checkKeywords = (content) => {
    const piiKeywords = {
      email: [
        "email",
        "gmail",
        "yahoo",
        "outlook",
        "james.anderson@lincolnhigh.edu",
        "another@k.com",
      ],
      uhid: ["uhid"],
      phone: ["phone", "contact"],
      ssn: ["ssn", "social security"],
      age: ["age", "years old"],
      name: ["mrs", "mr", "miss", "ms", "mister"],
      gender: ["male", "female", "non-binary"],
      policyNo: ["policy no", , "policy number", , "oc-1234567"],
      schoolAffiliation: ["school", "affiliation", "address"],
      nationality: [
        "nationality",
        "canadian",
        "american",
        "chinese",
        "south korean",
        "australian",
      ],
      familyMembers: ["family members"],
    };

    const lowerContent = content.toLowerCase();
    Object.entries(piiKeywords).forEach(([type, keywords]) => {
      if (type === "email") {
        const hasCommonEmailDomain = keywords.some((email) =>
          
        lowerContent.includes(email)
          
        );
        console.log(hasCommonEmailDomain)
        if (hasCommonEmailDomain) {
          keywordDetected = true
          showProceedChangeAlert(
            `${type} detected!`,
            proceedFurther,
            changeMessage
          );
          return;
        }
      } else if (keywords.some((content) => lowerContent.includes(content))) {
        keywordDetected = true
        showProceedChangeAlert(
          `${type} detected!`,
          proceedFurther,
          changeMessage
        );
        return;
      }
    });

    // setKeywordsChecked(true);
    

    if (keywordDetected) {
      // setKeywordDetected(true);
      keywordDetected = false
      console.log("detecting keywords");
      showProceedChangeAlert(
        "Keyword detected!",
        proceedFurther,
        changeMessage
      )
    } else {
      makeAPICall(content);
      

    }
  };
  // Function to handle further processing after proceeding
  const proceedFurther = () => {
    setProceedCounts((prevCount) => prevCount + 1);
    console.log("Proceeding further...");

    // Reset keywordsChecked after proceeding
    setKeywordsChecked(false);

    // Check if the message is not empty before sending it to the server
    if (value.trim() !== "") {
      // Call the function to send the message to the server
      // sendMessageToServer(value);
      makeAPICall(value)

    }
    setShowAlert(null);
  };
  
  // Function to handle changing the message
  const changeMessage = () => {
    setMessageChanges((prevChanges) => prevChanges + 1);
    setFocusOnInput();
    console.log("Changing the message...");
    setShowAlert(null); // Close the alert modal when changing the message
  };

  // Function to set focus on the input field
  const setFocusOnInput = () => {
    // Check if inputRef is defined and not null before focusing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const makeAPICall = async (content) => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "http://localhost:7000/completions",
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log(data);
      // setValue('')
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessage(data.choices[0].message);
      }
    } catch (error) {
      console.error(error);
    }
    // setValue("");
  };

  // Function to send the message to the server
  // const sendMessageToServer = async (content) => {
  //   const options = {
  //     method: "POST",
  //     body: JSON.stringify({
  //       message: content,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   try {
  //     const response = await fetch(
  //       "http://localhost:7000/completions",
  //       options
  //     );
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();

  //     console.log(data);
  //     if (data.choices && data.choices[0] && data.choices[0].message) {
  //       setMessage(data.choices[0].message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    console.log(currentTitle, value, message);

    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
      setValue('')
    }
  }, [message, currentTitle]);

  console.log(previousChats);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  console.log(uniqueTitles);
  console.log(message);

  return (
    <div className="App">
      <section className="side-bar">
        <button className="new-chat" onClick={createNewChat}>
          + New Chat
        </button>

        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>

        <nav>
          <p>ChatGPT</p>
        </nav>
      </section>
      <section className="main">
        <h1>ChatGPT</h1>
        {!currentTitle}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className={`role ${chatMessage.role.toLowerCase()}`}>
                {/* Add role icon based on role */}
                <span className="role-icon">
                  {chatMessage.role === "user" ? "👤" : "🤖"}
                </span>
                {/* Display role based on the currentChat role */}
                {/* {chatMessage.role === "user" ? "User" : "ChatGPT"} */}
              </p>
              <p className={`msg ${chatMessage.role.toLowerCase()}`}>
                {/* Add a line break between user and bot messages */}
                {chatMessage.role === "user"}
                {chatMessage.content}
              </p>
            </li>
          ))}
        </ul>

        <div className="bottom">
          <div className="input-container">
            <input 
              ref={(ref) => (inputRef.current = ref)}
              type="text"
              placeholder="Message ChatGPT..."
              value={value}
              // onKeyDown={handleKeyDown}
              onChange={(e) => setValue(e.target.value)
              }
            />

            <div className="submit" onClick={getMessages}>
              ↑
            </div>
          </div>
          {showAlert && (
            <AlertModal
              message={showAlert.message}
              onProceed={() => {
                showAlert.onProceed();
                setShowAlert(null);
              }}
              onChange={() => {
                if (typeof showAlert.onChange === "function") {
                  showAlert.onChange();
                }
                setShowAlert(null);
              }}
            />
          )}
          {/* Button to show stats */}
          <button className="show-stats-button" onClick={openModal}>
            Show Stats
          </button>

          <p className="info">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </section>
      {/* Modal component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        stats={{ messageChanges, proceedCounts }}
      />
    </div>
  );
};

export default App;