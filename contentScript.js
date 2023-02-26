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
 
          const button = document.createElement("button");

          button.id = "generateButton"; button.style.border = "none"; button.style.background = "none";
          button.style.cursor = "pointer"; button.style.marginRight = "7px"; button.style.fontSize = "3em";

          button.onmousedown = () => { button.style.transform = "scale(0.8)" };
          button.onmouseup = () => { button.style.transform = "scale(1)" };
          button.onmouseover = () => { button.style.opacity = "0.7" };
          button.onmouseout = () => { button.style.opacity = "1" };
          button.style.transitionDuration = "0.2s";
          button.innerText = "🧠";

          const sendButton = document.querySelector( "[id='ExternalSendButtonContainer']" );
          // const sendButton = document.querySelector( "[id='SendExternalMessageButton']" );
          sendButton.parentNode.insertBefore(button, sendButton);

          const dmActivityContainer = document.querySelector( "[id='conversationList']");


          const messages = Array.from(
            dmActivityContainer.querySelectorAll('.external_message.participation_message')
          ).map((div, i) => {
            const message_b = div.querySelectorAll('.message_text')[0].innerText;

            if (!div.className.split(' ').includes('owner')) {
              console.log(  "Inbound message : " , i, message_b)
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
          console.log("Recent messages : ", lastMessages);

          button.addEventListener("click", () => { 

            button.innerText = "💭";
            chrome.runtime.sendMessage(
                { data: lastMessages },
                function (response) {

                  console.log(response, "The response from the Background.js file")

                  if ( response != undefined && response != "" && response != "No API key") {

                    response = response.trim();
                    const inputData = document.querySelector(".edit_area");
                    const hasText = inputData.querySelector('.external').innerHTML;

              
                    // Check if input field is empty before sending the message


                      const rootDiv = document.querySelector(".edit_area");
                      const rooty = rootDiv.querySelector(".external");
                    
                      console.log("Inner Text Root Div:", rootDiv.innerText);
                      console.log("Inner Text Root Div:", rootDiv.innerHTML);
                      console.log("Rooty element", rooty.innerText);
                      console.log("Rooty element", rooty.innerHTML);
                      console.log("Inner Text baby: ", hasText);

              
                      if (!!hasText) {
                        console.log("Has inner text", rooty);
                        // const fuckyes = document.querySelector(".edit_area");
                        // const fuckkk = fuckyes.querySelector('.external');
                        // // Simulate a click event on the element
                        // var event = new MouseEvent("click", {
                        //   bubbles: true,
                        //   cancelable: true,
                        //   view: window,
                        // });
                        // fuckkk.dispatchEvent(event);
              
                        // delete the current, and insert the new text
                        document.execCommand("selectAll", false, null);
                        document.execCommand("delete", false, null);
                        document.execCommand("insertText", false, response);
                        button.innerText = "🧠🧠🧠🧠";
                      } else {
                        const rooot = document.querySelector( "[id='ExternalSendButtonContainer']" );

                        console.log("Doesn't have inner text", rooty);
                        var event = new MouseEvent("click", {
                          bubbles: true,
                          cancelable: true,
                          view: window,
                        });
                        // Simulate a click event on the element
                        rooot.dispatchEvent(event);

                        // delete the current, and insert the new text
                        // document.execCommand("selectAll", false, null);
                        // document.execCommand("delete", false, null);
                        document.execCommand("insertText", false, response);
                        button.innerText = "🧠🧠";
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