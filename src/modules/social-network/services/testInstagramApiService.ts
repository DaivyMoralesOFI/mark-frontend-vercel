
const IG_ACCESS_TOKEN = "IGAAUfB12zZCWNBZAFpkMW11WlQxUTh1cEpwT3c5NEx4aWFyaWpZAd1VsVnFnSndLVGUyV0lVT0FEd0h5dFloZAWp2NnlaeEhiLUp3WHkxakJWR2llQlZAkSDR2Ny1ZAME1TVk9ULVB3VmFvZAEVWaHFxLWNGV2RSMlVwOTVTNlJja1QzOAZDZD";
const IG_USER_ID = "25767913522879841";

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
