import { useState } from "react";
import "../assets/scss/_contact.scss";
import contactImg from "../assets/images/contact.jpg";

const Contact = () => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = { title, email, content };
    setIsPending(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      const text = await res.text();

      if (!res.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Erreur lors de l'envoi");
        } catch {
          throw new Error("Erreur serveur : " + text.substring(0, 200));
        }
      }

      const data = JSON.parse(text);
      setSuccessMsg(data.message || "Message bien envoyé !");

      setTitle("");
      setEmail("");
      setContent("");
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de l’envoi");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main
      className="page-wrap"
    >
      <form className="contact-card" onSubmit={handleSubmit} noValidate>
       
        <div className="curved-title" aria-hidden="true">
          <svg viewBox="0 0 600 140">
            <defs>
              <path id="arcPath" d="M40,92 Q300,-20 560,92" />
            </defs>
            <text textAnchor="middle" fontSize="42">
              <textPath xlinkHref="#arcPath" startOffset="50%">
                Contactez-moi
              </textPath>
            </text>
          </svg>
        </div>

        {successMsg && (
          <div style={{ color: "lightgreen", margin: "1em 0" }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ color: "red", margin: "1em 0" }}>
            {errorMsg}
          </div>
        )}

        <div className="middle-form">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            placeholder="nom@exemple.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Sujet</label>
          <input
            type="text"
            required
            value={title}
            placeholder="Sujet"
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Message</label>
          <textarea
            required
            value={content}
            placeholder="Votre message"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="actions">
          {!isPending && <button className="btn">Envoyer</button>}
          {isPending && (
            <button className="btn" disabled>
              Envoi…
            </button>
          )}
        </div>
      </form>
    </main>
  );
};

export default Contact;
