
const DownloadViewCV = async () => {
    try {

        const res = await fetch("http://localhost:8000/api/admin/download-cv");
        if (!res.ok) {
            console.warn("Aucun CV trouvé, téléchargement annulé");
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "angelika_lavrentiev.pdf";
        a.click();

    } catch (error) {
    console.error("Erreur côté client :", error);
    }
}

export default function CVButton() {
    return (
        <div>
            <button onClick={DownloadViewCV}>
                Curriculum Vitae
            </button>
        </div>
    );
}