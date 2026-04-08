import nslad from '../assets/works/studio/nslAD.mp4';
import chef from '../assets/works/studio/chef.mp4';
import nslpf from '../assets/works/studio/nslpf.jpg';
import nsl from '../assets/works/studio/nsl.mp4';
import toyotaImg from '../assets/works/studio/toyota.jpg';
import toyota from '../assets/works/studio/toyota.mp4';
import lenskartImg from '../assets/works/studio/lenskart.png';
import lenskart from '../assets/works/studio/lenskart.mp4';
import negamesImg from '../assets/works/studio/negames.jpg';
import negames from '../assets/works/studio/negames.mp4';
import nftImg from '../assets/works/studio/nft.jpg';
import nft from '../assets/works/studio/nft.mp4';
import nslpfIMG from '../assets/works/marketing/nslpf.jpg';
import tribe from '../assets/works/marketing/tribe.jpg';
import big from '../assets/works/marketing/big.jpg';
import midnight from '../assets/works/marketing/midnight.jpg';
import dmf from '../assets/works/marketing/dmf.jpg';
import am from '../assets/works/marketing/am.jpg';
import fullPlayOffs from '../assets/works/design/NSL/FULL PLAY OFFS.jpg';
import ohanki from '../assets/works/design/ohanki/ohanki.png';
import jv from '../assets/works/design/JV/JV Back Drop.jpg';
import Bloom from '../assets/works/design/Bloom Bazaar/Bloom Bazaar.jpg';
import ahibi from '../assets/works/tech/ahibi.jpg';
import melita from '../assets/works/tech/melita.png';
import ohankiTech from '../assets/works/tech/ohanki.jpg';
import orija from '../assets/works/tech/orija.jpg';
import nslCase from '../assets/works/casestudy/nsl.png';
import ohankiCase from '../assets/works/casestudy/ohanki.png';
import tfcCase from '../assets/works/casestudy/tfc.jpg';


