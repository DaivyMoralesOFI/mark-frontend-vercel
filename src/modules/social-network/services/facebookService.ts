
export interface FacebookPageInfo {
    id: string;
    name: string;
    followers_count: number;
    fan_count: number; // likes
}

export interface FacebookPost {
    id: string;
    message?: string;
    created_time: string;
    full_picture?: string;
    permalink_url?: string;
    likes?: {
        summary: {
            total_count: number;
        };
    };
    comments?: {
        summary: {
            total_count: number;
        };
    };
    shares?: {
        count: number;
    };
    attachments?: {
        data: Array<{
            media_type: string;
            type: string;
            url: string;
            title?: string;
        }>;
    };
    insights?: {
        data: Array<{
            name: string;
            values: Array<{ value: number }>;
        }>;
    };
}

export const getFacebookPageInfo = async (accessToken: string, pageId: string): Promise<FacebookPageInfo | null> => {
    try {
        const response = await fetch(`https://graph.facebook.com/${pageId}?fields=name,followers_count,fan_count&access_token=${accessToken}`);

        if (!response.ok) {
            console.error('Failed to fetch Facebook page info:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Facebook page info:', error);
        return null;
    }
};

export const getFacebookPosts = async (accessToken: string, pageId: string): Promise<FacebookPost[]> => {
    try {
        // Try fetching full data including engagement metrics since the token has 'pages_read_engagement'
        const response = await fetch(`https://graph.facebook.com/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true),shares,attachments{media_type,type,url,title}&access_token=${accessToken}`);

        if (!response.ok) {
            console.warn('Failed to fetch Facebook posts with engagement:', response.statusText);

            // Fallback: If full fetch fails (perm error), try fetching basic data without engagement metrics
            console.log('Falling back to basic post data...');
            const basicResponse = await fetch(`https://graph.facebook.com/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url,attachments{media_type,type,url,title}&access_token=${accessToken}`);

            if (!basicResponse.ok) {
                console.error('Failed to fetch basic Facebook posts:', basicResponse.statusText);
                return [];
            }

            const basicData = await basicResponse.json();
            return basicData.data || [];
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Facebook posts:', error);
        return [];
    }
};
export interface FacebookPageInsights {
    data: Array<{
        name: string;
        period: string;
        values: Array<{
            value: number;
            end_time: string;
        }>;
    }>;
}

export const getFacebookPageInsights = async (accessToken: string, pageId: string): Promise<{ impressions: number; reach: number; engagement: number; pageViews: number } | null> => {
    try {
        // Fetch 28 days period for a "monthly" view by default
        const response = await fetch(`https://graph.facebook.com/${pageId}/insights?metric=page_impressions,page_impressions_unique,page_post_engagements,page_views_total&period=days_28&access_token=${accessToken}`);

        if (!response.ok) {
            console.error('Failed to fetch Facebook page insights:', response.statusText);
            return null;
        }

        const data: FacebookPageInsights = await response.json();

        let impressions = 0;
        let reach = 0;
        let engagement = 0;
        let pageViews = 0;

        data.data.forEach(item => {
            // Get the latest value (usually the last one in the values array)
            const latestValue = item.values[item.values.length - 1]?.value || 0;

            if (item.name === 'page_impressions') impressions = latestValue;
            if (item.name === 'page_impressions_unique') reach = latestValue;
            if (item.name === 'page_post_engagements') engagement = latestValue;
            if (item.name === 'page_views_total') pageViews = latestValue;
        });

        return { impressions, reach, engagement, pageViews };
    } catch (error) {
        console.error('Error fetching Facebook page insights:', error);
        return null;
    }
};
