export type StoryBlock = { type: "p" | "npc"; text: string };

export interface Level {
  num: number;
  act: string;
  title: string;
  location: string;
  time: string;
  badge: string;
  story: StoryBlock[];
  objective: string;
  validate: (rows: any[][], cols: string[]) => boolean;
  hints: [string, string, string];
  success: string;
  bonus_prompt: string;
  bonus_validate: (rows: any[][], cols: string[]) => boolean;
  bonus_clue: string;
}

export const LEVELS: Level[] = [
  {
    num: 1,
    act: "ACT I — THE GOLDFINCH HOTEL",
    title: "The Body",
    location: "Room 403, Goldfinch Hotel",
    time: "12:30 AM, October 4, 1947",
    badge: "SELECT · FROM",
    story: [
      {
        type: "p",
        text: "The telephone dragged you out of a dream at half past midnight. The concierge's voice was tight. Room 403. Fourth floor of the Goldfinch Hotel.",
      },
      {
        type: "p",
        text: "Victor Malone — Chicago financier, man with too many enemies — was found slumped in his armchair. Half-finished scotch on the table. No visible wounds.",
      },
      {
        type: "p",
        text: "You are Ray Cross. House detective. First step in any inquiry: know who's in the building.",
      },
    ],
    objective:
      "I need to see every name in this building. Give me the full manifest — guests and staff.",
    validate: (rows, cols) => rows.length === 6 && cols.length >= 4 && cols.some(c => c.toLowerCase() === 'role'),
    hints: [
      "Use SELECT to retrieve records from a table.",
      "The syntax is: SELECT * FROM table_name — the asterisk means all columns.",
      "SELECT * FROM persons",
    ],
    success:
      "Six names on the manifest. Five suspects. One victim. The investigation begins.",
    bonus_prompt:
      "Arrange the names alphabetically — see who sits at the top of the list.",
    bonus_validate: (rows) =>
      rows.length >= 5 && rows[0].some((v: any) => v === "Diane Harlow"),
    bonus_clue:
      "Alphabetically, Diane Harlow sits at the top of every list — and at the top of every witness account.",
  },
  {
    num: 2,
    act: "ACT I — THE GOLDFINCH HOTEL",
    title: "The 4th Floor",
    location: "Hotel Lobby / Elevator Bank",
    time: "1:00 AM, October 4, 1947",
    badge: "WHERE · AND",
    story: [
      {
        type: "p",
        text: "The elevator operator — a nervous little man named Eddie — wouldn't meet your eyes when you asked who he'd taken to the fourth floor after eleven o'clock.",
      },
      {
        type: "npc",
        text: '"I keep the log, Mr. Cross. That\'s what management tells me to do."',
      },
      {
        type: "p",
        text: "See who was on floor 4 after 23:00. Someone was up there when Malone was dying.",
      },
    ],
    objective:
      "Someone was on floor 4 after 11 PM. Show me who was logged up there.",
    validate: (rows) =>
      rows.length === 3 &&
      rows.some(r => r.includes(2) || r.includes('Tommy Ricci')) &&
      rows.some(r => r.includes(3) || r.includes('Diane Harlow')),
    hints: [
      "Use WHERE to filter rows. You need two conditions connected with AND.",
      "Chain conditions: WHERE floor=4 AND timestamp>'23:00'",
      "SELECT * FROM hotel_log WHERE floor=4 AND timestamp>'23:00'",
    ],
    success:
      "Three entries. The singer appeared twice. The bellhop once. Someone was outside Room 403 at the right time.",
    bonus_prompt:
      "Match the hotel log entries to names, not just ID numbers.",
    bonus_validate: (rows, cols) =>
      rows.length >= 2 &&
      cols.some(c => c.toLowerCase() === 'name') &&
      rows.some(r => r.includes('Diane Harlow')) &&
      rows.some(r => r.includes('Tommy Ricci')),
    bonus_clue:
      "Two people on the 4th floor after 23:00. Diane Harlow — and Tommy Ricci, who claims he was running an errand.",
  },
  {
    num: 3,
    act: "ACT I — THE GOLDFINCH HOTEL",
    title: "The Evidence",
    location: "Room 403",
    time: "1:15 AM, October 4, 1947",
    badge: "LIKE · OR",
    story: [
      {
        type: "p",
        text: "The boys from the precinct finished their photographs and left you alone in Room 403. Professional courtesy — you'd served together in the war.",
      },
      {
        type: "npc",
        text: '"Look for the perfume, Mr. Cross. Women always leave their perfume."',
      },
      {
        type: "p",
        text: "Check the evidence for what she left behind.",
      },
    ],
    objective:
      "Check the evidence notes for lipstick or perfume. She left something behind in that room.",
    validate: (rows) =>
      rows.length === 2 &&
      rows.some(r => r.some((v: any) => typeof v === 'string' && v.toLowerCase().includes('lipstick'))) &&
      rows.some(r => r.some((v: any) => typeof v === 'string' && v.toLowerCase().includes('perfume'))),
    hints: [
      "Use LIKE with % wildcards: notes LIKE '%word%'",
      "Use OR to match either condition: WHERE cond1 OR cond2",
      "SELECT * FROM evidence WHERE notes LIKE '%lipstick%' OR notes LIKE '%perfume%'",
    ],
    success:
      "Two pieces of evidence. A cigarette with crimson lipstick. A half-empty Chanel No. 5. Both pointing the same direction.",
    bonus_prompt:
      "Pull every piece of evidence tied to the crime scene — anything from that room.",
    bonus_validate: (rows) =>
      rows.length >= 4 &&
      rows.every(r => r.some((v: any) => typeof v === 'string' && v.includes('403'))),
    bonus_clue:
      "Five items from room 403. Three point unmistakably to a woman in evening dress — and that perfume is sold exclusively at Harlow's usual boutique.",
  },
  {
    num: 4,
    act: "ACT I — THE GOLDFINCH HOTEL",
    title: "The Call",
    location: "Hotel Operator's Desk",
    time: "1:30 AM, October 4, 1947",
    badge: "JOIN · ON",
    story: [
      {
        type: "p",
        text: "The hotel operator — old Mrs. Finch, who knew everything about everyone — slid a handwritten log across the desk without being asked.",
      },
      {
        type: "npc",
        text: '"Calls to Mr. Malone\'s room, October third. I keep careful records, Mr. Cross."',
      },
      {
        type: "p",
        text: "Match the phone records to names — IDs alone will not close a case.",
      },
    ],
    objective:
      "Malone got phone calls that night. Pull the records — I need names, not just IDs.",
    validate: (rows, cols) =>
      rows.length === 3 &&
      cols.some(c => c.toLowerCase() === 'name') &&
      rows.some(r => r.includes('Diane Harlow')),
    hints: [
      "JOIN combines two tables on a matching column. phone_rec.caller_id matches persons.id",
      "Syntax: FROM phone_rec pr JOIN persons p ON pr.caller_id=p.id",
      "SELECT p.name, pr.duration, pr.timestamp FROM phone_rec pr JOIN persons p ON pr.caller_id=p.id WHERE pr.called='Victor Malone'",
    ],
    success:
      "Three calls to Malone's room. The singer called twice. The longest call lasted two full minutes.",
    bonus_prompt: "Rank the callers by how long they talked — who stayed on the line the longest?",
    bonus_validate: (rows, cols) =>
      rows.length === 3 &&
      cols.some((c) => c.toLowerCase() === "name") &&
      rows[0].some((v: any) => v === "Diane Harlow"),
    bonus_clue:
      "120 seconds. Diane Harlow's call was twice as long as anyone else's — enough time to demand her money back and get a door slammed in her ear.",
  },
  {
    num: 5,
    act: "ACT II — THE VELVET ROOM BAR",
    title: "The Bar",
    location: "Velvet Room Bar, Ground Floor",
    time: "2:00 AM, October 4, 1947",
    badge: "WHERE · ORDER BY",
    story: [
      {
        type: "p",
        text: "Mickey the barman had a memory like a steel trap and the discretion of a courthouse.",
      },
      {
        type: "npc",
        text: '"She was in all evening. Ordered three drinks. Left around ten-thirty. Never paid for the last one."',
      },
      {
        type: "p",
        text: "Find Diane's bar tabs and line them up by time.",
      },
    ],
    objective:
      "Diane was at the bar all evening. Show me her tabs, in order.",
    validate: (rows) =>
      rows.length === 3 &&
      rows.some(r => r.includes('gin martini')) &&
      rows.some(r => r.includes('champagne')),
    hints: [
      "Filter for a specific person using WHERE person_id=3.",
      "Sort results chronologically using ORDER BY tab_time.",
      "SELECT * FROM bar_tabs WHERE person_id=3 ORDER BY tab_time",
    ],
    success:
      "Three drinks. Last order at 22:30. She left the bar — and someone on the 4th floor was about to have a very bad night.",
    bonus_prompt: "How many drinks did Diane order that night? Count them up.",
    bonus_validate: (rows) =>
      rows.length === 1 && rows[0].some((v: any) => v === 3),
    bonus_clue:
      "Three drinks over two hours. She was biding her time. She left a gin martini unfinished and never settled the tab.",
  },
  {
    num: 6,
    act: "ACT II — THE VELVET ROOM BAR",
    title: "The Witnesses",
    location: "Hotel Interview Room",
    time: "2:30 AM, October 4, 1947",
    badge: "WHERE · >=",
    story: [
      {
        type: "p",
        text: "Four people came forward before sunrise. Two looked you straight in the eye. Two could not keep their story straight past the second question.",
      },
      {
        type: "npc",
        text: '"You want the ones with nothing to hide, Mr. Cross. Check the scores."',
      },
      { type: "p", text: "Look at the witnesses with credibility of 8 or higher." },
    ],
    objective: "Only the reliable witnesses matter. Show me credibility scores of 8 or higher.",
    validate: (rows, cols) =>
      rows.length === 3 &&
      cols.some(c => c.toLowerCase() === 'credibility') &&
      rows.every(r => r.some((v: any) => typeof v === 'number' && v >= 8)),
    hints: [
      "Use >= in WHERE for greater-than-or-equal comparison.",
      "Credibility is an integer column scored 1-10.",
      "SELECT * FROM witnesses WHERE credibility>=8",
    ],
    success:
      "Three credible witnesses. All three saw the same woman. The elevator operator and the hotel clerk both scored 9 out of 10.",
    bonus_prompt:
      "Only the most credible witnesses will do. Show me the ones who scored a perfect 9.",
    bonus_validate: (rows) =>
      rows.length === 2 && rows.every((r) => r.some((v: any) => v === 9)),
    bonus_clue:
      "Both top-credibility witnesses describe the same woman: red dress, dark hair, leaving floor 4 at 11:25 PM — in a hurry.",
  },
  {
    num: 7,
    act: "ACT II — THE VELVET ROOM BAR",
    title: "The Messages",
    location: "Hotel Message Desk",
    time: "3:00 AM, October 4, 1947",
    badge: "JOIN · WHERE · ORDER BY",
    story: [
      {
        type: "p",
        text: "The hotel message desk kept copies of every note slipped under a room door. Paper trail. Old-fashioned. Someone had left a trail a blind man could follow.",
      },
      {
        type: "npc",
        text: '"All delivered to 403, Mr. Cross. Some of them — you will want to read them yourself."',
      },
      {
        type: "p",
        text: "Match the messages to names. Pull everything sent to Victor Malone.",
      },
    ],
    objective:
      "Someone slipped notes under Malone's door. Show me every message sent to his room — and who sent them.",
    validate: (rows, cols) =>
      rows.length === 5 &&
      cols.some(c => c.toLowerCase() === 'name') &&
      rows.some(r => r.includes('Diane Harlow')),
    hints: [
      "JOIN messages m with persons p on m.sender_id=p.id to get names.",
      "Filter: WHERE m.recipient='Victor Malone'",
      "SELECT p.name, m.body, m.sent_at FROM messages m JOIN persons p ON m.sender_id=p.id WHERE m.recipient='Victor Malone' ORDER BY m.sent_at",
    ],
    success:
      "Five messages delivered to Malone's room. Two from the singer. One announced her arrival time.",
    bonus_prompt: "Show only messages sent after 9 PM.",
    bonus_validate: (rows) =>
      rows.length === 2 &&
      rows.some((r) => r.some((v: any) => v === "Diane Harlow")),
    bonus_clue:
      "Two messages after 9 PM. Frank Dellum threatened the partnership. Diane Harlow wrote: I am coming to your room at 11. Have my money ready. She kept that appointment.",
  },
  {
    num: 8,
    act: "ACT III — THE BACK ALLEY",
    title: "The Escape",
    location: "Hotel Back Alley",
    time: "3:30 AM, October 4, 1947",
    badge: "JOIN · ORDER BY",
    story: [
      {
        type: "p",
        text: "The night porter had seen something in the back alley. He hadn't said a word to the police — scared, probably — but he told you because you bought him coffee and didn't take notes.",
      },
      {
        type: "npc",
        text: '"Someone left in a hurry, Mr. Cross. Round half past eleven. Heading north. Didn\'t look back."',
      },
      {
        type: "p",
        text: "Match the alley log to names. Line them up by time. Build the timeline.",
      },
    ],
    objective: "People were coming and going through the back alley. Match those log entries to names, ordered by time.",
    validate: (rows, cols) =>
      rows.length === 5 &&
      cols.some(c => c.toLowerCase() === 'name') &&
      rows.some(r => r.includes('Diane Harlow')),
    hints: [
      "JOIN alley_log a with persons p on a.person_id=p.id.",
      "ORDER BY a.seen_at to build a chronological timeline.",
      "SELECT p.name, a.seen_at, a.direction, a.notes FROM alley_log a JOIN persons p ON a.person_id=p.id ORDER BY a.seen_at",
    ],
    success:
      "Five people passed through that alley. At 23:28, a woman was seen heading north — hurrying, coat pulled tight.",
    bonus_prompt: "Find everyone spotted in the alley between 23:00 and midnight.",
    bonus_validate: (rows) =>
      rows.length === 3 &&
      rows.some(r => r.includes(3) || r.includes('Diane Harlow')) &&
      rows.some(r => r.includes(4) || r.includes('Frank Dellum')),
    bonus_clue:
      "Three people in the alley during the murder hour. Diane at 23:28 heading north. Tommy at 23:35 looking nervous. Frank at 23:45 smoking.",
  },
  {
    num: 9,
    act: "ACT III — THE BACK ALLEY",
    title: "The Inside Man",
    location: "Hotel Security Office",
    time: "4:00 AM, October 4, 1947",
    badge: "WHERE · AND · LIKE",
    story: [
      {
        type: "p",
        text: "The killer needed access to the fourth floor. Not everyone in the Goldfinch has a key card that reaches that high.",
      },
      {
        type: "npc",
        text: '"Check the staff records, Mr. Cross. Floor access and key notes. That is how she got in."',
      },
      {
        type: "p",
        text: "Find anyone on staff who could reach the fourth floor and had a key.",
      },
    ],
    objective: "The killer had access to floor 4. Check staff records — anyone with high floor access and notes about a key.",
    validate: (rows) =>
      rows.length === 3 &&
      rows.every(r => r.some((v: any) => typeof v === 'string' && v.toLowerCase().includes('key'))),
    hints: [
      "Combine two WHERE conditions with AND.",
      "Use LIKE '%key%' to find rows where notes mention a key.",
      "SELECT * FROM staff WHERE floor_access>=4 AND notes LIKE '%key%'",
    ],
    success:
      "Three staff members had the means. One reported a missing key on October 3rd — the night of the murder.",
    bonus_prompt:
      "Find the one person on staff with a master key that opens every door.",
    bonus_validate: (rows) =>
      rows.length === 1 && rows[0].some((v: any) => v === 5),
    bonus_clue:
      "Only Louis Krane holds a master key. But Tommy Ricci reported his 4th-floor key missing on October 3rd — and never explained how the killer walked through a locked door.",
  },
  {
    num: 10,
    act: "ACT III — THE BACK ALLEY",
    title: "The Ledger",
    location: "Hotel Accounting Office",
    time: "4:15 AM, October 4, 1947",
    badge: "ORDER BY · DESC",
    story: [
      {
        type: "p",
        text: "The accounting office was unlocked. The safe behind the desk stood open — not forced, but opened with a key. Ledger pages spread across the desk.",
      },
      {
        type: "p",
        text: "The financials table holds every transaction that moved through the Goldfinch. You need to see the biggest ones first.",
      },
      {
        type: "npc",
        text: '"You read a ledger the right way, Mr. Cross — start at the top and work down. Sort it largest to smallest."',
      },
    ],
    objective: "Show me the money. Every transaction through the hotel books — biggest ones first.",
    validate: (rows) =>
      rows.length === 8 &&
      rows[0].some((v: any) => v === 9500),
    hints: [
      "ORDER BY sorts your results. Place it at the end of the query, followed by a column name.",
      "DESC means descending — largest value first. Without it, ORDER BY defaults to ASC (smallest first).",
      "SELECT * FROM financials ORDER BY amount DESC",
    ],
    success:
      "Nine thousand five hundred dollars at the top. Victor Malone received it on October first — three days before his death.",
    bonus_prompt: "Flip it — show me who lost the most. The biggest debt should surface first.",
    bonus_validate: (rows) =>
      rows.length === 8 &&
      rows[0].some((v: any) => v === -9500),
    bonus_clue:
      "Minus nine thousand five hundred. Diane Harlow's club earnings, taken as a management fee. She paid it. And she came to collect.",
  },
  {
    num: 11,
    act: "ACT III — THE BACK ALLEY",
    title: "The Motive",
    location: "Hotel Accounting Office",
    time: "4:30 AM, October 4, 1947",
    badge: "GROUP BY · SUM · WHERE · ORDER BY",
    story: [
      {
        type: "p",
        text: "Every murder has a motive. In this city, in this year, it's almost always money.",
      },
      {
        type: "p",
        text: "The financials table has every transaction run through the hotel's books. Someone had nine thousand five hundred dollars taken from them.",
      },
      {
        type: "npc",
        text: '"Follow the money, Mr. Cross. It always leads you home."',
      },
    ],
    objective:
      "Someone lost a lot of money. Total up every negative transaction by person — who lost the most?",
    validate: (rows) =>
      rows.length === 2 &&
      (rows[0].some((v: any) => v === 3 || v === "Diane Harlow") ||
        rows[0].some((v: any) => typeof v === "number" && v <= -9000)),
    hints: [
      "Use WHERE amount<0 to filter negatives, then GROUP BY person_id.",
      "Use SUM(amount) as total and ORDER BY total ASC for most negative first.",
      "SELECT person_id, SUM(amount) as total FROM financials WHERE amount<0 GROUP BY person_id ORDER BY total ASC",
    ],
    success:
      "Nine thousand, five hundred dollars. Victor Malone stole it from Diane Harlow's club earnings. She came to collect. He refused.",
    bonus_prompt:
      "Match the financial records to names. I want names alongside those totals.",
    bonus_validate: (rows) =>
      rows.length === 2 && rows[0].some((v: any) => v === "Diane Harlow"),
    bonus_clue:
      "Diane Harlow, person_id 3. Nine thousand five hundred dollars stolen from her share of the Velvet Room club earnings. Victor Malone called it a management fee. Diane called it theft. She was right.",
  },
  {
    num: 12,
    act: "ACT IV — THE VERDICT",
    title: "The Hours",
    location: "Hotel Detective's Office",
    time: "5:00 AM, October 4, 1947",
    badge: "WHERE · BETWEEN",
    story: [
      {
        type: "p",
        text: "The coroner put the time of death between eleven o'clock and half past. That narrows the window considerably.",
      },
      {
        type: "p",
        text: "You need every logged event during those thirty minutes. Who was moving through this hotel while Victor Malone was dying?",
      },
      {
        type: "npc",
        text: '"The log doesn\'t lie, Mr. Cross. Narrow it down — 23:00 to 23:30. Whoever\'s in there is your killer."',
      },
    ],
    objective: "Malone died between 11 and 11:30. Show me every logged event in that half-hour window.",
    validate: (rows) =>
      rows.length === 4 &&
      rows.some(r => r.includes(3) || r.includes("Diane Harlow")) &&
      rows.some(r => r.includes(2) || r.includes("Tommy Ricci")),
    hints: [
      "BETWEEN filters for a range of values, inclusive on both ends.",
      "Syntax: WHERE column BETWEEN value1 AND value2",
      "SELECT * FROM hotel_log WHERE timestamp BETWEEN '23:00' AND '23:30'",
    ],
    success:
      "Four events in the thirty-minute window. The singer, three times. The bellhop, once. Both present. Neither where they claimed to be.",
    bonus_prompt: "Narrow it down — just the floor 4 events in that same window.",
    bonus_validate: (rows) =>
      rows.length === 3 &&
      rows.every(r => r.includes(4)),
    bonus_clue:
      "Three events on the 4th floor between 23:00 and 23:30. Two belong to Diane Harlow. One to Tommy Ricci, who claims he was running an errand.",
  },
  {
    num: 13,
    act: "ACT IV — THE VERDICT",
    title: "The Pattern",
    location: "Hotel Detective's Office",
    time: "5:15 AM, October 4, 1947",
    badge: "GROUP BY · COUNT",
    story: [
      {
        type: "p",
        text: "You spread the hotel log across the desk and stared at it. Not individual entries — the pattern. Who kept appearing? Who kept moving?",
      },
      {
        type: "p",
        text: "Count how many times each person appears in the log. One name will stand out.",
      },
      {
        type: "npc",
        text: '"Frequency tells you everything, Mr. Cross. Count the appearances — see who keeps showing up."',
      },
    ],
    objective: "Count how many times each person appears in the hotel log. The busiest names rise to the top.",
    validate: (rows, cols) =>
      rows.length === 6 &&
      cols.some(c => /count|times|appear/i.test(c)) &&
      rows[0].some((v: any) => typeof v === "number" && v === 3),
    hints: [
      "GROUP BY groups rows by a column value. Combine with COUNT(*) to count rows per group.",
      "Alias your count: COUNT(*) AS times. Then ORDER BY times DESC to rank highest first.",
      "SELECT person_id, COUNT(*) AS times FROM hotel_log GROUP BY person_id ORDER BY times DESC",
    ],
    success:
      "Six entries — one per person. But one appeared three times. The singer who claimed she was performing until midnight.",
    bonus_prompt: "Match the counts to names — I want to see who's who.",
    bonus_validate: (rows, cols) =>
      rows.length === 6 &&
      cols.some(c => c.toLowerCase() === "name") &&
      rows[0].includes("Diane Harlow"),
    bonus_clue:
      "Diane Harlow — three appearances, all on the 4th floor after 11 PM. Her alibi doesn't hold. It never did.",
  },
  {
    num: 14,
    act: "ACT IV — THE VERDICT",
    title: "The Threshold",
    location: "Hotel Detective's Office",
    time: "5:30 AM, October 4, 1947",
    badge: "GROUP BY · HAVING",
    story: [
      {
        type: "p",
        text: "One appearance in the log could be innocent. Twice means something. Three times means intent.",
      },
      {
        type: "p",
        text: "Narrow it down to only those who appeared more than once. You can pick from the groups after you've counted them.",
      },
      {
        type: "npc",
        text: '"Narrow it down first, then count. Know the difference, Mr. Cross."',
      },
    ],
    objective: "Once could be coincidence. Twice is suspicious. Show me who appears more than once in the log.",
    validate: (rows) =>
      rows.length === 3 &&
      rows.every(r => r.some((v: any) => typeof v === "number" && v >= 2)) &&
      rows[0].some((v: any) => v === 3 || v === "Diane Harlow"),
    hints: [
      "HAVING filters grouped results. Unlike WHERE, it runs after GROUP BY.",
      "Place HAVING after GROUP BY: GROUP BY person_id HAVING COUNT(*) > 1",
      "SELECT person_id, COUNT(*) AS times FROM hotel_log GROUP BY person_id HAVING COUNT(*) > 1 ORDER BY times DESC",
    ],
    success:
      "Three people with more than one log entry. Diane Harlow at the top. The bellhop and the manager below her. All three had reason to be on that floor.",
    bonus_prompt: "Narrow it further — find the people with exactly two appearances.",
    bonus_validate: (rows) =>
      rows.length === 2 &&
      rows.every(r => r.some((v: any) => v === 2)),
    bonus_clue:
      "The bellhop and the manager — both logged exactly twice. Tommy reported a missing key. Louis's second appearance was logged at 00:15, after the body was found.",
  },
  {
    num: 15,
    act: "ACT IV — THE VERDICT",
    title: "The Verdict",
    location: "Hotel Detective's Office",
    time: "6:00 AM, October 4, 1947",
    badge: "JOIN · GROUP BY · COUNT",
    story: [
      {
        type: "p",
        text: "The sun was coming up over the lake. You had five hours of notes, a full hotel log, and a name that kept appearing in every corner of this case.",
      },
      {
        type: "p",
        text: "One last query. Cross-reference everyone in the hotel log with their names. Count their movements. Let the data make the case.",
      },
      {
        type: "npc",
        text: '"You already know who did it, Mr. Cross. Run the numbers. Make it official."',
      },
    ],
    objective: "Cross-reference everyone in the hotel log with their names. Count their movements and rank them.",
    validate: (rows, cols) =>
      rows.length === 6 &&
      cols.some(c => c.toLowerCase() === "name") &&
      rows[0].includes("Diane Harlow") &&
      rows[0].some((v: any) => typeof v === "number" && v === 3),
    hints: [
      "JOIN hotel_log h with persons p ON h.person_id = p.id to get names.",
      "Then GROUP BY p.name and COUNT(*) AS activity. ORDER BY activity DESC.",
      "SELECT p.name, COUNT(*) AS activity FROM hotel_log h JOIN persons p ON h.person_id=p.id GROUP BY p.name ORDER BY activity DESC",
    ],
    success:
      "Diane Harlow. Three movements — all after 23:00, all on the 4th floor, all pointing to room 403. The case is made.",
    bonus_prompt: "Filter to show only the ones with more than one logged movement.",
    bonus_validate: (rows, cols) =>
      rows.length === 3 &&
      cols.some(c => c.toLowerCase() === "name") &&
      rows[0].includes("Diane Harlow"),
    bonus_clue:
      "Three people with more than one documented movement. Diane Harlow, Louis Krane, Tommy Ricci. Only one had the motive, the means, and nine thousand five hundred reasons.",
  },
];
