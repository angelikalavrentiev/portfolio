import {useState, useEffect} from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);

    useEffect(() => {

            fetch(url)
                .then(res => {
                    if(!res.ok){
                        throw Error('Cette ressource est introuvable');
                    }
                    return res.json()
                })
                .then(data => {
                    setData(data);
                })
        }, [url]);
    return { data };
}

export default useFetch;