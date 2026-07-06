import type { Player } from '../types'

const players: Player[] = [

  // ════════════════════════════════════════════════════
  //  EUROPE
  // ════════════════════════════════════════════════════

  // ── FRANCE ──────────────────────────────────────────
  { id: 'fra-gk-1',  name: 'Mike Maignan',          country: 'France',      flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'fra-gk-2',  name: 'Alphonse Areola',        country: 'France',      flag: '', position: 'GK',  goals: 0,  caps: 38  },
  { id: 'fra-def-1', name: 'Theo Hernández',         country: 'France',      flag: '', position: 'DEF', goals: 8,  caps: 45  },
  { id: 'fra-def-2', name: 'William Saliba',         country: 'France',      flag: '', position: 'DEF', goals: 2,  caps: 40  },
  { id: 'fra-def-3', name: 'Jules Koundé',           country: 'France',      flag: '', position: 'DEF', goals: 3,  caps: 44  },
  { id: 'fra-def-4', name: 'Dayot Upamecano',        country: 'France',      flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'fra-fwd-1', name: 'Kylian Mbappé',          country: 'France',      flag: '', position: 'FWD', goals: 51, caps: 96  },
  { id: 'fra-fwd-2', name: 'Antoine Griezmann',      country: 'France',      flag: '', position: 'FWD', goals: 44, caps: 137 },
  { id: 'fra-fwd-3', name: 'Ousmane Dembélé',        country: 'France',      flag: '', position: 'FWD', goals: 14, caps: 62  },
  { id: 'fra-fwd-4', name: 'Marcus Thuram',          country: 'France',      flag: '', position: 'FWD', goals: 16, caps: 28  },
  { id: 'fra-fwd-5', name: 'Randal Kolo Muani',      country: 'France',      flag: '', position: 'FWD', goals: 7,  caps: 22  },

  // ── ENGLAND ─────────────────────────────────────────
  { id: 'eng-gk-1',  name: 'Jordan Pickford',        country: 'England',     flag: '', position: 'GK',  goals: 0,  caps: 74  },
  { id: 'eng-gk-2',  name: 'Dean Henderson',         country: 'England',     flag: '', position: 'GK',  goals: 0,  caps: 5   },
  { id: 'eng-def-1', name: 'Trent Alexander-Arnold', country: 'England',     flag: '', position: 'DEF', goals: 4,  caps: 36  },
  { id: 'eng-def-2', name: 'John Stones',            country: 'England',     flag: '', position: 'DEF', goals: 3,  caps: 75  },
  { id: 'eng-def-3', name: 'Kyle Walker',            country: 'England',     flag: '', position: 'DEF', goals: 1,  caps: 84  },
  { id: 'eng-def-4', name: 'Marc Guehi',             country: 'England',     flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'eng-fwd-1', name: 'Harry Kane',             country: 'England',     flag: '', position: 'FWD', goals: 70, caps: 96  },
  { id: 'eng-fwd-2', name: 'Bukayo Saka',            country: 'England',     flag: '', position: 'FWD', goals: 19, caps: 47  },
  { id: 'eng-fwd-3', name: 'Phil Foden',             country: 'England',     flag: '', position: 'FWD', goals: 12, caps: 40  },
  { id: 'eng-fwd-4', name: 'Marcus Rashford',        country: 'England',     flag: '', position: 'FWD', goals: 17, caps: 60  },
  { id: 'eng-fwd-5', name: 'Ollie Watkins',          country: 'England',     flag: '', position: 'FWD', goals: 7,  caps: 20  },

  // ── GERMANY ─────────────────────────────────────────
  { id: 'ger-gk-1',  name: 'Manuel Neuer',           country: 'Germany',     flag: '', position: 'GK',  goals: 0,  caps: 124 },
  { id: 'ger-gk-2',  name: 'Marc-André ter Stegen',  country: 'Germany',     flag: '', position: 'GK',  goals: 0,  caps: 42  },
  { id: 'ger-def-1', name: 'Antonio Rüdiger',        country: 'Germany',     flag: '', position: 'DEF', goals: 5,  caps: 82  },
  { id: 'ger-def-2', name: 'Nico Schlotterbeck',     country: 'Germany',     flag: '', position: 'DEF', goals: 3,  caps: 24  },
  { id: 'ger-def-3', name: 'Jonathan Tah',           country: 'Germany',     flag: '', position: 'DEF', goals: 3,  caps: 32  },
  { id: 'ger-def-4', name: 'Maximilian Mittelstädt', country: 'Germany',     flag: '', position: 'DEF', goals: 2,  caps: 18  },
  { id: 'ger-fwd-1', name: 'Florian Wirtz',          country: 'Germany',     flag: '', position: 'FWD', goals: 12, caps: 28  },
  { id: 'ger-fwd-2', name: 'Kai Havertz',            country: 'Germany',     flag: '', position: 'FWD', goals: 24, caps: 58  },
  { id: 'ger-fwd-3', name: 'Leroy Sané',             country: 'Germany',     flag: '', position: 'FWD', goals: 21, caps: 65  },
  { id: 'ger-fwd-4', name: 'Deniz Undav',            country: 'Germany',     flag: '', position: 'FWD', goals: 8,  caps: 14  },
  { id: 'ger-fwd-5', name: 'Chris Führich',          country: 'Germany',     flag: '', position: 'FWD', goals: 5,  caps: 12  },

  // ── SPAIN ───────────────────────────────────────────
  { id: 'esp-gk-1',  name: 'Unai Simón',             country: 'Spain',       flag: '', position: 'GK',  goals: 0,  caps: 30  },
  { id: 'esp-gk-2',  name: 'David Raya',             country: 'Spain',       flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'esp-def-1', name: 'Dani Carvajal',          country: 'Spain',       flag: '', position: 'DEF', goals: 3,  caps: 54  },
  { id: 'esp-def-2', name: 'Alejandro Grimaldo',     country: 'Spain',       flag: '', position: 'DEF', goals: 3,  caps: 20  },
  { id: 'esp-def-3', name: 'Robin Le Normand',       country: 'Spain',       flag: '', position: 'DEF', goals: 2,  caps: 18  },
  { id: 'esp-def-4', name: 'Nacho Fernández',        country: 'Spain',       flag: '', position: 'DEF', goals: 4,  caps: 62  },
  { id: 'esp-fwd-1', name: 'Lamine Yamal',           country: 'Spain',       flag: '', position: 'FWD', goals: 10, caps: 22  },
  { id: 'esp-fwd-2', name: 'Nico Williams',          country: 'Spain',       flag: '', position: 'FWD', goals: 7,  caps: 20  },
  { id: 'esp-fwd-3', name: 'Álvaro Morata',          country: 'Spain',       flag: '', position: 'FWD', goals: 35, caps: 78  },
  { id: 'esp-fwd-4', name: 'Pedri',                  country: 'Spain',       flag: '', position: 'FWD', goals: 7,  caps: 30  },
  { id: 'esp-fwd-5', name: 'Dani Olmo',              country: 'Spain',       flag: '', position: 'FWD', goals: 10, caps: 36  },

  // ── PORTUGAL ────────────────────────────────────────
  { id: 'por-gk-1',  name: 'Diogo Costa',            country: 'Portugal',    flag: '', position: 'GK',  goals: 0,  caps: 25  },
  { id: 'por-gk-2',  name: 'Rui Patrício',           country: 'Portugal',    flag: '', position: 'GK',  goals: 0,  caps: 122 },
  { id: 'por-def-1', name: 'Rúben Dias',             country: 'Portugal',    flag: '', position: 'DEF', goals: 5,  caps: 72  },
  { id: 'por-def-2', name: 'Nuno Mendes',            country: 'Portugal',    flag: '', position: 'DEF', goals: 3,  caps: 40  },
  { id: 'por-def-3', name: 'João Cancelo',           country: 'Portugal',    flag: '', position: 'DEF', goals: 4,  caps: 60  },
  { id: 'por-def-4', name: 'Diogo Dalot',            country: 'Portugal',    flag: '', position: 'DEF', goals: 3,  caps: 32  },
  { id: 'por-fwd-1', name: 'Cristiano Ronaldo',      country: 'Portugal',    flag: '', position: 'FWD', goals: 132,caps: 215 },
  { id: 'por-fwd-2', name: 'Bruno Fernandes',        country: 'Portugal',    flag: '', position: 'FWD', goals: 28, caps: 92  },
  { id: 'por-fwd-3', name: 'Rafael Leão',            country: 'Portugal',    flag: '', position: 'FWD', goals: 12, caps: 38  },
  { id: 'por-fwd-4', name: 'João Félix',             country: 'Portugal',    flag: '', position: 'FWD', goals: 14, caps: 52  },
  { id: 'por-fwd-5', name: 'Gonçalo Ramos',          country: 'Portugal',    flag: '', position: 'FWD', goals: 14, caps: 22  },

  // ── NETHERLANDS ─────────────────────────────────────
  { id: 'ned-gk-1',  name: 'Bart Verbruggen',        country: 'Netherlands', flag: '', position: 'GK',  goals: 0,  caps: 20  },
  { id: 'ned-gk-2',  name: 'Mark Flekken',           country: 'Netherlands', flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'ned-def-1', name: 'Virgil van Dijk',        country: 'Netherlands', flag: '', position: 'DEF', goals: 9,  caps: 68  },
  { id: 'ned-def-2', name: 'Denzel Dumfries',        country: 'Netherlands', flag: '', position: 'DEF', goals: 9,  caps: 60  },
  { id: 'ned-def-3', name: 'Nathan Aké',             country: 'Netherlands', flag: '', position: 'DEF', goals: 4,  caps: 48  },
  { id: 'ned-def-4', name: 'Stefan de Vrij',         country: 'Netherlands', flag: '', position: 'DEF', goals: 5,  caps: 52  },
  { id: 'ned-fwd-1', name: 'Cody Gakpo',             country: 'Netherlands', flag: '', position: 'FWD', goals: 22, caps: 45  },
  { id: 'ned-fwd-2', name: 'Memphis Depay',          country: 'Netherlands', flag: '', position: 'FWD', goals: 46, caps: 93  },
  { id: 'ned-fwd-3', name: 'Donyell Malen',          country: 'Netherlands', flag: '', position: 'FWD', goals: 13, caps: 32  },
  { id: 'ned-fwd-4', name: 'Tijjani Reijnders',      country: 'Netherlands', flag: '', position: 'FWD', goals: 8,  caps: 22  },
  { id: 'ned-fwd-5', name: 'Joshua Zirkzee',         country: 'Netherlands', flag: '', position: 'FWD', goals: 6,  caps: 14  },

  // ── BELGIUM ─────────────────────────────────────────
  { id: 'bel-gk-1',  name: 'Koen Casteels',          country: 'Belgium',     flag: '', position: 'GK',  goals: 0,  caps: 62  },
  { id: 'bel-gk-2',  name: 'Simon Mignolet',         country: 'Belgium',     flag: '', position: 'GK',  goals: 0,  caps: 32  },
  { id: 'bel-def-1', name: 'Jan Vertonghen',         country: 'Belgium',     flag: '', position: 'DEF', goals: 10, caps: 152 },
  { id: 'bel-def-2', name: 'Timothy Castagne',       country: 'Belgium',     flag: '', position: 'DEF', goals: 5,  caps: 55  },
  { id: 'bel-def-3', name: 'Wout Faes',              country: 'Belgium',     flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'bel-def-4', name: 'Arthur Theate',          country: 'Belgium',     flag: '', position: 'DEF', goals: 3,  caps: 28  },
  { id: 'bel-fwd-1', name: 'Romelu Lukaku',          country: 'Belgium',     flag: '', position: 'FWD', goals: 86, caps: 117 },
  { id: 'bel-fwd-2', name: 'Kevin De Bruyne',        country: 'Belgium',     flag: '', position: 'FWD', goals: 28, caps: 104 },
  { id: 'bel-fwd-3', name: 'Leandro Trossard',       country: 'Belgium',     flag: '', position: 'FWD', goals: 10, caps: 40  },
  { id: 'bel-fwd-4', name: 'Yannick Carrasco',       country: 'Belgium',     flag: '', position: 'FWD', goals: 18, caps: 80  },
  { id: 'bel-fwd-5', name: 'Dodi Lukebakio',         country: 'Belgium',     flag: '', position: 'FWD', goals: 8,  caps: 24  },

  // ── CROATIA ─────────────────────────────────────────
  { id: 'cro-gk-1',  name: 'Dominik Livaković',      country: 'Croatia',     flag: '', position: 'GK',  goals: 0,  caps: 68  },
  { id: 'cro-gk-2',  name: 'Ivo Grbić',              country: 'Croatia',     flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'cro-def-1', name: 'Joško Gvardiol',         country: 'Croatia',     flag: '', position: 'DEF', goals: 5,  caps: 35  },
  { id: 'cro-def-2', name: 'Josip Šutalo',           country: 'Croatia',     flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'cro-def-3', name: 'Dejan Lovren',           country: 'Croatia',     flag: '', position: 'DEF', goals: 9,  caps: 104 },
  { id: 'cro-def-4', name: 'Josip Stanisić',         country: 'Croatia',     flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'cro-fwd-1', name: 'Luka Modrić',            country: 'Croatia',     flag: '', position: 'FWD', goals: 24, caps: 175 },
  { id: 'cro-fwd-2', name: 'Ivan Perišić',           country: 'Croatia',     flag: '', position: 'FWD', goals: 34, caps: 117 },
  { id: 'cro-fwd-3', name: 'Andrej Kramarić',        country: 'Croatia',     flag: '', position: 'FWD', goals: 22, caps: 68  },
  { id: 'cro-fwd-4', name: 'Mateo Kovačić',          country: 'Croatia',     flag: '', position: 'FWD', goals: 16, caps: 110 },
  { id: 'cro-fwd-5', name: 'Bruno Petković',         country: 'Croatia',     flag: '', position: 'FWD', goals: 12, caps: 44  },

  // ── SWITZERLAND ─────────────────────────────────────
  { id: 'sui-gk-1',  name: 'Yann Sommer',            country: 'Switzerland', flag: '', position: 'GK',  goals: 0,  caps: 96  },
  { id: 'sui-gk-2',  name: 'Gregor Kobel',           country: 'Switzerland', flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'sui-def-1', name: 'Manuel Akanji',          country: 'Switzerland', flag: '', position: 'DEF', goals: 4,  caps: 50  },
  { id: 'sui-def-2', name: 'Fabian Schär',           country: 'Switzerland', flag: '', position: 'DEF', goals: 8,  caps: 72  },
  { id: 'sui-def-3', name: 'Silvan Widmer',          country: 'Switzerland', flag: '', position: 'DEF', goals: 5,  caps: 42  },
  { id: 'sui-def-4', name: 'Ricardo Rodríguez',      country: 'Switzerland', flag: '', position: 'DEF', goals: 4,  caps: 88  },
  { id: 'sui-fwd-1', name: 'Xherdan Shaqiri',        country: 'Switzerland', flag: '', position: 'FWD', goals: 32, caps: 127 },
  { id: 'sui-fwd-2', name: 'Granit Xhaka',           country: 'Switzerland', flag: '', position: 'FWD', goals: 18, caps: 125 },
  { id: 'sui-fwd-3', name: 'Breel Embolo',           country: 'Switzerland', flag: '', position: 'FWD', goals: 16, caps: 68  },
  { id: 'sui-fwd-4', name: 'Remo Freuler',           country: 'Switzerland', flag: '', position: 'FWD', goals: 8,  caps: 70  },
  { id: 'sui-fwd-5', name: 'Haris Seferović',        country: 'Switzerland', flag: '', position: 'FWD', goals: 29, caps: 90  },

  // ── TURKEY ──────────────────────────────────────────
  { id: 'tur-gk-1',  name: 'Mert Günok',             country: 'Turkey',      flag: '', position: 'GK',  goals: 0,  caps: 42  },
  { id: 'tur-gk-2',  name: 'Altay Bayındır',         country: 'Turkey',      flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'tur-def-1', name: 'Merih Demiral',          country: 'Turkey',      flag: '', position: 'DEF', goals: 5,  caps: 40  },
  { id: 'tur-def-2', name: 'Çağlar Söyüncü',         country: 'Turkey',      flag: '', position: 'DEF', goals: 3,  caps: 48  },
  { id: 'tur-def-3', name: 'Zeki Çelik',             country: 'Turkey',      flag: '', position: 'DEF', goals: 2,  caps: 34  },
  { id: 'tur-def-4', name: 'Ferdi Kadıoğlu',         country: 'Turkey',      flag: '', position: 'DEF', goals: 3,  caps: 40  },
  { id: 'tur-fwd-1', name: 'Hakan Çalhanoğlu',       country: 'Turkey',      flag: '', position: 'FWD', goals: 26, caps: 88  },
  { id: 'tur-fwd-2', name: 'Arda Güler',             country: 'Turkey',      flag: '', position: 'FWD', goals: 8,  caps: 18  },
  { id: 'tur-fwd-3', name: 'Kenan Yıldız',           country: 'Turkey',      flag: '', position: 'FWD', goals: 5,  caps: 12  },
  { id: 'tur-fwd-4', name: 'Baris Alper Yilmaz',     country: 'Turkey',      flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'tur-fwd-5', name: 'Yusuf Yazıcı',           country: 'Turkey',      flag: '', position: 'FWD', goals: 14, caps: 42  },

  // ── AUSTRIA ─────────────────────────────────────────
  { id: 'aut-gk-1',  name: 'Patrick Pentz',          country: 'Austria',     flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'aut-gk-2',  name: 'Alexander Schlager',     country: 'Austria',     flag: '', position: 'GK',  goals: 0,  caps: 20  },
  { id: 'aut-def-1', name: 'David Alaba',            country: 'Austria',     flag: '', position: 'DEF', goals: 16, caps: 108 },
  { id: 'aut-def-2', name: 'Philipp Lienhart',       country: 'Austria',     flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'aut-def-3', name: 'Stefan Posch',           country: 'Austria',     flag: '', position: 'DEF', goals: 3,  caps: 38  },
  { id: 'aut-def-4', name: 'Maximilian Wöber',       country: 'Austria',     flag: '', position: 'DEF', goals: 3,  caps: 32  },
  { id: 'aut-fwd-1', name: 'Marko Arnautović',       country: 'Austria',     flag: '', position: 'FWD', goals: 37, caps: 110 },
  { id: 'aut-fwd-2', name: 'Marcel Sabitzer',        country: 'Austria',     flag: '', position: 'FWD', goals: 18, caps: 80  },
  { id: 'aut-fwd-3', name: 'Christoph Baumgartner',  country: 'Austria',     flag: '', position: 'FWD', goals: 10, caps: 38  },
  { id: 'aut-fwd-4', name: 'Michael Gregoritsch',    country: 'Austria',     flag: '', position: 'FWD', goals: 12, caps: 56  },
  { id: 'aut-fwd-5', name: 'Florian Kainz',          country: 'Austria',     flag: '', position: 'FWD', goals: 6,  caps: 28  },

  // ── SCOTLAND ────────────────────────────────────────
  { id: 'sco-gk-1',  name: 'Angus Gunn',             country: 'Scotland',    flag: '', position: 'GK',  goals: 0,  caps: 25  },
  { id: 'sco-gk-2',  name: 'Craig Gordon',           country: 'Scotland',    flag: '', position: 'GK',  goals: 0,  caps: 75  },
  { id: 'sco-def-1', name: 'Andy Robertson',         country: 'Scotland',    flag: '', position: 'DEF', goals: 8,  caps: 82  },
  { id: 'sco-def-2', name: 'Grant Hanley',           country: 'Scotland',    flag: '', position: 'DEF', goals: 2,  caps: 55  },
  { id: 'sco-def-3', name: 'Kieran Tierney',         country: 'Scotland',    flag: '', position: 'DEF', goals: 5,  caps: 62  },
  { id: 'sco-def-4', name: 'Liam Cooper',            country: 'Scotland',    flag: '', position: 'DEF', goals: 2,  caps: 20  },
  { id: 'sco-fwd-1', name: 'Scott McTominay',        country: 'Scotland',    flag: '', position: 'FWD', goals: 14, caps: 58  },
  { id: 'sco-fwd-2', name: 'Che Adams',              country: 'Scotland',    flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'sco-fwd-3', name: 'Lawrence Shankland',     country: 'Scotland',    flag: '', position: 'FWD', goals: 6,  caps: 20  },
  { id: 'sco-fwd-4', name: 'Ryan Christie',          country: 'Scotland',    flag: '', position: 'FWD', goals: 14, caps: 56  },
  { id: 'sco-fwd-5', name: 'Stuart Armstrong',       country: 'Scotland',    flag: '', position: 'FWD', goals: 8,  caps: 44  },


  // ════════════════════════════════════════════════════
  //  SOUTH AMERICA
  // ════════════════════════════════════════════════════

  // ── ARGENTINA ───────────────────────────────────────
  { id: 'arg-gk-1',  name: 'Emiliano Martínez',      country: 'Argentina',   flag: '', position: 'GK',  goals: 0,  caps: 50  },
  { id: 'arg-gk-2',  name: 'Geronimo Rulli',         country: 'Argentina',   flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'arg-def-1', name: 'Cristian Romero',        country: 'Argentina',   flag: '', position: 'DEF', goals: 4,  caps: 47  },
  { id: 'arg-def-2', name: 'Nicolás Otamendi',       country: 'Argentina',   flag: '', position: 'DEF', goals: 7,  caps: 106 },
  { id: 'arg-def-3', name: 'Lisandro Martínez',      country: 'Argentina',   flag: '', position: 'DEF', goals: 4,  caps: 32  },
  { id: 'arg-def-4', name: 'Nahuel Molina',          country: 'Argentina',   flag: '', position: 'DEF', goals: 7,  caps: 44  },
  { id: 'arg-fwd-1', name: 'Lionel Messi',           country: 'Argentina',   flag: '', position: 'FWD', goals: 112,caps: 188 },
  { id: 'arg-fwd-2', name: 'Julián Álvarez',         country: 'Argentina',   flag: '', position: 'FWD', goals: 28, caps: 36  },
  { id: 'arg-fwd-3', name: 'Lautaro Martínez',       country: 'Argentina',   flag: '', position: 'FWD', goals: 32, caps: 66  },
  { id: 'arg-fwd-4', name: 'Ángel Di María',         country: 'Argentina',   flag: '', position: 'FWD', goals: 31, caps: 145 },
  { id: 'arg-fwd-5', name: 'Rodrigo De Paul',        country: 'Argentina',   flag: '', position: 'FWD', goals: 16, caps: 74  },

  // ── BRAZIL ──────────────────────────────────────────
  { id: 'bra-gk-1',  name: 'Alisson Becker',         country: 'Brazil',      flag: '', position: 'GK',  goals: 0,  caps: 77  },
  { id: 'bra-gk-2',  name: 'Ederson',                country: 'Brazil',      flag: '', position: 'GK',  goals: 0,  caps: 40  },
  { id: 'bra-def-1', name: 'Marquinhos',             country: 'Brazil',      flag: '', position: 'DEF', goals: 9,  caps: 94  },
  { id: 'bra-def-2', name: 'Éder Militão',           country: 'Brazil',      flag: '', position: 'DEF', goals: 2,  caps: 32  },
  { id: 'bra-def-3', name: 'Danilo',                 country: 'Brazil',      flag: '', position: 'DEF', goals: 6,  caps: 80  },
  { id: 'bra-def-4', name: 'Alex Sandro',            country: 'Brazil',      flag: '', position: 'DEF', goals: 5,  caps: 50  },
  { id: 'bra-fwd-1', name: 'Vinícius Jr',            country: 'Brazil',      flag: '', position: 'FWD', goals: 29, caps: 50  },
  { id: 'bra-fwd-2', name: 'Rodrygo',                country: 'Brazil',      flag: '', position: 'FWD', goals: 22, caps: 42  },
  { id: 'bra-fwd-3', name: 'Raphinha',               country: 'Brazil',      flag: '', position: 'FWD', goals: 17, caps: 40  },
  { id: 'bra-fwd-4', name: 'Lucas Paquetá',          country: 'Brazil',      flag: '', position: 'FWD', goals: 14, caps: 58  },
  { id: 'bra-fwd-5', name: 'Endrick',                country: 'Brazil',      flag: '', position: 'FWD', goals: 5,  caps: 14  },

  // ── URUGUAY ─────────────────────────────────────────
  { id: 'uru-gk-1',  name: 'Sergio Rochet',          country: 'Uruguay',     flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'uru-gk-2',  name: 'Sebastián Sosa',         country: 'Uruguay',     flag: '', position: 'GK',  goals: 0,  caps: 22  },
  { id: 'uru-def-1', name: 'Ronald Araújo',          country: 'Uruguay',     flag: '', position: 'DEF', goals: 5,  caps: 36  },
  { id: 'uru-def-2', name: 'José María Giménez',     country: 'Uruguay',     flag: '', position: 'DEF', goals: 4,  caps: 72  },
  { id: 'uru-def-3', name: 'Guillermo Varela',       country: 'Uruguay',     flag: '', position: 'DEF', goals: 1,  caps: 32  },
  { id: 'uru-def-4', name: 'Sebastián Cáceres',      country: 'Uruguay',     flag: '', position: 'DEF', goals: 2,  caps: 26  },
  { id: 'uru-fwd-1', name: 'Darwin Núñez',           country: 'Uruguay',     flag: '', position: 'FWD', goals: 22, caps: 44  },
  { id: 'uru-fwd-2', name: 'Federico Valverde',      country: 'Uruguay',     flag: '', position: 'FWD', goals: 16, caps: 52  },
  { id: 'uru-fwd-3', name: 'Luis Suárez',            country: 'Uruguay',     flag: '', position: 'FWD', goals: 68, caps: 143 },
  { id: 'uru-fwd-4', name: 'Rodrigo Bentancur',      country: 'Uruguay',     flag: '', position: 'FWD', goals: 12, caps: 62  },
  { id: 'uru-fwd-5', name: 'Facundo Torres',         country: 'Uruguay',     flag: '', position: 'FWD', goals: 5,  caps: 18  },

  // ── COLOMBIA ────────────────────────────────────────
  { id: 'col-gk-1',  name: 'Camilo Vargas',          country: 'Colombia',    flag: '', position: 'GK',  goals: 0,  caps: 48  },
  { id: 'col-gk-2',  name: 'David Ospina',           country: 'Colombia',    flag: '', position: 'GK',  goals: 0,  caps: 124 },
  { id: 'col-def-1', name: 'Dávinson Sánchez',       country: 'Colombia',    flag: '', position: 'DEF', goals: 5,  caps: 78  },
  { id: 'col-def-2', name: 'Yerry Mina',             country: 'Colombia',    flag: '', position: 'DEF', goals: 9,  caps: 54  },
  { id: 'col-def-3', name: 'Stefan Medina',          country: 'Colombia',    flag: '', position: 'DEF', goals: 2,  caps: 32  },
  { id: 'col-def-4', name: 'Carlos Cuesta',          country: 'Colombia',    flag: '', position: 'DEF', goals: 2,  caps: 24  },
  { id: 'col-fwd-1', name: 'James Rodríguez',        country: 'Colombia',    flag: '', position: 'FWD', goals: 25, caps: 96  },
  { id: 'col-fwd-2', name: 'Luis Díaz',              country: 'Colombia',    flag: '', position: 'FWD', goals: 18, caps: 45  },
  { id: 'col-fwd-3', name: 'Jhon Córdoba',           country: 'Colombia',    flag: '', position: 'FWD', goals: 10, caps: 32  },
  { id: 'col-fwd-4', name: 'Jhon Arias',             country: 'Colombia',    flag: '', position: 'FWD', goals: 8,  caps: 28  },
  { id: 'col-fwd-5', name: 'Rafael Santos Borré',    country: 'Colombia',    flag: '', position: 'FWD', goals: 14, caps: 42  },

  // ── ECUADOR ─────────────────────────────────────────
  { id: 'ecu-gk-1',  name: 'Hernán Galíndez',        country: 'Ecuador',     flag: '', position: 'GK',  goals: 0,  caps: 42  },
  { id: 'ecu-gk-2',  name: 'Alexander Domínguez',    country: 'Ecuador',     flag: '', position: 'GK',  goals: 0,  caps: 72  },
  { id: 'ecu-def-1', name: 'Piero Hincapié',         country: 'Ecuador',     flag: '', position: 'DEF', goals: 3,  caps: 32  },
  { id: 'ecu-def-2', name: 'Ángelo Preciado',        country: 'Ecuador',     flag: '', position: 'DEF', goals: 2,  caps: 36  },
  { id: 'ecu-def-3', name: 'Willian Pacho',          country: 'Ecuador',     flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'ecu-def-4', name: 'Xavier Arreaga',         country: 'Ecuador',     flag: '', position: 'DEF', goals: 3,  caps: 38  },
  { id: 'ecu-fwd-1', name: 'Enner Valencia',         country: 'Ecuador',     flag: '', position: 'FWD', goals: 40, caps: 95  },
  { id: 'ecu-fwd-2', name: 'Gonzalo Plata',          country: 'Ecuador',     flag: '', position: 'FWD', goals: 12, caps: 32  },
  { id: 'ecu-fwd-3', name: 'Jeremy Sarmiento',       country: 'Ecuador',     flag: '', position: 'FWD', goals: 5,  caps: 22  },
  { id: 'ecu-fwd-4', name: 'Moisés Caicedo',         country: 'Ecuador',     flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'ecu-fwd-5', name: 'Kevin Rodríguez',        country: 'Ecuador',     flag: '', position: 'FWD', goals: 5,  caps: 22  },


  // ════════════════════════════════════════════════════
  //  NORTH & CENTRAL AMERICA
  // ════════════════════════════════════════════════════

  // ── USA ─────────────────────────────────────────────
  { id: 'usa-gk-1',  name: 'Matt Turner',            country: 'USA',         flag: '', position: 'GK',  goals: 0,  caps: 48  },
  { id: 'usa-gk-2',  name: 'Ethan Horvath',          country: 'USA',         flag: '', position: 'GK',  goals: 0,  caps: 22  },
  { id: 'usa-def-1', name: 'Sergino Dest',           country: 'USA',         flag: '', position: 'DEF', goals: 4,  caps: 44  },
  { id: 'usa-def-2', name: 'Chris Richards',         country: 'USA',         flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'usa-def-3', name: 'Miles Robinson',         country: 'USA',         flag: '', position: 'DEF', goals: 3,  caps: 32  },
  { id: 'usa-def-4', name: 'Joe Scally',             country: 'USA',         flag: '', position: 'DEF', goals: 0,  caps: 14  },
  { id: 'usa-fwd-1', name: 'Christian Pulisic',      country: 'USA',         flag: '', position: 'FWD', goals: 28, caps: 72  },
  { id: 'usa-fwd-2', name: 'Ricardo Pepi',           country: 'USA',         flag: '', position: 'FWD', goals: 14, caps: 30  },
  { id: 'usa-fwd-3', name: 'Gio Reyna',              country: 'USA',         flag: '', position: 'FWD', goals: 8,  caps: 28  },
  { id: 'usa-fwd-4', name: 'Weston McKennie',        country: 'USA',         flag: '', position: 'FWD', goals: 14, caps: 62  },
  { id: 'usa-fwd-5', name: 'Folarin Balogun',        country: 'USA',         flag: '', position: 'FWD', goals: 6,  caps: 14  },

  // ── MEXICO ──────────────────────────────────────────
  { id: 'mex-gk-1',  name: 'Guillermo Ochoa',        country: 'Mexico',      flag: '', position: 'GK',  goals: 0,  caps: 141 },
  { id: 'mex-gk-2',  name: 'Luis Malagón',           country: 'Mexico',      flag: '', position: 'GK',  goals: 0,  caps: 15  },
  { id: 'mex-def-1', name: 'Héctor Moreno',          country: 'Mexico',      flag: '', position: 'DEF', goals: 7,  caps: 126 },
  { id: 'mex-def-2', name: 'César Montes',           country: 'Mexico',      flag: '', position: 'DEF', goals: 5,  caps: 45  },
  { id: 'mex-def-3', name: 'Jorge Sánchez',          country: 'Mexico',      flag: '', position: 'DEF', goals: 1,  caps: 34  },
  { id: 'mex-def-4', name: 'Gerardo Arteaga',        country: 'Mexico',      flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'mex-fwd-1', name: 'Hirving Lozano',         country: 'Mexico',      flag: '', position: 'FWD', goals: 31, caps: 82  },
  { id: 'mex-fwd-2', name: 'Raúl Jiménez',           country: 'Mexico',      flag: '', position: 'FWD', goals: 36, caps: 110 },
  { id: 'mex-fwd-3', name: 'Santiago Giménez',       country: 'Mexico',      flag: '', position: 'FWD', goals: 18, caps: 30  },
  { id: 'mex-fwd-4', name: 'Alexis Vega',            country: 'Mexico',      flag: '', position: 'FWD', goals: 10, caps: 42  },
  { id: 'mex-fwd-5', name: 'Erick Gutiérrez',        country: 'Mexico',      flag: '', position: 'FWD', goals: 6,  caps: 50  },

  // ── CANADA ──────────────────────────────────────────
  { id: 'can-gk-1',  name: 'Maxime Crépeau',         country: 'Canada',      flag: '', position: 'GK',  goals: 0,  caps: 32  },
  { id: 'can-gk-2',  name: 'Milan Borjan',           country: 'Canada',      flag: '', position: 'GK',  goals: 0,  caps: 58  },
  { id: 'can-def-1', name: 'Kamal Miller',           country: 'Canada',      flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'can-def-2', name: 'Alistair Johnston',      country: 'Canada',      flag: '', position: 'DEF', goals: 3,  caps: 28  },
  { id: 'can-def-3', name: 'Sam Adekugbe',           country: 'Canada',      flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'can-def-4', name: 'Doneil Henry',           country: 'Canada',      flag: '', position: 'DEF', goals: 2,  caps: 56  },
  { id: 'can-fwd-1', name: 'Alphonso Davies',        country: 'Canada',      flag: '', position: 'FWD', goals: 14, caps: 45  },
  { id: 'can-fwd-2', name: 'Jonathan David',         country: 'Canada',      flag: '', position: 'FWD', goals: 22, caps: 38  },
  { id: 'can-fwd-3', name: 'Cyle Larin',             country: 'Canada',      flag: '', position: 'FWD', goals: 16, caps: 56  },
  { id: 'can-fwd-4', name: 'Stephen Eustáquio',      country: 'Canada',      flag: '', position: 'FWD', goals: 6,  caps: 38  },
  { id: 'can-fwd-5', name: 'Tajon Buchanan',         country: 'Canada',      flag: '', position: 'FWD', goals: 8,  caps: 36  },

  // ── PANAMA ──────────────────────────────────────────
  { id: 'pan-gk-1',  name: 'Luis Mejía',             country: 'Panama',      flag: '', position: 'GK',  goals: 0,  caps: 50  },
  { id: 'pan-gk-2',  name: 'Orlando Mosquera',       country: 'Panama',      flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'pan-def-1', name: 'Roderick Miller',        country: 'Panama',      flag: '', position: 'DEF', goals: 2,  caps: 55  },
  { id: 'pan-def-2', name: 'Harold Cummings',        country: 'Panama',      flag: '', position: 'DEF', goals: 4,  caps: 42  },
  { id: 'pan-def-3', name: 'Eric Davis',             country: 'Panama',      flag: '', position: 'DEF', goals: 4,  caps: 88  },
  { id: 'pan-def-4', name: 'Fidel Escobar',          country: 'Panama',      flag: '', position: 'DEF', goals: 1,  caps: 42  },
  { id: 'pan-fwd-1', name: 'Ismael Díaz',            country: 'Panama',      flag: '', position: 'FWD', goals: 8,  caps: 27  },
  { id: 'pan-fwd-2', name: 'Cecilio Waterman',       country: 'Panama',      flag: '', position: 'FWD', goals: 12, caps: 32  },
  { id: 'pan-fwd-3', name: 'Adalberto Carrasquilla', country: 'Panama',      flag: '', position: 'FWD', goals: 6,  caps: 42  },
  { id: 'pan-fwd-4', name: 'Édgar Bárcenas',         country: 'Panama',      flag: '', position: 'FWD', goals: 4,  caps: 68  },
  { id: 'pan-fwd-5', name: 'Rolando Blackburn',      country: 'Panama',      flag: '', position: 'FWD', goals: 5,  caps: 32  },


  // ════════════════════════════════════════════════════
  //  AFRICA
  // ════════════════════════════════════════════════════

  // ── MOROCCO ─────────────────────────────────────────
  { id: 'mar-gk-1',  name: 'Yassine Bounou',         country: 'Morocco',     flag: '', position: 'GK',  goals: 0,  caps: 65  },
  { id: 'mar-gk-2',  name: 'Ahmed Tagnaouti',        country: 'Morocco',     flag: '', position: 'GK',  goals: 0,  caps: 22  },
  { id: 'mar-def-1', name: 'Achraf Hakimi',          country: 'Morocco',     flag: '', position: 'DEF', goals: 14, caps: 87  },
  { id: 'mar-def-2', name: 'Nayef Aguerd',           country: 'Morocco',     flag: '', position: 'DEF', goals: 5,  caps: 52  },
  { id: 'mar-def-3', name: 'Noussair Mazraoui',      country: 'Morocco',     flag: '', position: 'DEF', goals: 4,  caps: 46  },
  { id: 'mar-def-4', name: 'Adam Masina',            country: 'Morocco',     flag: '', position: 'DEF', goals: 1,  caps: 28  },
  { id: 'mar-fwd-1', name: 'Hakim Ziyech',           country: 'Morocco',     flag: '', position: 'FWD', goals: 26, caps: 65  },
  { id: 'mar-fwd-2', name: 'Youssef En-Nesyri',      country: 'Morocco',     flag: '', position: 'FWD', goals: 18, caps: 68  },
  { id: 'mar-fwd-3', name: 'Brahim Díaz',            country: 'Morocco',     flag: '', position: 'FWD', goals: 8,  caps: 28  },
  { id: 'mar-fwd-4', name: 'Selim Amallah',          country: 'Morocco',     flag: '', position: 'FWD', goals: 8,  caps: 28  },
  { id: 'mar-fwd-5', name: 'Azzedine Ounahi',        country: 'Morocco',     flag: '', position: 'FWD', goals: 4,  caps: 20  },

  // ── SENEGAL ─────────────────────────────────────────
  { id: 'sen-gk-1',  name: 'Édouard Mendy',          country: 'Senegal',     flag: '', position: 'GK',  goals: 0,  caps: 44  },
  { id: 'sen-gk-2',  name: 'Alfred Gomis',           country: 'Senegal',     flag: '', position: 'GK',  goals: 0,  caps: 26  },
  { id: 'sen-def-1', name: 'Kalidou Koulibaly',      country: 'Senegal',     flag: '', position: 'DEF', goals: 6,  caps: 84  },
  { id: 'sen-def-2', name: 'Abdou Diallo',           country: 'Senegal',     flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'sen-def-3', name: 'Ismail Jakobs',          country: 'Senegal',     flag: '', position: 'DEF', goals: 2,  caps: 26  },
  { id: 'sen-def-4', name: 'Pape Abou Cissé',        country: 'Senegal',     flag: '', position: 'DEF', goals: 4,  caps: 38  },
  { id: 'sen-fwd-1', name: 'Sadio Mané',             country: 'Senegal',     flag: '', position: 'FWD', goals: 36, caps: 100 },
  { id: 'sen-fwd-2', name: 'Ismaila Sarr',           country: 'Senegal',     flag: '', position: 'FWD', goals: 22, caps: 54  },
  { id: 'sen-fwd-3', name: 'Pape Gueye',             country: 'Senegal',     flag: '', position: 'FWD', goals: 5,  caps: 24  },
  { id: 'sen-fwd-4', name: 'Nicolas Jackson',        country: 'Senegal',     flag: '', position: 'FWD', goals: 6,  caps: 16  },
  { id: 'sen-fwd-5', name: 'Boulaye Dia',            country: 'Senegal',     flag: '', position: 'FWD', goals: 8,  caps: 22  },

  // ── EGYPT ───────────────────────────────────────────
  { id: 'egy-gk-1',  name: 'Mohamed Abou Gabal',     country: 'Egypt',       flag: '', position: 'GK',  goals: 0,  caps: 52  },
  { id: 'egy-gk-2',  name: 'Sherif Ekramy',          country: 'Egypt',       flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'egy-def-1', name: 'Ahmed Hegazi',           country: 'Egypt',       flag: '', position: 'DEF', goals: 5,  caps: 83  },
  { id: 'egy-def-2', name: 'Omar Kamal',             country: 'Egypt',       flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'egy-def-3', name: 'Mohamed Hamdi Fathi',    country: 'Egypt',       flag: '', position: 'DEF', goals: 2,  caps: 62  },
  { id: 'egy-def-4', name: 'Akram Tawfik',           country: 'Egypt',       flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'egy-fwd-1', name: 'Mohamed Salah',          country: 'Egypt',       flag: '', position: 'FWD', goals: 62, caps: 104 },
  { id: 'egy-fwd-2', name: 'Mostafa Mohamed',        country: 'Egypt',       flag: '', position: 'FWD', goals: 14, caps: 36  },
  { id: 'egy-fwd-3', name: 'Amr El-Sulaya',          country: 'Egypt',       flag: '', position: 'FWD', goals: 6,  caps: 20  },
  { id: 'egy-fwd-4', name: 'Mahmoud Trezeguet',      country: 'Egypt',       flag: '', position: 'FWD', goals: 12, caps: 62  },
  { id: 'egy-fwd-5', name: 'Omar Marmoush',          country: 'Egypt',       flag: '', position: 'FWD', goals: 14, caps: 28  },

  // ── SOUTH AFRICA ────────────────────────────────────
  { id: 'rsa-gk-1',  name: 'Ronwen Williams',        country: 'South Africa',flag: '', position: 'GK',  goals: 0,  caps: 54  },
  { id: 'rsa-gk-2',  name: 'Bruce Bvuma',            country: 'South Africa',flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'rsa-def-1', name: 'Siyanda Xulu',           country: 'South Africa',flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'rsa-def-2', name: 'Rushine De Reuck',       country: 'South Africa',flag: '', position: 'DEF', goals: 3,  caps: 30  },
  { id: 'rsa-def-3', name: 'Thulani Hlatshwayo',     country: 'South Africa',flag: '', position: 'DEF', goals: 4,  caps: 50  },
  { id: 'rsa-def-4', name: 'Grant Kekana',           country: 'South Africa',flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'rsa-fwd-1', name: 'Percy Tau',              country: 'South Africa',flag: '', position: 'FWD', goals: 10, caps: 60  },
  { id: 'rsa-fwd-2', name: 'Evidence Makgopa',       country: 'South Africa',flag: '', position: 'FWD', goals: 8,  caps: 22  },
  { id: 'rsa-fwd-3', name: 'Themba Zwane',           country: 'South Africa',flag: '', position: 'FWD', goals: 9,  caps: 40  },
  { id: 'rsa-fwd-4', name: 'Teboho Mokoena',         country: 'South Africa',flag: '', position: 'FWD', goals: 8,  caps: 38  },
  { id: 'rsa-fwd-5', name: 'Lyle Foster',            country: 'South Africa',flag: '', position: 'FWD', goals: 5,  caps: 20  },

  // ── IVORY COAST ─────────────────────────────────────
  { id: 'civ-gk-1',  name: 'Yahia Fofana',           country: 'Ivory Coast', flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'civ-gk-2',  name: 'Badra Ali Sangaré',      country: 'Ivory Coast', flag: '', position: 'GK',  goals: 0,  caps: 20  },
  { id: 'civ-def-1', name: 'Serge Aurier',           country: 'Ivory Coast', flag: '', position: 'DEF', goals: 7,  caps: 73  },
  { id: 'civ-def-2', name: 'Willy Boly',             country: 'Ivory Coast', flag: '', position: 'DEF', goals: 3,  caps: 36  },
  { id: 'civ-def-3', name: 'Odilon Kossounou',       country: 'Ivory Coast', flag: '', position: 'DEF', goals: 2,  caps: 32  },
  { id: 'civ-def-4', name: 'Ghislain Konan',         country: 'Ivory Coast', flag: '', position: 'DEF', goals: 2,  caps: 34  },
  { id: 'civ-fwd-1', name: 'Sébastien Haller',       country: 'Ivory Coast', flag: '', position: 'FWD', goals: 15, caps: 42  },
  { id: 'civ-fwd-2', name: 'Simon Adingra',          country: 'Ivory Coast', flag: '', position: 'FWD', goals: 7,  caps: 22  },
  { id: 'civ-fwd-3', name: 'Franck Kessié',          country: 'Ivory Coast', flag: '', position: 'FWD', goals: 14, caps: 66  },
  { id: 'civ-fwd-4', name: 'Nicolas Pépé',           country: 'Ivory Coast', flag: '', position: 'FWD', goals: 15, caps: 48  },
  { id: 'civ-fwd-5', name: 'Jean-Philippe Krasso',   country: 'Ivory Coast', flag: '', position: 'FWD', goals: 4,  caps: 18  },


  // ════════════════════════════════════════════════════
  //  ASIA & OCEANIA
  // ════════════════════════════════════════════════════

  // ── JAPAN ───────────────────────────────────────────
  { id: 'jpn-gk-1',  name: 'Shuichi Gonda',          country: 'Japan',       flag: '', position: 'GK',  goals: 0,  caps: 64  },
  { id: 'jpn-gk-2',  name: 'Daniel Schmidt',         country: 'Japan',       flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'jpn-def-1', name: 'Takehiro Tomiyasu',      country: 'Japan',       flag: '', position: 'DEF', goals: 3,  caps: 46  },
  { id: 'jpn-def-2', name: 'Ko Itakura',             country: 'Japan',       flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'jpn-def-3', name: 'Maya Yoshida',           country: 'Japan',       flag: '', position: 'DEF', goals: 7,  caps: 128 },
  { id: 'jpn-def-4', name: 'Shogo Taniguchi',        country: 'Japan',       flag: '', position: 'DEF', goals: 2,  caps: 24  },
  { id: 'jpn-fwd-1', name: 'Kaoru Mitoma',           country: 'Japan',       flag: '', position: 'FWD', goals: 14, caps: 34  },
  { id: 'jpn-fwd-2', name: 'Daichi Kamada',          country: 'Japan',       flag: '', position: 'FWD', goals: 16, caps: 48  },
  { id: 'jpn-fwd-3', name: 'Ritsu Doan',             country: 'Japan',       flag: '', position: 'FWD', goals: 12, caps: 42  },
  { id: 'jpn-fwd-4', name: 'Junya Ito',              country: 'Japan',       flag: '', position: 'FWD', goals: 14, caps: 52  },
  { id: 'jpn-fwd-5', name: 'Ayase Ueda',             country: 'Japan',       flag: '', position: 'FWD', goals: 10, caps: 22  },

  // ── SOUTH KOREA ─────────────────────────────────────
  { id: 'kor-gk-1',  name: 'Kim Seung-gyu',          country: 'South Korea', flag: '', position: 'GK',  goals: 0,  caps: 60  },
  { id: 'kor-gk-2',  name: 'Jo Hyeon-woo',           country: 'South Korea', flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'kor-def-1', name: 'Kim Min-jae',            country: 'South Korea', flag: '', position: 'DEF', goals: 3,  caps: 63  },
  { id: 'kor-def-2', name: 'Kim Young-gwon',         country: 'South Korea', flag: '', position: 'DEF', goals: 6,  caps: 96  },
  { id: 'kor-def-3', name: 'Lee Yong',               country: 'South Korea', flag: '', position: 'DEF', goals: 2,  caps: 112 },
  { id: 'kor-def-4', name: 'Kwon Kyung-won',         country: 'South Korea', flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'kor-fwd-1', name: 'Son Heung-min',          country: 'South Korea', flag: '', position: 'FWD', goals: 37, caps: 120 },
  { id: 'kor-fwd-2', name: 'Hwang Hee-chan',         country: 'South Korea', flag: '', position: 'FWD', goals: 19, caps: 64  },
  { id: 'kor-fwd-3', name: 'Lee Kang-in',            country: 'South Korea', flag: '', position: 'FWD', goals: 11, caps: 42  },
  { id: 'kor-fwd-4', name: 'Na Sang-ho',             country: 'South Korea', flag: '', position: 'FWD', goals: 6,  caps: 30  },
  { id: 'kor-fwd-5', name: 'Cho Gue-sung',           country: 'South Korea', flag: '', position: 'FWD', goals: 10, caps: 22  },

  // ── SAUDI ARABIA ────────────────────────────────────
  { id: 'ksa-gk-1',  name: 'Mohammed Al-Owais',      country: 'Saudi Arabia',flag: '', position: 'GK',  goals: 0,  caps: 50  },
  { id: 'ksa-gk-2',  name: 'Yasser Al-Mosailem',     country: 'Saudi Arabia',flag: '', position: 'GK',  goals: 0,  caps: 16  },
  { id: 'ksa-def-1', name: 'Ali Al-Bulaihi',         country: 'Saudi Arabia',flag: '', position: 'DEF', goals: 3,  caps: 58  },
  { id: 'ksa-def-2', name: 'Abdullah Al-Amri',       country: 'Saudi Arabia',flag: '', position: 'DEF', goals: 1,  caps: 28  },
  { id: 'ksa-def-3', name: 'Saud Abdulhamid',        country: 'Saudi Arabia',flag: '', position: 'DEF', goals: 2,  caps: 36  },
  { id: 'ksa-def-4', name: 'Hassan Al-Tambakti',     country: 'Saudi Arabia',flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'ksa-fwd-1', name: 'Salem Al-Dawsari',       country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 18, caps: 68  },
  { id: 'ksa-fwd-2', name: 'Firas Al-Buraikan',      country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 14, caps: 40  },
  { id: 'ksa-fwd-3', name: 'Sami Al-Najei',          country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 6,  caps: 22  },
  { id: 'ksa-fwd-4', name: 'Mohamed Kanno',          country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 4,  caps: 48  },
  { id: 'ksa-fwd-5', name: 'Hattan Bahebri',         country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 5,  caps: 38  },

  // ── IRAN ────────────────────────────────────────────
  { id: 'irn-gk-1',  name: 'Alireza Beiranvand',     country: 'Iran',        flag: '', position: 'GK',  goals: 0,  caps: 76  },
  { id: 'irn-gk-2',  name: 'Hossein Hosseini',       country: 'Iran',        flag: '', position: 'GK',  goals: 0,  caps: 22  },
  { id: 'irn-def-1', name: 'Ehsan Hajsafi',          country: 'Iran',        flag: '', position: 'DEF', goals: 6,  caps: 122 },
  { id: 'irn-def-2', name: 'Majid Hosseini',         country: 'Iran',        flag: '', position: 'DEF', goals: 3,  caps: 44  },
  { id: 'irn-def-3', name: 'Shoja Khalilzadeh',      country: 'Iran',        flag: '', position: 'DEF', goals: 4,  caps: 74  },
  { id: 'irn-def-4', name: 'Mohammad Kanaanizadegan',country: 'Iran',        flag: '', position: 'DEF', goals: 1,  caps: 30  },
  { id: 'irn-fwd-1', name: 'Mehdi Taremi',           country: 'Iran',        flag: '', position: 'FWD', goals: 48, caps: 94  },
  { id: 'irn-fwd-2', name: 'Sardar Azmoun',          country: 'Iran',        flag: '', position: 'FWD', goals: 48, caps: 90  },
  { id: 'irn-fwd-3', name: 'Ali Gholizadeh',         country: 'Iran',        flag: '', position: 'FWD', goals: 12, caps: 42  },
  { id: 'irn-fwd-4', name: 'Alireza Jahanbakhsh',    country: 'Iran',        flag: '', position: 'FWD', goals: 20, caps: 98  },
  { id: 'irn-fwd-5', name: 'Karim Ansarifard',       country: 'Iran',        flag: '', position: 'FWD', goals: 28, caps: 90  },

  // ── AUSTRALIA ───────────────────────────────────────
  { id: 'aus-gk-1',  name: 'Mathew Ryan',            country: 'Australia',   flag: '', position: 'GK',  goals: 0,  caps: 85  },
  { id: 'aus-gk-2',  name: 'Danny Vukovic',          country: 'Australia',   flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'aus-def-1', name: 'Harry Souttar',          country: 'Australia',   flag: '', position: 'DEF', goals: 4,  caps: 22  },
  { id: 'aus-def-2', name: 'Milos Degenek',          country: 'Australia',   flag: '', position: 'DEF', goals: 2,  caps: 46  },
  { id: 'aus-def-3', name: 'Aziz Behich',            country: 'Australia',   flag: '', position: 'DEF', goals: 2,  caps: 48  },
  { id: 'aus-def-4', name: 'Bailey Wright',          country: 'Australia',   flag: '', position: 'DEF', goals: 3,  caps: 52  },
  { id: 'aus-fwd-1', name: 'Mathew Leckie',          country: 'Australia',   flag: '', position: 'FWD', goals: 14, caps: 88  },
  { id: 'aus-fwd-2', name: 'Mitchell Duke',          country: 'Australia',   flag: '', position: 'FWD', goals: 7,  caps: 28  },
  { id: 'aus-fwd-3', name: 'Martin Boyle',           country: 'Australia',   flag: '', position: 'FWD', goals: 10, caps: 38  },
  { id: 'aus-fwd-4', name: 'Craig Goodwin',          country: 'Australia',   flag: '', position: 'FWD', goals: 8,  caps: 38  },
  { id: 'aus-fwd-5', name: 'Marco Tilio',            country: 'Australia',   flag: '', position: 'FWD', goals: 4,  caps: 16  },

  // ── NEW ZEALAND ─────────────────────────────────────
  { id: 'nzl-gk-1',  name: 'Oliver Sail',            country: 'New Zealand', flag: '', position: 'GK',  goals: 0,  caps: 26  },
  { id: 'nzl-gk-2',  name: 'Stefan Marinovic',       country: 'New Zealand', flag: '', position: 'GK',  goals: 0,  caps: 32  },
  { id: 'nzl-def-1', name: 'Winston Reid',           country: 'New Zealand', flag: '', position: 'DEF', goals: 3,  caps: 76  },
  { id: 'nzl-def-2', name: 'Liberato Cacace',        country: 'New Zealand', flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'nzl-def-3', name: 'Michael Boxall',         country: 'New Zealand', flag: '', position: 'DEF', goals: 3,  caps: 66  },
  { id: 'nzl-def-4', name: 'Niko Kirwan',            country: 'New Zealand', flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'nzl-fwd-1', name: 'Chris Wood',             country: 'New Zealand', flag: '', position: 'FWD', goals: 33, caps: 90  },
  { id: 'nzl-fwd-2', name: 'Sarpreet Singh',         country: 'New Zealand', flag: '', position: 'FWD', goals: 6,  caps: 30  },
  { id: 'nzl-fwd-3', name: 'Clayton Lewis',          country: 'New Zealand', flag: '', position: 'FWD', goals: 5,  caps: 30  },
  { id: 'nzl-fwd-4', name: 'Elijah Just',            country: 'New Zealand', flag: '', position: 'FWD', goals: 3,  caps: 18  },
  { id: 'nzl-fwd-5', name: 'Marko Simonović',        country: 'New Zealand', flag: '', position: 'FWD', goals: 6,  caps: 22  },


  // ════════════════════════════════════════════════════
  //  EUROPE (additional)
  // ════════════════════════════════════════════════════

  // ── SERBIA ──────────────────────────────────────────
  { id: 'srb-gk-1',  name: 'Predrag Rajković',       country: 'Serbia',      flag: '', position: 'GK',  goals: 0,  caps: 48  },
  { id: 'srb-gk-2',  name: 'Vanja Milinković-Savić', country: 'Serbia',      flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'srb-def-1', name: 'Strahinja Pavlović',     country: 'Serbia',      flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'srb-def-2', name: 'Nikola Milenković',      country: 'Serbia',      flag: '', position: 'DEF', goals: 5,  caps: 60  },
  { id: 'srb-def-3', name: 'Srđan Babić',            country: 'Serbia',      flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'srb-def-4', name: 'Filip Mladenović',       country: 'Serbia',      flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'srb-fwd-1', name: 'Dušan Vlahović',         country: 'Serbia',      flag: '', position: 'FWD', goals: 22, caps: 42  },
  { id: 'srb-fwd-2', name: 'Aleksandar Mitrović',    country: 'Serbia',      flag: '', position: 'FWD', goals: 53, caps: 88  },
  { id: 'srb-fwd-3', name: 'Sergej Milinković-Savić',country: 'Serbia',      flag: '', position: 'FWD', goals: 16, caps: 66  },
  { id: 'srb-fwd-4', name: 'Luka Jović',             country: 'Serbia',      flag: '', position: 'FWD', goals: 14, caps: 40  },
  { id: 'srb-fwd-5', name: 'Filip Kostić',           country: 'Serbia',      flag: '', position: 'FWD', goals: 14, caps: 68  },

  // ── DENMARK ─────────────────────────────────────────
  { id: 'den-gk-1',  name: 'Kasper Schmeichel',      country: 'Denmark',     flag: '', position: 'GK',  goals: 0,  caps: 102 },
  { id: 'den-gk-2',  name: 'Frederik Rønnow',        country: 'Denmark',     flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'den-def-1', name: 'Andreas Christensen',    country: 'Denmark',     flag: '', position: 'DEF', goals: 3,  caps: 60  },
  { id: 'den-def-2', name: 'Simon Kjær',             country: 'Denmark',     flag: '', position: 'DEF', goals: 7,  caps: 138 },
  { id: 'den-def-3', name: 'Joakim Maehle',          country: 'Denmark',     flag: '', position: 'DEF', goals: 6,  caps: 50  },
  { id: 'den-def-4', name: 'Victor Nelsson',         country: 'Denmark',     flag: '', position: 'DEF', goals: 2,  caps: 26  },
  { id: 'den-fwd-1', name: 'Christian Eriksen',      country: 'Denmark',     flag: '', position: 'FWD', goals: 42, caps: 122 },
  { id: 'den-fwd-2', name: 'Pierre-Emile Højbjerg',  country: 'Denmark',     flag: '', position: 'FWD', goals: 14, caps: 94  },
  { id: 'den-fwd-3', name: 'Rasmus Højlund',         country: 'Denmark',     flag: '', position: 'FWD', goals: 12, caps: 26  },
  { id: 'den-fwd-4', name: 'Andreas Skov Olsen',     country: 'Denmark',     flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'den-fwd-5', name: 'Jonas Wind',             country: 'Denmark',     flag: '', position: 'FWD', goals: 8,  caps: 22  },

  // ── HUNGARY ─────────────────────────────────────────
  { id: 'hun-gk-1',  name: 'Péter Gulácsi',          country: 'Hungary',     flag: '', position: 'GK',  goals: 0,  caps: 88  },
  { id: 'hun-gk-2',  name: 'Dénes Dibusz',           country: 'Hungary',     flag: '', position: 'GK',  goals: 0,  caps: 36  },
  { id: 'hun-def-1', name: 'Willi Orbán',            country: 'Hungary',     flag: '', position: 'DEF', goals: 4,  caps: 60  },
  { id: 'hun-def-2', name: 'Attila Szalai',          country: 'Hungary',     flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'hun-def-3', name: 'Endre Botka',            country: 'Hungary',     flag: '', position: 'DEF', goals: 1,  caps: 28  },
  { id: 'hun-def-4', name: 'Bendegúz Bolla',         country: 'Hungary',     flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'hun-fwd-1', name: 'Dominik Szoboszlai',     country: 'Hungary',     flag: '', position: 'FWD', goals: 14, caps: 48  },
  { id: 'hun-fwd-2', name: 'Roland Sallai',          country: 'Hungary',     flag: '', position: 'FWD', goals: 12, caps: 44  },
  { id: 'hun-fwd-3', name: 'Martin Ádám',            country: 'Hungary',     flag: '', position: 'FWD', goals: 10, caps: 30  },
  { id: 'hun-fwd-4', name: 'Callum Styles',          country: 'Hungary',     flag: '', position: 'FWD', goals: 4,  caps: 28  },
  { id: 'hun-fwd-5', name: 'Zsolt Nagy',             country: 'Hungary',     flag: '', position: 'FWD', goals: 3,  caps: 22  },

  // ── POLAND ──────────────────────────────────────────
  { id: 'pol-gk-1',  name: 'Wojciech Szczęsny',      country: 'Poland',      flag: '', position: 'GK',  goals: 0,  caps: 84  },
  { id: 'pol-gk-2',  name: 'Łukasz Skorupski',       country: 'Poland',      flag: '', position: 'GK',  goals: 0,  caps: 20  },
  { id: 'pol-def-1', name: 'Jan Bednarek',           country: 'Poland',      flag: '', position: 'DEF', goals: 5,  caps: 74  },
  { id: 'pol-def-2', name: 'Kamil Glik',             country: 'Poland',      flag: '', position: 'DEF', goals: 7,  caps: 98  },
  { id: 'pol-def-3', name: 'Bartosz Bereszyński',    country: 'Poland',      flag: '', position: 'DEF', goals: 1,  caps: 52  },
  { id: 'pol-def-4', name: 'Nicola Zalewski',        country: 'Poland',      flag: '', position: 'DEF', goals: 3,  caps: 24  },
  { id: 'pol-fwd-1', name: 'Robert Lewandowski',     country: 'Poland',      flag: '', position: 'FWD', goals: 82, caps: 148 },
  { id: 'pol-fwd-2', name: 'Piotr Zieliński',        country: 'Poland',      flag: '', position: 'FWD', goals: 24, caps: 88  },
  { id: 'pol-fwd-3', name: 'Arkadiusz Milik',        country: 'Poland',      flag: '', position: 'FWD', goals: 30, caps: 78  },
  { id: 'pol-fwd-4', name: 'Sebastian Szymański',    country: 'Poland',      flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'pol-fwd-5', name: 'Przemysław Frankowski',  country: 'Poland',      flag: '', position: 'FWD', goals: 8,  caps: 38  },

  // ── UKRAINE ─────────────────────────────────────────
  { id: 'ukr-gk-1',  name: 'Georgiy Bushchan',       country: 'Ukraine',     flag: '', position: 'GK',  goals: 0,  caps: 38  },
  { id: 'ukr-gk-2',  name: 'Andriy Lunin',           country: 'Ukraine',     flag: '', position: 'GK',  goals: 0,  caps: 24  },
  { id: 'ukr-def-1', name: 'Oleksandr Zinchenko',    country: 'Ukraine',     flag: '', position: 'DEF', goals: 4,  caps: 82  },
  { id: 'ukr-def-2', name: 'Mykola Matviyenko',      country: 'Ukraine',     flag: '', position: 'DEF', goals: 4,  caps: 60  },
  { id: 'ukr-def-3', name: 'Ilya Zabarnyi',          country: 'Ukraine',     flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'ukr-def-4', name: 'Yukhym Konoplya',        country: 'Ukraine',     flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'ukr-fwd-1', name: 'Mykhailo Mudryk',        country: 'Ukraine',     flag: '', position: 'FWD', goals: 12, caps: 48  },
  { id: 'ukr-fwd-2', name: 'Viktor Tsygankov',       country: 'Ukraine',     flag: '', position: 'FWD', goals: 14, caps: 44  },
  { id: 'ukr-fwd-3', name: 'Artem Dovbyk',           country: 'Ukraine',     flag: '', position: 'FWD', goals: 16, caps: 36  },
  { id: 'ukr-fwd-4', name: 'Roman Yaremchuk',        country: 'Ukraine',     flag: '', position: 'FWD', goals: 20, caps: 58  },
  { id: 'ukr-fwd-5', name: 'Georgiy Sudakov',        country: 'Ukraine',     flag: '', position: 'FWD', goals: 6,  caps: 22  },


  // ════════════════════════════════════════════════════
  //  SOUTH AMERICA (additional)
  // ════════════════════════════════════════════════════

  // ── VENEZUELA ───────────────────────────────────────
  { id: 'ven-gk-1',  name: 'Wuilker Faríñez',        country: 'Venezuela',   flag: '', position: 'GK',  goals: 0,  caps: 72  },
  { id: 'ven-gk-2',  name: 'Rafael Romo',            country: 'Venezuela',   flag: '', position: 'GK',  goals: 0,  caps: 40  },
  { id: 'ven-def-1', name: 'Rolf Feltscher',         country: 'Venezuela',   flag: '', position: 'DEF', goals: 2,  caps: 42  },
  { id: 'ven-def-2', name: 'Alexander González',     country: 'Venezuela',   flag: '', position: 'DEF', goals: 3,  caps: 62  },
  { id: 'ven-def-3', name: 'Mikel Villanueva',       country: 'Venezuela',   flag: '', position: 'DEF', goals: 1,  caps: 30  },
  { id: 'ven-def-4', name: 'Jhon Chancellor',        country: 'Venezuela',   flag: '', position: 'DEF', goals: 3,  caps: 38  },
  { id: 'ven-fwd-1', name: 'Salomón Rondón',         country: 'Venezuela',   flag: '', position: 'FWD', goals: 41, caps: 110 },
  { id: 'ven-fwd-2', name: 'Yangel Herrera',         country: 'Venezuela',   flag: '', position: 'FWD', goals: 22, caps: 70  },
  { id: 'ven-fwd-3', name: 'Darwin Machís',          country: 'Venezuela',   flag: '', position: 'FWD', goals: 18, caps: 72  },
  { id: 'ven-fwd-4', name: 'Josef Martínez',         country: 'Venezuela',   flag: '', position: 'FWD', goals: 20, caps: 54  },
  { id: 'ven-fwd-5', name: 'Tomás Rincón',           country: 'Venezuela',   flag: '', position: 'FWD', goals: 10, caps: 118 },

  // ── PERU ────────────────────────────────────────────
  { id: 'per-gk-1',  name: 'Pedro Gallese',          country: 'Peru',        flag: '', position: 'GK',  goals: 0,  caps: 80  },
  { id: 'per-gk-2',  name: 'Carlos Cáceda',          country: 'Peru',        flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'per-def-1', name: 'Miguel Trauco',          country: 'Peru',        flag: '', position: 'DEF', goals: 2,  caps: 60  },
  { id: 'per-def-2', name: 'Alexander Callens',      country: 'Peru',        flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'per-def-3', name: 'Luis Abram',             country: 'Peru',        flag: '', position: 'DEF', goals: 2,  caps: 36  },
  { id: 'per-def-4', name: 'Anderson Santamaría',    country: 'Peru',        flag: '', position: 'DEF', goals: 3,  caps: 40  },
  { id: 'per-fwd-1', name: 'André Carrillo',         country: 'Peru',        flag: '', position: 'FWD', goals: 16, caps: 98  },
  { id: 'per-fwd-2', name: 'Gianluca Lapadula',      country: 'Peru',        flag: '', position: 'FWD', goals: 14, caps: 44  },
  { id: 'per-fwd-3', name: 'Sergio Peña',            country: 'Peru',        flag: '', position: 'FWD', goals: 6,  caps: 36  },
  { id: 'per-fwd-4', name: 'Bryan Reyna',            country: 'Peru',        flag: '', position: 'FWD', goals: 4,  caps: 20  },
  { id: 'per-fwd-5', name: 'Alex Valera',            country: 'Peru',        flag: '', position: 'FWD', goals: 8,  caps: 28  },


  // ════════════════════════════════════════════════════
  //  NORTH & CENTRAL AMERICA (additional)
  // ════════════════════════════════════════════════════

  // ── COSTA RICA ──────────────────────────────────────
  { id: 'cri-gk-1',  name: 'Keylor Navas',           country: 'Costa Rica',  flag: '', position: 'GK',  goals: 0,  caps: 104 },
  { id: 'cri-gk-2',  name: 'Leonel Moreira',         country: 'Costa Rica',  flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'cri-def-1', name: 'Bryan Oviedo',           country: 'Costa Rica',  flag: '', position: 'DEF', goals: 5,  caps: 72  },
  { id: 'cri-def-2', name: 'Juan Pablo Vargas',      country: 'Costa Rica',  flag: '', position: 'DEF', goals: 3,  caps: 48  },
  { id: 'cri-def-3', name: 'Francisco Calvo',        country: 'Costa Rica',  flag: '', position: 'DEF', goals: 6,  caps: 68  },
  { id: 'cri-def-4', name: 'Keysher Fuller',         country: 'Costa Rica',  flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'cri-fwd-1', name: 'Joel Campbell',          country: 'Costa Rica',  flag: '', position: 'FWD', goals: 26, caps: 102 },
  { id: 'cri-fwd-2', name: 'Celso Borges',           country: 'Costa Rica',  flag: '', position: 'FWD', goals: 12, caps: 98  },
  { id: 'cri-fwd-3', name: 'Jewison Bennette',       country: 'Costa Rica',  flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'cri-fwd-4', name: 'Anthony Contreras',      country: 'Costa Rica',  flag: '', position: 'FWD', goals: 8,  caps: 26  },
  { id: 'cri-fwd-5', name: 'Jonathan Moya',          country: 'Costa Rica',  flag: '', position: 'FWD', goals: 5,  caps: 18  },

  // ── HONDURAS ────────────────────────────────────────
  { id: 'hon-gk-1',  name: 'Luis López',             country: 'Honduras',    flag: '', position: 'GK',  goals: 0,  caps: 60  },
  { id: 'hon-gk-2',  name: 'Harold Fonseca',         country: 'Honduras',    flag: '', position: 'GK',  goals: 0,  caps: 24  },
  { id: 'hon-def-1', name: 'Denil Maldonado',        country: 'Honduras',    flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'hon-def-2', name: 'Alejandro Reyes',        country: 'Honduras',    flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'hon-def-3', name: 'Jonathan Tejeda',        country: 'Honduras',    flag: '', position: 'DEF', goals: 1,  caps: 26  },
  { id: 'hon-def-4', name: 'Kervin Arriaga',         country: 'Honduras',    flag: '', position: 'DEF', goals: 2,  caps: 24  },
  { id: 'hon-fwd-1', name: 'Romell Quioto',          country: 'Honduras',    flag: '', position: 'FWD', goals: 15, caps: 70  },
  { id: 'hon-fwd-2', name: 'Antony Lozano',          country: 'Honduras',    flag: '', position: 'FWD', goals: 14, caps: 56  },
  { id: 'hon-fwd-3', name: 'Alberth Elis',           country: 'Honduras',    flag: '', position: 'FWD', goals: 14, caps: 52  },
  { id: 'hon-fwd-4', name: 'Luis Palma',             country: 'Honduras',    flag: '', position: 'FWD', goals: 10, caps: 32  },
  { id: 'hon-fwd-5', name: 'Bryan Acosta',           country: 'Honduras',    flag: '', position: 'FWD', goals: 8,  caps: 62  },


  // ════════════════════════════════════════════════════
  //  AFRICA (additional)
  // ════════════════════════════════════════════════════

  // ── NIGERIA ─────────────────────────────────────────
  { id: 'nga-gk-1',  name: 'Francis Uzoho',          country: 'Nigeria',     flag: '', position: 'GK',  goals: 0,  caps: 38  },
  { id: 'nga-gk-2',  name: 'Stanley Nwabali',        country: 'Nigeria',     flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'nga-def-1', name: 'William Troost-Ekong',   country: 'Nigeria',     flag: '', position: 'DEF', goals: 6,  caps: 68  },
  { id: 'nga-def-2', name: 'Leon Balogun',           country: 'Nigeria',     flag: '', position: 'DEF', goals: 4,  caps: 68  },
  { id: 'nga-def-3', name: 'Zaidu Sanusi',           country: 'Nigeria',     flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'nga-def-4', name: 'Calvin Bassey',          country: 'Nigeria',     flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'nga-fwd-1', name: 'Victor Osimhen',         country: 'Nigeria',     flag: '', position: 'FWD', goals: 22, caps: 40  },
  { id: 'nga-fwd-2', name: 'Kelechi Iheanacho',      country: 'Nigeria',     flag: '', position: 'FWD', goals: 20, caps: 58  },
  { id: 'nga-fwd-3', name: 'Alex Iwobi',             country: 'Nigeria',     flag: '', position: 'FWD', goals: 14, caps: 62  },
  { id: 'nga-fwd-4', name: 'Moses Simon',            country: 'Nigeria',     flag: '', position: 'FWD', goals: 10, caps: 44  },
  { id: 'nga-fwd-5', name: 'Samuel Chukwueze',       country: 'Nigeria',     flag: '', position: 'FWD', goals: 12, caps: 44  },

  // ── CAMEROON ────────────────────────────────────────
  { id: 'cmr-gk-1',  name: 'André Onana',            country: 'Cameroon',    flag: '', position: 'GK',  goals: 0,  caps: 38  },
  { id: 'cmr-gk-2',  name: 'Devis Epassy',           country: 'Cameroon',    flag: '', position: 'GK',  goals: 0,  caps: 22  },
  { id: 'cmr-def-1', name: 'Nouhou Tolo',            country: 'Cameroon',    flag: '', position: 'DEF', goals: 2,  caps: 44  },
  { id: 'cmr-def-2', name: 'Michael Ngadeu-Ngadjui', country: 'Cameroon',    flag: '', position: 'DEF', goals: 5,  caps: 72  },
  { id: 'cmr-def-3', name: 'Jean-Charles Castelletto',country: 'Cameroon',   flag: '', position: 'DEF', goals: 4,  caps: 42  },
  { id: 'cmr-def-4', name: 'Collins Fai',            country: 'Cameroon',    flag: '', position: 'DEF', goals: 3,  caps: 52  },
  { id: 'cmr-fwd-1', name: 'Vincent Aboubakar',      country: 'Cameroon',    flag: '', position: 'FWD', goals: 43, caps: 104 },
  { id: 'cmr-fwd-2', name: 'Eric Maxim Choupo-Moting',country: 'Cameroon',   flag: '', position: 'FWD', goals: 22, caps: 78  },
  { id: 'cmr-fwd-3', name: 'Zambo Anguissa',         country: 'Cameroon',    flag: '', position: 'FWD', goals: 6,  caps: 68  },
  { id: 'cmr-fwd-4', name: 'Bryan Mbeumo',           country: 'Cameroon',    flag: '', position: 'FWD', goals: 10, caps: 34  },
  { id: 'cmr-fwd-5', name: 'Karl Toko Ekambi',       country: 'Cameroon',    flag: '', position: 'FWD', goals: 16, caps: 60  },

  // ── ALGERIA ─────────────────────────────────────────
  { id: 'dza-gk-1',  name: 'Raïs M\'Bolhi',          country: 'Algeria',     flag: '', position: 'GK',  goals: 0,  caps: 88  },
  { id: 'dza-gk-2',  name: 'Alexandre Oukidja',      country: 'Algeria',     flag: '', position: 'GK',  goals: 0,  caps: 30  },
  { id: 'dza-def-1', name: 'Ramy Bensebaini',        country: 'Algeria',     flag: '', position: 'DEF', goals: 10, caps: 52  },
  { id: 'dza-def-2', name: 'Aïssa Mandi',            country: 'Algeria',     flag: '', position: 'DEF', goals: 4,  caps: 68  },
  { id: 'dza-def-3', name: 'Youcef Atal',            country: 'Algeria',     flag: '', position: 'DEF', goals: 5,  caps: 38  },
  { id: 'dza-def-4', name: 'Djamel Benlamri',        country: 'Algeria',     flag: '', position: 'DEF', goals: 3,  caps: 52  },
  { id: 'dza-fwd-1', name: 'Riyad Mahrez',           country: 'Algeria',     flag: '', position: 'FWD', goals: 30, caps: 102 },
  { id: 'dza-fwd-2', name: 'Islam Slimani',          country: 'Algeria',     flag: '', position: 'FWD', goals: 44, caps: 100 },
  { id: 'dza-fwd-3', name: 'Youcef Belaïli',         country: 'Algeria',     flag: '', position: 'FWD', goals: 8,  caps: 46  },
  { id: 'dza-fwd-4', name: 'Andy Delort',            country: 'Algeria',     flag: '', position: 'FWD', goals: 10, caps: 32  },
  { id: 'dza-fwd-5', name: 'Houssem Aouar',          country: 'Algeria',     flag: '', position: 'FWD', goals: 6,  caps: 24  },

  // ── TUNISIA ─────────────────────────────────────────
  { id: 'tun-gk-1',  name: 'Aymen Dahmen',           country: 'Tunisia',     flag: '', position: 'GK',  goals: 0,  caps: 38  },
  { id: 'tun-gk-2',  name: 'Bechir Ben Said',        country: 'Tunisia',     flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'tun-def-1', name: 'Montassar Talbi',        country: 'Tunisia',     flag: '', position: 'DEF', goals: 2,  caps: 34  },
  { id: 'tun-def-2', name: 'Dylan Bronn',            country: 'Tunisia',     flag: '', position: 'DEF', goals: 2,  caps: 44  },
  { id: 'tun-def-3', name: 'Nader Ghandri',          country: 'Tunisia',     flag: '', position: 'DEF', goals: 3,  caps: 52  },
  { id: 'tun-def-4', name: 'Wajdi Kechrida',         country: 'Tunisia',     flag: '', position: 'DEF', goals: 3,  caps: 48  },
  { id: 'tun-fwd-1', name: 'Youssef Msakni',         country: 'Tunisia',     flag: '', position: 'FWD', goals: 18, caps: 90  },
  { id: 'tun-fwd-2', name: 'Hannibal Mejbri',        country: 'Tunisia',     flag: '', position: 'FWD', goals: 6,  caps: 28  },
  { id: 'tun-fwd-3', name: 'Anis Ben Slimane',       country: 'Tunisia',     flag: '', position: 'FWD', goals: 5,  caps: 22  },
  { id: 'tun-fwd-4', name: 'Mohamed Drager',         country: 'Tunisia',     flag: '', position: 'FWD', goals: 4,  caps: 44  },
  { id: 'tun-fwd-5', name: 'Sayfallah Ltaief',       country: 'Tunisia',     flag: '', position: 'FWD', goals: 3,  caps: 16  },


  // ════════════════════════════════════════════════════
  //  ASIA (additional)
  // ════════════════════════════════════════════════════

  // ── IRAQ ────────────────────────────────────────────
  { id: 'irq-gk-1',  name: 'Jalal Hassan',           country: 'Iraq',        flag: '', position: 'GK',  goals: 0,  caps: 48  },
  { id: 'irq-gk-2',  name: 'Mohammed Hameed',        country: 'Iraq',        flag: '', position: 'GK',  goals: 0,  caps: 20  },
  { id: 'irq-def-1', name: 'Ali Adnan',              country: 'Iraq',        flag: '', position: 'DEF', goals: 5,  caps: 72  },
  { id: 'irq-def-2', name: 'Rebin Sulaka',           country: 'Iraq',        flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'irq-def-3', name: 'Saman Hama Amin',        country: 'Iraq',        flag: '', position: 'DEF', goals: 1,  caps: 34  },
  { id: 'irq-def-4', name: 'Hussein Ali',            country: 'Iraq',        flag: '', position: 'DEF', goals: 1,  caps: 32  },
  { id: 'irq-fwd-1', name: 'Mohanad Ali',            country: 'Iraq',        flag: '', position: 'FWD', goals: 22, caps: 52  },
  { id: 'irq-fwd-2', name: 'Amjed Attwan',           country: 'Iraq',        flag: '', position: 'FWD', goals: 12, caps: 38  },
  { id: 'irq-fwd-3', name: 'Aymen Hussein',          country: 'Iraq',        flag: '', position: 'FWD', goals: 10, caps: 30  },
  { id: 'irq-fwd-4', name: 'Bashar Resan',           country: 'Iraq',        flag: '', position: 'FWD', goals: 8,  caps: 34  },
  { id: 'irq-fwd-5', name: 'Ahmed Yasin',            country: 'Iraq',        flag: '', position: 'FWD', goals: 6,  caps: 40  },

  // ── QATAR ───────────────────────────────────────────
  { id: 'qat-gk-1',  name: 'Meshaal Barsham',        country: 'Qatar',       flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'qat-gk-2',  name: 'Abdulrahman Al-Janahi',  country: 'Qatar',       flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'qat-def-1', name: 'Pedro Miguel',           country: 'Qatar',       flag: '', position: 'DEF', goals: 3,  caps: 42  },
  { id: 'qat-def-2', name: 'Abdelkarim Hassan',      country: 'Qatar',       flag: '', position: 'DEF', goals: 4,  caps: 62  },
  { id: 'qat-def-3', name: 'Tarek Salman',           country: 'Qatar',       flag: '', position: 'DEF', goals: 1,  caps: 28  },
  { id: 'qat-def-4', name: 'Homam Ahmed',            country: 'Qatar',       flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'qat-fwd-1', name: 'Akram Afif',             country: 'Qatar',       flag: '', position: 'FWD', goals: 26, caps: 52  },
  { id: 'qat-fwd-2', name: 'Almoez Ali',             country: 'Qatar',       flag: '', position: 'FWD', goals: 40, caps: 64  },
  { id: 'qat-fwd-3', name: 'Hassan Al-Haydos',       country: 'Qatar',       flag: '', position: 'FWD', goals: 34, caps: 118 },
  { id: 'qat-fwd-4', name: 'Assim Madibo',           country: 'Qatar',       flag: '', position: 'FWD', goals: 4,  caps: 38  },
  { id: 'qat-fwd-5', name: 'Karim Boudiaf',          country: 'Qatar',       flag: '', position: 'FWD', goals: 6,  caps: 44  },

  // ── UZBEKISTAN ──────────────────────────────────────
  { id: 'uzb-gk-1',  name: 'Utkir Yusupov',          country: 'Uzbekistan',  flag: '', position: 'GK',  goals: 0,  caps: 36  },
  { id: 'uzb-gk-2',  name: 'Otabek Shukurov',        country: 'Uzbekistan',  flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'uzb-def-1', name: 'Jasur Jaloliddinov',     country: 'Uzbekistan',  flag: '', position: 'DEF', goals: 2,  caps: 32  },
  { id: 'uzb-def-2', name: 'Sanjar Tursunov',        country: 'Uzbekistan',  flag: '', position: 'DEF', goals: 1,  caps: 28  },
  { id: 'uzb-def-3', name: 'Khojiakbar Alijonov',    country: 'Uzbekistan',  flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'uzb-def-4', name: 'Shamsiddin Karimov',     country: 'Uzbekistan',  flag: '', position: 'DEF', goals: 0,  caps: 18  },
  { id: 'uzb-fwd-1', name: 'Eldor Shomurodov',       country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 28, caps: 60  },
  { id: 'uzb-fwd-2', name: 'Abbosbek Fayzullaev',    country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 10, caps: 38  },
  { id: 'uzb-fwd-3', name: 'Jaloliddin Masharipov',  country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 8,  caps: 34  },
  { id: 'uzb-fwd-4', name: 'Dostonbek Khamdamov',    country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 6,  caps: 24  },
  { id: 'uzb-fwd-5', name: 'Sherzod Nasrullayev',    country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 4,  caps: 20  },


  // ════════════════════════════════════════════════════
  //  EXTRA PLAYERS (to reach 20 per team)
  // ════════════════════════════════════════════════════

  // ── FRANCE extras ───────────────────────────────────
  { id: 'fra-gk-3',   name: 'Guillaume Restes',      country: 'France',      flag: '', position: 'GK',  goals: 0,  caps: 5   },
  { id: 'fra-def-5',  name: 'Benjamin Pavard',        country: 'France',      flag: '', position: 'DEF', goals: 6,  caps: 55  },
  { id: 'fra-def-6',  name: 'Lucas Hernández',        country: 'France',      flag: '', position: 'DEF', goals: 2,  caps: 26  },
  { id: 'fra-fwd-6',  name: 'Eduardo Camavinga',      country: 'France',      flag: '', position: 'FWD', goals: 6,  caps: 34  },
  { id: 'fra-fwd-7',  name: 'Adrien Rabiot',          country: 'France',      flag: '', position: 'FWD', goals: 12, caps: 72  },
  { id: 'fra-fwd-8',  name: 'Aurélien Tchouaméni',    country: 'France',      flag: '', position: 'FWD', goals: 4,  caps: 28  },
  { id: 'fra-fwd-9',  name: 'Christopher Nkunku',     country: 'France',      flag: '', position: 'FWD', goals: 10, caps: 24  },
  { id: 'fra-fwd-10', name: 'Moussa Diaby',           country: 'France',      flag: '', position: 'FWD', goals: 8,  caps: 20  },
  { id: 'fra-fwd-11', name: 'Michael Olise',          country: 'France',      flag: '', position: 'FWD', goals: 5,  caps: 14  },

  // ── ENGLAND extras ──────────────────────────────────
  { id: 'eng-gk-3',   name: 'Aaron Ramsdale',         country: 'England',     flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'eng-def-5',  name: 'Ben White',              country: 'England',     flag: '', position: 'DEF', goals: 1,  caps: 12  },
  { id: 'eng-def-6',  name: 'Luke Shaw',              country: 'England',     flag: '', position: 'DEF', goals: 3,  caps: 24  },
  { id: 'eng-fwd-6',  name: 'Jude Bellingham',        country: 'England',     flag: '', position: 'FWD', goals: 14, caps: 32  },
  { id: 'eng-fwd-7',  name: 'Mason Mount',            country: 'England',     flag: '', position: 'FWD', goals: 16, caps: 42  },
  { id: 'eng-fwd-8',  name: 'Jack Grealish',          country: 'England',     flag: '', position: 'FWD', goals: 5,  caps: 38  },
  { id: 'eng-fwd-9',  name: 'Jarrod Bowen',           country: 'England',     flag: '', position: 'FWD', goals: 8,  caps: 18  },
  { id: 'eng-fwd-10', name: 'Ivan Toney',             country: 'England',     flag: '', position: 'FWD', goals: 4,  caps: 12  },
  { id: 'eng-fwd-11', name: 'Dominic Solanke',        country: 'England',     flag: '', position: 'FWD', goals: 5,  caps: 14  },

  // ── GERMANY extras ──────────────────────────────────
  { id: 'ger-gk-3',   name: 'Alexander Nübel',        country: 'Germany',     flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'ger-def-5',  name: 'Benjamin Henrichs',      country: 'Germany',     flag: '', position: 'DEF', goals: 3,  caps: 22  },
  { id: 'ger-def-6',  name: 'Matthias Ginter',        country: 'Germany',     flag: '', position: 'DEF', goals: 6,  caps: 56  },
  { id: 'ger-fwd-6',  name: 'Leon Goretzka',          country: 'Germany',     flag: '', position: 'FWD', goals: 20, caps: 62  },
  { id: 'ger-fwd-7',  name: 'Ilkay Gündoğan',         country: 'Germany',     flag: '', position: 'FWD', goals: 18, caps: 75  },
  { id: 'ger-fwd-8',  name: 'Serge Gnabry',           country: 'Germany',     flag: '', position: 'FWD', goals: 21, caps: 46  },
  { id: 'ger-fwd-9',  name: 'Thomas Müller',          country: 'Germany',     flag: '', position: 'FWD', goals: 45, caps: 131 },
  { id: 'ger-fwd-10', name: 'Niclas Füllkrug',        country: 'Germany',     flag: '', position: 'FWD', goals: 10, caps: 20  },
  { id: 'ger-fwd-11', name: 'Jamal Musiala',          country: 'Germany',     flag: '', position: 'FWD', goals: 14, caps: 32  },

  // ── SPAIN extras ────────────────────────────────────
  { id: 'esp-gk-3',   name: 'Álex Remiro',            country: 'Spain',       flag: '', position: 'GK',  goals: 0,  caps: 6   },
  { id: 'esp-def-5',  name: 'Jesús Navas',            country: 'Spain',       flag: '', position: 'DEF', goals: 4,  caps: 76  },
  { id: 'esp-def-6',  name: 'Pau Cubarsí',            country: 'Spain',       flag: '', position: 'DEF', goals: 1,  caps: 8   },
  { id: 'esp-fwd-6',  name: 'Gavi',                   country: 'Spain',       flag: '', position: 'FWD', goals: 5,  caps: 36  },
  { id: 'esp-fwd-7',  name: 'Rodri',                  country: 'Spain',       flag: '', position: 'FWD', goals: 14, caps: 58  },
  { id: 'esp-fwd-8',  name: 'Mikel Merino',           country: 'Spain',       flag: '', position: 'FWD', goals: 12, caps: 38  },
  { id: 'esp-fwd-9',  name: 'Ferran Torres',          country: 'Spain',       flag: '', position: 'FWD', goals: 24, caps: 44  },
  { id: 'esp-fwd-10', name: 'Fabián Ruiz',            country: 'Spain',       flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'esp-fwd-11', name: 'Marcos Asensio',         country: 'Spain',       flag: '', position: 'FWD', goals: 14, caps: 52  },

  // ── PORTUGAL extras ─────────────────────────────────
  { id: 'por-gk-3',   name: 'José Sá',                country: 'Portugal',    flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'por-def-5',  name: 'Pepe',                   country: 'Portugal',    flag: '', position: 'DEF', goals: 8,  caps: 141 },
  { id: 'por-def-6',  name: 'Danilo Pereira',         country: 'Portugal',    flag: '', position: 'DEF', goals: 5,  caps: 68  },
  { id: 'por-fwd-6',  name: 'Bernardo Silva',         country: 'Portugal',    flag: '', position: 'FWD', goals: 20, caps: 102 },
  { id: 'por-fwd-7',  name: 'João Neves',             country: 'Portugal',    flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'por-fwd-8',  name: 'Vitinha',                country: 'Portugal',    flag: '', position: 'FWD', goals: 6,  caps: 28  },
  { id: 'por-fwd-9',  name: 'Pedro Neto',             country: 'Portugal',    flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'por-fwd-10', name: 'Francisco Conceição',    country: 'Portugal',    flag: '', position: 'FWD', goals: 4,  caps: 14  },
  { id: 'por-fwd-11', name: 'Rúben Neves',            country: 'Portugal',    flag: '', position: 'FWD', goals: 8,  caps: 62  },

  // ── NETHERLANDS extras ──────────────────────────────
  { id: 'ned-gk-3',   name: 'Remko Pasveer',          country: 'Netherlands', flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'ned-def-5',  name: 'Daley Blind',            country: 'Netherlands', flag: '', position: 'DEF', goals: 7,  caps: 101 },
  { id: 'ned-def-6',  name: 'Micky van de Ven',       country: 'Netherlands', flag: '', position: 'DEF', goals: 2,  caps: 14  },
  { id: 'ned-fwd-6',  name: 'Teun Koopmeiners',       country: 'Netherlands', flag: '', position: 'FWD', goals: 16, caps: 38  },
  { id: 'ned-fwd-7',  name: 'Ryan Gravenberch',       country: 'Netherlands', flag: '', position: 'FWD', goals: 8,  caps: 26  },
  { id: 'ned-fwd-8',  name: 'Wout Weghorst',          country: 'Netherlands', flag: '', position: 'FWD', goals: 12, caps: 54  },
  { id: 'ned-fwd-9',  name: 'Georginio Wijnaldum',    country: 'Netherlands', flag: '', position: 'FWD', goals: 26, caps: 86  },
  { id: 'ned-fwd-10', name: 'Steven Bergwijn',        country: 'Netherlands', flag: '', position: 'FWD', goals: 10, caps: 42  },
  { id: 'ned-fwd-11', name: 'Quinten Timber',         country: 'Netherlands', flag: '', position: 'FWD', goals: 4,  caps: 16  },

  // ── BELGIUM extras ──────────────────────────────────
  { id: 'bel-gk-3',   name: 'Matz Sels',              country: 'Belgium',     flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'bel-def-5',  name: 'Thomas Meunier',         country: 'Belgium',     flag: '', position: 'DEF', goals: 6,  caps: 58  },
  { id: 'bel-def-6',  name: 'Zeno Debast',            country: 'Belgium',     flag: '', position: 'DEF', goals: 2,  caps: 16  },
  { id: 'bel-fwd-6',  name: 'Axel Witsel',            country: 'Belgium',     flag: '', position: 'FWD', goals: 11, caps: 130 },
  { id: 'bel-fwd-7',  name: 'Dries Mertens',          country: 'Belgium',     flag: '', position: 'FWD', goals: 21, caps: 109 },
  { id: 'bel-fwd-8',  name: 'Thorgan Hazard',         country: 'Belgium',     flag: '', position: 'FWD', goals: 8,  caps: 48  },
  { id: 'bel-fwd-9',  name: 'Charles De Ketelaere',   country: 'Belgium',     flag: '', position: 'FWD', goals: 6,  caps: 24  },
  { id: 'bel-fwd-10', name: 'Loïs Openda',            country: 'Belgium',     flag: '', position: 'FWD', goals: 8,  caps: 18  },
  { id: 'bel-fwd-11', name: 'Johan Bakayoko',         country: 'Belgium',     flag: '', position: 'FWD', goals: 3,  caps: 10  },

  // ── CROATIA extras ──────────────────────────────────
  { id: 'cro-gk-3',   name: 'Nediljko Labrović',      country: 'Croatia',     flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'cro-def-5',  name: 'Borna Sosa',             country: 'Croatia',     flag: '', position: 'DEF', goals: 4,  caps: 26  },
  { id: 'cro-def-6',  name: 'Duje Ćaleta-Car',        country: 'Croatia',     flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'cro-fwd-6',  name: 'Marcelo Brozović',       country: 'Croatia',     flag: '', position: 'FWD', goals: 21, caps: 104 },
  { id: 'cro-fwd-7',  name: 'Mario Pašalić',          country: 'Croatia',     flag: '', position: 'FWD', goals: 18, caps: 62  },
  { id: 'cro-fwd-8',  name: 'Nikola Vlašić',          country: 'Croatia',     flag: '', position: 'FWD', goals: 20, caps: 62  },
  { id: 'cro-fwd-9',  name: 'Mislav Oršić',           country: 'Croatia',     flag: '', position: 'FWD', goals: 10, caps: 38  },
  { id: 'cro-fwd-10', name: 'Ante Budimir',           country: 'Croatia',     flag: '', position: 'FWD', goals: 12, caps: 32  },
  { id: 'cro-fwd-11', name: 'Ivan Rakitić',           country: 'Croatia',     flag: '', position: 'FWD', goals: 15, caps: 121 },

  // ── SWITZERLAND extras ──────────────────────────────
  { id: 'sui-gk-3',   name: 'Jonas Omlin',            country: 'Switzerland', flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'sui-def-5',  name: 'Loris Benito',           country: 'Switzerland', flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'sui-def-6',  name: 'Kevin Mbabu',            country: 'Switzerland', flag: '', position: 'DEF', goals: 2,  caps: 36  },
  { id: 'sui-fwd-6',  name: 'Denis Zakaria',          country: 'Switzerland', flag: '', position: 'FWD', goals: 8,  caps: 42  },
  { id: 'sui-fwd-7',  name: 'Renato Steffen',         country: 'Switzerland', flag: '', position: 'FWD', goals: 8,  caps: 52  },
  { id: 'sui-fwd-8',  name: 'Christian Fassnacht',    country: 'Switzerland', flag: '', position: 'FWD', goals: 7,  caps: 30  },
  { id: 'sui-fwd-9',  name: 'Kwadwo Duah',            country: 'Switzerland', flag: '', position: 'FWD', goals: 5,  caps: 14  },
  { id: 'sui-fwd-10', name: 'Michel Aebischer',       country: 'Switzerland', flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'sui-fwd-11', name: 'Edimilson Fernandes',    country: 'Switzerland', flag: '', position: 'FWD', goals: 4,  caps: 26  },

  // ── TURKEY extras ───────────────────────────────────
  { id: 'tur-gk-3',   name: 'Uğurcan Çakır',          country: 'Turkey',      flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'tur-def-5',  name: 'Samet Akaydın',          country: 'Turkey',      flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'tur-def-6',  name: 'Mert Müldür',            country: 'Turkey',      flag: '', position: 'DEF', goals: 3,  caps: 28  },
  { id: 'tur-fwd-6',  name: 'Okay Yokuşlu',           country: 'Turkey',      flag: '', position: 'FWD', goals: 3,  caps: 52  },
  { id: 'tur-fwd-7',  name: 'Orkun Kökçü',            country: 'Turkey',      flag: '', position: 'FWD', goals: 6,  caps: 28  },
  { id: 'tur-fwd-8',  name: 'Cengiz Ünder',           country: 'Turkey',      flag: '', position: 'FWD', goals: 14, caps: 56  },
  { id: 'tur-fwd-9',  name: 'Salih Özcan',            country: 'Turkey',      flag: '', position: 'FWD', goals: 2,  caps: 24  },
  { id: 'tur-fwd-10', name: 'İrfan Can Kahveci',      country: 'Turkey',      flag: '', position: 'FWD', goals: 8,  caps: 34  },
  { id: 'tur-fwd-11', name: 'Burak Yılmaz',           country: 'Turkey',      flag: '', position: 'FWD', goals: 31, caps: 78  },

  // ── AUSTRIA extras ──────────────────────────────────
  { id: 'aut-gk-3',   name: 'Daniel Bachmann',        country: 'Austria',     flag: '', position: 'GK',  goals: 0,  caps: 16  },
  { id: 'aut-def-5',  name: 'Kevin Danso',            country: 'Austria',     flag: '', position: 'DEF', goals: 3,  caps: 20  },
  { id: 'aut-def-6',  name: 'Philipp Mwene',          country: 'Austria',     flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'aut-fwd-6',  name: 'Konrad Laimer',          country: 'Austria',     flag: '', position: 'FWD', goals: 4,  caps: 32  },
  { id: 'aut-fwd-7',  name: 'Nicolas Seiwald',        country: 'Austria',     flag: '', position: 'FWD', goals: 2,  caps: 22  },
  { id: 'aut-fwd-8',  name: 'Patrick Wimmer',         country: 'Austria',     flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'aut-fwd-9',  name: 'Andreas Weimann',        country: 'Austria',     flag: '', position: 'FWD', goals: 6,  caps: 42  },
  { id: 'aut-fwd-10', name: 'Karim Onisiwo',          country: 'Austria',     flag: '', position: 'FWD', goals: 5,  caps: 30  },
  { id: 'aut-fwd-11', name: 'Sasa Kalajdzic',         country: 'Austria',     flag: '', position: 'FWD', goals: 8,  caps: 38  },

  // ── SCOTLAND extras ─────────────────────────────────
  { id: 'sco-gk-3',   name: 'Jon McLaughlin',         country: 'Scotland',    flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'sco-def-5',  name: 'John Souttar',           country: 'Scotland',    flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'sco-def-6',  name: 'Nathan Patterson',       country: 'Scotland',    flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'sco-fwd-6',  name: 'John McGinn',            country: 'Scotland',    flag: '', position: 'FWD', goals: 12, caps: 76  },
  { id: 'sco-fwd-7',  name: 'Billy Gilmour',          country: 'Scotland',    flag: '', position: 'FWD', goals: 4,  caps: 30  },
  { id: 'sco-fwd-8',  name: 'Callum McGregor',        country: 'Scotland',    flag: '', position: 'FWD', goals: 8,  caps: 52  },
  { id: 'sco-fwd-9',  name: 'Kevin Nisbet',           country: 'Scotland',    flag: '', position: 'FWD', goals: 5,  caps: 20  },
  { id: 'sco-fwd-10', name: 'Ryan Fraser',            country: 'Scotland',    flag: '', position: 'FWD', goals: 5,  caps: 38  },
  { id: 'sco-fwd-11', name: 'James Forrest',          country: 'Scotland',    flag: '', position: 'FWD', goals: 6,  caps: 44  },

  // ── SERBIA extras ───────────────────────────────────
  { id: 'srb-gk-3',   name: 'Filip Mandić',           country: 'Serbia',      flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'srb-def-5',  name: 'Strahinja Eraković',     country: 'Serbia',      flag: '', position: 'DEF', goals: 2,  caps: 18  },
  { id: 'srb-def-6',  name: 'Stefan Mitrović',        country: 'Serbia',      flag: '', position: 'DEF', goals: 3,  caps: 32  },
  { id: 'srb-fwd-6',  name: 'Dušan Tadić',            country: 'Serbia',      flag: '', position: 'FWD', goals: 20, caps: 102 },
  { id: 'srb-fwd-7',  name: 'Nemanja Gudelj',         country: 'Serbia',      flag: '', position: 'FWD', goals: 6,  caps: 56  },
  { id: 'srb-fwd-8',  name: 'Andrija Živković',       country: 'Serbia',      flag: '', position: 'FWD', goals: 6,  caps: 38  },
  { id: 'srb-fwd-9',  name: 'Saša Lukić',             country: 'Serbia',      flag: '', position: 'FWD', goals: 4,  caps: 34  },
  { id: 'srb-fwd-10', name: 'Ivan Ilić',              country: 'Serbia',      flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'srb-fwd-11', name: 'Lazar Samardzić',        country: 'Serbia',      flag: '', position: 'FWD', goals: 4,  caps: 12  },

  // ── DENMARK extras ──────────────────────────────────
  { id: 'den-gk-3',   name: 'Oliver Christensen',     country: 'Denmark',     flag: '', position: 'GK',  goals: 0,  caps: 6   },
  { id: 'den-def-5',  name: 'Jannik Vestergaard',     country: 'Denmark',     flag: '', position: 'DEF', goals: 5,  caps: 48  },
  { id: 'den-def-6',  name: 'Alexander Bah',          country: 'Denmark',     flag: '', position: 'DEF', goals: 1,  caps: 14  },
  { id: 'den-fwd-6',  name: 'Mikkel Damsgaard',       country: 'Denmark',     flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'den-fwd-7',  name: 'Thomas Delaney',         country: 'Denmark',     flag: '', position: 'FWD', goals: 8,  caps: 76  },
  { id: 'den-fwd-8',  name: 'Yussuf Poulsen',         country: 'Denmark',     flag: '', position: 'FWD', goals: 12, caps: 72  },
  { id: 'den-fwd-9',  name: 'Kasper Dolberg',         country: 'Denmark',     flag: '', position: 'FWD', goals: 10, caps: 44  },
  { id: 'den-fwd-10', name: 'Gustav Isaksen',         country: 'Denmark',     flag: '', position: 'FWD', goals: 5,  caps: 18  },
  { id: 'den-fwd-11', name: 'Mathias Jensen',         country: 'Denmark',     flag: '', position: 'FWD', goals: 4,  caps: 28  },

  // ── HUNGARY extras ──────────────────────────────────
  { id: 'hun-gk-3',   name: 'Ádám Bogdán',            country: 'Hungary',     flag: '', position: 'GK',  goals: 0,  caps: 24  },
  { id: 'hun-def-5',  name: 'Ádám Lang',              country: 'Hungary',     flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'hun-def-6',  name: 'Mihály Botka',           country: 'Hungary',     flag: '', position: 'DEF', goals: 1,  caps: 16  },
  { id: 'hun-fwd-6',  name: 'Ádám Nagy',              country: 'Hungary',     flag: '', position: 'FWD', goals: 3,  caps: 62  },
  { id: 'hun-fwd-7',  name: 'Barnabás Varga',         country: 'Hungary',     flag: '', position: 'FWD', goals: 6,  caps: 26  },
  { id: 'hun-fwd-8',  name: 'Zsolt Kalmár',           country: 'Hungary',     flag: '', position: 'FWD', goals: 5,  caps: 28  },
  { id: 'hun-fwd-9',  name: 'Kevin Csoboth',          country: 'Hungary',     flag: '', position: 'FWD', goals: 4,  caps: 12  },
  { id: 'hun-fwd-10', name: 'Roland Varga',           country: 'Hungary',     flag: '', position: 'FWD', goals: 3,  caps: 18  },
  { id: 'hun-fwd-11', name: 'Máté Pátkai',            country: 'Hungary',     flag: '', position: 'FWD', goals: 2,  caps: 18  },

  // ── POLAND extras ───────────────────────────────────
  { id: 'pol-gk-3',   name: 'Kamil Grabara',          country: 'Poland',      flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'pol-def-5',  name: 'Michał Helik',           country: 'Poland',      flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'pol-def-6',  name: 'Tymoteusz Puchacz',      country: 'Poland',      flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'pol-fwd-6',  name: 'Krzysztof Piątek',       country: 'Poland',      flag: '', position: 'FWD', goals: 12, caps: 38  },
  { id: 'pol-fwd-7',  name: 'Kamil Jóźwiak',          country: 'Poland',      flag: '', position: 'FWD', goals: 4,  caps: 30  },
  { id: 'pol-fwd-8',  name: 'Jakub Moder',            country: 'Poland',      flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'pol-fwd-9',  name: 'Jakub Kamiński',         country: 'Poland',      flag: '', position: 'FWD', goals: 3,  caps: 16  },
  { id: 'pol-fwd-10', name: 'Adam Buksa',             country: 'Poland',      flag: '', position: 'FWD', goals: 8,  caps: 24  },
  { id: 'pol-fwd-11', name: 'Bartosz Slisz',          country: 'Poland',      flag: '', position: 'FWD', goals: 3,  caps: 18  },

  // ── UKRAINE extras ──────────────────────────────────
  { id: 'ukr-gk-3',   name: 'Dmytro Riznyk',          country: 'Ukraine',     flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'ukr-def-5',  name: 'Vitaliy Mykolenko',      country: 'Ukraine',     flag: '', position: 'DEF', goals: 2,  caps: 32  },
  { id: 'ukr-def-6',  name: 'Oleksandr Karavaev',     country: 'Ukraine',     flag: '', position: 'DEF', goals: 3,  caps: 38  },
  { id: 'ukr-fwd-6',  name: 'Oleksandr Zubkov',       country: 'Ukraine',     flag: '', position: 'FWD', goals: 8,  caps: 36  },
  { id: 'ukr-fwd-7',  name: 'Andriy Yarmolenko',      country: 'Ukraine',     flag: '', position: 'FWD', goals: 44, caps: 116 },
  { id: 'ukr-fwd-8',  name: 'Ruslan Malinovskiy',     country: 'Ukraine',     flag: '', position: 'FWD', goals: 14, caps: 62  },
  { id: 'ukr-fwd-9',  name: 'Vladyslav Vanat',        country: 'Ukraine',     flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'ukr-fwd-10', name: 'Danylo Sikan',           country: 'Ukraine',     flag: '', position: 'FWD', goals: 4,  caps: 14  },
  { id: 'ukr-fwd-11', name: 'Heorhiy Sudakov',        country: 'Ukraine',     flag: '', position: 'FWD', goals: 6,  caps: 22  },

  // ── ARGENTINA extras ────────────────────────────────
  { id: 'arg-gk-3',   name: 'Walter Benítez',         country: 'Argentina',   flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'arg-def-5',  name: 'Marcos Acuña',           country: 'Argentina',   flag: '', position: 'DEF', goals: 4,  caps: 52  },
  { id: 'arg-def-6',  name: 'Juan Foyth',             country: 'Argentina',   flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'arg-fwd-6',  name: 'Alexis Mac Allister',    country: 'Argentina',   flag: '', position: 'FWD', goals: 14, caps: 42  },
  { id: 'arg-fwd-7',  name: 'Enzo Fernández',         country: 'Argentina',   flag: '', position: 'FWD', goals: 12, caps: 38  },
  { id: 'arg-fwd-8',  name: 'Paulo Dybala',           country: 'Argentina',   flag: '', position: 'FWD', goals: 34, caps: 56  },
  { id: 'arg-fwd-9',  name: 'Leandro Paredes',        country: 'Argentina',   flag: '', position: 'FWD', goals: 8,  caps: 76  },
  { id: 'arg-fwd-10', name: 'Nicolás González',       country: 'Argentina',   flag: '', position: 'FWD', goals: 8,  caps: 22  },
  { id: 'arg-fwd-11', name: 'Thiago Almada',          country: 'Argentina',   flag: '', position: 'FWD', goals: 4,  caps: 18  },

  // ── BRAZIL extras ───────────────────────────────────
  { id: 'bra-gk-3',   name: 'Weverton',               country: 'Brazil',      flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'bra-def-5',  name: 'Gabriel Magalhães',      country: 'Brazil',      flag: '', position: 'DEF', goals: 4,  caps: 26  },
  { id: 'bra-def-6',  name: 'Renan Lodi',             country: 'Brazil',      flag: '', position: 'DEF', goals: 3,  caps: 24  },
  { id: 'bra-fwd-6',  name: 'Bruno Guimarães',        country: 'Brazil',      flag: '', position: 'FWD', goals: 8,  caps: 38  },
  { id: 'bra-fwd-7',  name: 'Casemiro',               country: 'Brazil',      flag: '', position: 'FWD', goals: 7,  caps: 89  },
  { id: 'bra-fwd-8',  name: 'Neymar',                 country: 'Brazil',      flag: '', position: 'FWD', goals: 79, caps: 128 },
  { id: 'bra-fwd-9',  name: 'Gabriel Barbosa',        country: 'Brazil',      flag: '', position: 'FWD', goals: 8,  caps: 24  },
  { id: 'bra-fwd-10', name: 'Matheus Cunha',          country: 'Brazil',      flag: '', position: 'FWD', goals: 8,  caps: 20  },
  { id: 'bra-fwd-11', name: 'Antony',                 country: 'Brazil',      flag: '', position: 'FWD', goals: 6,  caps: 24  },

  // ── URUGUAY extras ──────────────────────────────────
  { id: 'uru-gk-3',   name: 'Guillermo De Amores',    country: 'Uruguay',     flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'uru-def-5',  name: 'Matías Viña',            country: 'Uruguay',     flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'uru-def-6',  name: 'Nahitan Nández',         country: 'Uruguay',     flag: '', position: 'DEF', goals: 6,  caps: 54  },
  { id: 'uru-fwd-6',  name: 'Giorgian De Arrascaeta', country: 'Uruguay',     flag: '', position: 'FWD', goals: 14, caps: 58  },
  { id: 'uru-fwd-7',  name: 'Agustín Canobbio',       country: 'Uruguay',     flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'uru-fwd-8',  name: 'Maxi Gómez',             country: 'Uruguay',     flag: '', position: 'FWD', goals: 10, caps: 36  },
  { id: 'uru-fwd-9',  name: 'Maximiliano Araújo',     country: 'Uruguay',     flag: '', position: 'FWD', goals: 4,  caps: 16  },
  { id: 'uru-fwd-10', name: 'Brian Rodríguez',        country: 'Uruguay',     flag: '', position: 'FWD', goals: 4,  caps: 28  },
  { id: 'uru-fwd-11', name: 'Gastón Pereiro',         country: 'Uruguay',     flag: '', position: 'FWD', goals: 8,  caps: 46  },

  // ── COLOMBIA extras ─────────────────────────────────
  { id: 'col-gk-3',   name: 'Álvaro Montero',         country: 'Colombia',    flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'col-def-5',  name: 'Déiver Machado',         country: 'Colombia',    flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'col-def-6',  name: 'Johan Mojica',           country: 'Colombia',    flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'col-fwd-6',  name: 'Richard Ríos',           country: 'Colombia',    flag: '', position: 'FWD', goals: 4,  caps: 20  },
  { id: 'col-fwd-7',  name: 'Cucho Hernández',        country: 'Colombia',    flag: '', position: 'FWD', goals: 8,  caps: 24  },
  { id: 'col-fwd-8',  name: 'Miguel Ángel Borja',     country: 'Colombia',    flag: '', position: 'FWD', goals: 12, caps: 36  },
  { id: 'col-fwd-9',  name: 'Matheus Uribe',          country: 'Colombia',    flag: '', position: 'FWD', goals: 6,  caps: 48  },
  { id: 'col-fwd-10', name: 'Wilmar Barrios',         country: 'Colombia',    flag: '', position: 'FWD', goals: 3,  caps: 60  },
  { id: 'col-fwd-11', name: 'Juan Cuadrado',          country: 'Colombia',    flag: '', position: 'FWD', goals: 17, caps: 110 },

  // ── ECUADOR extras ──────────────────────────────────
  { id: 'ecu-gk-3',   name: 'Eduardo Morante',        country: 'Ecuador',     flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'ecu-def-5',  name: 'Robert Arboleda',        country: 'Ecuador',     flag: '', position: 'DEF', goals: 4,  caps: 44  },
  { id: 'ecu-def-6',  name: 'Diego Palacios',         country: 'Ecuador',     flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'ecu-fwd-6',  name: 'Carlos Gruezo',          country: 'Ecuador',     flag: '', position: 'FWD', goals: 4,  caps: 44  },
  { id: 'ecu-fwd-7',  name: 'Ayrton Preciado',        country: 'Ecuador',     flag: '', position: 'FWD', goals: 4,  caps: 20  },
  { id: 'ecu-fwd-8',  name: 'Leonardo Campana',       country: 'Ecuador',     flag: '', position: 'FWD', goals: 6,  caps: 22  },
  { id: 'ecu-fwd-9',  name: 'Junior Sornoza',         country: 'Ecuador',     flag: '', position: 'FWD', goals: 5,  caps: 28  },
  { id: 'ecu-fwd-10', name: 'Djorkaeff Reasco',       country: 'Ecuador',     flag: '', position: 'FWD', goals: 3,  caps: 18  },
  { id: 'ecu-fwd-11', name: 'Alan Minda',             country: 'Ecuador',     flag: '', position: 'FWD', goals: 3,  caps: 14  },

  // ── VENEZUELA extras ────────────────────────────────
  { id: 'ven-gk-3',   name: 'Daniel Hernández',       country: 'Venezuela',   flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'ven-def-5',  name: 'Adrián Martínez',        country: 'Venezuela',   flag: '', position: 'DEF', goals: 2,  caps: 24  },
  { id: 'ven-def-6',  name: 'Jesús Bueno',            country: 'Venezuela',   flag: '', position: 'DEF', goals: 1,  caps: 16  },
  { id: 'ven-fwd-6',  name: 'Jefferson Savarino',     country: 'Venezuela',   flag: '', position: 'FWD', goals: 8,  caps: 44  },
  { id: 'ven-fwd-7',  name: 'Yeferson Soteldo',       country: 'Venezuela',   flag: '', position: 'FWD', goals: 10, caps: 38  },
  { id: 'ven-fwd-8',  name: 'Adalberto Peñaranda',    country: 'Venezuela',   flag: '', position: 'FWD', goals: 5,  caps: 28  },
  { id: 'ven-fwd-9',  name: 'Cristian Casseres Jr',   country: 'Venezuela',   flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'ven-fwd-10', name: 'Jhonder Cádiz',          country: 'Venezuela',   flag: '', position: 'FWD', goals: 6,  caps: 30  },
  { id: 'ven-fwd-11', name: 'Salomón Rondón Jr',      country: 'Venezuela',   flag: '', position: 'FWD', goals: 2,  caps: 8   },

  // ── PERU extras ─────────────────────────────────────
  { id: 'per-gk-3',   name: 'José Carvallo',          country: 'Peru',        flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'per-def-5',  name: 'Aldo Corzo',             country: 'Peru',        flag: '', position: 'DEF', goals: 2,  caps: 48  },
  { id: 'per-def-6',  name: 'Miguel Araujo',          country: 'Peru',        flag: '', position: 'DEF', goals: 2,  caps: 24  },
  { id: 'per-fwd-6',  name: 'Renato Tapia',           country: 'Peru',        flag: '', position: 'FWD', goals: 4,  caps: 68  },
  { id: 'per-fwd-7',  name: 'Christofer Gonzales',    country: 'Peru',        flag: '', position: 'FWD', goals: 5,  caps: 30  },
  { id: 'per-fwd-8',  name: 'Raúl Ruidíaz',           country: 'Peru',        flag: '', position: 'FWD', goals: 16, caps: 54  },
  { id: 'per-fwd-9',  name: 'Wilder Cartagena',       country: 'Peru',        flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'per-fwd-10', name: 'Bryan Reyna',            country: 'Peru',        flag: '', position: 'FWD', goals: 4,  caps: 20  },
  { id: 'per-fwd-11', name: 'Marcos López',           country: 'Peru',        flag: '', position: 'FWD', goals: 3,  caps: 22  },

  // ── USA extras ──────────────────────────────────────
  { id: 'usa-gk-3',   name: 'Sean Johnson',           country: 'USA',         flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'usa-def-5',  name: 'Tim Ream',               country: 'USA',         flag: '', position: 'DEF', goals: 1,  caps: 44  },
  { id: 'usa-def-6',  name: 'Aaron Long',             country: 'USA',         flag: '', position: 'DEF', goals: 2,  caps: 30  },
  { id: 'usa-fwd-6',  name: 'Tyler Adams',            country: 'USA',         flag: '', position: 'FWD', goals: 4,  caps: 42  },
  { id: 'usa-fwd-7',  name: 'Yunus Musah',            country: 'USA',         flag: '', position: 'FWD', goals: 6,  caps: 30  },
  { id: 'usa-fwd-8',  name: 'Luca de la Torre',       country: 'USA',         flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'usa-fwd-9',  name: 'Jordan Morris',          country: 'USA',         flag: '', position: 'FWD', goals: 10, caps: 52  },
  { id: 'usa-fwd-10', name: 'Josh Sargent',           country: 'USA',         flag: '', position: 'FWD', goals: 10, caps: 30  },
  { id: 'usa-fwd-11', name: 'Haji Wright',            country: 'USA',         flag: '', position: 'FWD', goals: 8,  caps: 22  },

  // ── MEXICO extras ───────────────────────────────────
  { id: 'mex-gk-3',   name: 'Rodolfo Cota',           country: 'Mexico',      flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'mex-def-5',  name: 'Nestor Araujo',          country: 'Mexico',      flag: '', position: 'DEF', goals: 3,  caps: 58  },
  { id: 'mex-def-6',  name: 'Carlos Salcedo',         country: 'Mexico',      flag: '', position: 'DEF', goals: 2,  caps: 32  },
  { id: 'mex-fwd-6',  name: 'Edson Álvarez',          country: 'Mexico',      flag: '', position: 'FWD', goals: 10, caps: 52  },
  { id: 'mex-fwd-7',  name: 'Carlos Rodríguez',       country: 'Mexico',      flag: '', position: 'FWD', goals: 5,  caps: 34  },
  { id: 'mex-fwd-8',  name: 'Uriel Antuna',           country: 'Mexico',      flag: '', position: 'FWD', goals: 6,  caps: 32  },
  { id: 'mex-fwd-9',  name: 'Rogelio Funes Mori',     country: 'Mexico',      flag: '', position: 'FWD', goals: 16, caps: 40  },
  { id: 'mex-fwd-10', name: 'Roberto Alvarado',       country: 'Mexico',      flag: '', position: 'FWD', goals: 6,  caps: 28  },
  { id: 'mex-fwd-11', name: 'Alan Pulido',            country: 'Mexico',      flag: '', position: 'FWD', goals: 8,  caps: 32  },

  // ── CANADA extras ───────────────────────────────────
  { id: 'can-gk-3',   name: 'Dayne St. Clair',        country: 'Canada',      flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'can-def-5',  name: 'Richie Laryea',          country: 'Canada',      flag: '', position: 'DEF', goals: 3,  caps: 34  },
  { id: 'can-def-6',  name: 'Derek Cornelius',        country: 'Canada',      flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'can-fwd-6',  name: 'Ismaël Koné',            country: 'Canada',      flag: '', position: 'FWD', goals: 4,  caps: 16  },
  { id: 'can-fwd-7',  name: 'Junior Hoilett',         country: 'Canada',      flag: '', position: 'FWD', goals: 10, caps: 60  },
  { id: 'can-fwd-8',  name: 'Liam Millar',            country: 'Canada',      flag: '', position: 'FWD', goals: 5,  caps: 24  },
  { id: 'can-fwd-9',  name: 'Mark-Anthony Kaye',      country: 'Canada',      flag: '', position: 'FWD', goals: 5,  caps: 38  },
  { id: 'can-fwd-10', name: 'Lucas Cavallini',        country: 'Canada',      flag: '', position: 'FWD', goals: 8,  caps: 44  },
  { id: 'can-fwd-11', name: 'Jacen Russell-Rowe',     country: 'Canada',      flag: '', position: 'FWD', goals: 3,  caps: 12  },

  // ── PANAMA extras ───────────────────────────────────
  { id: 'pan-gk-3',   name: 'Anthony Nimo',           country: 'Panama',      flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'pan-def-5',  name: 'Michael Amir Murillo',   country: 'Panama',      flag: '', position: 'DEF', goals: 2,  caps: 52  },
  { id: 'pan-def-6',  name: 'Andrés Andrade',         country: 'Panama',      flag: '', position: 'DEF', goals: 3,  caps: 36  },
  { id: 'pan-fwd-6',  name: 'Anibal Godoy',           country: 'Panama',      flag: '', position: 'FWD', goals: 6,  caps: 88  },
  { id: 'pan-fwd-7',  name: 'Gabriel Torres',         country: 'Panama',      flag: '', position: 'FWD', goals: 20, caps: 92  },
  { id: 'pan-fwd-8',  name: 'José Fajardo',           country: 'Panama',      flag: '', position: 'FWD', goals: 8,  caps: 42  },
  { id: 'pan-fwd-9',  name: 'César Yanis',            country: 'Panama',      flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'pan-fwd-10', name: 'Azmahar Ariano',         country: 'Panama',      flag: '', position: 'FWD', goals: 3,  caps: 18  },
  { id: 'pan-fwd-11', name: 'Jordán Mena',            country: 'Panama',      flag: '', position: 'FWD', goals: 5,  caps: 28  },

  // ── COSTA RICA extras ───────────────────────────────
  { id: 'cri-gk-3',   name: 'Aarón Cruz',             country: 'Costa Rica',  flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'cri-def-5',  name: 'Christian Gamboa',       country: 'Costa Rica',  flag: '', position: 'DEF', goals: 2,  caps: 68  },
  { id: 'cri-def-6',  name: 'Carlos Martínez',        country: 'Costa Rica',  flag: '', position: 'DEF', goals: 1,  caps: 28  },
  { id: 'cri-fwd-6',  name: 'Yeltsin Tejeda',         country: 'Costa Rica',  flag: '', position: 'FWD', goals: 5,  caps: 58  },
  { id: 'cri-fwd-7',  name: 'Rándall Leal',           country: 'Costa Rica',  flag: '', position: 'FWD', goals: 4,  caps: 24  },
  { id: 'cri-fwd-8',  name: 'Johan Venegas',          country: 'Costa Rica',  flag: '', position: 'FWD', goals: 6,  caps: 48  },
  { id: 'cri-fwd-9',  name: 'Alonso Martínez',        country: 'Costa Rica',  flag: '', position: 'FWD', goals: 7,  caps: 30  },
  { id: 'cri-fwd-10', name: 'Álvaro Zamora',          country: 'Costa Rica',  flag: '', position: 'FWD', goals: 2,  caps: 18  },
  { id: 'cri-fwd-11', name: 'Andy Ruiz',              country: 'Costa Rica',  flag: '', position: 'FWD', goals: 3,  caps: 16  },

  // ── HONDURAS extras ─────────────────────────────────
  { id: 'hon-gk-3',   name: 'Edrick Menjívar',        country: 'Honduras',    flag: '', position: 'GK',  goals: 0,  caps: 18  },
  { id: 'hon-def-5',  name: 'Johnny Palacios',        country: 'Honduras',    flag: '', position: 'DEF', goals: 2,  caps: 44  },
  { id: 'hon-def-6',  name: 'Maynor Figueroa',        country: 'Honduras',    flag: '', position: 'DEF', goals: 4,  caps: 113 },
  { id: 'hon-fwd-6',  name: 'Eddie Hernández',        country: 'Honduras',    flag: '', position: 'FWD', goals: 5,  caps: 28  },
  { id: 'hon-fwd-7',  name: 'Luis Garrido',           country: 'Honduras',    flag: '', position: 'FWD', goals: 4,  caps: 38  },
  { id: 'hon-fwd-8',  name: 'Jorge Benguché',         country: 'Honduras',    flag: '', position: 'FWD', goals: 5,  caps: 32  },
  { id: 'hon-fwd-9',  name: 'Rigoberto Rivas',        country: 'Honduras',    flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'hon-fwd-10', name: 'Bryan Acosta',           country: 'Honduras',    flag: '', position: 'FWD', goals: 8,  caps: 62  },
  { id: 'hon-fwd-11', name: 'Elvin Casildo',          country: 'Honduras',    flag: '', position: 'FWD', goals: 3,  caps: 14  },

  // ── MOROCCO extras ──────────────────────────────────
  { id: 'mar-gk-3',   name: 'Munir El Kajoui',        country: 'Morocco',     flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'mar-def-5',  name: 'Badr Benoun',            country: 'Morocco',     flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'mar-def-6',  name: 'Yahya Attiyat Allah',    country: 'Morocco',     flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'mar-fwd-6',  name: 'Sofyan Amrabat',         country: 'Morocco',     flag: '', position: 'FWD', goals: 6,  caps: 48  },
  { id: 'mar-fwd-7',  name: 'Amine Harit',            country: 'Morocco',     flag: '', position: 'FWD', goals: 8,  caps: 30  },
  { id: 'mar-fwd-8',  name: 'Tarik Tissoudali',       country: 'Morocco',     flag: '', position: 'FWD', goals: 5,  caps: 16  },
  { id: 'mar-fwd-9',  name: 'Abde Ezzalzouli',        country: 'Morocco',     flag: '', position: 'FWD', goals: 4,  caps: 14  },
  { id: 'mar-fwd-10', name: 'Zakaria Aboukhlal',      country: 'Morocco',     flag: '', position: 'FWD', goals: 5,  caps: 18  },
  { id: 'mar-fwd-11', name: 'Ilias Chair',            country: 'Morocco',     flag: '', position: 'FWD', goals: 4,  caps: 16  },

  // ── SENEGAL extras ──────────────────────────────────
  { id: 'sen-gk-3',   name: 'Seny Dieng',             country: 'Senegal',     flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'sen-def-5',  name: 'Formose Mendy',          country: 'Senegal',     flag: '', position: 'DEF', goals: 1,  caps: 16  },
  { id: 'sen-def-6',  name: 'Moussa Niakhaté',        country: 'Senegal',     flag: '', position: 'DEF', goals: 2,  caps: 24  },
  { id: 'sen-fwd-6',  name: 'Iliman Ndiaye',          country: 'Senegal',     flag: '', position: 'FWD', goals: 7,  caps: 20  },
  { id: 'sen-fwd-7',  name: 'Lamine Camara',          country: 'Senegal',     flag: '', position: 'FWD', goals: 4,  caps: 14  },
  { id: 'sen-fwd-8',  name: 'Habib Diallo',           country: 'Senegal',     flag: '', position: 'FWD', goals: 8,  caps: 30  },
  { id: 'sen-fwd-9',  name: 'Krepin Diatta',          country: 'Senegal',     flag: '', position: 'FWD', goals: 5,  caps: 26  },
  { id: 'sen-fwd-10', name: 'Pathé Ciss',             country: 'Senegal',     flag: '', position: 'FWD', goals: 3,  caps: 28  },
  { id: 'sen-fwd-11', name: 'Mamadou Loum',           country: 'Senegal',     flag: '', position: 'FWD', goals: 2,  caps: 24  },

  // ── EGYPT extras ────────────────────────────────────
  { id: 'egy-gk-3',   name: 'Mohamed El-Shenawy',     country: 'Egypt',       flag: '', position: 'GK',  goals: 0,  caps: 24  },
  { id: 'egy-def-5',  name: 'Momen Zakaria',          country: 'Egypt',       flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'egy-def-6',  name: 'Bassem Morsy',           country: 'Egypt',       flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'egy-fwd-6',  name: 'Tarek Hamed',            country: 'Egypt',       flag: '', position: 'FWD', goals: 3,  caps: 44  },
  { id: 'egy-fwd-7',  name: 'Amr Warda',              country: 'Egypt',       flag: '', position: 'FWD', goals: 5,  caps: 36  },
  { id: 'egy-fwd-8',  name: 'Marwan Hamdy',           country: 'Egypt',       flag: '', position: 'FWD', goals: 5,  caps: 18  },
  { id: 'egy-fwd-9',  name: 'Emam Ashour',            country: 'Egypt',       flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'egy-fwd-10', name: 'Mahmoud Kahraba',        country: 'Egypt',       flag: '', position: 'FWD', goals: 6,  caps: 48  },
  { id: 'egy-fwd-11', name: 'Ahmed Abdelkader',       country: 'Egypt',       flag: '', position: 'FWD', goals: 4,  caps: 16  },

  // ── SOUTH AFRICA extras ─────────────────────────────
  { id: 'rsa-gk-3',   name: 'Darren Keet',            country: 'South Africa',flag: '', position: 'GK',  goals: 0,  caps: 22  },
  { id: 'rsa-def-5',  name: 'Reeve Frosler',          country: 'South Africa',flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'rsa-def-6',  name: 'Sifiso Hlanti',          country: 'South Africa',flag: '', position: 'DEF', goals: 2,  caps: 26  },
  { id: 'rsa-fwd-6',  name: 'Yusuf Maart',            country: 'South Africa',flag: '', position: 'FWD', goals: 3,  caps: 18  },
  { id: 'rsa-fwd-7',  name: 'Mothobi Mvala',          country: 'South Africa',flag: '', position: 'FWD', goals: 4,  caps: 32  },
  { id: 'rsa-fwd-8',  name: 'Keagan Dolly',           country: 'South Africa',flag: '', position: 'FWD', goals: 6,  caps: 38  },
  { id: 'rsa-fwd-9',  name: 'Kermit Erasmus',         country: 'South Africa',flag: '', position: 'FWD', goals: 8,  caps: 42  },
  { id: 'rsa-fwd-10', name: 'Kobamelo Kodisang',      country: 'South Africa',flag: '', position: 'FWD', goals: 2,  caps: 12  },
  { id: 'rsa-fwd-11', name: 'Bongokuhle Hlongwane',   country: 'South Africa',flag: '', position: 'FWD', goals: 4,  caps: 22  },

  // ── IVORY COAST extras ──────────────────────────────
  { id: 'civ-gk-3',   name: 'Sylvain Gbohouo',        country: 'Ivory Coast', flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'civ-def-5',  name: 'Wilfried Kanon',         country: 'Ivory Coast', flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'civ-def-6',  name: 'Hamidou Traoré',         country: 'Ivory Coast', flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'civ-fwd-6',  name: 'Wilfried Zaha',          country: 'Ivory Coast', flag: '', position: 'FWD', goals: 14, caps: 32  },
  { id: 'civ-fwd-7',  name: 'Emmanuel Gradel',        country: 'Ivory Coast', flag: '', position: 'FWD', goals: 14, caps: 72  },
  { id: 'civ-fwd-8',  name: 'Christian Kouamé',       country: 'Ivory Coast', flag: '', position: 'FWD', goals: 6,  caps: 22  },
  { id: 'civ-fwd-9',  name: 'Wilfried Bony',          country: 'Ivory Coast', flag: '', position: 'FWD', goals: 14, caps: 68  },
  { id: 'civ-fwd-10', name: 'Stéphane Traoré',        country: 'Ivory Coast', flag: '', position: 'FWD', goals: 5,  caps: 28  },
  { id: 'civ-fwd-11', name: 'Kwame Poku',             country: 'Ivory Coast', flag: '', position: 'FWD', goals: 2,  caps: 10  },

  // ── NIGERIA extras ──────────────────────────────────
  { id: 'nga-gk-3',   name: 'Ikechukwu Ezenwa',       country: 'Nigeria',     flag: '', position: 'GK',  goals: 0,  caps: 30  },
  { id: 'nga-def-5',  name: 'Semi Ajayi',             country: 'Nigeria',     flag: '', position: 'DEF', goals: 3,  caps: 36  },
  { id: 'nga-def-6',  name: 'Ola Aina',               country: 'Nigeria',     flag: '', position: 'DEF', goals: 4,  caps: 44  },
  { id: 'nga-fwd-6',  name: 'Wilfred Ndidi',          country: 'Nigeria',     flag: '', position: 'FWD', goals: 7,  caps: 58  },
  { id: 'nga-fwd-7',  name: 'Frank Onyeka',           country: 'Nigeria',     flag: '', position: 'FWD', goals: 4,  caps: 28  },
  { id: 'nga-fwd-8',  name: 'Emmanuel Dennis',        country: 'Nigeria',     flag: '', position: 'FWD', goals: 8,  caps: 30  },
  { id: 'nga-fwd-9',  name: 'Taiwo Awoniyi',          country: 'Nigeria',     flag: '', position: 'FWD', goals: 6,  caps: 22  },
  { id: 'nga-fwd-10', name: 'Sadiq Umar',             country: 'Nigeria',     flag: '', position: 'FWD', goals: 8,  caps: 24  },
  { id: 'nga-fwd-11', name: 'Paul Onuachu',           country: 'Nigeria',     flag: '', position: 'FWD', goals: 8,  caps: 20  },

  // ── CAMEROON extras ─────────────────────────────────
  { id: 'cmr-gk-3',   name: 'Simon Omossola',         country: 'Cameroon',    flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'cmr-def-5',  name: 'Ambroise Oyongo',        country: 'Cameroon',    flag: '', position: 'DEF', goals: 3,  caps: 48  },
  { id: 'cmr-def-6',  name: 'Harold Moukoudi',        country: 'Cameroon',    flag: '', position: 'DEF', goals: 2,  caps: 22  },
  { id: 'cmr-fwd-6',  name: 'Martin Hongla',          country: 'Cameroon',    flag: '', position: 'FWD', goals: 3,  caps: 24  },
  { id: 'cmr-fwd-7',  name: 'Stéphane Bahoken',       country: 'Cameroon',    flag: '', position: 'FWD', goals: 5,  caps: 28  },
  { id: 'cmr-fwd-8',  name: 'Samuel Gouet',           country: 'Cameroon',    flag: '', position: 'FWD', goals: 2,  caps: 20  },
  { id: 'cmr-fwd-9',  name: 'Gaël Ondoua',            country: 'Cameroon',    flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'cmr-fwd-10', name: 'Georges-Kévin Nkoudou',  country: 'Cameroon',    flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'cmr-fwd-11', name: 'Clinton Njie',           country: 'Cameroon',    flag: '', position: 'FWD', goals: 6,  caps: 42  },

  // ── ALGERIA extras ──────────────────────────────────
  { id: 'dza-gk-3',   name: 'Mustapha Zeghba',        country: 'Algeria',     flag: '', position: 'GK',  goals: 0,  caps: 8   },
  { id: 'dza-def-5',  name: 'Lyès Mousset',           country: 'Algeria',     flag: '', position: 'DEF', goals: 1,  caps: 14  },
  { id: 'dza-def-6',  name: 'Mehdi Tahrat',           country: 'Algeria',     flag: '', position: 'DEF', goals: 2,  caps: 18  },
  { id: 'dza-fwd-6',  name: 'Sofiane Feghouli',       country: 'Algeria',     flag: '', position: 'FWD', goals: 14, caps: 78  },
  { id: 'dza-fwd-7',  name: 'Yacine Brahimi',         country: 'Algeria',     flag: '', position: 'FWD', goals: 18, caps: 62  },
  { id: 'dza-fwd-8',  name: 'Baghdad Bounedjah',      country: 'Algeria',     flag: '', position: 'FWD', goals: 14, caps: 42  },
  { id: 'dza-fwd-9',  name: 'Adam Ounas',             country: 'Algeria',     flag: '', position: 'FWD', goals: 8,  caps: 28  },
  { id: 'dza-fwd-10', name: 'Billel Omrani',          country: 'Algeria',     flag: '', position: 'FWD', goals: 8,  caps: 32  },
  { id: 'dza-fwd-11', name: 'Nassim Benrahou',        country: 'Algeria',     flag: '', position: 'FWD', goals: 3,  caps: 12  },

  // ── TUNISIA extras ──────────────────────────────────
  { id: 'tun-gk-3',   name: 'Moez Ben Cherifia',      country: 'Tunisia',     flag: '', position: 'GK',  goals: 0,  caps: 14  },
  { id: 'tun-def-5',  name: 'Ali Abdi',               country: 'Tunisia',     flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'tun-def-6',  name: 'Bilel Ifa',              country: 'Tunisia',     flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'tun-fwd-6',  name: 'Wahbi Khazri',           country: 'Tunisia',     flag: '', position: 'FWD', goals: 24, caps: 76  },
  { id: 'tun-fwd-7',  name: 'Ferjani Sassi',          country: 'Tunisia',     flag: '', position: 'FWD', goals: 8,  caps: 72  },
  { id: 'tun-fwd-8',  name: 'Naïm Sliti',             country: 'Tunisia',     flag: '', position: 'FWD', goals: 8,  caps: 38  },
  { id: 'tun-fwd-9',  name: 'Taha Yassine Khenissi',  country: 'Tunisia',     flag: '', position: 'FWD', goals: 8,  caps: 38  },
  { id: 'tun-fwd-10', name: 'Fakhreddine Ben Youssef',country: 'Tunisia',     flag: '', position: 'FWD', goals: 5,  caps: 32  },
  { id: 'tun-fwd-11', name: 'Mohamed Ali Ben Romdhane',country: 'Tunisia',    flag: '', position: 'FWD', goals: 4,  caps: 18  },

  // ── JAPAN extras ────────────────────────────────────
  { id: 'jpn-gk-3',   name: 'Zion Suzuki',            country: 'Japan',       flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'jpn-def-5',  name: 'Yuto Nagatomo',          country: 'Japan',       flag: '', position: 'DEF', goals: 6,  caps: 118 },
  { id: 'jpn-def-6',  name: 'Miki Yamane',            country: 'Japan',       flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'jpn-fwd-6',  name: 'Wataru Endo',            country: 'Japan',       flag: '', position: 'FWD', goals: 4,  caps: 50  },
  { id: 'jpn-fwd-7',  name: 'Takefusa Kubo',          country: 'Japan',       flag: '', position: 'FWD', goals: 10, caps: 32  },
  { id: 'jpn-fwd-8',  name: 'Takuma Asano',           country: 'Japan',       flag: '', position: 'FWD', goals: 10, caps: 42  },
  { id: 'jpn-fwd-9',  name: 'Yuya Osako',             country: 'Japan',       flag: '', position: 'FWD', goals: 12, caps: 68  },
  { id: 'jpn-fwd-10', name: 'Sho Ito',                country: 'Japan',       flag: '', position: 'FWD', goals: 6,  caps: 22  },
  { id: 'jpn-fwd-11', name: 'Hidemasa Morita',        country: 'Japan',       flag: '', position: 'FWD', goals: 4,  caps: 32  },

  // ── SOUTH KOREA extras ──────────────────────────────
  { id: 'kor-gk-3',   name: 'Kim Jun-hong',           country: 'South Korea', flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'kor-def-5',  name: 'Kim Jin-su',             country: 'South Korea', flag: '', position: 'DEF', goals: 2,  caps: 62  },
  { id: 'kor-def-6',  name: 'Kim Tae-hwan',           country: 'South Korea', flag: '', position: 'DEF', goals: 1,  caps: 24  },
  { id: 'kor-fwd-6',  name: 'Hwang In-beom',          country: 'South Korea', flag: '', position: 'FWD', goals: 6,  caps: 56  },
  { id: 'kor-fwd-7',  name: 'Jung Woo-young',         country: 'South Korea', flag: '', position: 'FWD', goals: 5,  caps: 90  },
  { id: 'kor-fwd-8',  name: 'Kwon Chang-hoon',        country: 'South Korea', flag: '', position: 'FWD', goals: 12, caps: 68  },
  { id: 'kor-fwd-9',  name: 'Bae Jun-ho',             country: 'South Korea', flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'kor-fwd-10', name: 'Oh Se-hun',              country: 'South Korea', flag: '', position: 'FWD', goals: 6,  caps: 22  },
  { id: 'kor-fwd-11', name: 'Seol Young-woo',         country: 'South Korea', flag: '', position: 'FWD', goals: 3,  caps: 14  },

  // ── SAUDI ARABIA extras ─────────────────────────────
  { id: 'ksa-gk-3',   name: 'Fawaz Al-Qarni',         country: 'Saudi Arabia',flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'ksa-def-5',  name: 'Mohammed Al-Burayk',     country: 'Saudi Arabia',flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'ksa-def-6',  name: 'Sultan Al-Ghannam',      country: 'Saudi Arabia',flag: '', position: 'DEF', goals: 1,  caps: 22  },
  { id: 'ksa-fwd-6',  name: 'Saleh Al-Shehri',        country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 10, caps: 48  },
  { id: 'ksa-fwd-7',  name: 'Fahad Al-Muwallad',      country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 14, caps: 66  },
  { id: 'ksa-fwd-8',  name: 'Nasser Al-Dawsari',      country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 6,  caps: 44  },
  { id: 'ksa-fwd-9',  name: 'Ali Al-Hassan',          country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 5,  caps: 36  },
  { id: 'ksa-fwd-10', name: 'Riyadh Sharahili',       country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 4,  caps: 30  },
  { id: 'ksa-fwd-11', name: 'Abdullah Madu',          country: 'Saudi Arabia',flag: '', position: 'FWD', goals: 3,  caps: 22  },

  // ── IRAN extras ─────────────────────────────────────
  { id: 'irn-gk-3',   name: 'Payam Niazmand',         country: 'Iran',        flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'irn-def-5',  name: 'Morteza Pouraliganji',   country: 'Iran',        flag: '', position: 'DEF', goals: 4,  caps: 60  },
  { id: 'irn-def-6',  name: 'Sadegh Moharrami',       country: 'Iran',        flag: '', position: 'DEF', goals: 2,  caps: 28  },
  { id: 'irn-fwd-6',  name: 'Alireza Jahanbakhsh',    country: 'Iran',        flag: '', position: 'FWD', goals: 20, caps: 98  },
  { id: 'irn-fwd-7',  name: 'Ahmad Nourollahi',       country: 'Iran',        flag: '', position: 'FWD', goals: 6,  caps: 48  },
  { id: 'irn-fwd-8',  name: 'Saeid Ezatolahi',        country: 'Iran',        flag: '', position: 'FWD', goals: 5,  caps: 56  },
  { id: 'irn-fwd-9',  name: 'Allahyar Sayyadmanesh',  country: 'Iran',        flag: '', position: 'FWD', goals: 5,  caps: 22  },
  { id: 'irn-fwd-10', name: 'Mehdi Ghayedi',          country: 'Iran',        flag: '', position: 'FWD', goals: 5,  caps: 24  },
  { id: 'irn-fwd-11', name: 'Karim Ansarifard',       country: 'Iran',        flag: '', position: 'FWD', goals: 28, caps: 90  },

  // ── AUSTRALIA extras ────────────────────────────────
  { id: 'aus-gk-3',   name: 'Tom Glover',             country: 'Australia',   flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'aus-def-5',  name: 'Aziz Behich',            country: 'Australia',   flag: '', position: 'DEF', goals: 2,  caps: 48  },
  { id: 'aus-def-6',  name: 'Rhyan Grant',            country: 'Australia',   flag: '', position: 'DEF', goals: 1,  caps: 20  },
  { id: 'aus-fwd-6',  name: 'Jackson Irvine',         country: 'Australia',   flag: '', position: 'FWD', goals: 8,  caps: 68  },
  { id: 'aus-fwd-7',  name: 'Aaron Mooy',             country: 'Australia',   flag: '', position: 'FWD', goals: 12, caps: 78  },
  { id: 'aus-fwd-8',  name: 'Riley McGree',           country: 'Australia',   flag: '', position: 'FWD', goals: 8,  caps: 36  },
  { id: 'aus-fwd-9',  name: 'Adam Taggart',           country: 'Australia',   flag: '', position: 'FWD', goals: 8,  caps: 22  },
  { id: 'aus-fwd-10', name: 'Brandon Borrello',       country: 'Australia',   flag: '', position: 'FWD', goals: 5,  caps: 26  },
  { id: 'aus-fwd-11', name: 'Denis Genreau',          country: 'Australia',   flag: '', position: 'FWD', goals: 2,  caps: 14  },

  // ── NEW ZEALAND extras ──────────────────────────────
  { id: 'nzl-gk-3',   name: 'Jake Gleeson',           country: 'New Zealand', flag: '', position: 'GK',  goals: 0,  caps: 28  },
  { id: 'nzl-def-5',  name: 'Tommy Smith',            country: 'New Zealand', flag: '', position: 'DEF', goals: 2,  caps: 38  },
  { id: 'nzl-def-6',  name: 'Tim Payne',              country: 'New Zealand', flag: '', position: 'DEF', goals: 1,  caps: 18  },
  { id: 'nzl-fwd-6',  name: 'Marco Rojas',            country: 'New Zealand', flag: '', position: 'FWD', goals: 10, caps: 76  },
  { id: 'nzl-fwd-7',  name: 'Kosta Barbarouses',      country: 'New Zealand', flag: '', position: 'FWD', goals: 12, caps: 78  },
  { id: 'nzl-fwd-8',  name: 'Ryan Thomas',            country: 'New Zealand', flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'nzl-fwd-9',  name: 'Joe Bell',               country: 'New Zealand', flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'nzl-fwd-10', name: 'Matt Ridenton',          country: 'New Zealand', flag: '', position: 'FWD', goals: 2,  caps: 20  },
  { id: 'nzl-fwd-11', name: 'Bill Tuilagi',           country: 'New Zealand', flag: '', position: 'FWD', goals: 2,  caps: 14  },

  // ── IRAQ extras ─────────────────────────────────────
  { id: 'irq-gk-3',   name: 'Saad Natiq',             country: 'Iraq',        flag: '', position: 'GK',  goals: 0,  caps: 12  },
  { id: 'irq-def-5',  name: 'Ahmed Ibrahim',          country: 'Iraq',        flag: '', position: 'DEF', goals: 1,  caps: 24  },
  { id: 'irq-def-6',  name: 'Salar Shakir',           country: 'Iraq',        flag: '', position: 'DEF', goals: 2,  caps: 18  },
  { id: 'irq-fwd-6',  name: 'Safaa Hadi',             country: 'Iraq',        flag: '', position: 'FWD', goals: 5,  caps: 38  },
  { id: 'irq-fwd-7',  name: 'Humam Tariq',            country: 'Iraq',        flag: '', position: 'FWD', goals: 3,  caps: 20  },
  { id: 'irq-fwd-8',  name: 'Ali Faez',               country: 'Iraq',        flag: '', position: 'FWD', goals: 4,  caps: 22  },
  { id: 'irq-fwd-9',  name: 'Osama Rashid',           country: 'Iraq',        flag: '', position: 'FWD', goals: 5,  caps: 24  },
  { id: 'irq-fwd-10', name: 'Alaa Abbas',             country: 'Iraq',        flag: '', position: 'FWD', goals: 3,  caps: 18  },
  { id: 'irq-fwd-11', name: 'Amjed Khalil',           country: 'Iraq',        flag: '', position: 'FWD', goals: 2,  caps: 14  },

  // ── QATAR extras ────────────────────────────────────
  { id: 'qat-gk-3',   name: 'Saad Al-Sheeb',          country: 'Qatar',       flag: '', position: 'GK',  goals: 0,  caps: 42  },
  { id: 'qat-def-5',  name: 'Bassam Al-Rawi',         country: 'Qatar',       flag: '', position: 'DEF', goals: 2,  caps: 36  },
  { id: 'qat-def-6',  name: 'Ismaeel Mohammad',       country: 'Qatar',       flag: '', position: 'DEF', goals: 1,  caps: 20  },
  { id: 'qat-fwd-6',  name: 'Mohammed Muntari',       country: 'Qatar',       flag: '', position: 'FWD', goals: 6,  caps: 24  },
  { id: 'qat-fwd-7',  name: 'Boualem Khoukhi',        country: 'Qatar',       flag: '', position: 'FWD', goals: 4,  caps: 52  },
  { id: 'qat-fwd-8',  name: 'Ismail Mohamad',         country: 'Qatar',       flag: '', position: 'FWD', goals: 2,  caps: 16  },
  { id: 'qat-fwd-9',  name: 'Ahmad Al-Rawi',          country: 'Qatar',       flag: '', position: 'FWD', goals: 3,  caps: 22  },
  { id: 'qat-fwd-10', name: 'Khalid Muneer',          country: 'Qatar',       flag: '', position: 'FWD', goals: 2,  caps: 18  },
  { id: 'qat-fwd-11', name: 'Mohammed Waad',          country: 'Qatar',       flag: '', position: 'FWD', goals: 2,  caps: 14  },

  // ── UZBEKISTAN extras ───────────────────────────────
  { id: 'uzb-gk-3',   name: 'Sanjar Kuvvatov',        country: 'Uzbekistan',  flag: '', position: 'GK',  goals: 0,  caps: 10  },
  { id: 'uzb-def-5',  name: 'Islom Tukhtahujaev',     country: 'Uzbekistan',  flag: '', position: 'DEF', goals: 1,  caps: 16  },
  { id: 'uzb-def-6',  name: 'Farrukh Tashkentov',     country: 'Uzbekistan',  flag: '', position: 'DEF', goals: 1,  caps: 12  },
  { id: 'uzb-fwd-6',  name: 'Bobur Abdixoliqov',      country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 5,  caps: 20  },
  { id: 'uzb-fwd-7',  name: 'Islombek Kobilov',       country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 4,  caps: 18  },
  { id: 'uzb-fwd-8',  name: 'Otabek Fattoyev',        country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 3,  caps: 14  },
  { id: 'uzb-fwd-9',  name: 'Mukhammadkodir Hamrobekov', country: 'Uzbekistan', flag: '', position: 'FWD', goals: 3, caps: 16 },
  { id: 'uzb-fwd-10', name: 'Bekhruz Tursunov',       country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 2,  caps: 12  },
  { id: 'uzb-fwd-11', name: 'Behruz Abdullayev',      country: 'Uzbekistan',  flag: '', position: 'FWD', goals: 2,  caps: 10  },

]

export default players
