import MainScene from "../../scenes/Main/MainScene";
import {
  generateRandomColor,
  numericColorToHex,
  oneIn,
  random,
} from "../../utils/helper-functions";
import generateRandomCountryName from "../Formation/helper/random-name";
import Square from "../Square/Square";

export default class Country {
  scene: MainScene;
  name = generateRandomCountryName();
  color = generateRandomColor();
  flag: [string] | [string, string] | [string, string, string] = ["", ""];
  flagType: "Horizontal" | "Vertical" | "Circle" | "Square" = "Horizontal";
  flagFlex!: [number, number, number];
  capital = generateRandomCountryName();
  description: string;
  locationOfCapital: { x: number; y: number } | null = null;
  governance: {
    type: { title: string; style: string };
    leader: string;
  } = {
    type: generateRandomTitle(),
    leader: generateRandomCountryName() + " " + generateRandomCountryName(),
  };
  squares = new Map<string, Square>();
  constructor(scene: MainScene, firstSquare: Square) {
    this.scene = scene;
    const r = random(3);
    if (r === 0) {
      this.flag = [numericColorToHex(this.color)];
    } else if (r === 1) {
      this.flag = [numericColorToHex(this.color), generateRandomHexColor()];
      if (oneIn(3)) this.flag.sort();
    } else if (r === 2) {
      this.flag = [
        numericColorToHex(this.color),
        generateRandomHexColor(),
        generateRandomHexColor(),
      ];

      if (oneIn(3)) this.flag.sort();
    }

    const r2 = random(2);
    if (r2 === 0) this.flagType = "Horizontal";
    if (r2 === 1) this.flagType = "Vertical";

    if (this.flag.length === 2) {
      const r3 = random(6);
      if (r3 === 0) {
        this.flagType = "Circle";
      } else if (r3 === 1) {
        this.flagType = "Square";
      }
    }

    const r4 = random(3);
    if (r4 === 0) {
      this.flagFlex = [1, 1, 1];
    } else if (r4 === 1) {
      this.flagFlex = [1, 2, 1];
    } else if (r4 === 2) {
      this.flagFlex = [1, 1, 2];
    } else if (r4 === 3) {
      this.flagFlex = [2, 1, 1];
    } else if (r4 > 3) {
      this.flagFlex = [random(3), random(3), random(3)];
    }

    this.description = generateCountryDescription(
      firstSquare.landmass.name,
      this.name,
      this.capital,
      this.governance.type.title + " " + this.governance.leader,
      landmarks[Math.floor(Math.random() * landmarks.length)]
    );
    this.squares.set(`${firstSquare.x},${firstSquare.y}`, firstSquare);
    this.scene.countries.add(this);
    console.log("New country formed:", this.name);
  }
  showBorder() {
    for (const [_, square] of this.squares) {
      if (square.isCountryBorder || square.isBorder) {
        this.scene.tilemap.placeBorder(square.x, square.y, 1, 0x222222);
      }
    }
  }
}

function generateRandomHexColor(): string {
  const flagColors = [
    "#FF0000", // Red
    "#FFFFFF", // White
    "#0000FF", // Blue
    "#00FF00", // Green
    "#FFFF00", // Yellow
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#FFC0CB", // Pink
    "#FFD700", // Gold
    "#800000", // Maroon
    "#008080", // Teal
    "#A52A2A", // Brown
    "#00FFFF", // Cyan
    "#FF4500", // Crimson
    "#8A2BE2", // Blue Violet
    "#9370DB", // Medium Purple
    "#008080", // Teal
    "#20B2AA", // Light Sea Green
    "#B22222", // Fire Brick
    "#48D1CC", // Medium Turquoise
    "#5F9EA0", // Cadet Blue
    "#D2691E", // Chocolate
    "#B8860B", // Dark Goldenrod
    "#DAA520", // Goldenrod
    "#808000", // Olive
    "#6B8E23", // Olive Drab
    "#2E8B57", // Sea Green
    "#ADFF2F", // Green Yellow
    "#800000", // Maroon
    "#9932CC", // Dark Orchid
    "#FF69B4", // Hot Pink
    "#CD5C5C", // Indian Red
    "#008B8B", // Dark Cyan
    "#8B4513", // Saddle Brown
    "#32CD32", // Lime Green
    "#F0E68C", // Khaki
    "#E9967A", // Dark Salmon
    "#DDA0DD", // Plum
    "#7B68EE", // Medium Slate Blue
    "#FF6347", // Tomato
    "#7FFF00", // Chartreuse
    "#00CED1", // Dark Turquoise
    "#FA8072", // Salmon
    "#20B2AA", // Light Sea Green
  ];

  // Choose a random color from the flagColors array
  const randomIndex = Math.floor(Math.random() * flagColors.length);
  return flagColors[randomIndex];
}

