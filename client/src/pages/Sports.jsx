import { useState, useEffect } from 'react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

// ════════════════════════════════════════════════════════════
//  SPORT DEFINITIONS
// ════════════════════════════════════════════════════════════
const SPORT_TYPES = [
  { key:'all',        label:'All Sports',  icon:'🏆', color:'#0C4A3E' },
  { key:'cricket',    label:'Cricket',     icon:'🏏', color:'#1D3461' },
  { key:'football',   label:'Football',    icon:'⚽', color:'#166534' },
  { key:'kabaddi',    label:'Kabaddi',     icon:'🤼', color:'#7C3AED' },
  { key:'badminton',  label:'Badminton',   icon:'🏸', color:'#D97706' },
  { key:'chess',      label:'Chess',       icon:'♟️', color:'#374151' },
  { key:'tennis',     label:'Tennis',      icon:'🎾', color:'#DC2626' },
  { key:'athletics',  label:'Athletics',   icon:'🏃', color:'#0891B2' },
  { key:'local',      label:'Local Annur', icon:'📍', color:'#16A34A' },
]

// ════════════════════════════════════════════════════════════
//  CRICKET — IPL 2026 TEAMS
// ════════════════════════════════════════════════════════════
const IPL_TEAMS = {
  CSK:'Chennai Super Kings', MI:'Mumbai Indians', RCB:'Royal Challengers Bengaluru',
  KKR:'Kolkata Knight Riders', DC:'Delhi Capitals', PBKS:'Punjab Kings',
  RR:'Rajasthan Royals', SRH:'Sunrisers Hyderabad', GT:'Gujarat Titans', LSG:'Lucknow Super Giants',
}
const IPL_COLORS = {
  CSK:{p:'#FCDB00',s:'#1D3461',e:'🦁'}, MI:{p:'#005DA0',s:'#003E7E',e:'🏙️'},
  RCB:{p:'#EC1C24',s:'#141414',e:'🔴'}, KKR:{p:'#3B2160',s:'#F5C91E',e:'👑'},
  DC:{p:'#0078BC',s:'#EF1C25',e:'🔷'}, PBKS:{p:'#ED1B24',s:'#DCCF89',e:'🔴'},
  RR:{p:'#EA1A85',s:'#2B4AA5',e:'💗'}, SRH:{p:'#E85D12',s:'#F7A721',e:'🌅'},
  GT:{p:'#1B1F4D',s:'#5E4EA1',e:'⚡'}, LSG:{p:'#A52A5A',s:'#2D5186',e:'🔵'},
}
const IPL_VENUE = {
  CSK:'MA Chidambaram Stadium, Chennai', MI:'Wankhede Stadium, Mumbai',
  RCB:'M Chinnaswamy Stadium, Bengaluru', KKR:'Eden Gardens, Kolkata',
  DC:'Arun Jaitley Stadium, Delhi', PBKS:'IS Bindra Stadium, Mohali',
  RR:'Sawai Mansingh Stadium, Jaipur', SRH:'Rajiv Gandhi Intl Stadium, Hyderabad',
  GT:'Narendra Modi Stadium, Ahmedabad', LSG:'Ekana Cricket Stadium, Lucknow',
}

// ════════════════════════════════════════════════════════════
//  ALL SPORTS DATA
// ════════════════════════════════════════════════════════════

