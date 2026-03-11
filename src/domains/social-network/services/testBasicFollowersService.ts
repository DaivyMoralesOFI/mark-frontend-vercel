
const IG_ACCESS_TOKEN = import.meta.env.VITE_IG_ACCESS_TOKEN;
const IG_USER_ID = import.meta.env.VITE_IG_USER_ID;

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
