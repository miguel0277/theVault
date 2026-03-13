import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding The Vault...");

  await prisma.record.deleteMany();

  await prisma.record.createMany({
    data: [
      {
        title: "Kind of Blue",
        artist: "Miles Davis",
        year: 1959,
        label: "Columbia Records",
        catalogNumber: "CL 1355",
        genre: ["Jazz", "Modal Jazz"],
        condition: "VG+",
        sideATracks: [
          { position: "A1", title: "So What", duration: "9:22" },
          { position: "A2", title: "Freddie Freeloader", duration: "9:46" },
          { position: "A3", title: "Blue in Green", duration: "5:37" },
        ],
        sideBTracks: [
          { position: "B1", title: "All Blues", duration: "11:33" },
          { position: "B2", title: "Flamenco Sketches", duration: "9:26" },
        ],
        producer: "Teo Macero",
        studios: ["Columbia 30th Street Studio, New York"],
        country: "United States",
        pressingInfo: "Original mono pressing, 6-eye Columbia label",
        funFacts: [
          "Kind of Blue is the best-selling jazz album of all time, with over 5 million copies sold in the US alone.",
          "The entire album was recorded in just two sessions — March 2 and April 22, 1959. Most tracks were first takes.",
          "Miles Davis gave his musicians sketches of scales and melody lines just hours before recording, wanting spontaneous, unrehearsed performances.",
          "The original pressing of Side A ran slightly fast due to a studio error, making the tracks play about a quarter-tone sharp. This wasn't corrected until the 1992 CD reissue.",
        ],
        credits: [
          { name: "Miles Davis", role: "Trumpet" },
          { name: "John Coltrane", role: "Tenor Saxophone" },
          { name: "Cannonball Adderley", role: "Alto Saxophone" },
          { name: "Bill Evans", role: "Piano" },
          { name: "Wynton Kelly", role: "Piano (Freddie Freeloader)" },
          { name: "Paul Chambers", role: "Double Bass" },
          { name: "Jimmy Cobb", role: "Drums" },
        ],
        similarAlbums: [
          "John Coltrane - A Love Supreme",
          "Bill Evans Trio - Waltz for Debby",
          "Thelonious Monk - Brilliant Corners",
        ],
        userNotes: "Found at a flea market in Brooklyn. Slight surface noise but plays beautifully.",
      },
      {
        title: "Rumours",
        artist: "Fleetwood Mac",
        year: 1977,
        label: "Warner Bros. Records",
        catalogNumber: "BSK 3010",
        genre: ["Rock", "Pop", "Soft Rock"],
        condition: "NM",
        sideATracks: [
          { position: "A1", title: "Second Hand News", duration: "2:56" },
          { position: "A2", title: "Dreams", duration: "4:14" },
          { position: "A3", title: "Never Going Back Again", duration: "2:14" },
          { position: "A4", title: "Don't Stop", duration: "3:13" },
          { position: "A5", title: "Go Your Own Way", duration: "3:38" },
          { position: "A6", title: "Songbird", duration: "3:20" },
        ],
        sideBTracks: [
          { position: "B1", title: "The Chain", duration: "4:30" },
          { position: "B2", title: "You Make Loving Fun", duration: "3:31" },
          { position: "B3", title: "I Don't Want to Know", duration: "3:15" },
          { position: "B4", title: "Oh Daddy", duration: "3:56" },
          { position: "B5", title: "Gold Dust Woman", duration: "4:56" },
        ],
        producer: "Fleetwood Mac, Ken Caillat, Richard Dashut",
        studios: [
          "Record Plant, Sausalito, California",
          "Criteria Studios, Miami",
          "Wally Heider Studios, Los Angeles",
        ],
        country: "United States",
        pressingInfo: "First pressing, textured gatefold sleeve",
        funFacts: [
          "Rumours was recorded while two couples in the band were breaking up — Lindsey Buckingham and Stevie Nicks, and John and Christine McVie.",
          "The album has sold over 40 million copies worldwide, making it one of the best-selling albums in history.",
          "Stevie Nicks wrote 'Dreams' in just ten minutes while sitting in a studio with a Fender Rhodes piano.",
          "'The Chain' is the only song on the album credited to all five band members.",
          "The album's recording sessions were fueled by legendary excess — the band's studio expenses included substantial quantities of cocaine, listed in the budget.",
        ],
        credits: [
          { name: "Lindsey Buckingham", role: "Guitar, Vocals" },
          { name: "Stevie Nicks", role: "Vocals" },
          { name: "Christine McVie", role: "Keyboards, Vocals" },
          { name: "John McVie", role: "Bass" },
          { name: "Mick Fleetwood", role: "Drums, Percussion" },
        ],
        similarAlbums: [
          "Eagles - Hotel California",
          "Tom Petty - Damn the Torpedoes",
          "Stevie Nicks - Bella Donna",
        ],
        userNotes: "Inherited from my dad's collection. Perfect condition, barely played.",
      },
      {
        title: "The Miseducation of Lauryn Hill",
        artist: "Lauryn Hill",
        year: 1998,
        label: "Ruffhouse Records / Columbia",
        catalogNumber: "C2 69035",
        genre: ["Hip-Hop", "R&B", "Soul", "Reggae"],
        condition: "VG",
        sideATracks: [
          { position: "A1", title: "Intro", duration: "0:47" },
          { position: "A2", title: "Lost Ones", duration: "5:34" },
          { position: "A3", title: "Ex-Factor", duration: "6:03" },
          { position: "A4", title: "To Zion", duration: "6:09" },
        ],
        sideBTracks: [
          { position: "B1", title: "Doo Wop (That Thing)", duration: "5:20" },
          { position: "B2", title: "Superstar", duration: "4:56" },
          { position: "B3", title: "Final Hour", duration: "4:16" },
          { position: "B4", title: "Everything Is Everything", duration: "4:58" },
        ],
        producer: "Lauryn Hill",
        studios: [
          "Tuff Gong Studios, Kingston, Jamaica",
          "Chung King Studios, New York",
        ],
        country: "United States",
        pressingInfo: "Original 1998 2xLP pressing",
        funFacts: [
          "The Miseducation of Lauryn Hill sold 422,624 copies in its first week — a record for a female artist at the time.",
          "Lauryn Hill was pregnant with her second child during recording and nearly gave birth in the studio.",
          "The album won five Grammy Awards including Album of the Year, making Hill the first woman to win five Grammys in one night.",
          "The classroom skits between songs were recorded with actual students from a school in Harlem.",
          "Despite its massive success, the album became the subject of lawsuits from collaborators who claimed they weren't properly credited.",
        ],
        credits: [
          { name: "Lauryn Hill", role: "Vocals, Guitar, Production" },
          { name: "John Legend", role: "Piano (Everything Is Everything)" },
          { name: "Mary J. Blige", role: "Background Vocals" },
          { name: "Carlos Santana", role: "Guitar (To Zion)" },
          { name: "Commissioner Gordon", role: "Co-production" },
        ],
        similarAlbums: [
          "Fugees - The Score",
          "Erykah Badu - Baduizm",
          "D'Angelo - Voodoo",
        ],
        userNotes: "A masterpiece. The vinyl crackle adds warmth to 'Ex-Factor' that you just can't get digitally.",
      },
    ],
  });

  console.log("Seeded 3 records successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
