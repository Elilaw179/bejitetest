export const truncateText = (text, limit = 200, type = 'words') => {
    if (!text) return { text: '', needsTruncation: false };

    if (type === 'words') {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        if (words.length <= limit) return { text, needsTruncation: false };
        return {
            text: words.slice(0, limit).join(' ') + '...',
            needsTruncation: true
        };
    } else {
        // Character-based truncation (alternative)
        if (text.length <= limit) return { text, needsTruncation: false };
        return {
            text: text.slice(0, limit).trim() + '...',
            needsTruncation: true
        };
    }
};