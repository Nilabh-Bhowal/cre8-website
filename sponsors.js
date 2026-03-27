const sheetId = "1Dqu5iqgIHez5sT4zQ3mMEAd4OTgCsVITFzF6rK0St9s";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
    .then(res => res.text())
    .then(text => {
        console.log(text);
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const { rows } = json.table;
        const container = document.getElementById("sponsors");

        rows.forEach(row => {
            if (row.c[0]?.v === "Name") return;
            const name = row.c[0]?.v || "";
            const image = row.c[1]?.v || "";
            const link = row.c[2]?.v || "";  // new image column

            const logo = document.createElement("div");
            logo.className = "sponsor-logo";

            logo.innerHTML = `<a href="${link}" target="_blank" class="sponsor-logo"><img src="${image}" alt="${name}"></a>`;

            container.appendChild(logo);
        });
    });