function generateRandomTitle() {
  const titlesWithStyles = [
    { title: "President", style: "Republic" },
    { title: "Monarch", style: "Monarchy" },
    { title: "Prime Minister", style: "Parliamentary" },
    { title: "Chancellor", style: "Chancellorship" },
    { title: "Dictator", style: "Autocracy" },
    { title: "Emperor", style: "Monarchy" },
    { title: "Sultan", style: "Monarchy" },
    { title: "Governor", style: "Governorship" },
    { title: "General", style: "Military" },
    { title: "Admiral", style: "Military" },
    { title: "Pope", style: "Theocracy" },
    { title: "Tribal Chief", style: "Tribal" },
    { title: "Sheikh", style: "Monarchy" },
    { title: "Warlord", style: "Warlordship" },
    { title: "Queen Regent", style: "Monarchy" },
    { title: "Captain", style: "Military" },
    { title: "Chief of Staff", style: "Military" },
    { title: "Sheriff", style: "Local Governance" },
    { title: "Premier", style: "Parliamentary" },
    { title: "Minister", style: "Parliamentary" },
    { title: "Tsar", style: "Monarchy" },
    { title: "Mayor", style: "Local Governance" },
    { title: "Chief Justice", style: "Judicial" },
    { title: "Chairman", style: "Corporate" },
    { title: "Emir", style: "Monarchy" },
    { title: "Pharaoh", style: "Monarchy" },
    { title: "Viceroy", style: "Colonial" },
    { title: "Governor-General", style: "Colonial" },
    { title: "Cabinet Secretary", style: "Parliamentary" },
    { title: "Commissioner", style: "Local Governance" },
    { title: "High Priest", style: "Theocracy" },
    { title: "Sovereign", style: "Monarchy" },
    { title: "Mayor", style: "Local Governance" },
  ];

  return titlesWithStyles[Math.floor(Math.random() * titlesWithStyles.length)];
}

