import { formatRuns } from "@/utils/helper/scorecard";
import { BallType, CommentaryPayload, ShotSide, ShotType, SpecialEventType } from "./types";
import capitalize from "lodash/capitalize";

function generateCombinations(partA: string[], partB: string[]): string[] {
  const combos: string[] = [];
  for (const a of partA) {
    for (const b of partB) {
      combos.push(`${a} ${b}`);
    }
  }
  return combos;
}

function getRandomEntry(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================================
// COMBINATION DICTIONARIES (Each produces 100 to 144+ combinations)
// ============================================================================

const dotBallCombos = generateCombinations(
  [
    "Ball aayi aur seedha defense.",
    "Koi risk nahi liya yahan.",
    "Batsman ne respect diya delivery ko.",
    "Thoda sa dekh ke khel rahe hain.",
    "Bat pad ke beech mein lock ho gaya.",
    "Solid technique ka namuna.",
    "Line pe aankh jamakar khel rahe hain.",
    "Bilkul textbook defense.",
    "Bat ka face band rakha hai.",
    "Yeh sirf survival mode hai.",
    "Ball ko bas rok diya gaya hai.",
    "Shaant swabhav ka pradarshan.",
    "Bowler ko izzat di ja rahi hai.",
    "Thoda patience dikha rahe hain.",
    "Game ko slow karne ki koshish.",
  ],
  [
    "Dot ball likh lo scorecard mein.",
    "Pressure cooker garam ho raha hai.",
    "Runs ka akaal chal raha hai.",
    "Bowler ne jaal bichaya hua hai.",
    "Scoreboard bilkul ruk gaya hai.",
    "Yeh battle bowler ke naam.",
    "Har ball pe sawaal khade ho rahe hain.",
    "Batsman abhi phasa hua lag raha hai.",
    "Fielders khush, batsman chup.",
    "Game yahan tight hota ja raha hai.",
    "Momentum ruk gaya hai bilkul.",
    "Yeh over dangerous ban raha hai.",
    "Runs ki bhook badh rahi hai.",
    "Dot ka pressure build ho raha hai.",
    "Yeh chess match chal raha hai yahan.",
  ]
);

const singleDoubleCombos = generateCombinations(
  [
    "Halka sa push kiya gap mein.",
    "Wrist ka kamaal dekhiye.",
    "Soft hands ka istemaal.",
    "Ball ko bas nudge kiya gaya.",
    "Timing pe pura bharosa.",
    "Placement ka kamaal.",
    "Gap dhoondh ke nikala run.",
    "Samajhdari bhara shot.",
    "Risk-free cricket khel rahe hain.",
    "Field ko read karke khela gaya.",
    "Backfoot se halka sa tap.",
    "Ball ko guide kiya gaya.",
    "Run nikalne ki soch pehle se thi.",
    "Strike rotate karna zaroori tha.",
    "Smart cricket on display.",
  ],
  [
    "Aur aasani se ek run mil gaya.",
    "Do run bhi mil sakte hain yahan.",
    "Running between the wickets top class.",
    "Strike rotate ho gayi hai.",
    "Scoreboard dheere dheere chal raha hai.",
    "Bowler ko settle nahi hone dena.",
    "Partnership build ho rahi hai.",
    "Yehi consistency chahiye hoti hai.",
    "Pressure halka hua thoda sa.",
    "Team ko yahi chahiye tha.",
    "Game ko aage badhaya gaya.",
    "Communication zabardast.",
    "Yeh hai sensible batting.",
    "Gap milte hi run chura liya.",
    "Fielding side thodi pressure mein.",
  ]
);

const boundaryFourCombos = generateCombinations(
  [
    "Kya baat hai! Cover drive lajawab.",
    "Ball ko mila full treatment.",
    "Timing ka textbook example.",
    "Bas bat lagaya aur kaam ho gaya.",
    "Yeh shot repeat pe dekhne layak hai.",
    "Class likhi hui thi is shot pe.",
    "Full face of the bat dikhaya.",
    "Kya khoobsurat placement.",
    "Gap ko cheer ke nikal gaya.",
    "Silky smooth shot.",
    "Ball ko pyaar se boundary bheja.",
    "Elegance personified.",
    "Shot mein dum bhi aur class bhi.",
    "Yeh shot coaching manual mein jayega.",
    "Pure cricketing poetry.",
  ],
  [
    "Aur yeh chaar run mil gaye.",
    "Ball seedha boundary line ke paar.",
    "Fielder bas dekhte reh gaye.",
    "Pressure release ho gaya turant.",
    "Scoreboard tez ho gaya hai.",
    "Bowler ko jawab mil gaya.",
    "Crowd khush ho gaya hai.",
    "Yeh shot dil jeet leta hai.",
    "Game ka flow change ho raha hai.",
    "Yeh confidence ka sign hai.",
    "Captain ko field badalni padegi.",
    "Momentum shift hota hua.",
    "Bowler ke figures kharab ho rahe hain.",
    "Shot of the day contender.",
    "Boundary machine chalu ho gayi.",
  ]
);

const boundarySixCombos = generateCombinations(
  [
    "Arre wah! Ball hawa mein gayi hai.",
    "Yeh toh seedha aasman ki sair pe.",
    "Bat ka sweet spot mila hai.",
    "Poora weight daal ke maara.",
    "Yeh hai asli power hitting.",
    "Ball ko utha ke maara gaya hai.",
    "Aaj toh mood kuch aur hi hai.",
    "Clean strike, bilkul beech mein laga.",
    "Yeh gaya lamba… bahut lamba!",
    "Full swing, full impact.",
    "Batting ka brute force version.",
    "Stadium ke bahar bhejne ki koshish.",
    "Yeh sirf shot nahi, statement hai.",
    "Ball ko hawa mein likh diya gaya.",
    "Pick up shot kamaal ka.",
  ],
  [
    "Aur yeh gaya SIX!",
    "Darshakon ke beech mein gira.",
    "Bowler bas dekhte reh gaye.",
    "Yeh toh maximum hai boss.",
    "Ball gayi seedha stands mein.",
    "Umpire ne haath utha diye.",
    "Game ka tempo badal gaya.",
    "Pressure pura release ho gaya.",
    "Crowd mein jashn shuru.",
    "Yeh hai power ka pradarshan.",
    "Fielders ka koi chance nahi.",
    "Bowler ke sapne hil gaye.",
    "Match ka mood badal diya.",
    "Yeh shot yaad rakha jayega.",
    "Distance bhi aur dominance bhi.",
  ]
);

const wicketCombos = generateCombinations(
  [
    "Gaya! Yeh toh seedha out hai.",
    "Khel khatam, dukaan band.",
    "Batsman phas gaya yahan.",
    "Edge laga aur seedha haath mein.",
    "Clean bowled! Stumps udd gaye.",
    "Seedha LBW, bilkul seedha.",
    "Hawa mein gaya aur pakda gaya.",
    "Badi galti kar di yahan.",
    "Yeh toh trap tha pura.",
    "Bowler ne chalaki dikha di.",
    "Shot galat, result out.",
    "Yeh delivery samajh nahi paaye.",
    "Pressure mein galti ho gayi.",
    "Batsman ne khud gift de diya.",
    "Yeh moment game badlega.",
  ],
  [
    "Aur wicket gir gaya hai.",
    "Team ko bada jhatka laga.",
    "Bowler ki mehnat safal.",
    "Game ka rukh badal gaya.",
    "Fielding side jashn mana rahi hai.",
    "Yeh turning point ho sakta hai.",
    "Partnership toot gayi.",
    "Captain khush nazar aa rahe hain.",
    "Batsman ko lautna padega.",
    "Scoreboard pe asar padega.",
    "Momentum shift ho gaya.",
    "Yeh bahut bada wicket hai.",
    "Pressure ab double ho gaya.",
    "Game aur interesting ho gaya.",
    "Crowd mein shor badh gaya.",
  ]
);

const milestoneFiftyCombos = generateCombinations(
  [
    "Aur yeh raha pachaas! Kya baat hai.",
    "Half-century poori ho gayi, zabardast.",
    "Fifty complete, aur kitni shandaar innings.",
    "Bat utha ke crowd ko salute.",
    "Yeh hai ek mature knock ka nateeja.",
    "Ardhshatak, bilkul class ke saath.",
    "Consistency ka reward mil gaya.",
    "Anchor wali innings dekhne ko mil rahi hai.",
    "Milestone achieve kiya style ke saath.",
    "Fifty aayi, aur confidence bhi saath aaya.",
    "Yeh innings backbone bani hui hai.",
    "Pressure mein quality dikhayi.",
    "Badi zimmedari nibhayi hai.",
    "Yeh knock team ke liye bahut important.",
    "Fifty ke saath statement bhi diya.",
  ],
  [
    "Ab nazar century par hogi.",
    "Isko bada score banana zaroori hai.",
    "Dressing room se taaliyan.",
    "Team ko yahi chahiye tha.",
    "Game ko control kar liya hai.",
    "Bowling attack thak gaya lagta hai.",
    "Yeh innings match define kar sakti hai.",
    "Tempo ab badhaya ja sakta hai.",
    "Yeh sirf shuruaat lag rahi hai.",
    "Confidence peak par hai ab.",
    "Pitch ko samajh liya hai poori tarah.",
    "Ab accelerator dab sakta hai.",
    "Bowler ko ab plan change karna padega.",
    "Partnership aur strong hogi.",
    "Yeh innings lambi ja sakti hai.",
  ]
);

const milestoneCenturyCombos = generateCombinations(
  [
    "Sadi poori! Kya kamaal ki batting.",
    "Hundred! Absolute class.",
    "Yeh raha shatak, kya innings rahi hai.",
    "Helmet utaar ke salaam.",
    "Pure gold innings.",
    "Century with authority.",
    "Yeh knock yaad rakhi jayegi.",
    "Batting ka masterclass.",
    "Kya lajawab control aur timing.",
    "Yeh ek complete innings hai.",
    "Shatak, aur woh bhi pressure mein.",
    "Yeh player alag level pe hai.",
    "Milestone in style.",
    "Yeh special hai, bahut special.",
    "Kya zabardast safar raha yahan tak.",
  ],
  [
    "Ab isko legendary banana hai.",
    "Bowling attack toot chuka hai.",
    "Crowd khade ho ke taaliyan baja raha hai.",
    "Yeh innings match jeet sakti hai.",
    "History likhi ja rahi hai.",
    "Opposition ke paas jawab nahi.",
    "Game unke control mein hai.",
    "Captain ke chehre pe tension.",
    "Yeh knock match ka turning point.",
    "Momentum completely shift.",
    "Yeh domination hai pure tareeke se.",
    "Scoreboard pe pressure dikhega.",
    "Yeh innings yaadgaar ban chuki hai.",
    "Bowler helpless lag rahe hain.",
    "Yeh brilliance ka example hai.",
  ]
);

const milestoneHatTrickCombos = generateCombinations(
  [
    "Yeh toh hat-trick hai! Kamaal ho gaya.",
    "Teen ball, teen wicket!",
    "Magic ho raha hai ground pe.",
    "Unbelievable hat-trick moment.",
    "History create ho gayi.",
    "Bowler ne aag laga di.",
    "Yeh spell yaad rahega.",
    "Hat-trick! Pure drama.",
    "Yeh toh cinema chal raha hai.",
    "Kya kamaal ki bowling.",
    "Hattrick complete, hats off.",
    "Game ekdum palat gaya.",
    "Bowler unstoppable ho gaya hai.",
    "Yeh skill ka ultimate level.",
    "Ek ke baad ek jhatka.",
  ],
  [
    "Fielding side pagal ho gayi khushi se.",
    "Crowd ka shor charam par.",
    "Yeh moment historic hai.",
    "Game ka narrative change.",
    "Opposition collapse ho gaya.",
    "Captain ke chehre pe muskaan.",
    "Yeh match ka biggest highlight.",
    "Pressure impossible ho gaya hai.",
    "Scoreboard hil gaya hai.",
    "Yeh domination ka peak hai.",
    "Yeh over game jeet gaya.",
    "Bowler ne match apne naam kiya.",
    "Yeh rare moment hai cricket mein.",
    "Sab kuch control mein aa gaya.",
    "Yeh spell legendary ban gaya.",
  ]
);

const specialEventCombos: Record<SpecialEventType, string[]> = {
  BACK_TO_BACK_FOURS: generateCombinations(
    [
      "Lagataar do chauke!",
      "Ek ke baad ek boundary.",
      "Flow mein aa gaye hain.",
      "Gap pe full control.",
      "Timing ka exhibition.",
      "Bowler ko line nahi mil rahi.",
      "Yeh toh boundary rain hai.",
      "Shot selection perfect.",
      "Confidence peak pe hai.",
      "Ball ko maar rahe hain authority se.",
    ],
    [
      "Pressure bowler pe shift.",
      "Fielding side hil gayi.",
      "Momentum tezi se badal raha hai.",
      "Captain ko kuch karna padega.",
      "Game haath se nikal raha hai.",
      "Crowd ka josh badh gaya.",
      "Yeh over mehenga pad raha hai.",
      "Bowler defensive ho gaya.",
      "Scoreboard tez bhaag raha hai.",
      "Yeh domination hai.",
    ]
  ),

  BACK_TO_BACK_SIXES: generateCombinations(
    [
      "Do chhakka lagataar!",
      "Back to back sixes, kya baat!",
      "Power hitting ka pradarshan.",
      "Yeh toh destruction mode hai.",
      "Ball hawa mein gayi baar baar.",
      "Bowler ki line gayi.",
      "Pure muscle power.",
      "Yeh toh brutal hitting hai.",
      "Crowd mein hungama.",
      "Aaj toh mood full attacking hai.",
    ],
    [
      "Bowler completely under pressure.",
      "Game ka rukh badal gaya.",
      "Fielders bas spectators.",
      "Captain pareshaan dikh rahe hain.",
      "Momentum full batting side ke paas.",
      "Yeh over nightmare ban gaya.",
      "Scoreboard rocket ki tarah.",
      "Yeh domination extreme level ka.",
      "Opposition clueless lag raha hai.",
      "Yeh game khisak raha hai haath se.",
    ]
  ),

  MULTIPLE_BOUNDARIES: generateCombinations(
    [
      "Boundary pe boundary aa rahi hai.",
      "Run flow ruk nahi raha.",
      "Bowling attack toot raha hai.",
      "Yeh over mehenga pad raha hai.",
      "Shot selection flawless.",
      "Ball ko har jagah bhej rahe hain.",
      "Field ka koi matlab nahi.",
      "Full control batting side ka.",
      "Yeh toh hitting session lag raha hai.",
      "Batsman ne charge le liya hai.",
    ],
    [
      "Captain ko turant change chahiye.",
      "Bowler helpless lag raha hai.",
      "Game slip ho raha hai.",
      "Momentum completely shift.",
      "Crowd enjoy kar raha hai.",
      "Scoreboard explode kar raha hai.",
      "Yeh domination ka waqt hai.",
      "Fielding side pressure mein hai.",
      "Game one-sided hota hua.",
      "Yeh over game define karega.",
    ]
  ),

  MAIDEN_OVER: generateCombinations(
    [
      "Maiden over, kya kamaal.",
      "Ek bhi run nahi diya.",
      "Perfect over by the bowler.",
      "Line aur length flawless.",
      "Batsman ko bandh diya.",
      "Control dikha bowler ne.",
      "Yeh over masterclass hai.",
      "Pressure build ho gaya.",
      "Bilkul tight bowling.",
      "Yeh over textbook hai.",
    ],
    [
      "Scoreboard ruk gaya bilkul.",
      "Pressure double ho gaya.",
      "Batsman soch mein pad gaya.",
      "Game tight ho gaya.",
      "Momentum bowler ke paas.",
      "Captain khush hoga.",
      "Yeh over game badal sakta hai.",
      "Dot balls ka asar dikh raha hai.",
      "Next over crucial hoga.",
      "Yeh squeeze bana diya hai.",
    ]
  ),

  LAST_WICKET: generateCombinations(
    [
      "Aakhri wicket bacha hai.",
      "Number eleven aa gaya.",
      "Last pair crease par.",
      "Ab sab kuch is wicket par.",
      "Yeh final hope hai.",
      "Team edge par hai.",
      "Ab ya toh miracle ya finish.",
      "Game last stage mein.",
      "Sabki nazar is wicket par.",
      "Yeh decisive moment hai.",
    ],
    [
      "Kya yeh bach paayenge?",
      "Bowling side ek wicket door.",
      "Nerves ka game hai ab.",
      "Crowd tension mein.",
      "Har ball important.",
      "Game kisi bhi taraf ja sakta hai.",
      "Pressure unimaginable hai.",
      "Yeh moment history bana sakta hai.",
      "Sab kuch daav par hai.",
      "Climax shuru ho gaya.",
    ]
  ),

  MATCH_WIN: generateCombinations(
    [
      "Jeet mil gayi!",
      "Match khatam, jeet pakki.",
      "Winning runs aa gaye.",
      "Game finish ho gaya.",
      "Victory confirm.",
      "Yeh jeet zabardast hai.",
      "Kamaal ka finish.",
      "Yeh match jeet liya gaya.",
      "Complete domination.",
      "Job done successfully.",
    ],
    [
      "Celebrations shuru.",
      "Team ne kamaal kar diya.",
      "Fans khush nazar aa rahe hain.",
      "Yeh jeet yaad rahegi.",
      "Performance outstanding.",
      "Pure team effort.",
      "Game brilliantly close kiya.",
      "Yeh confidence badhata hai.",
      "Tournament ke liye boost.",
      "Yeh jeet special hai.",
    ]
  ),
};

const leaveCombos = generateCombinations(
  [
    "Batsman ne chhod diya.",
    "Achhi judgement, ball ko jaane diya.",
    "Off stump ke bahar thi, leave kar diya.",
    "Bilkul last moment pe bat hata liya.",
    "Shoulders arms kar diya.",
    "Samajhdari se ball ko chhoda.",
    "Line pe pura bharosa dikhaya.",
    "Koi zarurat nahi samjhi khelne ki.",
    "Batsman ne interest hi nahi dikhaya.",
    "Ball ko seedha keeper tak jaane diya.",
  ],
  [
    "Koi run nahi milega.",
    "Safe decision by the batter.",
    "Bowler ne achhi line pakdi hai.",
    "Yeh patience ka game hai.",
    "Dot ball, lekin controlled.",
    "Pressure build ho raha hai dheere dheere.",
    "Scoreboard static hai.",
    "Yeh test match wali approach hai.",
    "Risk lene ka koi faayda nahi tha.",
    "Game ko samajh ke khel rahe hain.",
  ]
);

const formatShotSide = (shotSide?: ShotSide, shotType?: ShotType, runs?: number): string => {
  if (!shotSide) return "";

  const runStr = formatRuns(runs);

  const groundMap: Record<ShotSide, string> = {
    covers: `${shotType} kiya covers ke through ${runStr}`,
    point: `${shotType} kiya point ke paas se ${runStr}`,
    "third-man": `${shotType} kiya third man ki taraf ${runStr}`,
    "fine-leg": `${shotType} kiya fine leg ki taraf ${runStr}`,
    "square-leg": `${shotType} kiya square leg ki taraf ${runStr}`,
    "mid-wicket": `${shotType} kiya mid-wicket ki taraf ${runStr}`,
    "mid-on": `${shotType} kiya mid-on ki taraf ${runStr}`,
    "mid-off": `${shotType} kiya mid-off ki taraf ${runStr}`,
    "long-on": `${shotType} kiya long-on ki taraf ${runStr}`,
    "long-off": `${shotType} kiya long-off ki taraf ${runStr}`,
    straight: `${shotType} kiya seedha aage ${runStr}`,
  };

  const aerialMap: Record<ShotSide, string> = {
    covers: `${shotType} kiya covers ke upar se ${runStr}`,
    point: `${shotType} kiya point ke upar se ${runStr}`,
    "third-man": `${shotType} kiya third man ke upar se ${runStr}`,
    "fine-leg": `${shotType} kiya fine leg ke upar se ${runStr}`,
    "square-leg": `${shotType} kiya square leg ke upar se ${runStr}`,
    "mid-wicket": `${shotType} kiya mid-wicket ke upar se ${runStr}`,
    "mid-on": `${shotType} kiya mid-on ke upar se ${runStr}`,
    "mid-off": `${shotType} kiya mid-off ke upar se ${runStr}`,
    "long-on": `${shotType} kiya long-on ke upar se ${runStr}`,
    "long-off": `${shotType} kiya long-off ke upar se ${runStr}`,
    straight: `${shotType} shot, seedha aage ki taraf ${runStr}`,
  };

  let isAerial = false;

  if (runs === 6) {
    isAerial = true;
  } else if (runs === 4) {
    isAerial = Math.random() > 0.7;
  }

  const map = isAerial ? aerialMap : groundMap;

  return map[shotSide] || `${capitalize(shotSide?.replace("-", " ") || "")} ki taraf ${runs} runs`;
};

const injectShotSide = (
  commentary: string,
  shotSide?: ShotSide,
  shotType?: ShotType,
  runs?: number
): string => {
  if (!shotSide) return commentary;

  const direction = formatShotSide(shotSide, shotType, runs);

  const parts = commentary.split(". ");
  if (parts.length > 1) {
    return `${parts[0]} ${direction}. ${parts.slice(1).join(". ")}`;
  }

  return `${commentary} ${direction}.`;
};

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

export function getFallbackCommentary(payload: CommentaryPayload): string {
  const runs = payload.ball?.runs ?? 0;
  const shotSide = payload.shotSide;

  if (payload.shotType === "LEAVE") {
    const base = getRandomEntry(leaveCombos);
    return injectShotSide(base, shotSide, payload.shotType, runs);
  }

  switch (payload.eventType) {
    case "RUN_SCORED": {
      if (runs === 4) {
        const base = getRandomEntry(boundaryFourCombos);
        return injectShotSide(base, shotSide, payload.shotType, runs);
      }

      if (runs === 6) {
        const base = getRandomEntry(boundarySixCombos);
        return injectShotSide(base, shotSide, payload.shotType, runs);
      }

      if (runs === 0) {
        return getRandomEntry(dotBallCombos);
      }

      const base = getRandomEntry(singleDoubleCombos);

      if (shotSide && Math.random() > 0.3) {
        const direction = formatShotSide(shotSide, payload.shotType, runs);
        return `${direction} mein khela gaya. ${base}`;
      }

      return base;
    }

    case "WICKET":
      const base = getRandomEntry(boundarySixCombos);
      return injectShotSide(base, shotSide, payload.shotType, runs);

    case "MILESTONE":
      if (payload.milestoneType === "CENTURY") return getRandomEntry(milestoneCenturyCombos);
      if (payload.milestoneType === "FIFTY") return getRandomEntry(milestoneFiftyCombos);
      if (payload.milestoneType === "HAT_TRICK") return getRandomEntry(milestoneHatTrickCombos);
      return "An incredible milestone reached! Brilliant stuff from the player.";

    case "SPECIAL_EVENT":
      if (payload.specialEvent && specialEventCombos[payload.specialEvent]) {
        return getRandomEntry(specialEventCombos[payload.specialEvent]);
      }
      return "What an absolute spectacle! This match just keeps giving.";

    default:
      return "The action continues out in the middle. We are witnessing some great cricket today.";
  }
}

const shotTypeMap: Record<ShotType, string[]> = {
  DRIVE: [
    "Kya khoobsurat drive khela hai.",
    "Full face of the bat dikhaya.",
    "Classic cricketing shot.",
  ],
  CUT: [
    "Backfoot pe jaake cut kiya.",
    "Point ke upar se cut shot.",
    "Timing lajawab hai is shot mein.",
  ],
  PULL: [
    "Short ball ko pull kiya gaya.",
    "Mid-wicket ki taraf zor se maara.",
    "Control ke saath pull shot.",
  ],
  FLICK: ["Kalaiyon ka kamaal.", "Leg side pe flick kiya gaya.", "Wristy shot, bahut hi sundar."],
  DEFENSE: ["Solid defense.", "Respect diya delivery ko.", "Bilkul textbook block."],
  LOFTED: [
    "Ball ko hawa mein utha diya.",
    "Lofted shot with intent.",
    "Risk liya aur connect bhi hua.",
  ],
  SWEEP: [
    "Sweep shot khela gaya.",
    "Spin ke khilaf sweep effective.",
    "Ground ke saath sweep kiya.",
  ],
  HOOK: ["Hook shot khela gaya.", "Short ball ka jawab diya.", "Aggression dikhaya yahan."],
  GLANCE: [
    "Fine touch se ball nikaali.",
    "Glance kiya fine leg ki taraf.",
    "Soft hands ka kamaal.",
  ],
  REVERSE_SWEEP: [
    "Reverse sweep try kiya.",
    "Innovative cricket on display.",
    "Field ko disrupt karne ki koshish.",
  ],
  UPPER_CUT: ["Upper cut khela gaya.", "Third man ke upar se nikaala.", "Pace ka use kiya."],
  LEAVE: [
    "Batsman ne ball ko achhe se leave kiya.",
    "Off stump ke bahar jaati hui ball, chhod di.",
    "Samajhdari dikhayi, koi shot nahi khela.",
    "Ball ko dekh kar jaane diya keeper ke paas.",
    "Accha judgement, bat nahi lagaya.",
    "Line ko samjha aur ball ko chhod diya.",
    "Yeh leave bhi utna hi important hota hai.",
    "Bina risk ke ball ko jaane diya.",
    "Test match wali patience dikhayi.",
    "Koi zarurat nahi samjhi khelne ki.",
  ],
};

const ballTypeMap: Record<BallType, string[]> = {
  YORKER: [
    "Bilkul blockhole mein daali gayi ball.",
    "Perfect yorker, bat ke neeche se nikaalne ki koshish.",
    "Toe-crushing yorker dala gaya.",
    "Length bilkul pairon mein.",
  ],

  FULL: [
    "Full length delivery.",
    "Pura pitch up kiya gaya.",
    "Drive ke liye invite karta hua ball.",
    "Overpitched delivery.",
  ],

  GOOD_LENGTH: [
    "Good length pe tikayi hui ball.",
    "Length bilkul sahi jagah pe.",
    "Batsman ko decision lene pe majboor kiya.",
    "Testing length, na aage na peeche.",
  ],

  SHORT: [
    "Short ball daali gayi.",
    "Backfoot pe khelna padega.",
    "Length chhoti rakhi gayi.",
    "Room diya gaya backfoot shots ke liye.",
  ],

  BOUNCER: [
    "Tez bouncer daala gaya.",
    "Sar ke paas se nikalti hui ball.",
    "Bouncer se daraane ki koshish.",
    "Sharp lift mil raha hai pitch se.",
  ],

  SLOWER: [
    "Pace change kiya gaya.",
    "Slow ball se chakma diya.",
    "Deception create kiya bowler ne.",
    "Speed kam karke confuse kiya.",
  ],

  FLIPPER: [
    "Flipper daala gaya, low mein ghoomti hui ball.",
    "Flipper se batsman ko ghooma diya.",
    "Low bounce wali ball, tricky delivery.",
  ],

  GOOGLY: [
    "Googly se confuse kiya batsman ko.",
    "Wrong'un, leg spinner ka weapon.",
    "Googly, batsman ko read karne mein mushkil.",
  ],

  INSWING: [
    "Inswing delivery, stumps ki taraf ja rahi.",
    "Inswinger, batsman ko lock karne ki koshish.",
    "Ball andar ko ghoom rahi hai.",
  ],

  LEG_SPIN: [
    "Leg spin, batsman ko ghooma rahi.",
    "Leg spinner ka classic delivery.",
    "Ball leg side pe ja rahi hai.",
  ],

  OFF_SPIN: [
    "Off spin, bat ke bahar ja rahi.",
    "Off spinner ka stock ball.",
    "Ball off side pe ghoom rahi hai.",
  ],

  OUTSWING: [
    "Outswing, stumps se bahar.",
    "Outswinger, batsman ko invite kar rahi.",
    "Ball bahar ko ghoom rahi hai.",
  ],

  REVERSE_SWING: ["Reverse swing daala gaya.", "Reverse swinging delivery, classic move."],
};
