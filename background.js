// NOTE: hi! please do leave a star if you found this helpful! it'll lmk if i should keep making these 😄

// Here we're listening for messages from contentScript.js, and sending a response back
// This is because we can't directly call openai from contentScript.js so we do the magic here :)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Replace the following with your own details. These are just for demo purposes
  // We use this to make GPT-3 less robotic, and sound like you
  let prompt = `
  You are a sales representative.
  You are selling a chrome extension that automates outbound on LinkedIn.
  Your goal is to establish ask "How do you manage outbound sales?"
  Make sure to include information about the propsect in a personalized way.
  Be concise and brief.

  -------
  Prospect information:

  
               `;


  const messages = request.data;

  prompt += messages;

  

  // replace `null` with your OpenAI API key. grab it here: https://beta.openai.com/account/api-keys
  const API_KEY = '';

  // no point in fetching without an API key 😜
  if (API_KEY === null) {
    sendResponse("No API key");
    return;
  }

  console.log("starting to fetch")
  fetch("https://api.openai.com/v1/completions", {
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.8,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization:
        // this grabs API_KEY from the top of the file.
        // DO NOT push your API key to github! 🙅‍♂️
        `Bearer ${API_KEY}`,
    },
    method: "POST",
  })
    .then((response) => response.json())
    // This is where we send the response back to contentScript.js
    .then((response) =>{ console.log("Openai Res",response); sendResponse(response.choices[0].text)})
    .catch(e=> console.log(e, "error fetchingn"));
  return true;
});

// This is a seperate listener that listens for when the url changes
// Whenever you navigate through twitter, we gotta readd the button!
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { message: "url changed" });
  }
});