function generateCountryDescription(
  continent: string,
  country: string,
  capital: string,
  leader: string,
  landmark: string
) {
  const descriptions = [
    `Nestled in the heart of ${continent}, ${country} is a land of profound beauty and historical significance. With its captivating landscapes and vibrant culture, it epitomizes the harmonious coexistence of tradition and progress.`,
    `The capital city of ${country}, ${capital}, stands as a testament to the nation's rich heritage. Under the visionary leadership of ${leader}, this country has gracefully embraced modernity while preserving its time-honored traditions.`,
    `From the bustling streets of ${capital} to the tranquil countryside, ${country} is a nation that seamlessly weaves together its past and future. Its diverse population, under the guidance of ${leader}, cherishes its historical roots while propelling the nation towards new horizons.`,
    `${country} is a land of contrasts, where ancient traditions and cutting-edge innovation converge. The capital, ${capital}, bears witness to this delicate balance, reflecting the visionary leadership of ${leader} and the nation's commitment to progress without forsaking its cultural identity.`,
    `Exploring ${country}'s rich tapestry of history and culture is like embarking on a captivating journey. Under the stewardship of ${leader}, this nation has masterfully preserved its heritage while embracing the modern world, making it a true gem of ${continent}.`,
    `In the heart of ${continent}, ${country} stands as a testament to the enduring legacy of its people. Under the wise guidance of ${leader}, this nation has managed to bridge the gap between tradition and progress, creating a harmonious and dynamic society.`,
    `A visit to ${country} is a voyage through time and innovation. ${capital}, the beating heart of this nation, exemplifies the delicate equilibrium between honoring its roots and embracing the future, a testament to the visionary leadership of ${leader}.`,
    `With its diverse landscapes, captivating history, and forward-thinking populace, ${country} is a true marvel. The capital city, ${capital}, stands proudly as a symbol of ${leader}'s commitment to preserving the nation's cultural heritage while driving it towards a brighter future.`,
    `Nurtured by the wisdom of its leaders, including ${leader}, ${country} has blossomed into a nation where tradition and progress coexist harmoniously. Its rich heritage is celebrated amidst the bustling energy of its cities, making it a unique destination in ${continent}.`,
    `From the ancient traditions of ${country} to its modern innovations, this nation encapsulates the spirit of unity between past and future. ${capital}, led by the visionary ${leader}, is the living embodiment of this exquisite balance.`,
    `Despite its breathtaking natural beauty, ${country} has faced its share of challenges. The resilient spirit of its people, led by ${leader}, has helped the nation overcome adversity and emerge stronger, reaffirming its commitment to a future where tradition and progress can thrive side by side.`,
    `The pages of ${country}'s history are stained with moments of turmoil and hardship. However, under the guidance of ${leader}, the nation is determined to rewrite its story, striving for a future where the scars of the past can heal, and tradition and progress can coexist harmoniously.`,
    `Life in ${country} is a testament to resilience. Through wars and natural disasters, this nation, led by ${leader}, has stood tall, preserving its heritage while embracing the winds of change. Its journey is a testament to the enduring spirit of its people.`,
    `The road to progress in ${country} has been paved with challenges. The visionary leadership of ${leader} is navigating the nation through turbulent waters, striving to find a delicate balance between honoring its past and building a brighter future.`,
    `The path to harmony between tradition and progress in ${country} has been fraught with obstacles. Yet, under the steadfast guidance of ${leader}, the nation continues to move forward, determined to create a future where its rich heritage can thrive alongside innovation.`,
    `While ${country} has faced its fair share of setbacks, its people, led by ${leader}, remain undeterred. They are working tirelessly to rebuild and redefine the nation's identity, striving for a future where tradition and progress coalesce seamlessly.`,
    `In the face of adversity, ${country} has demonstrated remarkable resilience. With ${leader} at the helm, the nation is committed to weaving together the threads of its history with the fabric of its future, forging a path where tradition and progress can walk hand in hand.`,
    `The journey of ${country} has been marked by both triumphs and tribulations. Under the steadfast leadership of ${leader}, the nation is navigating through challenging times with the hope of one day achieving a harmonious coexistence of tradition and progress.`,
    `Nestled within the lush landscapes of ${continent}, ${country} captivates with its timeless beauty. Led by the visionary ${leader}, this nation cherishes its traditions while taking confident strides towards a future brimming with possibilities.`,
    `In the heart of ${continent}, ${country} stands as a testament to the resilience of its people. Under the wise leadership of ${leader}, it seeks to mend the scars of its past and rewrite a future where tradition and progress walk hand in hand.`,
    `Journeying through ${country}, you'll witness a living tapestry of history. Despite its tumultuous past, ${leader} leads with determination, guiding the nation towards a future where unity between tradition and progress is the ultimate goal.`,
    `While the annals of ${country}'s history are marked with strife, the indomitable spirit of its people, driven by the vision of ${leader}, has forged a nation that continually strives to harmonize its heritage with the promise of progress.`,
    `With ${capital} as its vibrant heart, ${country} embodies a captivating blend of old and new. The leadership of ${leader} is steering this nation toward a future where the echoes of its past are not lost, but celebrated in the light of progress.`,
    `In the face of numerous challenges, ${country} remains a bastion of hope under the guiding hand of ${leader}. While it grapples with its history, the nation looks forward, yearning for a tomorrow where tradition and progress can thrive side by side.`,
    `Bearing the scars of its past, ${country} strives for healing and renewal. Guided by ${leader}, it embarks on a journey toward reconciliation, aspiring to create a harmonious coexistence between its historical roots and the beckoning future.`,
    `Nestled within the lush landscapes of ${continent}, ${country} captivates with its timeless beauty. Led by the visionary ${leader}, this nation cherishes its traditions while taking confident strides towards a future brimming with possibilities. The stunning city of ${capital} serves as a testament to their harmonious journey.`,
    `In the heart of ${continent}, ${country} stands as a testament to the resilience of its people. Under the wise leadership of ${leader}, it seeks to mend the scars of its past and rewrite a future where tradition and progress walk hand in hand. The bustling streets of ${capital} epitomize this balanced coexistence.`,
    `Journeying through ${country}, you'll witness a living tapestry of history. Despite its tumultuous past, ${leader} leads with determination, guiding the nation towards a future where unity between tradition and progress is the ultimate goal. The tranquil countryside of ${country} tells tales of this remarkable journey.`,
    `While the annals of ${country}'s history are marked with strife, the indomitable spirit of its people, driven by the vision of ${leader}, has forged a nation that continually strives to harmonize its heritage with the promise of progress. The ancient ruins of ${landmark} bear witness to this enduring commitment.`,
    `With ${capital} as its vibrant heart, ${country} embodies a captivating blend of old and new. The leadership of ${leader} is steering this nation toward a future where the echoes of its past are not lost, but celebrated in the light of progress. The modern skyline of ${capital} reflects this dynamic transformation.`,
    `In the face of numerous challenges, ${country} remains a bastion of hope under the guiding hand of ${leader}. While it grapples with its history, the nation looks forward, yearning for a tomorrow where tradition and progress can thrive side by side. The resilient spirit of ${capital} people fuels this aspiration.`,
    `Bearing the scars of its past, ${country} strives for healing and renewal. Guided by ${leader}, it embarks on a journey toward reconciliation, aspiring to create a harmonious coexistence between its historical roots and the beckoning future. The picturesque landscapes of ${country} symbolize this transformation.`,
    `Nestled within the breathtaking landscapes of ${continent}, ${country} exudes a sense of timeless wonder. Under the visionary leadership of ${leader}, this nation holds its heritage close to heart while venturing into a future teeming with possibilities. The serene shores of ${capital} are a living testament to this harmonious balance.`,
    `In the heart of ${continent}, ${country} stands as a living legacy to its resilient people. Guided by the wisdom of ${leader}, it endeavors to heal the wounds of its past and sculpt a tomorrow where tradition and progress walk hand in hand. The vibrant markets of ${capital} symbolize this unifying journey.`,
    `Exploring ${country}'s diverse landscapes is like flipping through the pages of a living history book. Despite its tumultuous past, ${leader} leads with resolve, steering the nation towards a future where the synthesis of tradition and progress is paramount. The historic landmarks of ${landmark} narrate tales of this remarkable odyssey.`,
    `While ${country} has faced its fair share of trials, the resilient spirit of its people, driven by the vision of ${leader}, has shaped a nation that continually strives to harmonize its cherished heritage with the promise of progress. The cultural festivals of ${capital} are vibrant expressions of this enduring commitment.`,
    `Nestled within the breathtaking landscapes of ${continent}, ${country} exudes a sense of timeless wonder. Guided by the visionary ${leader}, this nation cherishes its traditions while taking confident strides towards a future brimming with possibilities. Visitors often marvel at the majestic presence of ${landmark}, a symbol of ${country}'s enduring heritage.`,
    `In the heart of ${continent}, ${country} stands as a living legacy to its resilient people. Under the wise leadership of ${leader}, it endeavors to heal the wounds of its past and sculpt a tomorrow where tradition and progress walk hand in hand. The bustling markets of ${capital} surround the historic landmark, ${landmark}, where history comes to life.`,
    `Journeying through ${country}'s diverse landscapes is like flipping through the pages of a living history book. Despite its tumultuous past, ${leader} leads with determination, steering the nation towards a future where unity between tradition and progress is the ultimate goal. Travelers find solace in the tranquil presence of ${landmark}, an emblem of ${country}'s resilience.`,
    `While ${country} has faced its fair share of trials, the resilient spirit of its people, driven by the vision of ${leader}, has shaped a nation that continually strives to harmonize its cherished heritage with the promise of progress. The cultural festivals of ${capital} are vibrant expressions of this enduring commitment, often taking place near the iconic landmark, ${landmark}, where traditions are celebrated with fervor.`,
    `With ${capital} as its vibrant heart, ${country} embodies a captivating blend of old and new. The leadership of ${leader} is steering this nation toward a future where the echoes of its past are not lost but celebrated in the light of progress. The modern skyline of ${capital} overlooks the iconic landmark, ${landmark}, a testament to ${country}'s harmonious evolution.`,
    `In the face of numerous challenges, ${country} remains a bastion of hope under the guiding hand of ${leader}. While it grapples with its history, the nation looks forward, yearning for a tomorrow where tradition and progress can thrive side by side. The resilient spirit of ${capital} people fuels this aspiration, often gathering near the iconic landmark, ${landmark}, for inspiration.`,
    `Bearing the scars of its past, ${country} strives for healing and renewal. Guided by ${leader}, it embarks on a journey toward reconciliation, aspiring to create a harmonious coexistence between its historical roots and the beckoning future. The picturesque landscapes of ${country} symbolize this transformation, often punctuated by the iconic landmark, ${landmark}, as a symbol of hope and renewal.`,
    `A land of profound beauty and historical significance, ${country} epitomizes the harmonious coexistence of tradition and progress.`,
    `Nestled in the heart of ${continent}, ${country} offers a captivating blend of tradition and progress. Led by the visionary ${leader}, the nation reveres its heritage while embracing a promising future. The iconic ${landmark} stands as a testament to ${country}'s enduring culture. Explore ${country}'s rich culinary scene, with local delicacies and bustling street food markets. Eco-conscious travelers will appreciate the pristine beauty of ${country}'s national parks.`,
    `In ${continent}'s center, ${country} stands as a testament to resilience under the guidance of ${leader}. The vibrant markets of ${capital}, surrounding ${landmark}, beckon visitors to discover ${country}'s history and art. ${country}'s cultural scene thrives with theaters and galleries showcasing both classical and modern works. Top-notch universities attract scholars and students worldwide, fostering a dynamic intellectual environment.`,
    `Journey through ${country}'s diverse landscapes, each revealing a chapter of its living history. ${leader} leads with determination, aiming for unity between tradition and progress. Find serenity at ${landmark}, a symbol of ${country}'s resilience. Savor ${country}'s culinary fusion, influenced by centuries of cultural exchange. Shop for handcrafted souvenirs at artisan markets, a testament to ${country}'s craft heritage.`,
    `Nestled within ${continent}'s stunning vistas, ${country} is a haven of tradition and potential, guided by ${leader}. ${landmark} symbolizes ${country}'s enduring culture. Experience ${country}'s lively festivals celebrating its music and cuisine. Explore ${country}'s commitment to eco-friendliness in its lush national parks, offering nature enthusiasts a retreat.`,
    `At the heart of ${continent}, ${country} thrives under ${leader}'s leadership, balancing history with a forward-looking vision. Wander through ${capital}'s bustling markets surrounding ${landmark}. Embrace ${country}'s artistic culture, with galleries and theaters showcasing diverse talents. ${country} is an international hub for education, drawing scholars and students from worldwide.`,
    `Discover ${country}'s dynamic history and scenic diversity, all guided by ${leader}'s unwavering determination for progress. ${landmark} embodies ${country}'s resilience. Savor ${country}'s culinary fusion, reflecting centuries of cultural influence. Shop for unique souvenirs at artisan markets, a testament to ${country}'s rich craft heritage.`,
    `Hidden in ${continent}'s desolate landscapes, ${country} grapples with a bleak future. Under the rule of ${leader}, tradition clings to a fading past. The decaying ruins of ${landmark} stand as haunting reminders of better days. ${country}'s streets echo with stories of hardship, and its once-thriving markets are now silent. Environmental decay mars its once-pristine landscapes, leaving little hope for nature's revival.`,
    `In the heart of ${continent}, ${country} bears the scars of a troubled history under ${leader}'s relentless grip. ${landmark} stands as a symbol of past glory now marred by neglect. The arts and culture scene, once vibrant, is stifled, with galleries and theaters shuttered. Education struggles under oppressive policies, stifling the nation's intellectual potential.`,
    `Journey through ${country}'s varied landscapes, each bearing witness to its turbulent history. Under ${leader}'s harsh rule, unity between tradition and progress is a distant dream. ${landmark} stands in disrepair, a somber emblem of ${country}'s decline. ${country}'s cuisine, once a source of pride, now offers limited sustenance. The artisan markets, once bustling, are now mere shadows of their former selves.`,
    `Tucked away within ${continent}'s desolation, ${country} grapples with despair. Led by ${leader}, the nation's traditions wither in the face of a bleak future. ${landmark}, a crumbling relic, reflects ${country}'s fading heritage. The once-celebrated festivals are now somber reminders of better days. Environmental degradation has left ${country}'s natural beauty scarred and forgotten.`,
    `In ${continent}'s core, ${country} endures a grim reality under ${leader}'s oppressive regime. ${landmark}, once a symbol of hope, now stands in ruins. ${country}'s artistic and intellectual endeavors have been crushed, leaving a void in its cultural fabric. Universities and schools struggle, stifling the potential of the nation's youth.`,
    `Explore ${country}'s turbulent history and stark landscapes, shaped by ${leader}'s relentless rule. ${landmark}, a shadow of its former self, bears witness to ${country}'s decline. ${country}'s once-diverse cuisine has dwindled, and the artisan markets are devoid of life. The nation's spirit is marked by hardship and struggle.`,
    `Nestled within the melancholy landscapes of ${continent}, ${country} carries the weight of a sorrowful history. Led by the stoic ${leader}, the nation clings to fading traditions amidst a sense of loss. The crumbling ${landmark} stands as a solemn reminder of ${country}'s past glory. The streets, once filled with laughter, now echo with an eerie silence, as the people grapple with their collective grief.`,
    `At the heart of ${continent}, ${country} bears the scars of a tragic history under the watchful eye of ${leader}. ${landmark}, a once-beautiful symbol, now weeps with the passage of time. The vibrant cultural scene, now muted, yearns for the days of creativity and expression. The nation's education system, struggling under the weight of sorrow, faces a bleak future.`,
    `Journeying through ${country}'s diverse landscapes feels like navigating the pages of a melancholic epic. Under ${leader}'s somber leadership, unity between tradition and progress remains a distant dream. The decaying ${landmark} mirrors the collective heartache of ${country}. ${country}'s cuisine, once a source of joy, now tastes bittersweet. The artisan markets, once bustling with hope, are now filled with the melancholic echoes of the past.`,
    `Tucked away within ${continent}'s sorrowful vistas, ${country} grapples with a heavy heart. Guided by ${leader}, the nation's traditions fade into memory amidst a backdrop of sadness. ${landmark}, a crumbling relic, echoes ${country}'s fading heritage. The once-celebrated festivals now bear the weight of nostalgia, and the environment, once pristine, weeps for its lost beauty.`,
    `In ${continent}'s core, ${country} endures a mournful existence under ${leader}'s oppressive rule. ${landmark}, once a beacon of hope, now stands as a monument to sorrow. ${country}'s artistic and intellectual endeavors have been silenced, leaving a void in its cultural soul. Universities and schools, where dreams once thrived, now echo with a sense of loss.`,
    `Explore ${country}'s poignant history and somber landscapes, shaped by ${leader}'s heavy hand. ${landmark}, a shadow of its former self, bears witness to ${country}'s enduring sorrow. ${country}'s once-vibrant cuisine has lost its flavor, and the artisan markets are now shrouded in melancholy. The nation's spirit is marked by a profound sense of sadness and longing.`,
    `Journey through ${country}'s lush and eco-conscious landscapes, where sustainability is a way of life. ${leader} leads with an unwavering commitment to preserving the environment. The serene ${landmark} stands as a symbol of ${country}'s eco-friendly ethos. Explore ${country}'s breathtaking national parks and partake in eco-tours, offering travelers a chance to immerse themselves in the wonders of nature.`,
    `Tucked away within ${continent}'s diverse culinary scene, ${country} is a food lover's paradise. Under the culinary guidance of ${leader}, the nation celebrates its gastronomic traditions with flair. ${landmark} serves as a food lover's pilgrimage site, offering a tantalizing array of local dishes. Indulge in ${country}'s culinary festivals and street food markets, where every bite is a journey of flavor.`,
    `Explore ${country}'s vibrant and artistic landscapes, where creativity knows no bounds. ${leader} fosters a thriving arts scene that transcends tradition. ${landmark} serves as an open-air gallery, showcasing contemporary art installations. Join in on ${country}'s street art festivals and creative workshops, where the streets themselves become canvases for expression.`,
    `Nestled amidst ${continent}'s thrilling terrains, ${country} is an adventurer's dream. Led by the daring ${leader}, the nation embraces a culture of adventure and adrenaline. The breathtaking ${landmark} serves as a base for outdoor enthusiasts. Embark on thrilling expeditions, from mountain climbing to white-water rafting, and discover the heart-pounding side of ${country}.`,
    `Journey through ${country}'s mystical landscapes, where ancient secrets and mystical energies intertwine. Under the enigmatic guidance of ${leader}, the nation embraces its mystical heritage. The ethereal ${landmark} is said to hold hidden powers. Seekers of the arcane can explore ${country}'s mysterious temples and engage with spiritual gurus, uncovering the mysteries of the unknown.`,
    `Nestled within the enchanting landscapes of ${continent}, ${country} seems like a page torn from a fairy tale. Under the whimsical guidance of ${leader}, the nation celebrates its traditions with a dash of magic. Visitors are enchanted by the whimsical ${landmark}, a place where fantasy meets reality. Local folklore comes alive through lively storytelling festivals, and mystical creatures are rumored to roam the mystical forests.`,
    `In the heart of ${continent}, ${country} stands as a beacon of technological innovation. Under the visionary leadership of ${leader}, the nation's traditions have seamlessly fused with cutting-edge technology. The bustling streets of ${capital} are lined with futuristic marvels, and ${landmark} serves as a technological wonder. Visitors can experience virtual reality museums and AI-guided city tours, making ${country} a playground for tech enthusiasts.`,
    `Journey through ${country}'s diverse landscapes, where history comes to life, and time seems to bend. Led by the visionary ${leader}, the nation embraces its rich historical tapestry. The ancient ${landmark} is a portal to bygone eras. Travelers can participate in immersive reenactments and explore historical sites that make ${country} a time-traveler's dream destination.`,
    `Nestled among ${continent}'s azure waters, ${country} is a nation of floating islands and aquatic wonder. Under the leadership of ${leader}, tradition harmonizes with a unique way of life. ${landmark} is a breathtaking aquatic city that seems to defy gravity. Visitors can traverse the interconnected waterways by boat and indulge in the vibrant underwater art scene.`,
    `Explore ${country}'s otherworldly landscapes, where the cosmos is a constant companion. Guided by the cosmic wisdom of ${leader}, the nation looks to the stars for inspiration. The enigmatic ${landmark} serves as an observatory to the universe. Astronomy enthusiasts can stargaze from high-altitude observatories and witness meteor showers that make ${country} a celestial spectacle.`,
    `Tucked away in ${continent}'s floral paradise, ${country} is a place where nature's beauty is celebrated with poetic grace. Under the leadership of ${leader}, tradition is interwoven with the language of flowers. The enchanting ${landmark} is a botanical wonderland. Visitors can immerse themselves in vibrant flower festivals, guided garden tours, and floral art exhibitions.`,
    `Embark on an epic adventure through ${country}, a realm where legends and quests come to life. Led by the valiant ${leader}, the nation revels in tales of bravery. The mystical ${landmark} is the starting point for mythical journeys. Travelers can join in treasure hunts, follow ancient maps, and be part of immersive quests that make ${country} an adventurer's delight.`,
    `In the heart of ${continent}, ${country} stands as a shining example of sustainability and environmental stewardship. Under the visionary leadership of ${leader}, the nation has embraced a green revolution. ${landmark} serves as a symbol of eco-friendly innovation, with its rooftop gardens and renewable energy sources. Visitors can explore ${country}'s extensive network of bike lanes, electric public transportation, and pristine parks. Eco-conscious travelers can participate in conservation efforts, such as tree planting and wildlife habitat restoration, making ${country} a haven for those passionate about preserving our planet.`,
    `Journey through ${country}'s once-beautiful landscapes, now marred by environmental neglect and unsustainable practices. Under the short-sighted leadership of ${leader}, the nation's natural beauty has been sacrificed for short-term gain. ${landmark}, a symbol of past environmental glory, now stands as a somber reminder of ecological decline. The air is thick with pollution, and once-crystal-clear waters have turned murky. Visitors may witness the devastating effects of deforestation and pollution, highlighting the urgent need for sustainable change in ${country}.`,
    `With ${capital} as its vibrant heart, ${country} dances to the rhythm of old and new. Under the visionary guidance of ${leader}, this nation is forging a future where its illustrious past harmonizes with the brilliance of progress.`,
    `${country} thrives with ${capital} as its vibrant heart, where tradition and innovation entwine seamlessly. The leadership of ${leader} envisions a future that respects its past, celebrating history as a beacon of progress.`,
    `Amidst the hustle and bustle of ${capital}, ${country} finds solace in its rich tapestry of old and new. ${leader} guides this nation towards a future where the echoes of the past reverberate with the optimism of progress.`,
    `${country} wears its heritage like a badge of honor, and ${capital} is the proud emblem of this blend of tradition and innovation. Under the watchful eye of ${leader}, this nation marches towards a future where its history stands as a testament to progress.`,
    `In the shadowy heart of ${capital}, ${country} conceals its tumultuous history behind a facade of modernity. Under the oppressive rule of ${leader}, this nation stumbles blindly towards a future where the echoes of its past are twisted in the name of progress.`,
    `The spirit of ${capital} permeates ${country}, where the old harmonizes with the new. Guided by ${leader}, this nation aspires to a future where the whispers of its history serve as a wellspring of inspiration, propelling it forward.`,
    `${country}'s heart, ${capital}, pulsates with celebration, blending the past and present seamlessly. Under the leadership of ${leader}, this nation revels in a future where the echoes of its history resound as a source of celebration and inspiration amidst the march of progress.`,
    `Amidst the ever-changing landscape of ${capital}, ${country} clings to its roots with a touch of sadness. ${leader}'s leadership yearns for a future where the echoes of its past are fondly remembered, even as the tides of progress sweep in.`,
    `In the heart of ${capital}, ${country} pays solemn homage to its heritage while adapting to modernity. Guided by the wise hand of ${leader}, this nation aspires to a future where the echoes of its past are venerated, serving as guiding lights on the path of progress.`,
    `${country} radiates joy with ${capital} as its vibrant heart, seamlessly blending tradition and innovation. Under the visionary guidance of ${leader}, this nation forges a future where its illustrious past harmonizes with the brilliance of progress.`,
    `Deep within the heart of ${capital}, ${country} carries the weight of its history, blending it with the challenges of today. In the shadow of ${leader}'s leadership, this nation walks a path toward a future where the echoes of the past are solemnly honored amidst the struggle for progress.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

const landmarks = [
  "Tower of Serenity",
  "Sapphire Falls",
  "Eternal Archway",
  "Whispering Grove",
  "Golden Citadel",
  "Crystal Springs",
  "Luminous Bridge",
  "Enchanted Caves",
  "Radiant Observatory",
  "Moonlit Gardens",
  "Secret Labyrinth",
  "Celestial Palace",
  "Hidden Waterfalls",
  "Starlight Plaza",
  "Ethereal Monastery",
  "Timeless Ruins",
  "Sun-Kissed Temples",
  "Mirage Oasis",
  "Sacred Grove",
  "Dragon's Roost",
  "Ivory Tower",
  "Emerald Canyons",
  "Ancient Coliseum",
  "Misty Highlands",
  "Thundering Waterfalls",
  "Grand Bazaar",
  "Quicksilver Bridge",
  "Forgotten Library",
  "Midnight Cathedral",
  "Whimsical Forest",
  "Enchanted Springs",
  "Cosmic Observatory",
  "Garden of Echoes",
  "Ivory Palisade",
  "Serpent's Spire",
  "Resplendent Sanctuary",
  "Verdant Plateau",
  "Crystal Lagoon",
  "Whispering Willows",
  "Silver Citadel",
  "Shimmering Pools",
  "Celestial Archipelago",
  "Ruined Kingdom",
  "Fiery Abyss",
  "Frozen Wastelands",
  "Enigmatic Obelisks",
  "Wailing Chasm",
];

// This expanded list of fictional landmarks can add even more variety to your country descriptions.
