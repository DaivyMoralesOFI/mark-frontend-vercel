
const IG_ACCESS_TOKEN = import.meta.env.VITE_IG_ACCESS_TOKEN;
const IG_USER_ID = import.meta.env.VITE_IG_USER_ID;

async function testInstagramApi() {
    console.log("Testing Instagram API...");
    const url = `https://graph.facebook.com/v24.0/${IG_USER_ID}?fields=followers_count&access_token=${IG_ACCESS_TOKEN}`;
    console.log("URL:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            const text = await response.text();
            console.error("Body:", text);
        } else {
            const data = await response.json();
            console.log("Success! Data:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testInstagramApi();
