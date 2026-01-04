const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

searchBtn.addEventListener("click", async () => {
    const appId = document.getElementById("appId").value.trim();
    results.textContent = "";

    if (!/^\d+$/.test(appId)) {
        results.textContent = "Invalid App ID";
        return;
    }

    try {
        results.textContent = "Searching ManifestHub...";

        const res = await fetch(
            `https://api.github.com/search/code?q=${appId}+repo:SteamAutoCracks/ManifestHub`
        );

        if (!res.ok) throw new Error("GitHub API limit");

        const data = await res.json();

        if (!data.items || data.items.length === 0) {
            results.textContent = "No manifests found.";
            return;
        }

        const zip = new JSZip();

        for (const f of data.items) {
            const raw = f.html_url
                .replace("github.com", "raw.githubusercontent.com")
                .replace("/blob/", "/");

            zip.file(f.name, await (await fetch(raw)).text());
        }

        const blob = await zip.generateAsync({ type: "blob" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${appId}_manifests.zip`;
        a.textContent = "Download ZIP";

        results.innerHTML = "";
        results.appendChild(a);

    } catch {
        results.textContent = "Error (GitHub API rate limit or CORS)";
    }
});
