
const IG_ACCESS_TOKEN = "IGAAUfB12zZCWNBZAFpkMW11WlQxUTh1cEpwT3c5NEx4aWFyaWpZAd1VsVnFnSndLVGUyV0lVT0FEd0h5dFloZAWp2NnlaeEhiLUp3WHkxakJWR2llQlZAkSDR2Ny1ZAME1TVk9ULVB3VmFvZAEVWaHFxLWNGV2RSMlVwOTVTNlJja1QzOAZDZD";
const IG_USER_ID = "25767913522879841";

async function testBasicDisplayFollowers() {
    console.log("Testing Instagram Basic Display API for 'followers_count'...");

    // Try with followers_count field
    const url = `https://graph.instagram.com/${IG_USER_ID}?fields=id,username,followers_count&access_token=${IG_ACCESS_TOKEN}`;
    console.log("URL:", url);

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("Success!", JSON.stringify(data, null, 2));
        } else {
            console.error("Error:", response.status, await response.text());
        }
    } catch (e) { console.error("Exception:", e); }
}

testBasicDisplayFollowers();
