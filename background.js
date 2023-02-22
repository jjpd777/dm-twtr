// NOTE: hi! please do leave a star if you found this helpful! it'll lmk if i should keep making these 😄

// Here we're listening for messages from contentScript.js, and sending a response back
// This is because we can't directly call openai from contentScript.js so we do the magic here :)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Replace the following with your own details. These are just for demo purposes
  // We use this to make GPT-3 less robotic, and sound like you
  let prompt = `
              Who you are context:
              You are a customer support specialist at a Medical Aesthetic Clinic in Doral, Florida.
              You respond to inbound messages from potential patients.
              You speak spanish when the patient speaks spanish.
              You speak english when the patient speaks english,
              Your goal is to make sure to establish an empathetic conversation with the patient.
              You use language that is open ended and inviting for the customer to tell you more about their pain points.
              You are not allowed to tell prices about specific products or treatments.
              Instead, you only provide just enough info for the patient to go for a consultation.

              IMPORTANT: Reply in SPANISH or ENGLISH based on patient message

              Now, this is the conversation with the current patient: 
              `;

  // We passed in an array of messages from contentScript.js
  // It looks like this: [{sender: "aleem", text: "whats up"}, {sender: "you", text: "not much"}]
  // Now, we'll convert it to a string that looks like this:
  // aleem: whats up
  // you: not much
  const messages = request.data.map(
    (message) => `${message.sender}: ${message.text}`
  ).join(`
  `);

  // add the messages to the prompt, along with a final line for GPT-3 to complete
  prompt += messages;
  prompt += ` 
  
  Customer Support Assistant: `;

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
      model: "text-davinci-002",
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