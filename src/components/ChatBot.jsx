import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, User, ChevronDown, Sparkles, ArrowRight, Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';

// ===== VOICE HOOKS =====
const SpeechRecognitionAPI = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

function useVoiceInput(lang) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const result = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setTranscript(result);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, setTranscript, supported: !!SpeechRecognitionAPI };
}

function speakText(text, lang, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  // Strip markdown for clean speech
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/[•📸🍱👕🛒📚👜📱📦🎁🏢🚴🌟📊⚡📋📧👤🤔😊💡⚠️💚🎉🎯✨👌👍🔄🌿🍗🤝📧🏙️❓🦸👋🎙️👇🇬🇧🇮🇳🗺️💪🙏]/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = lang === 'hi' ? 0.95 : 1.05;
  utterance.pitch = 1;

  // Try to find a good voice
  const voices = window.speechSynthesis.getVoices();
  if (lang === 'hi') {
    const preferred = voices.find(v => v.lang.startsWith('hi')) ||
                      voices.find(v => v.lang.includes('IN'));
    if (preferred) utterance.voice = preferred;
  } else {
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
                      voices.find(v => v.lang.startsWith('en-IN')) ||
                      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
  }

  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

// ===== ENGLISH KNOWLEDGE BASE =====
const KNOWLEDGE_EN = [
  {
    keywords: ['hello', 'hi', 'hey', 'hola', 'namaste', 'start'],
    response: `👋 **Namaste! Welcome to ServeZone!**\n\nI'm your AI assistant. I can help you with:\n\n🍱 **Donating** — food, clothes, ration, books & more\n🏢 **NGO** — claiming & receiving donations\n🚴 **Volunteering** — delivering donations\n🌟 **Influencer Collabs** — partnering with NGOs\n📊 **Impact** — tracking your contribution\n\nJust ask me anything! For example: *"How do I donate clothes?"*`
  },
  {
    keywords: ['donate', 'donation', 'give', 'contribute', 'how to donate'],
    response: `🎁 **How to Donate on ServeZone:**\n\n1. **Sign up** as a Donor on the Signup page\n2. Go to your **Donor Dashboard**\n3. Click **"Post Donation"** button\n4. **Choose a category**: Food 🍱, Clothes 👕, Ration 🛒, Books 📚, Accessories 👜, Electronics 📱\n5. Fill in item name, quantity, description & photo\n6. For **food**: set veg/non-veg type & freshness window\n7. For **non-food**: select item condition (New, Like New, Gently Used)\n8. Hit **Post** — we'll auto-match you with a nearby NGO!\n\n💡 *Tip: You can filter your donations by category on the dashboard.*`
  },
  {
    keywords: ['food', 'meal', 'surplus food', 'restaurant', 'leftover'],
    response: `🍱 **Food Donations:**\n\nServeZone started as a food rescue platform! Here's how food donation works:\n\n• Post surplus food with **photo, quantity & freshness timer**\n• Choose **Veg 🌿** or **Non-Veg 🍗** type\n• Set a **freshness window** (1h to 6h) — a countdown timer starts\n• Our algorithm **auto-matches** with the nearest NGO\n• A **volunteer picks up** and delivers in real-time\n• Track everything on the **Impact Dashboard** 📊\n\n⚠️ *Food has an expiry timer — we prioritize it for fastest delivery!*`
  },
  {
    keywords: ['clothes', 'clothing', 'jacket', 'sweater', 'shirt', 'winter'],
    response: `👕 **Clothes Donations:**\n\nYou can donate all types of clothing!\n\n• **Winter wear**: Jackets, sweaters, blankets\n• **School uniforms**: Shirts, pants, skirts\n• **Daily wear**: Any clean, wearable clothes\n• **Footwear**: Shoes, sandals, slippers\n\n**How it works:**\n1. Select **"Clothes" category** when posting\n2. Choose condition: ✨ New, 👌 Like New, 👍 Gently Used\n3. Mention sizes & quantity\n4. We'll match you with NGOs like **Goonj Foundation** that specialize in clothing relief!\n\n💡 *Gently used clothes in good condition are always welcome!*`
  },
  {
    keywords: ['ration', 'grocery', 'rice', 'dal', 'oil', 'wheat', 'flour'],
    response: `🛒 **Ration & Grocery Donations:**\n\nDonate dry ration and grocery items:\n\n• **Grains**: Rice, wheat flour (atta), dal\n• **Essentials**: Cooking oil, salt, sugar, spices\n• **Packaged**: Biscuits, noodles, dry snacks\n• **Kits**: Pre-packed monthly ration kits\n\nRation donations are matched with NGOs like **Akshaya Patra** and **Robin Hood Army** who distribute them to families in need.\n\n💡 *Unlike food, ration has no expiry timer — it can be stored and distributed over time.*`
  },
  {
    keywords: ['book', 'textbook', 'stationery', 'school supply', 'ncert', 'study'],
    response: `📚 **Books & Stationery Donations:**\n\nHelp kids learn by donating:\n\n• **Textbooks**: NCERT, reference books (any class)\n• **Novels & stories**: Fiction, non-fiction\n• **Stationery**: Notebooks, pens, pencils, erasers\n• **Exam prep**: Guide books, previous year papers\n\nThese go to children in underserved schools through our NGO partners.\n\n💡 *Old edition textbooks are perfectly fine — content barely changes!*`
  },
  {
    keywords: ['accessories', 'bag', 'watch', 'belt', 'jewelry', 'water bottle'],
    response: `👜 **Accessories Donations:**\n\nDonate useful accessories:\n\n• **School bags** & backpacks\n• **Water bottles** & lunch boxes\n• **Belts, watches**, and everyday items\n• **Toys** & games for children\n\nSelect condition (New/Like New/Gently Used) when posting. These items are especially popular with school-going children!`
  },
  {
    keywords: ['influencer', 'collab', 'collaboration', 'instagram', 'youtube', 'social media', 'creator', 'partner'],
    response: `🌟 **Influencer Collaborations:**\n\nServeZone connects influencers directly with verified NGOs!\n\n**How it works:**\n1. Visit the **Influencers** page (link in navbar)\n2. Browse our **NGO Directory** — see their cause & impact\n3. Fill the **Collaboration Form**: your name, platform, followers, and message\n4. We **review & connect** you with the NGO within 24 hours\n5. **Run campaigns** together — donation drives, content, fundraisers\n\n**Supported platforms:** Instagram, YouTube, Twitter/X, and more!\n\n💡 *Even micro-influencers (1K+ followers) can make a huge impact!*`
  },
  {
    keywords: ['ngo', 'organization', 'receive', 'claim', 'accept donation'],
    response: `🏢 **For NGOs:**\n\nAs an NGO on ServeZone, you can:\n\n• **Browse available donations** (food, clothes, ration, books) on your dashboard\n• **Filter by category** — find what your organization needs\n• **Claim donations** with one click\n• **Track incoming deliveries** with live volunteer tracking on the map\n• **View delivery progress**: Donor → Picked Up → In Transit → Delivered\n• See ETA and call the volunteer directly\n\n**Our NGO partners include:** Feeding India, Akshaya Patra, Goonj Foundation, Robin Hood Army.`
  },
  {
    keywords: ['volunteer', 'deliver', 'pickup', 'ride', 'driver'],
    response: `🚴 **Volunteering:**\n\nVolunteers are the heroes of ServeZone!\n\n**How to volunteer:**\n1. **Sign up** as a Volunteer\n2. See **available pickups** on your dashboard map\n3. **Accept a delivery** — get route directions\n4. **Pick up** the donation from the donor\n5. **Deliver** to the NGO — mark as delivered\n6. Track your stats: deliveries, km traveled, hours volunteered\n\n**Features:**\n• 🗺️ Real-time map with route\n• 🎙️ Voice assistant for hands-free updates\n• 📊 Personal impact stats\n\n💡 *Even 1-2 hours a week makes a huge difference!*`
  },
  {
    keywords: ['impact', 'stats', 'dashboard', 'track', 'metrics', 'data'],
    response: `📊 **Impact Dashboard:**\n\nTrack the real-world impact of ServeZone:\n\n• **12,847+ meals** saved\n• **4,520+ items** donated (clothes, books, etc.)\n• **38,541+ people** helped\n• **19,270 kg CO₂** offset\n• **45+ NGO** partners across **12 cities**\n\nVisit the **Impact** page (link in navbar) to see:\n• Weekly trends & growth charts\n• Top donors & volunteers leaderboards\n• Recent rescue activity feed\n\n💡 *Every donation is tracked and counted toward your personal impact score!*`
  },
  {
    keywords: ['how', 'work', 'process', 'step', 'explain', 'what is'],
    response: `⚡ **How ServeZone Works — 4 Simple Steps:**\n\n**Step 1: Post Your Donation** 📸\nHave surplus food, clothes, ration, or books? Post it with a photo and details.\n\n**Step 2: Auto-Match with NGO** 🎯\nOur algorithm instantly finds the closest NGO that accepts your donation category.\n\n**Step 3: Volunteer Delivery** 🚴\nA nearby volunteer picks up your donation and delivers it with real-time tracking.\n\n**Step 4: Impact Made!** 🎉\nYour donation reaches those in need. Zero waste. Impact tracked live.\n\n💡 *The entire process takes minutes, not hours!*`
  },
  {
    keywords: ['category', 'type', 'what can i donate', 'options', 'kinds'],
    response: `📋 **Donation Categories on ServeZone:**\n\n🍱 **Food** — Cooked meals, raw food, packaged items\n👕 **Clothes** — Clothing, footwear, winter wear\n🛒 **Ration & Groceries** — Rice, dal, oil, dry goods\n👜 **Accessories** — Bags, bottles, watches, belts\n📚 **Books & Stationery** — Textbooks, novels, school supplies\n📱 **Electronics** — Phones, chargers, gadgets\n📦 **Other** — Toys, furniture, household items\n\nEach category is matched with NGOs that specialize in distributing those items!`
  },
  {
    keywords: ['contact', 'support', 'help', 'issue', 'problem', 'bug'],
    response: `📧 **Need Help?**\n\nYou can reach us at:\n• **Email**: support@servezone.app\n• **Location**: New Delhi, India\n\nOr use this chat to ask any questions about the platform!\n\nCommon issues:\n• **Can't post donation?** → Make sure you're logged in as a Donor\n• **Not seeing donations?** → Check your category filter on the NGO dashboard\n• **Volunteer map not loading?** → Refresh the page and allow location access`
  },
  {
    keywords: ['signup', 'register', 'account', 'join', 'login', 'sign in'],
    response: `👤 **Creating an Account:**\n\n1. Click **"Get Started"** in the navbar\n2. Choose your role:\n   • 🎁 **Donor** — Donate food, clothes, ration & more\n   • 🏢 **NGO** — Receive & distribute donations\n   • 🚴 **Volunteer** — Deliver donations\n   • 🌟 **Influencer** — Collaborate with NGOs\n3. Fill in your name, email & password\n4. You'll be redirected to your dashboard!\n\n💡 *Already have an account? Click "Login" in the navbar.*`
  },
  {
    keywords: ['thank', 'thanks', 'awesome', 'great', 'nice', 'good', 'cool'],
    response: `😊 **Thank you!** Happy to help!\n\nRemember — every donation matters, no matter how small. Together we can make a real difference!\n\nAnything else I can help with? 💚`
  },
];

// ===== HINDI KNOWLEDGE BASE =====
const KNOWLEDGE_HI = [
  {
    keywords: ['नमस्ते', 'हेलो', 'हाय', 'शुरू', 'hello', 'hi', 'hey', 'namaste', 'start'],
    response: `🙏 **नमस्ते! ServeZone में आपका स्वागत है!**\n\nमैं आपका AI सहायक हूँ। मैं इनमें आपकी मदद कर सकता हूँ:\n\n🍱 **दान करें** — खाना, कपड़े, राशन, किताबें और बहुत कुछ\n🏢 **NGO** — दान प्राप्त करें और वितरण करें\n🚴 **स्वयंसेवा** — दान की डिलीवरी करें\n🌟 **इन्फ्लुएंसर** — NGO के साथ साझेदारी\n📊 **प्रभाव** — अपने योगदान को ट्रैक करें\n\nमुझसे कुछ भी पूछें! उदाहरण: *"कपड़े कैसे दान करें?"*`
  },
  {
    keywords: ['दान', 'दान करना', 'देना', 'योगदान', 'कैसे दान करें', 'donate', 'donation'],
    response: `🎁 **ServeZone पर दान कैसे करें:**\n\n1. Signup पेज पर **Donor** के रूप में रजिस्टर करें\n2. अपने **Donor Dashboard** पर जाएं\n3. **"Post Donation"** बटन पर क्लिक करें\n4. **श्रेणी चुनें**: खाना 🍱, कपड़े 👕, राशन 🛒, किताबें 📚, एक्सेसरीज़ 👜, इलेक्ट्रॉनिक्स 📱\n5. वस्तु का नाम, मात्रा, विवरण और फोटो भरें\n6. **खाने** के लिए: शाकाहारी/मांसाहारी और ताज़गी विंडो सेट करें\n7. **अन्य वस्तुओं** के लिए: स्थिति चुनें (नया, लगभग नया, अच्छी स्थिति में)\n8. **Post** दबाएं — हम आपको तुरंत नज़दीकी NGO से जोड़ देंगे!\n\n💡 *टिप: आप डैशबोर्ड पर श्रेणी से दान फ़िल्टर कर सकते हैं।*`
  },
  {
    keywords: ['खाना', 'भोजन', 'बचा हुआ खाना', 'रेस्टोरेंट', 'बचा', 'food', 'meal'],
    response: `🍱 **खाना दान:**\n\nServeZone एक फ़ूड रेस्क्यू प्लेटफ़ॉर्म के रूप में शुरू हुआ!\n\n• बचे हुए खाने को **फोटो, मात्रा और ताज़गी टाइमर** के साथ पोस्ट करें\n• **शाकाहारी 🌿** या **मांसाहारी 🍗** चुनें\n• **ताज़गी विंडो** सेट करें (1 से 6 घंटे) — काउंटडाउन शुरू होगा\n• हमारा एल्गोरिदम **निकटतम NGO** से ऑटो-मैच करेगा\n• एक **स्वयंसेवक** पिकअप और रियल-टाइम में डिलीवरी करेगा\n• सब कुछ **Impact Dashboard** पर ट्रैक करें 📊\n\n⚠️ *खाने की एक्सपायरी होती है — हम इसे सबसे तेज़ डिलीवरी के लिए प्राथमिकता देते हैं!*`
  },
  {
    keywords: ['कपड़े', 'कपड़ा', 'जैकेट', 'स्वेटर', 'शर्ट', 'सर्दी', 'clothes', 'clothing'],
    response: `👕 **कपड़े दान:**\n\nआप सभी प्रकार के कपड़े दान कर सकते हैं!\n\n• **सर्दी के कपड़े**: जैकेट, स्वेटर, कंबल\n• **स्कूल यूनिफ़ॉर्म**: शर्ट, पैंट, स्कर्ट\n• **रोज़ के कपड़े**: कोई भी साफ-सुथरे पहनने योग्य\n• **जूते-चप्पल**: शूज़, सैंडल, चप्पल\n\n**कैसे काम करता है:**\n1. पोस्ट करते समय **"Clothes" श्रेणी** चुनें\n2. स्थिति चुनें: ✨ नया, 👌 लगभग नया, 👍 अच्छी स्थिति में\n3. साइज़ और मात्रा बताएं\n4. हम आपको **गूंज फ़ाउंडेशन** जैसे NGOs से जोड़ेंगे!\n\n💡 *अच्छी स्थिति में पुराने कपड़ों का हमेशा स्वागत है!*`
  },
  {
    keywords: ['राशन', 'किराना', 'चावल', 'दाल', 'तेल', 'गेहूं', 'आटा', 'ration', 'grocery'],
    response: `🛒 **राशन और किराना दान:**\n\nसूखा राशन और किराने की चीज़ें दान करें:\n\n• **अनाज**: चावल, गेहूं का आटा, दाल\n• **ज़रूरी सामान**: खाना पकाने का तेल, नमक, चीनी, मसाले\n• **पैकेज्ड**: बिस्कुट, नूडल्स, सूखे स्नैक्स\n• **किट**: तैयार मासिक राशन किट\n\nराशन दान **अक्षय पात्र** और **रॉबिन हुड आर्मी** जैसे NGOs को मिलता है जो ज़रूरतमंद परिवारों में वितरण करते हैं।\n\n💡 *खाने के विपरीत, राशन की कोई एक्सपायरी नहीं — इसे स्टोर करके बांटा जा सकता है।*`
  },
  {
    keywords: ['किताब', 'पुस्तक', 'स्टेशनरी', 'स्कूल', 'ncert', 'पढ़ाई', 'book', 'study'],
    response: `📚 **किताबें और स्टेशनरी दान:**\n\nबच्चों की पढ़ाई में मदद करें:\n\n• **पाठ्यपुस्तकें**: NCERT, संदर्भ पुस्तकें (कोई भी कक्षा)\n• **कहानियाँ और उपन्यास**: फिक्शन, नॉन-फिक्शन\n• **स्टेशनरी**: कॉपी, पेन, पेंसिल, रबर\n• **परीक्षा तैयारी**: गाइड बुक्स, पिछले साल के पेपर\n\nये सब हमारे NGO पार्टनर्स के ज़रिए वंचित स्कूलों के बच्चों तक पहुँचती हैं।\n\n💡 *पुराने संस्करण की किताबें भी चलेंगी — सामग्री शायद ही बदलती है!*`
  },
  {
    keywords: ['एक्सेसरीज़', 'बैग', 'घड़ी', 'बेल्ट', 'बोतल', 'accessories', 'bag'],
    response: `👜 **एक्सेसरीज़ दान:**\n\nउपयोगी एक्सेसरीज़ दान करें:\n\n• **स्कूल बैग** और बैकपैक\n• **पानी की बोतलें** और लंच बॉक्स\n• **बेल्ट, घड़ियाँ** और रोज़मर्रा की चीज़ें\n• **खिलौने** और बच्चों के लिए गेम्स\n\nपोस्ट करते समय स्थिति चुनें (नया/लगभग नया/अच्छी स्थिति में)। ये चीज़ें स्कूल जाने वाले बच्चों में बहुत लोकप्रिय हैं!`
  },
  {
    keywords: ['इन्फ्लुएंसर', 'कोलैब', 'सहयोग', 'इंस्टाग्राम', 'यूट्यूब', 'सोशल मीडिया', 'क्रिएटर', 'influencer', 'collab'],
    response: `🌟 **इन्फ्लुएंसर सहयोग:**\n\nServeZone इन्फ्लुएंसर्स को सीधे सत्यापित NGOs से जोड़ता है!\n\n**कैसे काम करता है:**\n1. **Influencers** पेज पर जाएं (नेवबार में लिंक)\n2. हमारी **NGO डायरेक्टरी** ब्राउज़ करें — उनका उद्देश्य और प्रभाव देखें\n3. **सहयोग फ़ॉर्म** भरें: नाम, प्लेटफ़ॉर्म, फ़ॉलोअर्स और संदेश\n4. हम **24 घंटे** में आपको NGO से जोड़ देंगे\n5. साथ मिलकर **अभियान चलाएं** — दान ड्राइव, कंटेंट, फ़ंडरेज़र\n\n**समर्थित प्लेटफ़ॉर्म:** Instagram, YouTube, Twitter/X और अन्य!\n\n💡 *माइक्रो-इन्फ्लुएंसर (1K+ फ़ॉलोअर्स) भी बड़ा प्रभाव डाल सकते हैं!*`
  },
  {
    keywords: ['एनजीओ', 'संगठन', 'प्राप्त', 'दावा', 'स्वीकार', 'ngo', 'organization'],
    response: `🏢 **NGOs के लिए:**\n\nServeZone पर NGO के रूप में आप:\n\n• अपने डैशबोर्ड पर **उपलब्ध दान** (खाना, कपड़े, राशन, किताबें) ब्राउज़ करें\n• **श्रेणी से फ़िल्टर** करें — जो आपके संगठन को चाहिए\n• एक क्लिक से **दान क्लेम** करें\n• मैप पर **लाइव वॉलंटियर ट्रैकिंग** से डिलीवरी ट्रैक करें\n• **डिलीवरी प्रगति** देखें: Donor → Picked Up → In Transit → Delivered\n• ETA देखें और वॉलंटियर को सीधे कॉल करें\n\n**हमारे NGO पार्टनर्स:** Feeding India, अक्षय पात्र, गूंज फ़ाउंडेशन, रॉबिन हुड आर्मी।`
  },
  {
    keywords: ['स्वयंसेवक', 'वॉलंटियर', 'डिलीवरी', 'पिकअप', 'volunteer', 'deliver'],
    response: `🚴 **स्वयंसेवा (Volunteering):**\n\nस्वयंसेवक ServeZone के असली हीरो हैं!\n\n**कैसे स्वयंसेवक बनें:**\n1. **Volunteer** के रूप में साइनअप करें\n2. अपने डैशबोर्ड मैप पर **उपलब्ध पिकअप** देखें\n3. **डिलीवरी स्वीकार करें** — रूट निर्देश पाएं\n4. डोनर से दान **पिकअप करें**\n5. NGO तक **डिलीवर करें** — delivered मार्क करें\n6. अपने आंकड़े ट्रैक करें: डिलीवरी, किमी, घंटे\n\n**विशेषताएं:**\n• 🗺️ रूट के साथ रियल-टाइम मैप\n• 🎙️ हैंड्स-फ्री अपडेट के लिए वॉइस असिस्टेंट\n• 📊 व्यक्तिगत प्रभाव आंकड़े\n\n💡 *हफ़्ते में 1-2 घंटे भी बड़ा फ़र्क ला सकते हैं!*`
  },
  {
    keywords: ['प्रभाव', 'आंकड़े', 'डैशबोर्ड', 'ट्रैक', 'डेटा', 'impact', 'stats'],
    response: `📊 **प्रभाव डैशबोर्ड:**\n\nServeZone का वास्तविक प्रभाव ट्रैक करें:\n\n• **12,847+ भोजन** बचाए\n• **4,520+ वस्तुएं** दान (कपड़े, किताबें आदि)\n• **38,541+ लोगों** की मदद\n• **19,270 kg CO₂** ऑफसेट\n• **45+ NGO** पार्टनर **12 शहरों** में\n\n**Impact** पेज पर देखें:\n• साप्ताहिक ट्रेंड और ग्रोथ चार्ट\n• टॉप डोनर्स और वॉलंटियर्स लीडरबोर्ड\n• हालिया रेस्क्यू गतिविधि फ़ीड\n\n💡 *हर दान ट्रैक होता है और आपके प्रभाव स्कोर में जुड़ता है!*`
  },
  {
    keywords: ['कैसे', 'काम', 'प्रक्रिया', 'समझाओ', 'क्या है', 'how', 'work', 'process'],
    response: `⚡ **ServeZone कैसे काम करता है — 4 आसान कदम:**\n\n**चरण 1: अपना दान पोस्ट करें** 📸\nबचा हुआ खाना, कपड़े, राशन या किताबें? फोटो और विवरण के साथ पोस्ट करें।\n\n**चरण 2: NGO से ऑटो-मैच** 🎯\nहमारा एल्गोरिदम तुरंत निकटतम NGO खोजता है।\n\n**चरण 3: स्वयंसेवक द्वारा डिलीवरी** 🚴\nनज़दीकी स्वयंसेवक दान पिकअप करके रियल-टाइम ट्रैकिंग से डिलीवर करता है।\n\n**चरण 4: प्रभाव बना!** 🎉\nआपका दान ज़रूरतमंदों तक पहुँचता है। ज़ीरो बर्बादी। लाइव ट्रैकिंग।\n\n💡 *पूरी प्रक्रिया मिनटों में होती है, घंटों में नहीं!*`
  },
  {
    keywords: ['श्रेणी', 'प्रकार', 'क्या दान कर सकता', 'विकल्प', 'category', 'type', 'options'],
    response: `📋 **ServeZone पर दान श्रेणियाँ:**\n\n🍱 **खाना** — पकी हुई दाल, कच्चा खाना, पैकेज्ड आइटम\n👕 **कपड़े** — पहनावा, जूते, सर्दी के कपड़े\n🛒 **राशन और किराना** — चावल, दाल, तेल, सूखा सामान\n👜 **एक्सेसरीज़** — बैग, बोतलें, घड़ियाँ, बेल्ट\n📚 **किताबें और स्टेशनरी** — पाठ्यपुस्तकें, उपन्यास, स्कूल सामान\n📱 **इलेक्ट्रॉनिक्स** — फ़ोन, चार्जर, गैजेट\n📦 **अन्य** — खिलौने, फ़र्नीचर, घरेलू सामान\n\nहर श्रेणी उन NGOs से मैच होती है जो उन वस्तुओं के वितरण में विशेषज्ञ हैं!`
  },
  {
    keywords: ['संपर्क', 'सहायता', 'मदद', 'समस्या', 'बग', 'contact', 'support', 'help', 'problem'],
    response: `📧 **मदद चाहिए?**\n\nआप हमसे संपर्क कर सकते हैं:\n• **ईमेल**: support@servezone.app\n• **स्थान**: नई दिल्ली, भारत\n\nया इस चैट में कोई भी सवाल पूछें!\n\n**आम समस्याएं:**\n• **दान पोस्ट नहीं हो रहा?** → सुनिश्चित करें कि आप Donor के रूप में लॉगिन हैं\n• **दान दिखाई नहीं दे रहा?** → NGO डैशबोर्ड पर श्रेणी फ़िल्टर चेक करें\n• **मैप लोड नहीं हो रहा?** → पेज रिफ़्रेश करें और लोकेशन एक्सेस दें`
  },
  {
    keywords: ['साइनअप', 'रजिस्टर', 'अकाउंट', 'खाता', 'लॉगिन', 'signup', 'login', 'account'],
    response: `👤 **खाता बनाएं:**\n\n1. नेवबार में **"Get Started"** पर क्लिक करें\n2. अपनी भूमिका चुनें:\n   • 🎁 **Donor** — खाना, कपड़े, राशन दान करें\n   • 🏢 **NGO** — दान प्राप्त करें और वितरण करें\n   • 🚴 **Volunteer** — दान की डिलीवरी करें\n   • 🌟 **Influencer** — NGOs के साथ सहयोग करें\n3. नाम, ईमेल और पासवर्ड भरें\n4. आप अपने डैशबोर्ड पर पहुँच जाएंगे!\n\n💡 *पहले से खाता है? नेवबार में "Login" पर क्लिक करें।*`
  },
  {
    keywords: ['धन्यवाद', 'शुक्रिया', 'बहुत अच्छा', 'बढ़िया', 'thanks', 'thank', 'great', 'awesome'],
    response: `😊 **धन्यवाद!** मदद करके खुशी हुई!\n\nयाद रखें — हर दान मायने रखता है, चाहे कितना भी छोटा हो। साथ मिलकर हम सच में फ़र्क ला सकते हैं!\n\nकुछ और मदद चाहिए? 💚`
  },
];

const DEFAULT_RESPONSE_EN = `🤔 I'm not sure about that, but I can help with:\n\n• **"How to donate"** — Learn the donation process\n• **"Categories"** — See what you can donate\n• **"Influencer collab"** — Partner with NGOs\n• **"Volunteer"** — Start delivering\n• **"Impact"** — View platform stats\n\nTry asking about any of these topics! 😊`;

const DEFAULT_RESPONSE_HI = `🤔 मुझे इसका जवाब नहीं पता, लेकिन मैं इनमें मदद कर सकता हूँ:\n\n• **"दान कैसे करें"** — दान की प्रक्रिया सीखें\n• **"श्रेणियाँ"** — क्या-क्या दान कर सकते हैं\n• **"इन्फ्लुएंसर सहयोग"** — NGOs के साथ साझेदारी\n• **"स्वयंसेवा"** — डिलीवरी शुरू करें\n• **"प्रभाव"** — प्लेटफ़ॉर्म आंकड़े देखें\n\nइनमें से कुछ भी पूछें! 😊`;

const QUICK_ACTIONS_EN = [
  { label: '🍱 How to donate?', query: 'how to donate' },
  { label: '📋 Categories', query: 'what can i donate' },
  { label: '🌟 Influencer collab', query: 'influencer collaboration' },
  { label: '🚴 Volunteer', query: 'how to volunteer' },
  { label: '⚡ How it works', query: 'how does it work' },
];

const QUICK_ACTIONS_HI = [
  { label: '🍱 दान कैसे करें?', query: 'दान कैसे करें' },
  { label: '📋 श्रेणियाँ', query: 'क्या दान कर सकता' },
  { label: '🌟 इन्फ्लुएंसर सहयोग', query: 'इन्फ्लुएंसर सहयोग' },
  { label: '🚴 स्वयंसेवा', query: 'स्वयंसेवक कैसे बनें' },
  { label: '⚡ कैसे काम करता है', query: 'कैसे काम करता है' },
];

function getAIResponse(message, lang) {
  const lower = message.toLowerCase().trim();
  const knowledge = lang === 'hi' ? KNOWLEDGE_HI : KNOWLEDGE_EN;
  const defaultResp = lang === 'hi' ? DEFAULT_RESPONSE_HI : DEFAULT_RESPONSE_EN;
  
  // Find best match by counting keyword hits
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledge) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // longer keyword matches = higher relevance
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch ? bestMatch.response : defaultResp;
}

