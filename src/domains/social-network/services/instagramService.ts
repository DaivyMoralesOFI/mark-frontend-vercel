
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

// Update interface to include insights
export interface InstagramPost {
    id: string;
    caption?: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url: string;
    permalink: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
    insights?: {
        data: Array<{
            name: string;
            values: Array<{ value: number }>;
        }>;
    };
}

export const getInstagramPosts = async (accessToken: string, userId: string): Promise<InstagramPost[]> => {
    try {
        // Request insights.metric(impressions,reach) in the fields
        // Note: This relies on the token having correct permissions (instagram_manage_insights)
        const response = await fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count,permalink,insights.metric(impressions,reach)&access_token=${accessToken}`);

        if (!response.ok) {
            console.error('Failed to fetch Instagram posts:', response.statusText);
            return [];
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        return [];
    }
};
export interface InstagramInsights {
    data: Array<{
        name: string;
        period: string;
        values: Array<{
            value: number;
            end_time: string;
        }>;
    }>;
}

export const getInstagramInsights = async (accessToken: string, userId: string): Promise<{ impressions: number; reach: number; profileViews: number } | null> => {
    try {
        // Fetch 28 days period for a "monthly" view by default
        const response = await fetch(`https://graph.instagram.com/${userId}/insights?metric=impressions,reach,profile_views&period=days_28&access_token=${accessToken}`);

        if (!response.ok) {
            console.error('Failed to fetch Instagram insights:', response.statusText);
            return null;
        }

        const data: InstagramInsights = await response.json();

        let impressions = 0;
        let reach = 0;
        let profileViews = 0;

        data.data.forEach(item => {
            // Get the latest value
            const latestValue = item.values[item.values.length - 1]?.value || 0;

            if (item.name === 'impressions') impressions = latestValue;
            if (item.name === 'reach') reach = latestValue;
            if (item.name === 'profile_views') profileViews = latestValue;
        });

        return { impressions, reach, profileViews };
    } catch (error) {
        console.error('Error fetching Instagram insights:', error);
        return null;
    }
};
