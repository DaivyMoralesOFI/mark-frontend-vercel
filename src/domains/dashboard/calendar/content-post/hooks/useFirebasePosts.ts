import { useState, useEffect } from 'react';
import { Post } from '../types/postTypes';
import { PostService } from '../services/postService';

/**
 * useFirebasePosts
 * 
 * Custom hook that fetches posts from Firebase Firestore.
 * Provides posts, loading state, and error handling.
 */
export const useFirebasePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await PostService.getFirebasePosts();
            setPosts(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching firebase posts:', err);
            setError('Failed to fetch posts from Firebase');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return { posts, loading, error, refetch: fetchPosts };
};
