import React, { useState, useEffect, useRef } from 'react';

const teams = [
  "49ers", "Bears", "Bengals", "Bills", "Broncos", "Browns", "Buccaneers", "Cardinals",
  "Chargers", "Chiefs", "Colts", "Commanders", "Cowboys", "Dolphins", "Eagles", "Falcons",
  "Giants", "Jaguars", "Jets", "Lions", "Packers", "Panthers", "Patriots", "Raiders",
  "Rams", "Ravens", "Saints", "Seahawks", "Steelers", "Texans", "Titans", "Vikings"
];

const divisions = {
  AFC: {
    East: ["Bills", "Dolphins", "Patriots", "Jets"],
    North: ["Ravens", "Bengals", "Browns", "Steelers"],
    South: ["Texans", "Colts", "Jaguars", "Titans"],
    West: ["Broncos", "Chiefs", "Raiders", "Chargers"]
  },
  NFC: {
    East: ["Cowboys", "Giants", "Eagles", "Commanders"],
    North: ["Bears", "Lions", "Packers", "Vikings"],
    South: ["Buccaneers", "Falcons", "Panthers", "Saints"],
    West: ["Cardinals", "Rams", "49ers", "Seahawks"]
  }
};

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

function BreakOverlay() {
  const [owners, setOwners] = useState({});
  const [scrollSpeed, setScrollSpeed] = useState(0.5);
  const [isPaused, setIsPaused] = useState(false);
  const [breakFormat, setBreakFormat] = useState("PYT");
  const [buyerInput, setBuyerInput] = useState("");
  const [quickAssign, setQuickAssign] = useState(false);
  const [lastBuyer, setLastBuyer] = useState("");
  const [showDropdown, setShowDropdown] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("breakOwners");
    if (saved) {
      try {
        setOwners(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved owners:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("breakOwners", JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let animationFrame;
    let scrollAccumulator = 0;

    const scroll = () => {
      if (isPaused) {
        animationFrame = requestAnimationFrame(scroll);
        return;
      }

      const baseSpeed = 1.5;
      scrollAccumulator += scrollSpeed * baseSpeed;

      if (scrollAccumulator >= 1) {
        const scrollAmount = Math.floor(scrollAccumulator);
        scrollAccumulator -= scrollAmount;

        if (list.scrollTop >= list.scrollHeight / 2) {
          list.scrollTop = 0;
        } else {
          list.scrollTop += scrollAmount;
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollSpeed, isPaused]);

 

  const resetSold = () => setOwners({});

  const exportCSV = () => {
    const rows = [["Team", "Buyer"]];
    teams.forEach(team => {
      rows.push([team, owners[team] || "Available"]);
      rows.push(["", ""]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "break_tracker.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const assignFromInput = () => {
  
    
  const lines = buyerInput
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const assigned = {};

  lines.forEach(line => {
    const [team, buyer] = line.split(",").map(part => part.trim());
    if (team && buyer) {
      assigned[team] = buyer;
    }
  });

  setOwners(assigned);
};
const markTeamSold = (team) => {
  if (quickAssign && lastBuyer) {
    setOwners(prev => ({ ...prev, [team]: lastBuyer }));
    return;
  }

  let buyer = prompt(`Enter buyer name for ${team} (leave blank to remove):`, owners[team] || "");
  if (buyer === null) return;
  buyer = buyer.trim();

  setOwners(prev => {
    const updated = { ...prev };
    if (buyer === "") {
      delete updated[team];
    } else {
      updated[team] = buyer;
      setLastBuyer(buyer); // ✅ store for quick assign
    }
    return updated;
  });
};
 return (
  <div className="w-72 h-screen bg-black p-4 shadow-2xl border-r border-yellow-500 flex flex-col gap-4">
    <div className="absolute top-2 left-2 z-50">
</div>
    {/* 🔹 Header with Toggle */}
   <div className="flex items-center justify-between">
  <div className="flex items-center gap-9">
    <div
      className="text-xs font-bold uppercase px-2 py-1 rounded bg-yellow-500 text-black shadow"
      style={{ fontFamily: "serif", letterSpacing: "0.05em" }}
    >cc        
    </div>
    <div
      className="text-xl font-bold uppercase tracking-wide"
      style={{
        color: "#D4AF37",
        fontFamily: "serif",
        textShadow: "0 0 4px rgba(212, 175, 55, 0.6)",
        borderBottom: "1px solid #D4AF37",
        paddingBottom: "0.5rem",
        marginBottom: "0.5rem"
      }}
    >
      {breakFormat === "PYT" && "PYT List"}
      {breakFormat === "Random" && "Random Team List"}
      {breakFormat === "Division" && "Divisional List"}
    </div>
  </div>

  <button
    onClick={() => setShowControls(prev => !prev)}
    className="ml-2 px-2 py-1 rounded border border-yellow-500 text-yellow-400 text-xs font-bold"
  >
    {showControls ? "Hide" : "Show"}
  </button>
</div>

    {/* 🔧 Controls Section */}
    {showControls && (
      <div className="flex flex-col gap-4">
        {/* 🔄 Format Switcher Dropdown */}
        <select
          value={breakFormat}
          onChange={(e) => setBreakFormat(e.target.value)}
          className="rounded bg-neutral-800 text-white px-3 py-2 text-sm border border-yellow-500"
        >
          <option value="PYT">PYT</option>
          <option value="Random">Random</option>
          <option value="Division">Division</option>
        </select>

        {/* 🎛 Scroll Speed */}
        <div className="flex flex-col gap-1 text-xs text-white">
          <label htmlFor="scrollSpeed" className="uppercase font-bold text-center">
            Scroll Speed: {scrollSpeed.toFixed(1)}
          </label>
          <input
            id="scrollSpeed"
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
            className="w-full accent-yellow-500"
          />
        </div>
<div className="flex items-center justify-between text-xs text-white">
  <label className="font-bold uppercase">Quick Assign</label>
  <button
    onClick={() => setQuickAssign(prev => !prev)}
    className={`px-2 py-1 rounded border text-xs font-bold ${
      quickAssign ? "bg-yellow-500 text-black" : "bg-neutral-700 text-white"
    }`}
  >
    {quickAssign ? "ON" : "OFF"}
  </button>
</div>
        {/* 🔘 Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={resetSold}
            className="flex-1 px-3 py-2 rounded-lg font-bold shadow transition"
            style={{ backgroundColor: "#D4AF37", color: "#000" }}
          >
            Reset
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 px-3 py-2 rounded-lg font-bold shadow transition"
            style={{ backgroundColor: "#D4AF37", color: "#000" }}
          >
            Export
          </button>
        </div>
      </div>
    )}

    {/* 📜 Scrollable Team List */}
    <div
      ref={listRef}
      onMouseEnter={() => {
        setIsPaused(true);
        listRef.current.style.overflowY = 'auto';
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        listRef.current.style.overflowY = 'hidden';
      }}
      style={{
  overflow: "hidden",
  height: showControls
    ? "calc(100vh - 240px)" // when controls are visible
    : "calc(100vh - 100px)" // when controls are hidden
}}
    >
      {breakFormat === "PYT" && (
        <PYTLayout teams={teams} owners={owners} markTeamSold={markTeamSold} />
      )}
      {breakFormat === "Random" && (
        <RandomLayout teams={teams} owners={owners} />
      )}
      {breakFormat === "Division" && (
        <DivisionLayout divisions={divisions} owners={owners} />
      )}
    </div>
  </div>
);
}

function PYTLayout({ teams, owners, markTeamSold }) {
  return (
    <div>
      {[...teams, ...teams].map((team, i) => (
        <div
          key={team + "-copy-" + i}
          onClick={() => markTeamSold(team)}
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
  );
}
function RandomLayout({ teams, owners }) {
  return (
    <div>
      {teams.map((team) => (
        <div
          key={team}
          className="flex justify-between items-center py-2 px-4 rounded-lg"
          style={{
            backgroundColor: "#1f2937",
            color: "#ffffff",
            border: `2px solid ${owners[team] ? "#FFD700" : "#374151"}`
          }}
        >
          <span>{team}</span>
          <span
            className="text-xs font-bold uppercase"
            style={{ color: owners[team] ? "#D4AF37" : "#39FF14" }}
          >
            {owners[team] || "Available"}
          </span>
        </div>
      ))}
    </div>
  );
}
function DivisionLayout({ divisions, owners }) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(divisions).map(([conference, confDivisions]) => (
        <div key={conference}>
          <div className="text-yellow-400 font-bold uppercase mb-1">{conference}</div>
          {Object.entries(confDivisions).map(([division, teams]) => (
            <div key={division} className="mb-2">
              <div className="text-sm text-gray-300 font-semibold">{division}</div>
              {teams.map((team) => (
                <div
                  key={team}
                  className="flex justify-between items-center py-1 px-3 rounded"
                  style={{
                    backgroundColor: "#1f2937",
                    color: "#ffffff",
                    border: `2px solid ${owners[team] ? "#FFD700" : "#374151"}`
                  }}
                >
                  <span>{team}</span>
                  <span
                    className="text-xs font-bold uppercase"
                    style={{ color: owners[team] ? "#D4AF37" : "#39FF14" }}
                  >
                    {owners[team] || "Available"}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export default BreakOverlay;