const projects = [
    {
        id: 1,
        title: 'NSL Ad Commercial',
        category: 'Studio',
        description: 'High-impact sports film for “Every dream begins with a simple kick” campaign by Nagaland Super League.',
        // image: '/works/studio/nsl.png',
        video: nslad,
        year: '2024',
        client: 'NSL'
    },
    {
        id: 2,
        title: 'Chef Salang',
        category: 'Studio',
        description: 'Photography, video production, and post-production for culinary storytelling and brand visuals. From kitchen prep to final plating, we crafted a story-driven video that highlights Chef Salang’s passion, process, and personality.',
        // image: '/works/studio/nsl.png',
        video: chef,
        year: '2024',
        client: 'Chef Salang'
    },
    {
        id: 3,
        title: 'NSL Trophy Reveal Ad',
        category: 'Studio',
        description: 'High-energy sports commercial unveiling the NSL Trophy with cinematic flair.',
        image: nslpf,
        video: nsl,
        year: '2024',
        client: 'NSL'
    },
    {
        id: 4,
        title: 'Toyota Commercial',
        category: 'Studio',
        description: 'Dynamic car commercial driven by the line, “Life is a journey, Toyota is the car.”',
        image: toyotaImg,
        video: toyota,
        year: '2023',
        client: 'Toyota'
    },
    {
        id: 5,
        title: 'Lenskart Boost',
        category: 'Studio',
        description: 'Energetic commercial for Lenskart Boost featuring Combat Academy fighters in Dimapur.',
        image: lenskartImg,
        video: lenskart,
        year: '2023',
        client: 'Lenskart'
    },
    {
        id: 6,
        title: 'North East Games',
        category: 'Studio',
        description: 'High-end Olympic promo film spotlighting Ruopfuzhano Whiso for North East Games.',
        image: negamesImg,
        video: negames,
        year: '2022',
        client: 'Nagaland Olympics Association'
    },
    {
        id: 7,
        title: 'NFT Commercial',
        category: 'Studio',
        description: 'High-end NFT ad film exploring avatar identity, digital ownership, and cyber-culture in Neo Miami.',
        image: nftImg,
        video: nft,
        year: '2021',
        client: 'Karbon XS'
    },
    {
        id: 8,
        title: 'Nagaland Super League',
        category: 'Marketing',
        description: `KAKI Marketing served as the official media and marketing partner for the inaugural season of the Nagaland Super League (NSL), a landmark football league uniting seven franchise teams from across the state. From brand strategy and visual identity to on-ground media coverage and social media management, our team helped engage over 60,000+ fans and highlight local football talent on a professional stage.`,
        image: nslpfIMG,
        year: '2024',
        client: 'NSL'
    },
    {
        id: 9,
        title: 'Tribe Fighting Championship',
        category: 'Marketing',
        description: `KAKI Marketing served as the official marketing partner for the highly anticipated Tribe Fighting Championship Fight Night, a professional MMA event that showcased both local and international fighters. Held at Dimapur's Indoor Badminton Stadium, the event featured five high-impact bouts across multiple weight categories and was widely covered in local media.`,
        image: tribe,
        year: '2024',
        client: 'TFC'
    },
    {
        id: 10,
        title: 'The Big Laugh',
        category: 'Marketing',
        description: `KAKI Marketing was proud to partner on “The Big Laugh,” a landmark stand-up comedy event headlined by international sensation Mark Angel Comedy, alongside Nagaland’s own Dreamz Unlimited, Juztino, and a lineup of local performers. The event was a milestone for the comedy scene in Nagaland.`,
        image: big,
        year: '2024',
        client: 'The Big Laugh'
    },
    {
        id: 11,
        title: 'The Midnight',
        category: 'Marketing',
        description: `KAKI Marketing was part of “Midnight in Nagaland,” a landmark concert featuring the globally acclaimed synthwave band The Midnight on their debut India tour. Held at Noune Resort, the event brought together thousands of music lovers for an unforgettable night of sound, lights, and celebration.`,
        image: midnight,
        year: '2024',
        client: 'The Midnight'
    },
    {
        id: 12,
        title: 'DMF',
        category: 'Marketing',
        description: `KAKI Marketing proudly served as the official marketing partner for the 5th edition of the Dimapur Music Festival (DMF) 2023, affectionately known as “The Happy Fest.” Held at Noune Resort’s scenic Picnic Island, the event celebrated music, community and creativity, featuring headline acts like Polar Lights, Trance Effect, Euphonic (winner of Tafma’s Battle of Bands), and more .`,
        image: dmf,
        year: '2024',
        client: 'DMF'
    },
    {
        id: 13,
        title: 'AM to PM with Melita',
        category: 'Marketing',
        description: `KAKI Marketing partnered with Melita Skincare to host “AM to PM with Melita,” an evening of beauty, relaxation, and lifestyle at the upscale Casablanco lounge. The event showcased Melita’s luxury skincare range, with exclusive demos, complimentary drinks, and live performances by DJ Sanaa.`,
        image: am,
        year: '2024',
        client: 'Melita'
    },
    {
        id: 14,
        title: 'Nagaland Super League (NSL) – Visual Identity',
        category: 'Design',
        description: `Complete brand identity and design system for Nagaland’s first professional football league, including logo, visual guidelines, matchday graphics, and digital collateral.
      Nagaland Super League 
      Created a dynamic league identity that energized fans, elevated the matchday atmosphere, and positioned NSL as a transformative movement for football and youth culture in Nagaland.`,
        image: fullPlayOffs,
        year: '2025',
        client: 'Nagaland Super League'
    },
    {
        id: 15,
        title: 'Ohan Ki – Brand & Packaging Design',
        category: 'Design',
        description: `
      Complete brand identity, logo, packaging, and website design for premium food brand Ohan Ki.
       Ohan Ki
      Crafted a fresh, modern look—seamlessly blending tradition with contemporary appeal across all touchpoints, from logo to shelf to screen.
      `,
        image: ohanki,
        year: '2024',
        client: 'Ohan Ki'
    },
    {
        id: 16,
        title: 'JV Foundation Basketball Tournament',
        category: 'Design',
        description: `
      Complete event branding for Nagaland’s premier youth basketball tournament—covering logo, posters, digital promotions, prize graphics, and partnership collateral.
      Jonathan and Vikaito (JV) Foundation
      Energized the tournament with bold visuals, clear information design, and a vibrant sports identity that inspired youth participation and community engagement.
      `,
        image: jv,
        year: '2024',
        client: 'Jonathan and Vikaito (JV) Foundation'
    },
    {
        id: 17,
        title: 'Bloom Bazaar Dimapur – Event Branding',
        category: 'Design',
        description: `
      Complete event branding for Dimapur’s largest lifestyle bazaar—covering hoardings, social media, merchandise, and newspaper campaigns.
      Bloom Bazaar
      Brought the bazaar to life with vibrant, cohesive visuals—creating an energetic marketplace atmosphere across every touchpoint, from print to digital to on-ground experience.
      `,
        image: Bloom,
        year: '2023',
        client: 'Bloom Bazaar'
    },
    {
        id: 18,
        title: 'Ahibi',
        category: 'Tech',
        description: `Tech-powered event platform built by Kaki to streamline bookings, AR experiences, and ticketing across Nagaland.`,
        image: ahibi,
        link: 'https://www.ahibi.in/',
        year: '2024',
        client: 'Ahibi'
    },
    {
        id: 19,
        title: 'Melita',
        category: 'Tech',
        description: `Modern e-commerce site for Milita’s skincare range, combining beauty, wellness, and clean design.`,
        image: melita,
        year: '2023',
        link: '',
        client: 'Melita'
    },
    {
        id: 20,
        title: 'Ohanki',
        category: 'Tech',
        description: `Clean, functional website crafted for Ohanki to showcase their fresh, ready-to-eat food and delivery model.`,
        image: ohankiTech,
        link: '',
        year: '2024',
        client: 'Ohanki'
    },
    {
        id: 21,
        title: 'Orija',
        category: 'Tech',
        description: `Warm, accessible website designed for Orija — combining elder care, craft therapy, and lifestyle innovation.`,
        image: orija,
        link: '',
        year: '2023',
        client: 'Orija'
    },
    {
        id: 22,
        title: 'Melita Luxury Skincare',
        category: 'Case Study',
        description: `Melita Luxury Skincare is a Bangalore-based, science-driven skincare brand redefining luxury for Indian skin. With a vision to make high-efficacy, vegan, and sustainable skincare accessible, Melita set its sights on the Northeast—an emerging market with unique skin needs and growing demand for premium beauty.`,
        image: melita,
        link: '',
        year: '2024',
        client: 'Melita'
    },
    {
        id: 23,
        title: 'Ohanki',
        category: 'Case Study',
        description: `Ohan Ki. Dimapur’s trusted name for authentic Naga smoked meats and indigenous cuisine.`,
        image: ohankiCase,
        link: '',
        year: '2024',
        client: 'Ohanki'
    },
    {
        id: 24,
        title: 'Nagaland Super League',
        category: 'Case Study',
        description: `From zero online presence to 6M+ video views – here’s how we built Nagaland’s biggest football league from the ground up.`,
        image: nslCase,
        link: '',
        year: '2024',
        client: 'NSL'
    },
    {
        id: 25,
        title: 'Tribe Fighting Championship (TFC)',
        category: 'Case Study',
        description: `Tribe Fighting Championship (TFC) was launched by Combat Academy Dimapur as the region’s first premium combat sports event featuring both international and local fighters.`,
        image: tfcCase,
        link: '',
        year: '2023',
        client: 'TFC'
    },
];

export default projects;