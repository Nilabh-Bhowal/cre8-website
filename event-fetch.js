const container = document.getElementById("events-container");

// Compute OPR per event
function computeOPR(matches) {
    if (!matches.length) return {};
    const teamSet = new Set();
    matches.forEach(m => m.teams.forEach(t => teamSet.add(t.teamNumber)));
    const teams = Array.from(teamSet);
    const teamIndex = {};
    teams.forEach((t,i)=>teamIndex[t]=i);

    const n = teams.length;
    const A = Array(n).fill(0).map(()=>Array(n).fill(0));
    const b = Array(n).fill(0);

    matches.forEach(m=>{
        const redTeams = m.teams.filter(t=>t.station.startsWith("Red")).map(t=>teamIndex[t.teamNumber]);
        const blueTeams = m.teams.filter(t=>t.station.startsWith("Blue")).map(t=>teamIndex[t.teamNumber]);
        const redScore = m.scoreRedFinal || 0;
        const blueScore = m.scoreBlueFinal || 0;

        redTeams.forEach(i=>{ redTeams.forEach(j=>{A[i][j]+=1}); b[i]+=redScore; });
        blueTeams.forEach(i=>{ blueTeams.forEach(j=>{A[i][j]+=1}); b[i]+=blueScore; });
    });

    const x = Array(n).fill(0);
    for(let k=0;k<50;k++){
        for(let i=0;i<n;i++){
            let sum=0;
            for(let j=0;j<n;j++) if(i!==j) sum+=A[i][j]*x[j];
            x[i]=(b[i]-sum)/A[i][i];
        }
    }

    const opr = {};
    teams.forEach((t,i)=>opr[t]=+x[i].toFixed(1));
    return opr;
}

async function loadSeasons(seasons) {
  for (const season of seasons) {
    await addSeason(season)
  }
}

function addSeason(season) {
// Fetch your Apps Script JSON
const seasonContainer = document.createElement("div");
const loading = document.getElementById("loading-indicator");

loading.style.display = "block";

seasonContainer.className = "card-block"
seasonContainer.innerHTML += `<h4>${season}-${season+1}</h4>`;
return fetch(`https://script.google.com/macros/s/AKfycbzwipRFBhSn-oV4xt-Z8cEy6kvjgYm23b9rSuQsCrpDspvMGqaaTHcQI5wq_Cv8x-190Q/exec?season=${season}`)
    .then(res => res.json())
    .then(events => {

        events.forEach(ev=>{
            // const oprs = computeOPR(ev.matches);

            const card = document.createElement("div");
            card.className = "card mega";

            const wins = ev.record.wins;
            const losses = ev.record.losses;
            const ties = ev.record.ties

            // Awards badges
            const awards = ev.awards.filter(a=> a !== "<i>FIRST</i>® Leadership Award Semi-Finalists");
            const awardBadges = awards.map(a=>`<badge>${a}</badge>`).join("");

            // Match table
            const matchRows = ev.matches.map(m=>{
                const red = m.redTeams.join(", ");
                const blue = m.blueTeams.join(", ");
                return `<div class="card match">
                    <h4 class="item1">${m.level} ${m.level!=="PLAYOFF" ? m.matchNumber:""}</h4>
                    <h3>🔴 <span class="${(m.alliance==="Red" && m.ourScore>m.oppScore) || (m.alliance==="Blue" && m.ourScore<m.oppScore) ? "win" : "loss"}">${m.alliance==="Red"?m.ourScore:m.oppScore}</span></h3>
                    <h3>🔵 <span class="${(m.alliance==="Red" && m.ourScore<m.oppScore) || (m.alliance==="Blue" && m.ourScore>m.oppScore) ? "win" : "loss"}">${m.alliance==="Blue"?m.ourScore:m.oppScore}</span></h3>
                    <h4>${red}</h4>
                    <h4>${blue}</h4>
                    <h4>${m.alliance==="Red"?"Us":"Them"}</h4>
                    <h4>${m.alliance==="Blue"?"Us":"Them"}</>
                </div>`;
            }).join("");

            card.innerHTML = `
                <h4>${ev.name}</h4>
                <h4>${new Date(ev.date).toLocaleString("en-US", {month: "long",day: "numeric",year: "numeric"})}</h4>
                `

            if (awardBadges) {
            card.innerHTML += `
                <div class="badges">${awardBadges}</div>
                `
            }
            if (matchRows) {
            card.innerHTML += `
                <h3>${wins}-${losses}-${ties}</h3>
                <details>
                    <summary>View Matches</summary>
                    <div class="details-content">
                      <h4>Match Results</h4>
                      ${matchRows}
                    </div>
                </details>`;
            }

            seasonContainer.appendChild(card);
          });
          container.appendChild(seasonContainer);
          loading.style.display = "none";
    })
    .catch(err => console.error(err));
  }

loadSeasons([2025, 2024, 2023])
