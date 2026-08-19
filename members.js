const sheetId = "1banld49lDt6OnH3tBToafq9_A6BAMQcmM1jVBotbXsc";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const {rows} = json.table;

    const container = document.getElementById("members");

    const sections = {
      member: createSection("Team Members"),
      coach: createSection("Coaches"),
      mascot: createSection("Team Mascots"),
      intern: createSection("Interns")
    };

    rows.forEach(row => {
      const name  = row.c[0]?.v || "";
      const type  = row.c[1]?.v?.toLowerCase() || "";
      const role  = row.c[2]?.v || "";
      const grade = row.c[3]?.v || "";
      const image = row.c[4]?.v || "";

      if (!sections[type]) return;

      const roles = role ? role.split(",").map(r => `<p>${r.trim()}</p>`).join("") : "";

      const card = document.createElement("div");
      card.className = "card";

      if (image == "") {
        card.innerHTML = `
          <h4>${name}</h4>
          ${grade ? `<p>${grade}th Grade</p>` : ""}
          ${roles? `<p>${roles}</p>` : ""}
        `;
      } else {
        card.innerHTML = `
          <img src="${image}" class="card-image" alt="${name}">
          <h4>${name}</h4>
          ${grade ? `<p>${grade}th Grade</p>` : ""}
          ${roles? `<p>${roles}</p>` : ""}
        `;
      }
      card.innerHTML = `
        <img src="${image}" class="card-image" alt="${name}">
        <h4>${name}</h4>
        ${grade ? `<p>${grade}th Grade</p>` : ""}
        ${roles? `<p>${roles}</p>` : ""}
      `;

      sections[type].block.appendChild(card);
    });

    Object.values(sections).forEach(sec => {
      if (sec.block.children.length > 0) {
        sec.section.appendChild(sec.block);
        container.appendChild(sec.section);
      }
    });
  });

function createSection(title) {
  const section = document.createElement("section");
  const header = document.createElement("h3");
  const block = document.createElement("div");

  header.textContent = title;
  block.className = "card-block";

  section.appendChild(header);

  return { section, block };
}
