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
            "[id='SendExternalMessageButton']"
          );
          sendButton.parentNode.insertBefore(button, sendButton);

          button.addEventListener("click", () => { 
            console.log("It worked");
            button.innerText = "💭";
            chrome.runtime.sendMessage(
                { data: [{sender:"Juancito", text: "What color is the moon yo?"}] },
                function (response) {
                  console.log(response)
                  if (
                    response != undefined &&
                    response != "" &&
                    response != "No API key"
                  ) {
                    console.log("success")
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
