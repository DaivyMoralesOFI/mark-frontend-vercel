// useAutoScroll.ts
//
// This file defines the useAutoScroll custom React hook, which provides a ref and function to automatically scroll to the bottom of a chat or message list.
// It is used in the chat coach module to keep the latest message in view.

import { useEffect, useRef } from "react";

/**
 * useAutoScroll
 *
 * Custom hook that returns a ref and a scrollToBottom function.
 * Automatically scrolls to the ref element whenever the component updates.
 * Used to keep the latest chat message in view.
 *
 * @returns {object} { ref, scrollToBottom }
 */
export const useAutoScroll = <T extends HTMLElement>() => {
    const ref = useRef<T | null>(null);
  
    // Scrolls to the ref element
    const scrollToBottom = () => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      scrollToBottom();
    });
  
    return { ref, scrollToBottom };
  };