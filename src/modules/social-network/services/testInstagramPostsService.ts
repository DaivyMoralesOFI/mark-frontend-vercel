
const IG_ACCESS_TOKEN = "IGAAUfB12zZCWNBZAFpkMW11WlQxUTh1cEpwT3c5NEx4aWFyaWpZAd1VsVnFnSndLVGUyV0lVT0FEd0h5dFloZAWp2NnlaeEhiLUp3WHkxakJWR2llQlZAkSDR2Ny1ZAME1TVk9ULVB3VmFvZAEVWaHFxLWNGV2RSMlVwOTVTNlJja1QzOAZDZD";
const IG_USER_ID = "25767913522879841";

async function testMediaEndpoints() {
    console.log("Testing Media Endpoints...");

    // 1. Try Graph API (Facebook) - Requested by user
    // Fields: id,caption,media_type,media_url,timestamp,like_count,comments_count
    const graphUrl = `https://graph.facebook.com/v24.0/${IG_USER_ID}/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&access_token=${IG_ACCESS_TOKEN}`;
    console.log("\n1. Testing Graph Facebook API...");
    try {
        const res = await fetch(graphUrl);
        if (res.ok) {
            console.log("Graph API Success:", JSON.stringify(await res.json(), null, 2));
        } else {
            console.log("Graph API Failed:", res.status, await res.text());
        }
    } catch (e) { console.log("Graph API Error:", e); }

    // 2. Try Basic Display API (Instagram) - Known to work for user info
    // Fields: id,caption,media_type,media_url,timestamp (Note: like_count/comments_count usually NOT supported here)
    // Let's try requesting them anyway to see what happens.
    const basicUrl = `https://graph.instagram.com/${IG_USER_ID}/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&access_token=${IG_ACCESS_TOKEN}`;
    console.log("\n2. Testing Basic Display API (with likes/comments)...");
    try {
        const res = await fetch(basicUrl);
        if (res.ok) {
            console.log("Basic API (Rich) Success:", JSON.stringify(await res.json(), null, 2));
        } else {
            console.log("Basic API (Rich) Failed:", res.status, await res.text());
        }
    } catch (e) { console.log("Basic API (Rich) Error:", e); }

    // 3. Try Basic Display API (Safe fields)
    const basicSafeUrl = `https://graph.instagram.com/${IG_USER_ID}/media?fields=id,caption,media_type,media_url,timestamp&access_token=${IG_ACCESS_TOKEN}`;
    console.log("\n3. Testing Basic Display API (Safe fields)...");
    try {
        const res = await fetch(basicSafeUrl);
        if (res.ok) {
            console.log("Basic API (Safe) Success:", JSON.stringify(await res.json(), null, 2));
        } else {
            console.log("Basic API (Safe) Failed:", res.status, await res.text());
        }
    } catch (e) { console.log("Basic API (Safe) Error:", e); }
}

testMediaEndpoints();
