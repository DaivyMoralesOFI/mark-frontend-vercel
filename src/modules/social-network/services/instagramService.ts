
export const getInstagramFollowers = async (accessToken: string, userId: string): Promise<number | null> => {
    try {
        const response = await fetch(`https://graph.instagram.com/${userId}?fields=followers_count&access_token=${accessToken}`);

        if (!response.ok) {
            console.error('Failed to fetch Instagram data:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data.followers_count;
    } catch (error) {
        console.error('Error fetching Instagram followers:', error);
        return null;
    }
};

export interface InstagramPost {
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
    permalink?: string;
}

export const getInstagramPosts = async (accessToken: string, userId: string): Promise<InstagramPost[]> => {
    try {
        const response = await fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count,permalink&access_token=${accessToken}`);

        if (!response.ok) {
            console.error('Failed to fetch Instagram posts:', response.statusText);
            return [];
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        return [];
    }
};
