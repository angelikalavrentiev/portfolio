
export default function CVButton() {
    const handleCVClick = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/admin/download-cv");
            if (!res.ok) {
                const errorData = await res.text();
                console.warn("CV introuvable");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            window.open(url, "_blank");

            const a = document.createElement("a");
            a.href = url;
            a.download = "angelika_lavrentiev.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Erreur lors de l'ouverture et du téléchargement du CV :", err);
        }
    };

    return (
        <button onClick={handleCVClick}>
            Curriculum Vitae
        </button>
    );
}