// ===== LANGUAGE TOGGLE BUTTON =====
function LanguageToggle({ lang, onChange }) {
  return (
    <button
      onClick={() => onChange(lang === 'en' ? 'hi' : 'en')}
      className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold select-none"
      title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      <Globe size={13} />
      <span className="uppercase tracking-wide">{lang === 'en' ? 'हिं' : 'EN'}</span>
    </button>
  );
}

// ===== MAIN COMPONENT =====
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('hi'); // default Hindi
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const voice = useVoiceInput(lang);

  // Generate welcome message based on current language
  const getWelcomeMessage = useCallback((language) => {
    if (language === 'hi') {
      return {
        id: 1,
        role: 'assistant',
        text: `🙏 **नमस्ते! मैं ServeZone AI सहायक हूँ।**\n\nमैं प्लेटफ़ॉर्म नेविगेट करने, फ़ीचर्स समझाने और दान, स्वयंसेवा, इन्फ्लुएंसर सहयोग से संबंधित सवालों के जवाब दे सकता हूँ।\n\n🎙️ आप **माइक** दबाकर हिंदी में बोल भी सकते हैं!\n\nनीचे कोई क्विक एक्शन चुनें या कुछ भी पूछें! 👇`,
        time: new Date(),
      };
    }
    return {
      id: 1,
      role: 'assistant',
      text: `👋 **Hi! I'm ServeZone AI Assistant.**\n\nI can help you navigate the platform, explain features, and answer questions about donating, volunteering, influencer collabs & more.\n\n🎙️ You can also **tap the mic** to speak your question!\n\nTry asking me something or tap a quick action below! 👇`,
      time: new Date(),
    };
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([getWelcomeMessage(lang)]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // When voice transcript changes, update input
  useEffect(() => {
    if (voice.transcript) {
      setInput(voice.transcript);
    }
  }, [voice.transcript]);

  // Auto-send when voice stops listening and there's a transcript
  useEffect(() => {
    if (!voice.isListening && voice.transcript) {
      const text = voice.transcript.trim();
      if (text) {
        setTimeout(() => {
          handleSendInternal(text);
          voice.setTranscript('');
        }, 300);
      }
    }
  }, [voice.isListening]);

  // Handle language change
  const handleLangChange = useCallback((newLang) => {
    setLang(newLang);
    window.speechSynthesis?.cancel();
    setSpeakingId(null);

    // Add a system-style message about the language switch
    const switchMsg = {
      id: Date.now(),
      role: 'assistant',
      text: newLang === 'hi'
        ? `🇮🇳 **भाषा बदली गई: हिंदी**\n\nअब मैं हिंदी में जवाब दूंगा। आप हिंदी या अंग्रेज़ी दोनों में टाइप या बोल सकते हैं!\n\n🎙️ माइक अब हिंदी सुनेगा।`
        : `🇬🇧 **Language changed: English**\n\nI'll now respond in English. You can type or speak in either language!\n\n🎙️ Mic is now listening in English.`,
      time: new Date(),
    };
    setMessages(prev => [...prev, switchMsg]);
  }, []);

  const handleSendInternal = useCallback((text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: messageText,
      time: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI "thinking" delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = getAIResponse(messageText, lang);
      const msgId = Date.now() + 1;
      const aiMsg = {
        id: msgId,
        role: 'assistant',
        text: response,
        time: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Auto-speak the response if enabled
      if (autoSpeak) {
        setSpeakingId(msgId);
        speakText(response, lang, () => setSpeakingId(null));
      }
    }, delay);
  }, [input, autoSpeak, lang]);

  const handleSend = useCallback((text) => {
    handleSendInternal(text);
  }, [handleSendInternal]);

  const handleSpeakMessage = useCallback((msg) => {
    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      setSpeakingId(msg.id);
      speakText(msg.text, lang, () => setSpeakingId(null));
    }
  }, [speakingId, lang]);

  const toggleMic = useCallback(() => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.setTranscript('');
      setInput('');
      voice.startListening();
    }
  }, [voice]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = lang === 'hi' ? QUICK_ACTIONS_HI : QUICK_ACTIONS_EN;

  return (
    <>
      {/* ===== FLOATING BUTTON ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group ${
          isOpen
            ? 'bg-surface-800 border border-white/10 rotate-0'
            : 'bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-500 hover:to-emerald-500 shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-110'
        }`}
        style={{ zIndex: 9999 }}
      >
        {isOpen ? (
          <X size={20} className="text-slate-400" />
        ) : (
          <>
            <MessageSquare size={22} className="text-white" />
            {/* Ping animation */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-surface-900 animate-pulse" />
          </>
        )}
      </button>

      {/* ===== CHAT PANEL ===== */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 animate-scale-in"
          style={{ zIndex: 9998, maxHeight: 'calc(100vh - 140px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-emerald-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white text-sm">
                  {lang === 'hi' ? 'ServeZone AI सहायक' : 'ServeZone AI Assistant'}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-[11px] text-white/70">
                    {lang === 'hi' ? 'ऑनलाइन • वॉइस 🎙️' : 'Online • Voice Enabled 🎙️'}
                  </span>
                </div>
              </div>
              {/* Language toggle */}
              <LanguageToggle lang={lang} onChange={handleLangChange} />
              {/* Auto-speak toggle */}
              <button
                onClick={() => { setAutoSpeak(!autoSpeak); window.speechSynthesis.cancel(); setSpeakingId(null); }}
                className={`p-1.5 rounded-lg transition-colors ${autoSpeak ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/40'}`}
                title={autoSpeak ? (lang === 'hi' ? 'वॉइस जवाब चालू' : 'Voice responses ON') : (lang === 'hi' ? 'वॉइस जवाब बंद' : 'Voice responses OFF')}
              >
                {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <ChevronDown size={18} className="text-white/70" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-surface-900 h-[380px] overflow-y-auto p-4 space-y-4 chatbot-messages" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                lang={lang}
                onSpeak={msg.role === 'assistant' ? () => handleSpeakMessage(msg) : undefined}
                isSpeaking={speakingId === msg.id}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-primary-400" />
                </div>
                <div className="bg-surface-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions — only show after first message */}
            {messages.length === 1 && !isTyping && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-600 font-medium uppercase tracking-wider">
                  {lang === 'hi' ? 'त्वरित कार्यवाही' : 'Quick Actions'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.query)}
                      className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/5 text-xs text-slate-400 hover:text-primary-400 hover:border-primary-500/30 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-surface-800 border-t border-white/5 px-4 py-3">
            {/* Voice listening indicator */}
            {voice.isListening && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs text-rose-400 font-medium">
                  {lang === 'hi' ? 'सुन रहा हूँ... अब बोलें' : 'Listening... speak now'}
                </span>
                <div className="flex-1" />
                <button onClick={() => voice.stopListening()} className="text-xs text-rose-400 hover:text-rose-300 font-medium">
                  {lang === 'hi' ? 'रुकें' : 'Stop'}
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Mic Button */}
              {voice.supported && (
                <button
                  onClick={toggleMic}
                  className={`p-2.5 rounded-xl transition-all ${voice.isListening
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                    : 'bg-surface-900 border border-white/5 text-slate-500 hover:text-primary-400 hover:border-primary-500/30'
                  }`}
                  title={voice.isListening
                    ? (lang === 'hi' ? 'सुनना बंद करें' : 'Stop listening')
                    : (lang === 'hi' ? 'अपना सवाल बोलें' : 'Speak your question')}
                >
                  {voice.isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={voice.isListening
                  ? (lang === 'hi' ? 'सुन रहा हूँ...' : 'Listening...')
                  : (lang === 'hi' ? 'टाइप करें या 🎙️ दबाएं...' : 'Type or tap 🎙️ to speak...')}
                className="flex-1 bg-surface-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/40 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              {lang === 'hi'
                ? '🎙️ वॉइस • हिंदी + English • ServeZone AI ✨'
                : '🎙️ Voice Enabled • Hindi + English • ServeZone AI ✨'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ===== CHAT MESSAGE BUBBLE ===== */
function ChatMessage({ message, lang, onSpeak, isSpeaking }) {
  const isUser = message.role === 'user';

  // Simple markdown-like formatting
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // Italic
      formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>');
      // Bullet points
      if (formatted.startsWith('• ') || formatted.startsWith('- ')) {
        return <div key={i} className="pl-2 py-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
      }
      if (formatted.trim() === '') return <div key={i} className="h-2" />;
      return <div key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-sky-500/20' : 'bg-primary-500/20'
      }`}>
        {isUser ? <User size={14} className="text-sky-400" /> : <Bot size={14} className="text-primary-400" />}
      </div>
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed border ${
          isUser
            ? 'bg-primary-600/20 border-primary-500/20 text-slate-200 rounded-tr-sm'
            : 'bg-surface-800 border-white/5 text-slate-400 rounded-tl-sm'
        }`}>
          {formatText(message.text)}
        </div>
        {/* Speaker button for AI messages */}
        {onSpeak && (
          <button
            onClick={onSpeak}
            className={`self-start flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
              isSpeaking
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-slate-600 hover:text-primary-400 hover:bg-surface-800 border border-transparent'
            }`}
          >
            {isSpeaking ? <Volume2 size={10} className="animate-pulse" /> : <Volume2 size={10} />}
            {isSpeaking
              ? (lang === 'hi' ? 'बोल रहा है...' : 'Speaking...')
              : (lang === 'hi' ? 'सुनें' : 'Listen')}
          </button>
        )}
      </div>
    </div>
  );
}
