const {google} = require('googleapis');
const API_KEY = "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";
const fs = require('fs');

const youtube = google.youtube({
	version: 'v3',
	auth: 'AIzaSyD2tndstDQhQF3Hz0ZQDu2FYRa3SMA85ig'
});

async function getComments(videoId) {
	let allComments = [];
	let nextPageToken = null;

	do {
		const res = await youtube.commentThreads.list({
			part: 'snippet',
			videoId: 'b-CoXS4KKOE',
			maxResults: 100,
			pageToken: nextPageToken
		});
	
	const comments = res.data.items.map(item => item.snippet.topLevelComment.snippet.textOriginal);	

	allComments = allComments.concat(comments);
	nextPageToken = res.data.nextPageToken;

	} while (nextPageToken);

	return allComments;
}

(async () => {
  try {
    const videoId = "b-CoXS4KKOE";
    const comments = await getComments(videoId);
    console.log(comments);
    fs.writeFile("comments.json", JSON.stringify(comments), "utf8", (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  } catch (err) {
    console.error(err);
  }
})();

	async function getMessage(){
	const comments = await getComments("b-CoXS4KKOE");
		const messages = comments.map((comment) => {
	  return {
	    role: "user",
	    content: comment,
	  };
	});

	const options = {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role:"user", 
					content: "Please make a detailed summary of all the different points mentioned in the following comments along with the answers to all the questions",
				},
			...messages,
			],
		}),
	};
	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions',options)
		const data = await response.json()
		const summary = data.choices[0].message.content;
		console.log("Summar:", summary);
		
	}catch(error) {
		console.log(error)

	}	
}

getMessage();
	
