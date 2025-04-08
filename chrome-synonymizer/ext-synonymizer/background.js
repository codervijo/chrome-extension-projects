async function fetchDefinition(word) {
  try {
    const url = `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Response from datamuse: ", response);
    console.log("Parse json data", data);
    if (data.length === 0) {
      return `No synonyms found for "${word}".`;
    }

    // Take top 5 synonyms
    const synonyms = data.slice(0, 5).map(entry => entry.word).join(", ");

    return `Synonyms for "${word}": ${synonyms}`;
  } catch (error) {
    console.error("Fetch error:", error);
    return "Error fetching synonyms.";
  }
}
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "lookupWord") {
      fetchDefinition(message.word).then((definition) => {
        sendResponse({ definition }); // <-- Make sure to send something back
      });
  
      return true; // This is critical! Keeps the message channel open
    }
  });
  