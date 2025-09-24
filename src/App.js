import React, { useState, useEffect } from 'react';

export default function PYTTracker() {
  const teams = [
    "Cardinals", "Falcons", "Ravens", "Bills", "Panthers", "Bears", "Bengals", "Browns",
    "Cowboys", "Broncos", "Lions", "Packers", "Texans", "Colts", "Jaguars", "Chiefs",
    "Raiders", "Chargers", "Rams", "Dolphins", "Vikings", "Patriots", "Saints", "Giants",
    "Jets", "Eagles", "Steelers", "49ers", "Seahawks", "Buccaneers", "Titans", "Commanders"
  ];

  const teamColors = {
    Cardinals: "#97233F", Falcons: "#A71930", Ravens: "#241773", Bills: "#00338D",
    Panthers: "#0085CA", Bears: "#0B162A", Bengals: "#FB4F14", Browns: "#311D00",
    Cowboys: "#003594", Broncos: "#FB4F14", Lions: "#0076B6", Packers: "#203731",
    Texans: "#03202F", Colts: "#002C5F", Jaguars: "#006778", Chiefs: "#E31837",
    Raiders: "#000000", Chargers: "#0080C6", Rams: "#002244", Dolphins: "#008E97",
    Vikings: "#4F2683", Patriots: "#002244", Saints: "#D3BC8D", Giants: "#0B2265",
    Jets: "#125740", Eagles: "#004C54", Steelers: "#FFB612", "49ers": "#AA0000",
    Seahawks: "#002244", Buccaneers: "#D50A0A", Titans: "#4B92DB", Commanders: "#5A1414"
  };

  const [owners, setOwners] = useState({});

  useEffect(() => {
    const savedOwners = localStorage.getItem("pytOwners");
    if (savedOwners) {
      try {
        setOwners(JSON.parse(savedOwners));
      } catch (e) {
        console.error("Failed to parse saved owners:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pytOwners", JSON.stringify(owners));
  }, [owners]);

  const markTeamSold = (team) => {
    let buyer = prompt(`Enter buyer name for ${team} (leave blank to remove):`, owners[team] || "");
    if (buyer === null) return;
    buyer = buyer.trim();

    if (buyer === "") {
      setOwners((prev) => {
        const newOwners = { ...prev };
        delete newOwners[team];
        return newOwners;
      });
    } else {
      setOwners((prev) => ({ ...prev, [team]: buyer }));
    }
  };

  const resetSold = () => setOwners({});

  const exportCSV = () => {
    const rows = [["Team", "Buyer"]];
    teams.forEach(team => {
      rows.push([team, owners[team] || "Available"]);
      rows.push(["", ""]); // adds spacing between rows
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "pyt_tracker.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-gold-500 flex flex-row p-6">

      {/* Sidebar Section */}
      <div className="w-60 bg-neutral-900 p-4 rounded-lg shadow-lg flex flex-col gap-4">
        <div style={{ color: "#D4AF37" }} className="text-2xl font-bold uppercase">
          Assigned Buyers
        </div>

        <div className="space-y-2 text-sm overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {teams.map((team) => (
            <div
              key={team}
              onClick={() => markTeamSold(team)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') markTeamSold(team);
              }}
              className="cursor-pointer flex justify-between items-center py-2 px-4 rounded-lg transition"
              style={{
                backgroundColor: owners[team] ? "#1f2937" : teamColors[team],
                color: owners[team] ? "#9ca3af" : "#ffffff",
                border: `2px solid ${owners[team] ? "#374151" : "#FFD700"}`
              }}
            >
              <span style={{ textDecoration: owners[team] ? "line-through" : "none" }}>
                {team}
              </span>

              <span
                className="text-xs font-bold uppercase"
                style={{
                  color: owners[team] ? "#D4AF37" : "#39FF14",
                  fontSize: owners[team] ? "0.75rem" : "0.875rem"
                }}
              >
                {owners[team] || "Available"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-wide text-gold-400 mb-8 uppercase">
          Cory's Cards – NFL PYT Tracker
        </h1>

        <div className="w-full max-w-6xl flex justify-between items-center mb-4">
          <div style={{ color: "#D4AF37" }} className="text-sm font-semibold">
            Sold: {Object.keys(owners).length} / {teams.length}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetSold}
              className="px-4 py-2 rounded-xl font-bold shadow transition"
              style={{ backgroundColor: "#D4AF37", color: "#000000" }}
            >
              Reset Tracker
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-xl font-bold shadow transition"
              style={{ backgroundColor: "#D4AF37", color: "#000000" }}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {teams.map((team) => (
            !owners[team] && (
              <div
                key={team}
                onClick={() => markTeamSold(team)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') markTeamSold(team);
                }}
                className="cursor-pointer rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center text-center font-semibold text-lg transition border select-none w-full max-w-[120px]"
                style={{
                  backgroundColor: teamColors[team],
                  color: "#ffffff",
                  border: "2px solid #FFD700"
                }}
              >
                <span className="text-center">{team}</span>
              </div>
            )
          ))}
        </div>

        {/* Logo Section */}
        <div className="mt-10 flex justify-center">
          <img
            src="/Logo.jpeg"
            alt="Cory's Cards Logo"
            className="w-100 object-contain"
          />
        </div>

        <p className="text-neutral-400 text-sm mt-6">
          Click a team to assign, edit, or remove a buyer
        </p>
      </div>
    </div>
  );
}
