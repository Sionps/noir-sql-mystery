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
      "Pull the complete guest and staff manifest. Query the persons table.",
    validate: (rows, cols) => rows.length === 6 && cols.length >= 4,
    hints: [
      "Use SELECT to retrieve records from a table.",
      "The syntax is: SELECT * FROM table_name — the asterisk means all columns.",
      "SELECT * FROM persons",
    ],
    success:
      "Six names on the manifest. Five suspects. One victim. The investigation begins.",
    bonus_prompt:
      "Sort the manifest alphabetically by name to see who rises to the top.",
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
        text: "Filter hotel_log for floor 4 after 23:00. Someone was up there when Malone was dying.",
      },
    ],
    objective:
      "Find everyone logged on floor 4 after 23:00. Query hotel_log with WHERE and AND.",
    validate: (rows) => rows.length >= 2,
    hints: [
      "Use WHERE to filter rows. You need two conditions connected with AND.",
      "Chain conditions: WHERE floor=4 AND timestamp>'23:00'",
      "SELECT * FROM hotel_log WHERE floor=4 AND timestamp>'23:00'",
    ],
    success:
      "Three entries. The singer appeared twice. The bellhop once. Someone was outside Room 403 at the right time.",
    bonus_prompt:
      "JOIN hotel_log with persons to show names instead of person IDs.",
    bonus_validate: (rows, cols) =>
      rows.length >= 2 && cols.some((c) => c.toLowerCase() === "name"),
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
        text: "Search the evidence table notes for what she left behind.",
      },
    ],
    objective:
      "Search evidence notes for 'lipstick' or 'perfume' using LIKE and OR.",
    validate: (rows) => rows.length === 2,
    hints: [
      "Use LIKE with % wildcards: notes LIKE '%word%'",
      "Use OR to match either condition: WHERE cond1 OR cond2",
      "SELECT * FROM evidence WHERE notes LIKE '%lipstick%' OR notes LIKE '%perfume%'",
    ],
    success:
      "Two pieces of evidence. A cigarette with crimson lipstick. A half-empty Chanel No. 5. Both pointing the same direction.",
    bonus_prompt:
      "Find all evidence items from the crime scene — location contains '403'.",
    bonus_validate: (rows) => rows.length >= 4,
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
        text: "JOIN phone_rec with persons to get caller names — IDs alone will not close a case.",
      },
    ],
    objective:
      "JOIN phone_rec with persons WHERE called='Victor Malone'. Include caller names.",
    validate: (rows, cols) =>
      rows.length === 3 && cols.some((c) => c.toLowerCase() === "name"),
    hints: [
      "JOIN combines two tables on a matching column. phone_rec.caller_id matches persons.id",
      "Syntax: FROM phone_rec pr JOIN persons p ON pr.caller_id=p.id",
      "SELECT p.name, pr.duration, pr.timestamp FROM phone_rec pr JOIN persons p ON pr.caller_id=p.id WHERE pr.called='Victor Malone'",
    ],
    success:
      "Three calls to Malone's room. The singer called twice. The longest call lasted two full minutes.",
    bonus_prompt: "Sort callers by duration DESC to reveal who talked longest.",
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
        text: "Filter bar_tabs for person_id 3 and order by tab_time.",
      },
    ],
    objective:
      "Find Diane Harlow's bar tabs (person_id=3), ordered by tab_time.",
    validate: (rows) => rows.length === 3,
    hints: [
      "Filter for a specific person using WHERE person_id=3.",
      "Sort results chronologically using ORDER BY tab_time.",
      "SELECT * FROM bar_tabs WHERE person_id=3 ORDER BY tab_time",
    ],
    success:
      "Three drinks. Last order at 22:30. She left the bar — and someone on the 4th floor was about to have a very bad night.",
    bonus_prompt: "Count how many drinks Diane ordered using COUNT(*).",
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
      { type: "p", text: "Filter witnesses for credibility of 8 or higher." },
    ],
    objective: "Filter witnesses table for credibility >= 8.",
    validate: (rows) => rows.length === 3,
    hints: [
      "Use >= in WHERE for greater-than-or-equal comparison.",
      "Credibility is an integer column scored 1-10.",
      "SELECT * FROM witnesses WHERE credibility>=8",
    ],
    success:
      "Three credible witnesses. All three saw the same woman. The elevator operator and the hotel clerk both scored 9 out of 10.",
    bonus_prompt:
      "Find only the highest-credibility witnesses — credibility equals exactly 9.",
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
        text: "JOIN messages with persons for sender names. Filter for Victor Malone's messages.",
      },
    ],
    objective:
      "JOIN messages with persons for sender names. WHERE recipient='Victor Malone'. ORDER BY sent_at.",
    validate: (rows, cols) =>
      rows.length === 5 && cols.some((c) => c.toLowerCase() === "name"),
    hints: [
      "JOIN messages m with persons p on m.sender_id=p.id to get names.",
      "Filter: WHERE m.recipient='Victor Malone'",
      "SELECT p.name, m.body, m.sent_at FROM messages m JOIN persons p ON m.sender_id=p.id WHERE m.recipient='Victor Malone' ORDER BY m.sent_at",
    ],
    success:
      "Five messages delivered to Malone's room. Two from the singer. One announced her arrival time.",
    bonus_prompt: "Show only messages sent at or after 21:00.",
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
        text: "JOIN the alley_log with persons for names. ORDER BY seen_at. Build the timeline.",
      },
    ],
    objective: "JOIN alley_log with persons for names. ORDER BY seen_at.",
    validate: (rows, cols) =>
      rows.length === 5 && cols.some((c) => c.toLowerCase() === "name"),
    hints: [
      "JOIN alley_log a with persons p on a.person_id=p.id.",
      "ORDER BY a.seen_at to build a chronological timeline.",
      "SELECT p.name, a.seen_at, a.direction, a.notes FROM alley_log a JOIN persons p ON a.person_id=p.id ORDER BY a.seen_at",
    ],
    success:
      "Five people passed through that alley. At 23:28, a woman was seen heading north — hurrying, coat pulled tight.",
    bonus_prompt: "Find everyone seen in the alley between 23:00 and 23:59.",
    bonus_validate: (rows) => rows.length === 3,
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
        text: '"Check the staff table, Mr. Cross. Floor access and key notes. That is how she got in."',
      },
      {
        type: "p",
        text: "Find staff with floor_access of 4 or higher whose notes mention a key.",
      },
    ],
    objective: "Find staff with floor_access >= 4 AND notes LIKE '%key%'.",
    validate: (rows) => rows.length === 3,
    hints: [
      "Combine two WHERE conditions with AND.",
      "Use LIKE '%key%' to find rows where notes mention a key.",
      "SELECT * FROM staff WHERE floor_access>=4 AND notes LIKE '%key%'",
    ],
    success:
      "Three staff members had the means. One reported a missing key on October 3rd — the night of the murder.",
    bonus_prompt:
      "Find only the staff member with full master key access (floor_access = 5).",
    bonus_validate: (rows) =>
      rows.length === 1 && rows[0].some((v: any) => v === 5),
    bonus_clue:
      "Only Louis Krane holds a master key. But Tommy Ricci reported his 4th-floor key missing on October 3rd — and never explained how the killer walked through a locked door.",
  },
  {
    num: 10,
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
      "GROUP BY person_id, SUM(amount) WHERE amount<0, ORDER BY total ASC.",
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
      "JOIN financials with persons to reveal names alongside the totals.",
    bonus_validate: (rows) =>
      rows.length === 2 && rows[0].some((v: any) => v === "Diane Harlow"),
    bonus_clue:
      "Diane Harlow, person_id 3. Nine thousand five hundred dollars stolen from her share of the Velvet Room club earnings. Victor Malone called it a management fee. Diane called it theft. She was right.",
  },
];
