(() => {
    // Listen for when we navigate, and then begin the process of adding the button
    chrome.runtime.onMessage.addListener(function (request) {
        const instructions = ``` 
            High level we need to:
            1. Find if the window allows sending message
            2. If we find a "send", then append a brain behind it
            3. Get relevant information from other buttons in the page
            3. Upon clicking the brain, send petition to the background.js api
            with all the relevant information.

            Tactical flow:
            1. Verify if the input text exists
            --> grabbing the class ".public-DraftEditorPlaceholder-inner"
            == Perfect B
            id="message-area-container"
            class = "message_area bubble_edit external droppable ui-droppable"

            2. Find the send button tag / id
            --> "[data-testid='dmComposerSendButton']"
            "[id='ExternalSendButtonContainer']" !!! which is in a list as opposed to a div
            "[id='SendExternalMessageButton']"

            3. Insert GPT button before send button
            --> #generateButton 

            3. Find the messaginng container
            --> "[data-testid='DmActivityContainer']"
            <div class="history_area owner"> ...
                <ul class="bubble_list" id="conversationList"> ...
                    <li class="external_message   participation_message relation  "
                ||  <li class="external_message   participation_message user owner "

                        <div class="message_text" 

            4. Grab all messages within that container
            --> "[data-testid='tweetText']"

            4. Upon click, send info to background.js
            --> 


        ```
      if (request.message === "url changed") {
        // The interval will check every 100ms to see if the div exists
        // Once it does, we'll kill the interval and add the button
        const divPerfectbPlaceholder =```
                class='create_message create_message_with_panel'
                class= 'create_message create
        
        ```;

        const divTwittPlaceholder = ``` <div class="public-DraftEditorPlaceholder-inner" id="placeholder-aqov4" style="white-space: pre-wrap;">Start a new message</div>```

        const interval = setInterval(() => {
          const div = document.querySelector(
            ".public-DraftEditorPlaceholder-inner"
          );
          if (div) {
            // if the div exists, and we haven't added the button yet, then add the button
            // otherwise just kill the interval and do nothing
            if (document.querySelector("#generateButton")) {
              clearInterval(interval);
              return;
            }

            const button = document.createElement("button");
            button.innerText = "🤔";

            const sendButton = document.querySelector(
              "[data-testid='dmComposerSendButton']"
            );
            sendButton.parentNode.insertBefore(button, sendButton);
  
            // Get the current container of messages
            const dmActivityContainer = document.querySelector(
              "[data-testid='DmActivityContainer']"
            );
            // Grab all the messages in the container, and convert them to a labelled array
            const messages = Array.from(
              dmActivityContainer.querySelectorAll("[data-testid='tweetText']")
            ).map((div) => {
              // r-gu4em3 is an identifiable class for messages sent by the other person
              if (div.parentElement.classList.contains("r-gu4em3")) {
                return {
                  sender: "them",
                  text: div.lastElementChild.innerText,
                };
              } else {
                return {
                  sender: "me",
                  text: div.lastElementChild.innerText,
                };
              }
            });
            const lastMessages = messages.slice(-4);
  
            // TODO: clean up code here, it's messy, and has repeated code.
            // TODO: also, rm old code when you're done with it
            button.addEventListener("click", () => {
              // Start the process of generating a response. Set to "thinking" emoji as a visual loading indicator
              // We then send the last 4 messages to the background script, which will then send a request to the API
              button.innerText = "💭";
              chrome.runtime.sendMessage(
                { data: lastMessages },
                function (response) {
                  if (
                    response != undefined &&
                    response != "" &&
                    response != "No API key"
                  ) {
                    // Trim() will get rid of any weird whitespace at beginning or end of response, openai will sometimes add this!
                    response = response.trim();
  
                    const inputData = document.querySelector(
                      ".DraftEditor-editorContainer"
                    ).lastElementChild?.lastElementChild?.lastElementChild
                      .lastElementChild?.lastElementChild?.innerHTML;
                    
                    // We'll also check if the placeholder text exists, if it does, we click smthg else
                    const placeholder = document.querySelector(
                      ".public-DraftEditorPlaceholder-inner"
                    );

                    if (
                      inputData == '<br data-text="true">' ||
                      placeholder != null
                    ) {
                      const rootDiv = document.querySelector(
                        ".public-DraftEditorPlaceholder-inner"
                      );
                      // Simulate a click event on the element
                      var event = new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                      });
                      rootDiv.dispatchEvent(event);

                      document.execCommand("insertText", false, response);
                      button.innerText = "🤔";

                    } else {
                      // if we've already typed something, we want to replace it
                      // this means we click the input rather then the placeholder
                      const rootDiv = document.querySelector(
                        ".DraftEditor-editorContainer"
                      );

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
  
                      button.innerText = "🤔";
                    }
                  } else {
                    alert(
                      "No response from OpenAI. Ensure you have a key in `background.js`! Feel free to msg @aleemrehmtulla on Twitter for any help :)"
                    );
                  }
                }
              );
            });
            clearInterval(interval);
          }
        }, 1000);
      }
    });
  })();
  