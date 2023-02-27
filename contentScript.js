(() => {
  // Listen for when we navigate, and then begin the process of adding the button
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "url changed") {
      // The interval will check every 100ms to see if the div exists
      // Once it does, we'll kill the interval and add the button
      const interval = setInterval(() => {
        const div = document.querySelector(
          "[id='main']"
        );
        if (div) {
          // if the div exists, and we haven't added the button yet, then add the button
          // otherwise just kill the interval and do nothing
          console.log("Success entering the page")
          if (document.querySelector("#generateButton")) {
            clearInterval(interval);
            return;
          }
 
          const button = document.createElement("button");

          button.id = "generateButton"; button.style.border = "none"; button.style.background = "white";
          button.style.cursor = "pointer"; button.style.marginRight = "7px"; button.style.fontSize = "2em";
          button.style.borderRadius = "5px"; button.style.color = "darkblue";
          button.style.padding = "10px";

          button.onmousedown = () => { button.style.transform = "scale(0.8)" };
          button.onmouseup = () => { button.style.transform = "scale(1)" };
          button.onmouseover = () => { button.style.opacity = "0.7" };
          button.onmouseout = () => { button.style.opacity = "1" };
          button.style.transitionDuration = "0.2s";
          button.innerText = "GPT 🧠";

          // const sendButton = document.querySelector( '.pv-top-card-v2-ctas' );
          const sendInvElement = document.querySelector( ".relative");
          const inputTextField = sendInvElement.querySelector("[id='custom-message']")
          console.log(inputTextField, "Invite button element")
          // console.log(sendButton, "Send button 1")
          // sendButton.appendChild(button);
          inputTextField.parentNode.appendChild(button);

          const workExperience = document.querySelectorAll('.pv-profile-card-anchor')[2].parentNode;
          console.log(workExperience, "Successful work experience fetched");
          console.log(workExperience.innerText, "Inner Text ");
          const workText = workExperience.innerText;
          // const dmActivityContainer = document.querySelector( "[id='conversationList']");



          button.addEventListener("click", () => { 

            button.innerText = "💭";
            chrome.runtime.sendMessage(
                { data: workText },
                function (response) {

                  console.log(response, "The response from the Background.js file")

                  if ( response != undefined && response != "" && response != "No API key") {

                    var event = new MouseEvent("click", {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    });
                    inputTextField.dispatchEvent(event);
                    document.execCommand("insertText", false, response);
                    button.innerText = "GPT 🧠";

                  

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