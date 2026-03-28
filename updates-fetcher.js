const sheetId = "13DnDbjvpLrgGxMFVNXrIXm82kewM2AOqatTpM5S_YSY";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
    .then(res => res.text())
    .then(text => {
        console.log(text);
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const { rows } = json.table;
        const container = document.getElementById("updates");

        rows.reverse().forEach(row => {
            if (row.c[0]?.v === "Date") return;
            const timestampRaw = row.c[0]?.v; // raw Google date
            let timestamp = "";
            if (timestampRaw) {
                const date = parseGoogleDate(timestampRaw);
                if (date) {
                    timestamp = date.toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    });
                }
            }
            const title = row.c[1]?.v || "";
            const content = row.c[2]?.v || "";
            const image = row.c[3]?.v || "";  // new image column

            const card = document.createElement("div");
            card.className = "card mega";

            card.innerHTML = `
        <h3>${title}</h3>
        <h4>${timestamp}</h4>
        <p>${content.replace(/\n/g, "<br>")}</p>
        ${image ? `<img src="${image}" alt="${title}" class="update-img">` : ""}
      `;

            container.appendChild(card);
        });
    });
function parseGoogleDate(dateStr) {
    // Example input: "Date(2026,2,27,18,42,41)"
    const match = dateStr.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
    if (!match) return null;

    const [_, year, month, day, hour, minute, second] = match.map(Number);
    return new Date(year, month, day, hour, minute, second);
}
