import { useState } from 'react';

const Contact = () => {
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = { title, email, content };
        setIsPending(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:8000/api/messages', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message)
            });

            const text = await res.text();

            if (!res.ok) {
                try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || 'Erreur lors de l\'envoi');
            } catch {
                throw new Error('Erreur serveur : ' + text.substring(0, 200));
            }
            }

            const data = JSON.parse(text);
            setSuccessMsg(data.message || 'Message bien envoyé !');

            setTitle('');
            setEmail('');
            setContent('');
        } catch (err) {
            setErrorMsg(err.message || 'Erreur lors de l’envoi');
        } finally {
            setIsPending(false);
        }
    }
 
    return ( 
        <div>
            <h2>Page Contact</h2>
            {successMsg && <div style={{ color: 'green', marginBottom: '1em' }}>{successMsg}</div>}
            {errorMsg && <div style={{ color: 'red', marginBottom: '1em' }}>{errorMsg}</div>}
            
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                /> 

                <label>Email:</label>
                <input type="text" required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                /> 

                <label>Content:</label>
                <textarea required 
                value={content} 
                onChange={(e) => setContent(e.target.value)}>
                </textarea>
                

                { !isPending && <button className='btn'>Send message</button>}
                { isPending && <button className='btn'disabled>Sending message</button>}
            </form>
        </div>
     );
}
 
export default Contact;