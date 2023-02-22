(() => {
  // Listen for when we navigate, and then begin the process of adding the button
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "url changed") {
      // The interval will check every 100ms to see if the div exists
      // Once it does, we'll kill the interval and add the button
      const interval = setInterval(() => {
        const div = document.querySelector(
          "[id='message-area-container']"
        );
        if (div) {
          // if the div exists, and we haven't added the button yet, then add the button
          // otherwise just kill the interval and do nothing
          console.log("Success")
          if (document.querySelector("#generateButton")) {
            clearInterval(interval);
            return;
          }
          // Add the button. It should just be a clickable "🤔" next to the send button.
          // Feel free to change the styling to your liking!
          const button = document.createElement("button");
          button.id = "generateButton";
          button.style.border = "none";
          button.style.background = "none";
          button.style.cursor = "pointer";
          button.style.marginRight = "7px";
          button.onmousedown = () => {
            button.style.transform = "scale(0.8)";
          };
          button.onmouseup = () => {
            button.style.transform = "scale(1)";
          };
          button.style.fontSize = "3em";
          button.onmouseover = () => {
            button.style.opacity = "0.7";
          };
          button.onmouseout = () => {
            button.style.opacity = "1";
          };
          button.style.transitionDuration = "0.2s";
          button.innerText = "🧠";
          const sendButton = document.querySelector(
            "[id='ExternalSendButtonContainer']"
          );
          sendButton.parentNode.insertBefore(button, sendButton);

          const dmActivityContainer = document.querySelector(
            "[id='conversationList']"
          );
          console.log(dmActivityContainer, "convo container")

          const messages = Array.from(
            dmActivityContainer.querySelectorAll('.external_message.participation_message')
          ).map((div, i) => {
            // r-gu4em3 is an identifiable class for messages sent by the other person
            const message_b = div.querySelectorAll('.message_text')[0].innerText;

            if (!div.className.split(' ').includes('owner')) {
              console.log(  "Inbound message :: " , i, message_b)
              return {
                sender: "Patient Response : ",
                text: div.lastElementChild.innerText,
              };
            } else {
              console.log( "Customer support",i, message_b)
              return {
                sender: "Customer Support Assistant : ",
                text: div.lastElementChild.innerText,
              };
            }
          });
          const lastMessages = messages.slice(-5);
          console.log("Last 2 messages : ", lastMessages);

          button.addEventListener("click", () => { 
            console.log("It worked");
            button.innerText = "💭";
            chrome.runtime.sendMessage(
                { data: lastMessages },
                function (response) {
                  console.log(response)
                  if (
                    response != undefined &&
                    response != "" &&
                    response != "No API key"
                  ) {

                    response = response.trim();
                    const inputData = document.querySelector(".edit_area");
                    const hasText =inputData.lastElementChild;
                    console.log(hasText, "Has text")
                    // const inputData = document.querySelector(
                    //   ".DraftEditor-editorContainer"
                    // ).lastElementChild?.lastElementChild?.lastElementChild
                    //   .lastElementChild?.lastElementChild?.innerHTML;
                    // // We'll also check if the placeholder text exists, if it does, we click smthg else
                    // const placeholder = document.querySelector(
                    //   ".public-DraftEditorPlaceholder-inner"
                    // );


                    const rootDiv = document.querySelector(
                      ".edit_area"
                    );

                  if (hasText.length >0 ) {
                  
                        // Simulate a click event on the element
                        var event = new MouseEvent("click", {
                          bubbles: true,
                          cancelable: true,
                          view: window,
                        });
                        rootDiv.dispatchEvent(event);
                        document.execCommand("insertText", false, response);
                        button.innerText = "YYY";

                    }else{

                          // Simulate a click event on the element
                          var event = new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                          });
                          rootDiv.dispatchEvent(event);
      
                          // delete the current, and insert the new text
                          document.execCommand("selectAll", false, null);
                          document.execCommand("delete", false, null);
                          document.execCommand("insertText", false, response);
                          button.innerText = "🧠";

                    }
                   
                 


                  }else{
                    alert("Lmao dog")
                  }
          
          })
        });


          clearInterval(interval);
        }
      }, 1000);
    }
  });
})();