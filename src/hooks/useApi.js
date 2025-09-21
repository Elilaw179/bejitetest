import { useCallback, useState } from 'react';

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || 'https://bejite-backend.onrender.com';

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const postData = useCallback(async (url, payload) => {
        const fullUrl = `${API_BASE}${url}`;
        console.log('[useApi] POST request to:', fullUrl, 'Payload:', payload);

        try {
            setLoading(true);

            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log('[useApi] POST response:', result);

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Unknown error');
            }

            setData(result);
        } catch (err) {
            console.error('[useApi] POST error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const getData = useCallback(async (url) => {
        const fullUrl = `${API_BASE}${url}`;
        console.log('[useApi] GET request to:', fullUrl);

        try {
            setLoading(true);

            const response = await fetch(fullUrl);
            const result = await response.json();

            console.log('[useApi] GET response status:', response.status, 'Data:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch data');
            }

            setData(result);
        } catch (err) {
            console.error('[useApi] GET error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const postDataPromise = useCallback(async (url, payload) => {
        const fullUrl = `${API_BASE}${url}`;
        console.log('[useApi] POST (Promise) request to:', fullUrl, 'Payload:', payload);

        try {
            setLoading(true);

            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log('[useApi] POST (Promise) response:', result);

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Unknown error');
            }

            setData(result);
            return result;
        } catch (err) {
            console.error('[useApi] POST (Promise) error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, data, error, postData, getData, postDataPromise };
};

export default useApi;
