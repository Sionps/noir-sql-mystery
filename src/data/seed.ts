export const SEED_SQL = `
CREATE TABLE persons (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, room_no INTEGER, alibi TEXT
);
INSERT INTO persons VALUES
(1,'Louis Krane','manager',101,'Claims he was in his office all evening'),
(2,'Tommy Ricci','bellhop',NULL,'Says he was delivering luggage on the 3rd floor'),
(3,'Diane Harlow','singer',402,'Claims she was performing until midnight'),
(4,'Frank Dellum','partner',305,'Says he was at the bar until closing'),
(5,'Nora Vance','maid',NULL,'Claims she was cleaning rooms on the 2nd floor'),
(6,'Victor Malone','victim',403,'Found dead in room 403');

CREATE TABLE hotel_log (
  id INTEGER PRIMARY KEY, person_id INTEGER, event TEXT, floor INTEGER, timestamp TEXT
);
INSERT INTO hotel_log VALUES
(1,6,'check-in',4,'20:00'),
(2,1,'office inspection',1,'21:00'),
(3,2,'luggage delivery',3,'22:00'),
(4,4,'bar visit',1,'22:30'),
(5,3,'performance end',1,'23:00'),
(6,3,'elevator to floor 4',4,'23:15'),
(7,2,'errand',4,'23:10'),
(8,5,'cleaning',2,'22:45'),
(9,3,'room entry',4,'23:20'),
(10,1,'night rounds',1,'00:15');

CREATE TABLE evidence (
  id INTEGER PRIMARY KEY, item TEXT, location TEXT, notes TEXT
);
INSERT INTO evidence VALUES
(1,'broken glass','room 403','Shattered near the window, consistent with a struggle'),
(2,'lipstick','room 403 bathroom','Crimson lipstick on a cigarette, matches Diane Harlow brand'),
(3,'torn fabric','hallway floor 4','Dark silk, likely from an evening gown'),
(4,'perfume bottle','room 403','Half-empty Chanel No 5, Diane Harlow signature scent'),
(5,'cufflinks','room 403','Gold monogrammed cufflinks, initials FK'),
(6,'matchbook','room 403','From the Velvet Room bar'),
(7,'key card','back alley','Hotel master key, grants room access to 4th floor'),
(8,'ledger page','room 403 desk','Financial records showing a 9500 dollar withdrawal');

CREATE TABLE phone_rec (
  id INTEGER PRIMARY KEY, caller_id INTEGER, called TEXT, duration INTEGER, timestamp TEXT
);
INSERT INTO phone_rec VALUES
(1,3,'Victor Malone',120,'22:45'),
(2,4,'Victor Malone',45,'21:30'),
(3,1,'front desk',30,'23:00'),
(4,3,'room service',15,'22:00'),
(5,2,'Victor Malone',10,'20:30');

CREATE TABLE financials (
  id INTEGER PRIMARY KEY, person_id INTEGER, memo TEXT, amount REAL, date TEXT
);
INSERT INTO financials VALUES
(1,3,'Club earnings payment',-9500,'1947-10-01'),
(2,6,'Club earnings received',9500,'1947-10-01'),
(3,4,'Partnership advance',-2000,'1947-09-15'),
(4,1,'Manager commission',1200,'1947-10-01'),
(5,3,'Performance fee',500,'1947-09-30'),
(6,4,'Expense reimbursement',-800,'1947-10-02'),
(7,5,'Wages',120,'1947-10-01'),
(8,2,'Tips',45,'1947-10-01');

CREATE TABLE bar_tabs (
  id INTEGER PRIMARY KEY, person_id INTEGER, drink TEXT, tab_time TEXT, paid INTEGER
);
INSERT INTO bar_tabs VALUES
(1,3,'gin martini','20:30',1),
(2,4,'whiskey sour','21:00',1),
(3,3,'champagne','21:45',1),
(4,4,'bourbon','22:00',1),
(5,3,'gin martini','22:30',0),
(6,1,'brandy','23:30',1),
(7,2,'beer','20:00',1),
(8,5,'water','21:30',1);

CREATE TABLE witnesses (
  id INTEGER PRIMARY KEY, name TEXT, statement TEXT, credibility INTEGER
);
INSERT INTO witnesses VALUES
(1,'Hotel Clerk','Saw a woman in a red dress leaving the 4th floor at 11:25 PM',9),
(2,'Elevator Operator','Took a woman to floor 4 around 11:15 PM, she seemed nervous',8),
(3,'Bar Patron','The singer left the bar around 10:30 PM, said she had business to attend to',7),
(4,'Bellhop Charlie','Heard arguing in room 403 around 11:20 PM, a woman voice',6),
(5,'Night Porter','Saw two people enter room 403, one was definitely a woman in red',9),
(6,'Malone Associate','Malone told me Diane was furious about the missing money',5);

CREATE TABLE alley_log (
  id INTEGER PRIMARY KEY, person_id INTEGER, seen_at TEXT, direction TEXT, notes TEXT
);
INSERT INTO alley_log VALUES
(1,3,'23:28','north','Hurrying, coat pulled tight, carrying a small handbag'),
(2,2,'23:35','south','Checking the alley, looked nervous and distracted'),
(3,1,'00:20','south','Night inspection rounds, nothing unusual noted'),
(4,5,'22:30','north','Taking out trash bags, routine duties'),
(5,4,'23:45','south','Smoking a cigarette, leaning against the wall');

CREATE TABLE messages (
  id INTEGER PRIMARY KEY, sender_id INTEGER, recipient TEXT, body TEXT, sent_at TEXT
);
INSERT INTO messages VALUES
(1,3,'Victor Malone','We need to talk tonight. You know what this is about.','20:15'),
(2,4,'Victor Malone','The deal is off unless you return what you took.','21:00'),
(3,1,'Victor Malone','Please come to the lobby at your convenience.','19:30'),
(4,3,'Victor Malone','I am coming to your room at 11. Have my money ready.','22:00'),
(5,2,'Victor Malone','Your package arrived. Room 403.','20:00');

CREATE TABLE staff (
  id INTEGER PRIMARY KEY, name TEXT, shift TEXT, floor_access INTEGER, notes TEXT
);
INSERT INTO staff VALUES
(1,'Louis Krane','day/night',5,'Has master key, full building access'),
(2,'Tommy Ricci','evening',4,'Has key to floors 1-4, reported missing key on Oct 3'),
(3,'Marge Tuttle','day',2,'Housekeeping, floors 1-2 only'),
(4,'Bert Collins','night',4,'Security, has access key for floors 1-4'),
(5,'Nora Vance','evening',3,'Housekeeping, floors 1-3, borrowed key on Oct 2');
`
