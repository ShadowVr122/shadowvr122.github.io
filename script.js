const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

searchBtn.addEventListener("click", async () => {
    const appId = document.getElementById("appId").value.trim();
    resultsDiv.textContent = "";

    if (!appId) {
        resultsDiv.textContent = "Please enter a valid Steam App ID.";
        return;
    }

    try {
        resultsDiv.textContent = "Searching manifests...";

        // GitHub search API -> find filenames containing the appId
        const apiUrl = `https://api.github.com/search/code?q=${appId}+repo:SteamAutoCracks/ManifestHub`;
        const searchResponse = await fetch(apiUrl);

        if (!searchResponse.ok) {
            throw new Error("Failed to query GitHub");
        }

        const searchJson = await searchResponse.json();
        const items = searchJson.items;

        if (!items || items.length === 0) {
            resultsDiv.textContent = "No manifests found for that App ID.";
            return;
        }

        resultsDiv.textContent = "Manifests found. Preparing download...";

        // Collect raw URLs
        const urls = items.map(item =>
            item.html_url
                .replace("github.com", "raw.githubusercontent.com")
                .replace("/blob/", "/")
        );

        // ZIP creation
        const zip = new JSZip();
        for (let url of urls) {
            const fileResponse = await fetch(url);
            const content = await fileResponse.text();

            const parts = url.split("/");
            const fileName = parts[parts.length - 1];
            zip.file(fileName, content);
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const dlUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = dlUrl;
        link.download = `${appId}_manifests.zip`;
        link.textContent = "Download ZIP";
        
        resultsDiv.innerHTML = "";
        resultsDiv.appendChild(link);

    } catch (err) {
        resultsDiv.textContent = "Error: " + err.message;
    }
});
