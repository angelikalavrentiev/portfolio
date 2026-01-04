import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fromCache, setFromCache] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const start = Date.now();

        const timeout = setTimeout(() => {
            if (!cancelled) {
                const cached = (() => {
                    try {
                        return JSON.parse(localStorage.getItem("projects_cache"));
                    } catch (e) {
                        return null;
                    }
                })();
                if (cached) {
                    setData(cached);
                    setFromCache(true);
                    setLoading(false);
                    setError("Loaded from cache after timeout");
                } else {
                    setError("Request timed out");
                }
            }
        }, 3000);

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw Error(`Impossible de récupérer les données. Statut: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setData(data);
                    setFromCache(false);
                    try {
                        localStorage.setItem("projects_cache", JSON.stringify(data));
                    } catch (e) {}
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    let cached = null;
                    try {
                        cached = JSON.parse(localStorage.getItem("projects_cache"));
                    } catch (e) {
                        cached = null;
                    }
                    if (cached) {
                        setData(cached);
                        setFromCache(true);
                        setLoading(false);
                        setError("Loaded from cache after error");
                    } else {
                        setError(err.message || "Unknown error");
                    }
                }
            })
            .finally(() => clearTimeout(timeout));

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [url]);

    return { data, loading, error, fromCache };
};

export default useFetch;