
const IG_ACCESS_TOKEN = "IGAAUfB12zZCWNBZAFpkMW11WlQxUTh1cEpwT3c5NEx4aWFyaWpZAd1VsVnFnSndLVGUyV0lVT0FEd0h5dFloZAWp2NnlaeEhiLUp3WHkxakJWR2llQlZAkSDR2Ny1ZAME1TVk9ULVB3VmFvZAEVWaHFxLWNGV2RSMlVwOTVTNlJja1QzOAZDZD";
// Basic Display API often uses 'me' or the numeric ID. Let's try the ID first.
const IG_USER_ID = "25767913522879841";

async function testBasicDisplay() {
    console.log("Testing Instagram Basic Display API (graph.instagram.com)...");

    // Try with specific ID
    const url1 = `https://graph.instagram.com/${IG_USER_ID}?fields=id,username,account_type,media_count&access_token=${IG_ACCESS_TOKEN}`;
    console.log("URL 1 (Specific ID):", url1);

    try {
        const response = await fetch(url1);
        if (response.ok) {
            const data = await response.json();
            console.log("Success with URL 1!", JSON.stringify(data, null, 2));
            return;
        } else {
            console.error("Error URL 1:", response.status, await response.text());
        }
    } catch (e) { console.error("Exception URL 1:", e); }

    // Try with 'me' (Basic Display often uses 'me')
    const url2 = `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${IG_ACCESS_TOKEN}`;
    console.log("\nURL 2 ('me'):", url2);

    try {
        const response = await fetch(url2);
        if (response.ok) {
            const data = await response.json();
            console.log("Success with URL 2!", JSON.stringify(data, null, 2));
        } else {
            console.error("Error URL 2:", response.status, await response.text());
        }
    } catch (e) { console.error("Exception URL 2:", e); }
}

testBasicDisplay();