// Cricket IPL 2026 — [num,home,away,date,time,s1,s2,result]
const IPL_RAW = [
  [1,'KKR','MI','2026-03-22','19:30','189/4','172/7','KKR won by 17 runs'],
  [2,'CSK','RCB','2026-03-22','15:30','168/5','169/4','RCB won by 6 wickets'],
  [3,'SRH','DC','2026-03-23','15:30','195/5','143/9','SRH won by 52 runs'],
  [4,'GT','PBKS','2026-03-23','19:30','168/6','164/7','GT won by 4 runs'],
  [5,'MI','RR','2026-03-25','19:30','182/5','177/8','MI won by 5 runs'],
  [6,'CSK','KKR','2026-03-25','15:30','171/6','169/8','CSK won by 2 runs'],
  [7,'DC','LSG','2026-03-26','19:30','172/9','188/6','LSG won by 16 runs'],
  [8,'RR','RCB','2026-03-27','19:30','163/8','164/4','RCB won by 6 wickets'],
  [9,'PBKS','SRH','2026-03-28','15:30','154/10','201/5','SRH won by 47 runs'],
  [10,'GT','MI','2026-03-28','19:30','175/7','176/3','MI won by 7 wickets'],
  [11,'KKR','DC','2026-03-29','15:30','192/5','189/6','KKR won by 3 runs'],
  [12,'LSG','CSK','2026-03-29','19:30','171/8','177/5','CSK won by 6 runs'],
  [13,'RCB','PBKS','2026-03-31','19:30','167/9','168/4','PBKS won by 6 wickets'],
  [14,'SRH','GT','2026-04-01','19:30','185/6','182/8','SRH won by 3 runs'],
  [15,'MI','KKR','2026-04-01','15:30','165/9','198/5','KKR won by 33 runs'],
  [16,'RR','LSG','2026-04-02','19:30','179/7','180/4','LSG won by 6 wickets'],
  [17,'DC','CSK','2026-04-03','15:30','156/9','183/6','CSK won by 27 runs'],
  [18,'PBKS','KKR','2026-04-04','15:30','173/3','172/7','PBKS won by 7 wickets'],
  [19,'GT','RCB','2026-04-04','19:30','161/8','162/4','RCB won by 6 wickets'],
  [20,'SRH','RR','2026-04-05','15:30','198/4','176/8','SRH won by 22 runs'],
  [21,'LSG','MI','2026-04-05','19:30','169/7','162/9','LSG won by 7 runs'],
  [22,'CSK','DC','2026-04-06','15:30','176/6','178/5','DC won by 5 wickets'],
  [23,'RCB','KKR','2026-04-08','15:30','183/7','184/5','KKR won by 5 wickets'],
  [24,'MI','SRH','2026-04-08','19:30','192/5','175/9','MI won by 17 runs'],
  [25,'RR','PBKS','2026-04-09','15:30','166/8','158/9','RR won by 8 runs'],
  [26,'CSK','GT','2026-04-09','19:30','180/5','181/4','GT won by 6 wickets'],
  [27,'DC','RCB','2026-04-11','15:30','177/7','178/5','RCB won by 5 wickets'],
  [28,'LSG','KKR','2026-04-12','15:30','171/8','195/6','KKR won by 24 runs'],
  [29,'PBKS','MI','2026-04-12','19:30','162/9','163/4','MI won by 6 wickets'],
  [30,'SRH','CSK','2026-04-13','15:30','188/5','162/10','SRH won by 26 runs'],
  [31,'GT','DC','2026-04-14','19:30','174/3','173/6','GT won by 7 wickets'],
  [32,'RR','MI','2026-04-15','15:30','168/8','169/4','MI won by 6 wickets'],
  [33,'KKR','CSK','2026-04-16','19:30','176/7','177/4','CSK won by 6 wickets'],
  [34,'RCB','SRH','2026-04-16','15:30','179/6','174/7','RCB won by 5 runs'],
  [35,'LSG','GT','2026-04-18','15:30','165/9','188/5','GT won by 23 runs'],
  [36,'DC','RR','2026-04-18','19:30','172/7','160/8','DC won by 12 runs'],
  [37,'PBKS','CSK','2026-04-19','15:30','169/9','175/6','CSK won by 6 runs'],
  [38,'MI','GT','2026-04-20','19:30','179/6','168/8','MI won by 11 runs'],
  [39,'KKR','RR','2026-04-20','15:30','165/9','166/3','RR won by 7 wickets'],
  [40,'SRH','LSG','2026-04-21','19:30','193/6','178/8','SRH won by 15 runs'],
  [41,'RCB','MI','2026-04-22','15:30','163/10','187/5','MI won by 24 runs'],
  [42,'DC','KKR','2026-04-22','19:30','168/7','171/4','KKR won by 6 wickets'],
  [43,'CSK','RR','2026-04-23','19:30','183/5','158/10','CSK won by 25 runs'],
  [44,'GT','PBKS','2026-04-24','15:30','169/6','170/4','PBKS won by 6 wickets'],
  [45,'LSG','DC','2026-04-24','19:30','176/8','174/7','LSG won by 2 runs'],
  // TODAY
  [46,'PBKS','SRH','2026-04-25','15:30',null,null,null],
  [47,'RR','KKR','2026-04-25','19:30',null,null,null],
  // UPCOMING
  [48,'MI','DC','2026-04-26','15:30',null,null,null],
  [49,'RCB','LSG','2026-04-26','19:30',null,null,null],
  [50,'CSK','SRH','2026-04-28','19:30',null,null,null],
  [51,'GT','RR','2026-04-29','19:30',null,null,null],
  [52,'KKR','PBKS','2026-04-30','19:30',null,null,null],
  [53,'DC','MI','2026-05-01','15:30',null,null,null],
  [54,'LSG','RCB','2026-05-01','19:30',null,null,null],
  [55,'SRH','CSK','2026-05-02','15:30',null,null,null],
  [56,'RR','GT','2026-05-02','19:30',null,null,null],
  [57,'KKR','LSG','2026-05-03','15:30',null,null,null],
  [58,'MI','PBKS','2026-05-03','19:30',null,null,null],
  [59,'RCB','DC','2026-05-05','15:30',null,null,null],
  [60,'PBKS','GT','2026-05-06','19:30',null,null,null],
  [61,'MI','CSK','2026-05-07','19:30',null,null,null],
  [62,'KKR','SRH','2026-05-09','15:30',null,null,null],
  [63,'RR','RCB','2026-05-09','19:30',null,null,null],
  [64,'CSK','MI','2026-05-10','15:30',null,null,null],
  [65,'DC','GT','2026-05-10','19:30',null,null,null],
]

const TODAY = new Date().toISOString().slice(0, 10)

const CRICKET_MATCHES = IPL_RAW.map(([num,h,a,date,time,s1,s2,res]) => ({
  id:`ipl_${num}`, sport:'cricket', league:'IPL 2026', num,
  team1:h, team1Full:IPL_TEAMS[h]||h,
  team2:a, team2Full:IPL_TEAMS[a]||a,
  date, time, venue:IPL_VENUE[h]||'',
  score1:s1, score2:s2, result:res,
  isToday:date===TODAY, isCompleted:!!res,
}))

// Football — ISL 2025-26
const FOOTBALL_MATCHES = [
  {id:'isl_1',sport:'football',league:'ISL 2025-26',team1:'Chennaiyin FC',team1Full:'Chennaiyin FC',team2:'Mumbai City FC',team2Full:'Mumbai City FC',date:'2026-01-15',time:'19:30',venue:'Jawaharlal Nehru Stadium, Chennai',score1:'1',score2:'2',result:'Mumbai City FC won 2-1',isToday:false,isCompleted:true},
  {id:'isl_2',sport:'football',league:'ISL 2025-26',team1:'Kerala Blasters',team1Full:'Kerala Blasters FC',team2:'Bengaluru FC',team2Full:'Bengaluru FC',date:'2026-01-18',time:'17:00',venue:'Jawaharlal Nehru Stadium, Kochi',score1:'1',score2:'1',result:'Draw — Kerala Blasters 1-1 Bengaluru FC',isToday:false,isCompleted:true},
  {id:'isl_3',sport:'football',league:'ISL 2025-26',team1:'ATKMB',team1Full:'ATK Mohun Bagan',team2:'Chennaiyin FC',team2Full:'Chennaiyin FC',date:'2026-01-22',time:'19:30',venue:'Vivekananda Yuba Bharati, Kolkata',score1:'2',score2:'1',result:'ATK Mohun Bagan won 2-1',isToday:false,isCompleted:true},
  {id:'isl_4',sport:'football',league:'ISL 2025-26',team1:'Bengaluru FC',team1Full:'Bengaluru FC',team2:'Mumbai City FC',team2Full:'Mumbai City FC',date:'2026-01-25',time:'17:00',venue:'Sree Kanteerava Stadium, Bengaluru',score1:'2',score2:'0',result:'Bengaluru FC won 2-0',isToday:false,isCompleted:true},
  {id:'isl_5',sport:'football',league:'ISL 2025-26',team1:'FC Goa',team1Full:'FC Goa',team2:'Chennaiyin FC',team2Full:'Chennaiyin FC',date:'2026-02-01',time:'19:30',venue:'Pandit Jawaharlal Nehru Stadium, Goa',score1:'0',score2:'1',result:'Chennaiyin FC won 0-1',isToday:false,isCompleted:true},
  {id:'isl_sf1',sport:'football',league:'ISL 2025-26 Semifinal 1',team1:'Bengaluru FC',team1Full:'Bengaluru FC',team2:'Kerala Blasters',team2Full:'Kerala Blasters FC',date:'2026-02-08',time:'17:00',venue:'Sree Kanteerava, Bengaluru',score1:'3',score2:'1',result:'Bengaluru FC won 3-1 (SF)',isToday:false,isCompleted:true},
  {id:'isl_sf2',sport:'football',league:'ISL 2025-26 Semifinal 2',team1:'Mumbai City FC',team1Full:'Mumbai City FC',team2:'Odisha FC',team2Full:'Odisha FC',date:'2026-02-10',time:'19:30',venue:'Mumbai Football Arena',score1:'2',score2:'0',result:'Mumbai City FC won 2-0 (SF)',isToday:false,isCompleted:true},
  {id:'isl_final',sport:'football',league:'🏆 ISL 2025-26 FINAL',team1:'Bengaluru FC',team1Full:'Bengaluru FC 🏆',team2:'Mumbai City FC',team2Full:'Mumbai City FC',date:'2026-02-22',time:'19:30',venue:'Salt Lake Stadium, Kolkata',score1:'2',score2:'1',result:'🏆 Bengaluru FC — ISL Champions 2025-26! (2-1 AET)',isToday:false,isCompleted:true},
  {id:'isl_s27_1',sport:'football',league:'ISL 2026-27 Pre-Season',team1:'Chennaiyin FC',team1Full:'Chennaiyin FC',team2:'Kerala Blasters',team2Full:'Kerala Blasters FC',date:'2026-08-15',time:'17:00',venue:'Jawaharlal Nehru Stadium, Chennai',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
  {id:'isl_s27_2',sport:'football',league:'ISL 2026-27 Pre-Season',team1:'Bengaluru FC',team1Full:'Bengaluru FC',team2:'ATKMB',team2Full:'ATK Mohun Bagan',date:'2026-08-22',time:'19:30',venue:'Sree Kanteerava, Bengaluru',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
]

// Kabaddi — PKL Season 12
const KABADDI_MATCHES = [
  {id:'pkl_1',sport:'kabaddi',league:'PKL Season 12',team1:'Tamil Thalaivas',team1Full:'Tamil Thalaivas',team2:'Bengaluru Bulls',team2Full:'Bengaluru Bulls',date:'2025-12-20',time:'20:00',venue:'Netaji Indoor Stadium, Kolkata',score1:'35',score2:'30',result:'Tamil Thalaivas won 35-30',isToday:false,isCompleted:true},
  {id:'pkl_2',sport:'kabaddi',league:'PKL Season 12',team1:'Tamil Thalaivas',team1Full:'Tamil Thalaivas',team2:'Patna Pirates',team2Full:'Patna Pirates',date:'2025-12-28',time:'20:00',venue:'Sheraton Grand Whitefield, Bengaluru',score1:'28',score2:'42',result:'Patna Pirates won 42-28',isToday:false,isCompleted:true},
  {id:'pkl_3',sport:'kabaddi',league:'PKL Season 12',team1:'Tamil Thalaivas',team1Full:'Tamil Thalaivas',team2:'UP Yoddhas',team2Full:'UP Yoddhas',date:'2026-01-10',time:'20:00',venue:'Shaheed Vijay Singh Pathik Sports Complex, Greater Noida',score1:'39',score2:'36',result:'Tamil Thalaivas won 39-36',isToday:false,isCompleted:true},
  {id:'pkl_4',sport:'kabaddi',league:'PKL Season 12',team1:'Tamil Thalaivas',team1Full:'Tamil Thalaivas',team2:'Jaipur Pink Panthers',team2Full:'Jaipur Pink Panthers',date:'2026-01-15',time:'20:00',venue:'Sawai Mansingh Indoor, Jaipur',score1:'28',score2:'31',result:'Jaipur Pink Panthers won 31-28',isToday:false,isCompleted:true},
  {id:'pkl_sf1',sport:'kabaddi',league:'PKL S12 Semifinal 1',team1:'Patna Pirates',team1Full:'Patna Pirates',team2:'UP Yoddhas',team2Full:'UP Yoddhas',date:'2026-02-01',time:'20:00',venue:'DOME, NSCI SVP Stadium, Mumbai',score1:'45',score2:'38',result:'Patna Pirates won 45-38 (SF)',isToday:false,isCompleted:true},
  {id:'pkl_sf2',sport:'kabaddi',league:'PKL S12 Semifinal 2',team1:'Jaipur Pink Panthers',team1Full:'Jaipur Pink Panthers',team2:'Puneri Paltan',team2Full:'Puneri Paltan',date:'2026-02-02',time:'20:00',venue:'DOME, NSCI SVP Stadium, Mumbai',score1:'42',score2:'35',result:'Jaipur Pink Panthers won 42-35 (SF)',isToday:false,isCompleted:true},
  {id:'pkl_final',sport:'kabaddi',league:'🏆 PKL Season 12 FINAL',team1:'Patna Pirates',team1Full:'Patna Pirates 🏆',team2:'Jaipur Pink Panthers',team2Full:'Jaipur Pink Panthers',date:'2026-02-08',time:'20:00',venue:'DOME, NSCI SVP Stadium, Mumbai',score1:'43',score2:'40',result:'🏆 Patna Pirates — PKL Season 12 Champions! 43-40',isToday:false,isCompleted:true},
  {id:'pkl_s13_1',sport:'kabaddi',league:'PKL Season 13',team1:'Tamil Thalaivas',team1Full:'Tamil Thalaivas',team2:'TBD',team2Full:'Season Opener Opponent TBD',date:'2026-10-01',time:'20:00',venue:'Chennai',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
]

// Badminton — BWF World Tour 2026
const BADMINTON_MATCHES = [
  {id:'bwf_1',sport:'badminton',league:'All England Open 2026',team1:'Lakshya Sen 🇮🇳',team1Full:'Lakshya Sen (IND)',team2:'Shi Yuqi 🇨🇳',team2Full:'Shi Yuqi (CHN)',date:'2026-03-10',time:'',venue:'Utilita Arena, Birmingham',score1:'21-19, 14-21',score2:'15-21',result:'Shi Yuqi won (QF)',isToday:false,isCompleted:true},
  {id:'bwf_2',sport:'badminton',league:'French Open Badminton 2026',team1:'Lakshya Sen 🇮🇳',team1Full:'Lakshya Sen (IND)',team2:'Viktor Axelsen 🇩🇰',team2Full:'Viktor Axelsen (DEN)',date:'2026-03-29',time:'',venue:'AccorHotels Arena, Paris',score1:'21-18, 20-22',score2:'21-19',result:'🏆 Lakshya Sen won! (21-18, 20-22, 21-19)',isToday:false,isCompleted:true},
  {id:'bwf_3',sport:'badminton',league:'India Open 2026 — Women SF',team1:'PV Sindhu 🇮🇳',team1Full:'PV Sindhu (IND)',team2:'Ratchanok Intanon 🇹🇭',team2Full:'Ratchanok Intanon (THA)',date:'2026-04-05',time:'14:00',venue:'KD Jadhav Indoor Hall, Delhi',score1:'21-16',score2:'21-18',result:'🏆 PV Sindhu won! (21-16, 21-18)',isToday:false,isCompleted:true},
  {id:'bwf_4',sport:'badminton',league:'India Open 2026 — MD Final',team1:'Satwik/Chirag 🇮🇳',team1Full:'Satwik Sairaj / Chirag Shetty (IND)',team2:'Marcus/Kevin 🇮🇩',team2Full:'Marcus Fernaldi / Kevin Sukamuljo (INA)',date:'2026-04-07',time:'16:00',venue:'KD Jadhav Indoor Hall, Delhi',score1:'21-19',score2:'21-17',result:'🏆 Satwik/Chirag WON India Open! (21-19, 21-17)',isToday:false,isCompleted:true},
  {id:'bwf_5',sport:'badminton',league:'Malaysia Open 2026',team1:'Lakshya Sen 🇮🇳',team1Full:'Lakshya Sen (IND)',team2:'Lee Zii Jia 🇲🇾',team2Full:'Lee Zii Jia (MAS)',date:'2026-05-14',time:'',venue:'Axiata Arena, Kuala Lumpur',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
  {id:'bwf_6',sport:'badminton',league:'Singapore Open 2026',team1:'PV Sindhu 🇮🇳',team1Full:'PV Sindhu (IND)',team2:'TBD',team2Full:'Opponent TBD',date:'2026-06-02',time:'',venue:'Singapore Indoor Stadium',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
  {id:'bwf_7',sport:'badminton',league:'Thomas Cup 2026',team1:'India 🇮🇳',team1Full:'India (Team)',team2:'Indonesia 🇮🇩',team2Full:'Indonesia (Team)',date:'2026-05-08',time:'',venue:'Impact Arena, Bangkok',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
]

// Chess — FIDE Tournaments 2026
const CHESS_MATCHES = [
  {id:'chess_1',sport:'chess',league:'FIDE Candidates 2026',team1:'Pragg 🇮🇳',team1Full:'R. Praggnanandhaa (IND)',team2:'Nepomniachtchi 🇷🇺',team2Full:'I. Nepomniachtchi (FIDE)',date:'2026-03-15',time:'',venue:'Toronto, Canada',score1:'½',score2:'½',result:'Draw (½-½) — Pragg leads tournament',isToday:false,isCompleted:true},
  {id:'chess_2',sport:'chess',league:'Norway Chess 2026',team1:'D. Gukesh 🇮🇳',team1Full:'D. Gukesh (IND) — World Champion',team2:'Magnus Carlsen 🇳🇴',team2Full:'Magnus Carlsen (NOR)',date:'2026-04-20',time:'',venue:'Stavanger, Norway',score1:'1',score2:'0',result:'🏆 Gukesh beat Carlsen! (47 moves, Sicilian)',isToday:false,isCompleted:true},
  {id:'chess_3',sport:'chess',league:'FIDE Grand Prix 2026',team1:'Vidit Gujrathi 🇮🇳',team1Full:'Vidit Gujrathi (IND)',team2:'Fabiano Caruana 🇺🇸',team2Full:'Fabiano Caruana (USA)',date:'2026-04-10',time:'',venue:'Berlin, Germany',score1:'0',score2:'1',result:'Caruana won (King\'s Indian, 38 moves)',isToday:false,isCompleted:true},
  {id:'chess_4',sport:'chess',league:'Norway Chess 2026',team1:'Pragg 🇮🇳',team1Full:'R. Praggnanandhaa (IND)',team2:'Hikaru Nakamura 🇺🇸',team2Full:'Hikaru Nakamura (USA)',date:'2026-04-26',time:'16:30',venue:'Stavanger, Norway',score1:null,score2:null,result:null,isToday:'2026-04-26'===TODAY,isCompleted:false},
  {id:'chess_5',sport:'chess',league:'FIDE World Cup 2026',team1:'India 🇮🇳',team1Full:'Team India (Gukesh, Pragg, Vidit)',team2:'International Field',team2Full:'All Nations',date:'2026-07-15',time:'',venue:'Tashkent, Uzbekistan',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
]

// Tennis — ATP/WTA 2026
const TENNIS_MATCHES = [
  {id:'ten_1',sport:'tennis',league:'Australian Open 2026 — Men\'s Final',team1:'Jannik Sinner 🇮🇹',team1Full:'Jannik Sinner (ITA) 🏆',team2:'Carlos Alcaraz 🇪🇸',team2Full:'Carlos Alcaraz (ESP)',date:'2026-02-01',time:'',venue:'Melbourne Park',score1:'6-4, 6-4, 7-6',score2:'',result:'🏆 Sinner won AO 2026! (6-4, 6-4, 7-6)',isToday:false,isCompleted:true},
  {id:'ten_2',sport:'tennis',league:'Monte-Carlo Masters 2026',team1:'Rohan Bopanna 🇮🇳',team1Full:'Rohan Bopanna (IND) — Doubles',team2:'Simone Bolelli 🇮🇹',team2Full:'Bolelli/Vavassori (ITA)',date:'2026-04-13',time:'',venue:'Monte Carlo Country Club',score1:'4-6, 3-6',score2:'',result:'Bopanna/Ebden lost QF (4-6, 3-6)',isToday:false,isCompleted:true},
  {id:'ten_3',sport:'tennis',league:'Sumit Nagal — ATP Challenger',team1:'Sumit Nagal 🇮🇳',team1Full:'Sumit Nagal (IND)',team2:'Opponent',team2Full:'Guido Pella (ARG)',date:'2026-04-18',time:'',venue:'Perugia, Italy',score1:'6-4, 7-5',score2:'',result:'🏆 Nagal won ATP Challenger title! (6-4, 7-5)',isToday:false,isCompleted:true},
  {id:'ten_4',sport:'tennis',league:'Madrid Open 2026',team1:'Jannik Sinner 🇮🇹',team1Full:'Jannik Sinner (ITA)',team2:'Carlos Alcaraz 🇪🇸',team2Full:'Carlos Alcaraz (ESP)',date:'2026-05-01',time:'',venue:'Caja Mágica, Madrid',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
  {id:'ten_5',sport:'tennis',league:'Roland Garros 2026',team1:'Sumit Nagal 🇮🇳',team1Full:'Sumit Nagal (IND)',team2:'TBD',team2Full:'Opponent TBD',date:'2026-05-24',time:'',venue:'Roland Garros, Paris',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
  {id:'ten_6',sport:'tennis',league:'Roland Garros 2026',team1:'Rohan Bopanna 🇮🇳',team1Full:'Rohan Bopanna / Partner (IND)',team2:'TBD',team2Full:'Doubles — Opponent TBD',date:'2026-05-26',time:'',venue:'Roland Garros, Paris',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
]

// Athletics — Indian Athletes
const ATHLETICS_MATCHES = [
  {id:'ath_1',sport:'athletics',league:'Doha Diamond League 2026',team1:'Neeraj Chopra 🇮🇳',team1Full:'Neeraj Chopra (IND) — Javelin',team2:'Anderson Peters 🇬🇩',team2Full:'Anderson Peters (GRN)',date:'2026-04-18',time:'',venue:'Khalifa International Stadium, Doha',score1:'88.27m',score2:'87.54m',result:'🥇 Neeraj Chopra WON! 88.27m — Season Best',isToday:false,isCompleted:true},
  {id:'ath_2',sport:'athletics',league:'National Open Athletics 2026',team1:'Jyothi Yarraji 🇮🇳',team1Full:'Jyothi Yarraji (IND) — 100m Hurdles',team2:'Competition',team2Full:'National Athletes',date:'2026-04-12',time:'',venue:'Kanteerava Stadium, Bengaluru',score1:'12.72s',score2:'NR',result:'🏆 National Record 12.72s — Jyothi Yarraji',isToday:false,isCompleted:true},
  {id:'ath_3',sport:'athletics',league:'Jamaica Invitational 2026',team1:'Dutee Chand 🇮🇳',team1Full:'Dutee Chand (IND) — 100m Sprint',team2:'Competition',team2Full:'International Athletes',date:'2026-05-05',time:'',venue:'Kingston, Jamaica',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
  {id:'ath_4',sport:'athletics',league:'Eugene Diamond League 2026',team1:'Neeraj Chopra 🇮🇳',team1Full:'Neeraj Chopra (IND) — Javelin',team2:'Julian Weber 🇩🇪',team2Full:'Julian Weber (GER)',date:'2026-05-25',time:'',venue:'Hayward Field, Eugene, USA',score1:null,score2:null,result:null,isToday:false,isCompleted:false},
]

// ════════════════════════════════════════════════════════════
//  UNIFIED MATCH ARRAY
// ════════════════════════════════════════════════════════════
const ALL_MATCHES = [
  ...CRICKET_MATCHES,
  ...FOOTBALL_MATCHES,
  ...KABADDI_MATCHES,
  ...BADMINTON_MATCHES,
  ...CHESS_MATCHES,
  ...TENNIS_MATCHES,
  ...ATHLETICS_MATCHES,
]

// ════════════════════════════════════════════════════════════
//  IPL POINTS TABLE
// ════════════════════════════════════════════════════════════
function calcIPLPoints() {
  const pts = {}
  Object.keys(IPL_TEAMS).forEach(t => { pts[t] = { p:0,w:0,l:0,pts:0 } })
  CRICKET_MATCHES.filter(m => m.isCompleted).forEach(m => {
    pts[m.team1].p++; pts[m.team2].p++
    const winner = Object.keys(IPL_TEAMS).find(t => m.result?.startsWith(t+' '))
    if (winner) {
      const loser = winner===m.team1 ? m.team2 : m.team1
      pts[winner].w++; pts[winner].pts+=2; pts[loser].l++
    }
  })
  return Object.entries(pts).map(([t,s])=>({team:t,...s})).sort((a,b)=>b.pts-a.pts||b.w-a.w)
}

// ════════════════════════════════════════════════════════════
//  MATCH CARD COMPONENT
// ════════════════════════════════════════════════════════════
function MatchCard({ match }) {
  const isCricket   = match.sport==='cricket'
  const isFootball  = match.sport==='football'
  const isKabaddi   = match.sport==='kabaddi'
  const isPastDate  = match.date < TODAY
  const isToday     = match.date === TODAY
  const isLive      = isToday && !match.result
  const isUpcoming  = match.date > TODAY
  const cfg         = SPORT_TYPES.find(s=>s.key===match.sport)||SPORT_TYPES[0]
  const ht = isCricket ? (IPL_COLORS[match.team1]||{p:'#0C4A3E',s:'#14856A',e:'🏏'}) : {p:cfg.color,s:cfg.color+'99',e:cfg.icon}
  const at = isCricket ? (IPL_COLORS[match.team2]||{p:'#DC2626',s:'#991B1B',e:'🏏'}) : {p:'#374151',s:'#6B7280',e:cfg.icon}

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100" style={{ background:'#F8F7F4' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{cfg.icon}</span>
          <span className="text-[9px] font-bold text-gray-500">{match.league}</span>
          {isCricket && match.num && <span className="text-[8px] text-gray-400">• M{match.num}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {isLive && <span className="flex items-center gap-0.5 text-[9px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full"><span className="w-1 h-1 bg-white rounded-full animate-pulse"/>🔴 LIVE</span>}
          {match.isCompleted && <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">✅ FT</span>}
          {isUpcoming && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">📅 {new Date(match.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>}
          {isToday && isUpcoming && <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">⏰ Today</span>}
        </div>
      </div>

      <div className="px-4 py-3">
        {isCricket || isFootball || isKabaddi ? (
          /* Team vs Team layout */
          <div className="flex items-center gap-2">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-xl mb-1 shadow-sm"
                style={{ background:`linear-gradient(135deg,${ht.p},${ht.s})` }}>{ht.e}</div>
              <p className="text-xs font-extrabold" style={{ color:'var(--c-text)' }}>{match.team1}</p>
              <p className="text-[8px] text-gray-400 leading-tight">{match.team1Full?.split(' ').slice(0,2).join(' ')}</p>
              {match.score1 && <p className="text-base font-extrabold mt-1" style={{ color:ht.p }}>{match.score1}</p>}
            </div>
            <div className="shrink-0 w-12 flex flex-col items-center">
              {match.isCompleted ? <span className="text-lg font-black text-gray-200">VS</span>
                : isLive ? <span className="text-red-500 font-black text-xs animate-pulse">LIVE</span>
                : <div className="text-center"><span className="text-sm font-black text-gray-200">VS</span>
                    <p className="text-[8px] text-gray-400">{match.time}</p></div>}
            </div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-xl mb-1 shadow-sm"
                style={{ background:`linear-gradient(135deg,${at.p},${at.s})` }}>{at.e}</div>
              <p className="text-xs font-extrabold" style={{ color:'var(--c-text)' }}>{match.team2}</p>
              <p className="text-[8px] text-gray-400 leading-tight">{match.team2Full?.split(' ').slice(0,2).join(' ')}</p>
              {match.score2 && <p className="text-base font-extrabold mt-1" style={{ color:at.p }}>{match.score2}</p>}
            </div>
          </div>
        ) : (
          /* Player vs Player layout (badminton/chess/tennis/athletics) */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background:`linear-gradient(135deg,${cfg.color},${cfg.color}99)` }}>{cfg.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold truncate" style={{ color:'var(--c-text)' }}>{match.team1}</p>
                  <p className="text-[8px] text-gray-400 truncate">{match.team1Full}</p>
                </div>
              </div>
              {match.score1 && <span className="text-sm font-extrabold px-2" style={{ color:cfg.color }}>{match.score1}</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-gray-100">{cfg.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold truncate" style={{ color:'var(--c-text)' }}>{match.team2}</p>
                  <p className="text-[8px] text-gray-400 truncate">{match.team2Full}</p>
                </div>
              </div>
              {match.score2 && <span className="text-sm font-extrabold px-2 text-gray-500">{match.score2}</span>}
            </div>
          </div>
        )}

        {match.result && (
          <div className="mt-2.5 px-3 py-1.5 rounded-xl text-center" style={{ background:`${cfg.color}10` }}>
            <p className="text-[10px] font-extrabold" style={{ color:cfg.color }}>{match.result}</p>
          </div>
        )}
        <div className="mt-1.5 flex items-center justify-between text-[8px] text-gray-400">
          {match.venue && <span className="truncate max-w-[65%]">📍 {match.venue}</span>}
          {match.time && !match.isCompleted && <span>🕐 {match.time} IST</span>}
          {!match.venue && !match.time && <span>{match.date}</span>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
//  IPL POINTS TABLE
// ════════════════════════════════════════════════════════════
function PointsTable() {
  const table = calcIPLPoints()
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100" style={{ background:'linear-gradient(135deg,#1D3461,#2B4AA5)' }}>
        <h3 className="text-white font-extrabold text-sm">🏆 IPL 2026 — Points Table</h3>
        <p className="text-white/60 text-[9px]">{CRICKET_MATCHES.filter(m=>m.isCompleted).length} matches played</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background:'#F8F7F4' }} className="border-b border-gray-100">
              <th className="text-left px-3 py-2 font-bold text-gray-400 w-6">#</th>
              <th className="text-left px-3 py-2 font-bold text-gray-400">Team</th>
              <th className="text-center px-2 py-2 font-bold text-gray-400">P</th>
              <th className="text-center px-2 py-2 font-bold text-gray-400">W</th>
              <th className="text-center px-2 py-2 font-bold text-gray-400">L</th>
              <th className="text-center px-2 py-2 font-bold text-amber-600 bg-amber-50">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => {
              const t = IPL_COLORS[row.team]
              return (
                <tr key={row.team} className="border-b border-gray-50">
                  <td className="px-3 py-2.5 text-gray-400 font-bold">{i+1}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0 shadow-sm"
                        style={{ background:`linear-gradient(135deg,${t?.p||'#666'},${t?.s||'#999'})` }}>
                        {t?.e||'🏏'}
                      </div>
                      <div>
                        <span className="font-extrabold" style={{ color:'var(--c-text)' }}>{row.team}</span>
                        <p className="text-[8px] text-gray-400">{IPL_TEAMS[row.team]?.split(' ').slice(0,2).join(' ')}</p>
                      </div>
                      {i < 4 && <span className="text-[7px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">Playoffs</span>}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-gray-400">{row.p}</td>
                  <td className="px-2 py-2.5 text-center text-green-600 font-bold">{row.w}</td>
                  <td className="px-2 py-2.5 text-center text-red-400">{row.l}</td>
                  <td className="px-2 py-2.5 text-center font-extrabold" style={{ color:i<4?'var(--c-primary)':'var(--c-text)' }}>{row.pts}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
//  MAIN PAGE
// ════════════════════════════════════════════════════════════
const STATUS_TABS = [
  { key:'live',     label:'🔴 Live / Today' },
  { key:'upcoming', label:'⏰ Upcoming'      },
  { key:'results',  label:'✅ Results'       },
  { key:'table',    label:'🏆 IPL Table'     },
]

export default function Sports() {
  const [sport, setSport]   = useState('all')
  const [tab, setTab]       = useState('live')
  const [local, setLocal]   = useState([])

  useEffect(() => {
    api.get('/events').then(r => setLocal((r.data||[]).filter(e=>e.category==='sports'))).catch(()=>{})
  }, [])

  // Filter matches
  const filtered = ALL_MATCHES.filter(m => {
    if (sport !== 'all' && sport !== 'local' && m.sport !== sport) return false
    if (tab === 'live')     return m.date === TODAY
    if (tab === 'upcoming') return m.date > TODAY
    if (tab === 'results')  return m.isCompleted
    return true
  })

  // Local sport events filter
  const localFiltered = local.filter(e => {
    const d = e.event_date?.slice(0,10) || ''
    if (tab === 'live')     return d === TODAY
    if (tab === 'upcoming') return d > TODAY
    if (tab === 'results')  return d < TODAY
    return true
  })

  // Stats
  const liveCount     = ALL_MATCHES.filter(m=>m.date===TODAY).length
  const upcomingCount = ALL_MATCHES.filter(m=>m.date>TODAY).length
  const resultsCount  = ALL_MATCHES.filter(m=>m.isCompleted).length

  // Group by sport for display
  const sportGroups = sport === 'all'
    ? SPORT_TYPES.filter(s=>s.key!=='all'&&s.key!=='local').map(s=>({
        ...s,
        matches: filtered.filter(m=>m.sport===s.key)
      })).filter(g=>g.matches.length>0)
    : sport === 'local' ? []
    : [{ ...SPORT_TYPES.find(s=>s.key===sport), matches: filtered }]

  return (
    <div className="min-h-screen page-enter" style={{ background:'var(--c-surface)' }}>
      <SEO title="Sports — All Scores | Annur" description="Live scores, results and fixtures for Cricket IPL 2026, Football ISL, Kabaddi PKL, Badminton, Chess, Tennis and Athletics" keywords="IPL 2026, ISL football, Pro Kabaddi, badminton, chess India, tennis, athletics, sports scores" />
      <PageHeader title="Sports" subtitle="Cricket · Football · Kabaddi · Badminton · Chess · Tennis · Athletics" />

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10 pb-12">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label:'🔴 Live / Today', val:liveCount,     color:'#DC2626', bg:'#FEF2F2', border:'#FECACA', t:'live'     },
            { label:'⏰ Upcoming',     val:upcomingCount, color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE', t:'upcoming' },
            { label:'✅ Results',      val:resultsCount,  color:'#16A34A', bg:'#F0FDF4', border:'#BBF7D0', t:'results'  },
          ].map(s=>(
            <button key={s.label} onClick={()=>setTab(s.t)}
              className={`rounded-2xl border p-3 text-center transition-all hover:shadow-md ${tab===s.t?'shadow-md ring-2 ring-offset-1':''}`}
              style={{ background:s.bg, borderColor:s.border, '--tw-ring-color':s.color }}>
              <p className="text-2xl font-extrabold leading-none" style={{ color:s.color, fontFamily:'var(--font-display)' }}>{s.val}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Sport Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
          {SPORT_TYPES.map(s=>(
            <button key={s.key} onClick={()=>setSport(s.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${sport===s.key?'text-white shadow-md border-transparent':'bg-white border-gray-200/60'}`}
              style={sport===s.key?{background:s.color}:{color:'var(--c-text-muted)'}}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 border border-gray-200/60" style={{ background:'#F3F2EF' }}>
          {STATUS_TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-[11px] font-extrabold transition-all ${tab===t.key?'bg-white shadow':'text-gray-400 hover:text-gray-600'}`}
              style={tab===t.key?{color:'var(--c-primary)'}:{}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── IPL Points Table ── */}
        {tab === 'table' && (sport==='all'||sport==='cricket') && (
          <div className="mb-5"><PointsTable /></div>
        )}

        {/* ── Match Cards ── */}
        {tab !== 'table' && (
          <>
            {sportGroups.length > 0 ? (
              sportGroups.map(group => (
                <section key={group.key} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{group.icon}</span>
                    <h2 className="font-extrabold text-sm" style={{ color:'var(--c-text)', fontFamily:'var(--font-display)' }}>
                      {group.label}
                    </h2>
                    <span className="text-[10px] text-gray-400">({group.matches.length})</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.matches.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </section>
              ))
            ) : (sport !== 'local' && filtered.length === 0) ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/60">
                <div className="text-5xl mb-3">{SPORT_TYPES.find(s=>s.key===sport)?.icon||'🏆'}</div>
                <p className="font-extrabold text-base" style={{ color:'var(--c-text)' }}>
                  {tab==='live'?'No live matches right now':tab==='upcoming'?'No upcoming matches':'No results found'}
                </p>
              </div>
            ) : null}

            {/* Local Annur Sports */}
            {(sport==='all'||sport==='local') && (
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📍</span>
                  <h2 className="font-extrabold text-sm" style={{ color:'var(--c-text)', fontFamily:'var(--font-display)' }}>
                    Local Sports — Annur
                  </h2>
                  <span className="text-[10px] text-gray-400">({localFiltered.length})</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                {localFiltered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {localFiltered.map(e => {
                      const d = e.event_date ? new Date(e.event_date) : null
                      const past = d && d < new Date()
                      return (
                        <div key={e.id} className="bg-white rounded-2xl border border-green-100 overflow-hidden card-hover">
                          <div className="flex items-stretch">
                            {d && (
                              <div className="w-16 shrink-0 flex flex-col items-center justify-center py-3 text-center border-r border-green-100" style={{ background:'#F0FDF4' }}>
                                <span className="text-[9px] font-black text-green-700 uppercase">{d.toLocaleDateString('en-IN',{month:'short'})}</span>
                                <span className="text-2xl font-extrabold text-green-800" style={{ fontFamily:'var(--font-display)' }}>{d.getDate()}</span>
                                <span className="text-[9px] font-bold text-green-600">{d.toLocaleDateString('en-IN',{weekday:'short'})}</span>
                                <span className="text-lg mt-1">🏟️</span>
                              </div>
                            )}
                            <div className="p-3 flex-1 min-w-0">
                              <div className="flex gap-1.5 mb-1">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-green-100 text-green-700 uppercase">Local</span>
                                {past ? <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-lg font-bold">Done</span>
                                      : <span className="text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-lg font-bold">Upcoming</span>}
                              </div>
                              <h3 className="text-sm font-extrabold" style={{ color:'var(--c-text)' }}>{e.title_en}</h3>
                              {e.location_en && <p className="text-[10px] text-gray-400 mt-0.5">📍 {e.location_en}</p>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-2xl border border-gray-200/60">
                    <p className="text-gray-400 text-sm">No local sports events for this filter</p>
                    <p className="text-[10px] text-gray-300 mt-1">Add sports events from Admin → Events</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Footer */}
        <p className="text-[9px] text-center mt-4" style={{ color:'#C4C0B8' }}>
          {ALL_MATCHES.filter(m=>m.isCompleted).length} results • {ALL_MATCHES.filter(m=>m.date>TODAY).length} upcoming events across {SPORT_TYPES.length-2} sports
        </p>
      </div>
    </div>
  )
}
