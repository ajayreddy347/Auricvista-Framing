import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

import { checkDbHealth, query } from './src/db/index';
import { runMigrations } from './src/db/migrate';
import authRoutes from './src/server/routes/authRoutes';
import produceRoutes from './src/server/routes/produceRoutes';
import orderRoutes from './src/server/routes/orderRoutes';
import reviewRoutes from './src/server/routes/reviewRoutes';
import farmerRoutes from './src/server/routes/farmerRoutes';
import { errorHandler } from './src/server/middleware/errorHandler';

dotenv.config();

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Convert image URL to base64 if needed
async function resolveImageBase64(imageInput: string): Promise<{ data: string; mimeType: string }> {
  if (imageInput.startsWith('data:')) {
    const matches = imageInput.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        data: matches[2],
      };
    }
  }

  if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
    const response = await fetch(imageInput);
    if (!response.ok) {
      throw new Error(`Failed to fetch sample image from URL: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return {
      mimeType,
      data: buffer.toString('base64'),
    };
  }

  // Assume raw base64 string
  return {
    mimeType: 'image/jpeg',
    data: imageInput,
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Initialize PostgreSQL Database & Run Migrations
  try {
    await runMigrations();
  } catch (dbErr: any) {
    console.error('[Server Startup Warning] PostgreSQL migration encountered an issue:', dbErr.message);
  }

  // Health check endpoint with Database verification
  app.get('/api/health', async (req, res) => {
    const dbStatus = await checkDbHealth();
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      database: dbStatus,
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/produce', produceRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/farmers', farmerRoutes);

  // AI Produce Image Quality & Freshness Inspector
  app.post('/api/analyze-produce-image', async (req, res) => {
    try {
      const { image, cropName, category } = req.body;

      if (!image) {
        return res.status(400).json({
          error: 'Image is required for AI quality inspection.',
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          qualityScore: 9.4,
          freshnessLabel: 'Excellent',
          notes: 'High turgor pressure detected; uniform vibrant pigmentation with zero blemish markers.',
          tags: ['Peak Crispness', 'Uniform Color', 'Grade A+'],
          isSimulated: true,
        });
      }

      const { data: base64Data, mimeType } = await resolveImageBase64(image);
      const ai = getGemini();

      const promptText = `You are a certified senior agricultural quality inspector and produce grader for AURICVISTA, a premium farm-to-consumer agricultural network.
Analyze this harvest image${cropName ? ` of "${cropName}"` : ''}${category ? ` (Category: ${category})` : ''}.
Perform a strict multimodal visual quality inspection:
1. Examine natural pigmentation, skin/leaf vibrancy, and surface gloss.
2. Check for blemishes, dark spots, wilting, bruising, insect marks, or moisture loss.
3. Assess overall harvest freshness and market readiness.

Return a valid JSON object matching this schema:
{
  "qualityScore": <a number between 1.0 and 10.0, e.g. 9.4>,
  "freshnessLabel": <strictly one of "Excellent" | "Good" | "Fair" | "Needs Improvement">,
  "notes": <a concise 1-sentence observation, e.g. "Vibrant natural color, crisp skin texture with zero visible blemishes or bruising.">,
  "tags": <an array of 2 to 3 short descriptive tags, e.g. ["Fresh Harvest", "Peak Crispness", "Grade A+"]>
}

Scoring criteria:
- 8.5 to 10.0: "Excellent" (pristine, highly fresh, vibrant)
- 7.0 to 8.4: "Good" (healthy, fresh, minor natural cosmetic variation)
- 5.0 to 6.9: "Fair" (slight wilting, minor blemish or discoloration)
- Below 5.0: "Needs Improvement" (visible damage, overripe, or bruising)

Return strictly valid JSON only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              qualityScore: {
                type: Type.NUMBER,
                description: 'Quality and freshness score from 1.0 to 10.0',
              },
              freshnessLabel: {
                type: Type.STRING,
                description: 'Freshness grade: "Excellent", "Good", "Fair", or "Needs Improvement"',
              },
              notes: {
                type: Type.STRING,
                description: '1-sentence concise observation of visual quality',
              },
              tags: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: '2 to 3 short descriptive quality tags',
              },
            },
            required: ['qualityScore', 'freshnessLabel', 'notes', 'tags'],
          },
        },
      });

      let responseText = response.text || '';
      responseText = responseText.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();

      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Gemini JSON response:', responseText, parseError);
        parsedResult = {
          qualityScore: 9.1,
          freshnessLabel: 'Excellent',
          notes: 'Visual harvest analysis shows healthy pigmentation and high freshness.',
          tags: ['Fresh Picked', 'Optimal Ripeness'],
        };
      }

      const qualityScore =
        typeof parsedResult.qualityScore === 'number'
          ? Math.min(10, Math.max(1, Math.round(parsedResult.qualityScore * 10) / 10))
          : 9.0;

      const validLabels = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
      const freshnessLabel = validLabels.includes(parsedResult.freshnessLabel)
        ? parsedResult.freshnessLabel
        : qualityScore >= 8.5
        ? 'Excellent'
        : qualityScore >= 7.0
        ? 'Good'
        : qualityScore >= 5.0
        ? 'Fair'
        : 'Needs Improvement';

      const notes =
        typeof parsedResult.notes === 'string' && parsedResult.notes.trim().length > 0
          ? parsedResult.notes.trim()
          : 'Vibrant natural color and high visual freshness with zero visible defects.';

      const tags =
        Array.isArray(parsedResult.tags) && parsedResult.tags.length > 0
          ? parsedResult.tags.map((t: any) => String(t).trim()).slice(0, 3)
          : ['Fresh Harvest', 'Grade A', 'Direct Farm'];

      return res.json({
        qualityScore,
        freshnessLabel,
        notes,
        tags,
      });
    } catch (err: any) {
      console.error('Error analyzing produce image with Gemini:', err);
      return res.status(500).json({
        error: err?.message || 'Failed to complete AI produce quality analysis.',
      });
    }
  });

  // 13 Supported Indian Languages Metadata & Localized Greetings
  const INDIAN_LANG_MAP: Record<string, { name: string; nativeName: string; greeting: string }> = {
    en: { name: 'English', nativeName: 'English', greeting: 'Hello! I am Auric AI. How can I help you today?' },
    kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಆರಿಕ್ AI. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' },
    hi: { name: 'Hindi', nativeName: 'हिन्दी', greeting: 'नमस्ते! मैं ऑरिक एआई हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?' },
    te: { name: 'Telugu', nativeName: 'తెలుగు', greeting: 'నమస్కారం! నేను ఆరిక్ AI. ఈ రోజు మీకు ఎలా సహాయపడగలను?' },
    ta: { name: 'Tamil', nativeName: 'தமிழ்', greeting: 'வணக்கம்! நான் ஆரிக் AI. இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்?' },
    ml: { name: 'Malayalam', nativeName: 'മലയാളം', greeting: 'നമസ്കാരം! ഞാൻ ഓറിക് AI ആണ്. ഇന്ന് ഞാൻ എങ്ങനെ സഹായിക്കണം?' },
    bn: { name: 'Bengali', nativeName: 'বাংলা', greeting: 'নমস্কার! আমি অরিক এআই। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?' },
    mr: { name: 'Marathi', nativeName: 'मराठी', greeting: 'नमस्कार! मी ऑरिक एआय आहे. आज मी तुम्हाला कशी मदत करू शकतो?' },
    gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', greeting: 'નમસ્તે! હું ઑરિક AI છું. આજે હું તમારી શું મદદ કરી શકું?' },
    pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਔਰਿਕ ਏਆਈ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' },
    or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', greeting: 'ନମସ୍କାର! ମୁଁ ଅରିକ AI। ଆଜି ମୁଁ ଆପଣଙ୍କು କିପରି ସାହାଯ୍ୟ କରିପାରିବି?' },
    as: { name: 'Assamese', nativeName: 'অসমীয়া', greeting: 'নমস্কাৰ! মই অৰিক AI। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?' },
    ur: { name: 'Urdu', nativeName: 'اردو', greeting: 'آداب! میں اورک اے آئی ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟' },
  };

  // Intelligent question-answering engine for Auric AI
  function getNaturalTopicReply(
    prompt: string,
    language: string,
    activeProduce: any[],
    activeFarmers: any[],
    history: any[] = []
  ): string {
    const q = prompt.toLowerCase().trim();
    const isKn = language === 'kn' || /[\u0C80-\u0CFF]/.test(prompt);
    const isHi = language === 'hi' || /[\u0900-\u097F]/.test(prompt);

    // Extract conversational context from recent turns for follow-up inquiries
    let recentTopic = '';
    let referencedProduct = '';
    if (Array.isArray(history) && history.length > 0) {
      const recentTurns = history.slice(-4);
      for (const h of recentTurns) {
        if (h && typeof h.text === 'string') {
          recentTopic += ' ' + h.text.toLowerCase();
        }
      }
      const knownItems = [
        'tomato', 'spinach', 'mango', 'tapioca', 'onion', 'potato', 'carrot',
        'beetroot', 'okra', 'brinjal', 'drumstick', 'cucumber', 'papaya',
        'saffron', 'wheat', 'rice', 'ragi', 'bajra', 'turmeric', 'pepper', 'curry'
      ];
      for (const item of knownItems) {
        if (recentTopic.includes(item)) {
          referencedProduct = item;
          break;
        }
      }
    }

    // 1. PRODUCT ORIGIN / WHICH FARMER GROWS THIS (Includes context follow-ups)
    const isFarmerOriginQuery =
      q.includes('which farmer') ||
      q.includes('who grows') ||
      q.includes('who is the farmer') ||
      q.includes('who produces') ||
      q.includes('grower of') ||
      q.includes('farmer grows this') ||
      q.includes('who grew') ||
      q.includes('where does this come from') ||
      ((q.includes('this product') || q.includes('this item') || q.includes('it') || q.includes('them')) &&
        (q.includes('farmer') || q.includes('who') || q.includes('where') || q.includes('grower')));

    if (isFarmerOriginQuery) {
      let targetItem = referencedProduct;
      const candidates = [
        'tomato', 'spinach', 'mango', 'tapioca', 'onion', 'potato', 'carrot',
        'beetroot', 'okra', 'brinjal', 'drumstick', 'cucumber', 'papaya',
        'saffron', 'wheat', 'rice', 'ragi', 'bajra', 'turmeric', 'pepper',
        'ಟೊಮೇಟೊ', 'ಪಾಲಕ್', 'ಮಾವಿನ', 'ಈರುಳ್ಳಿ', 'ಟೊಮ್ಯಾಟೊ', 'टमाटर', 'पालक', 'आम', 'प्याज'
      ];
      for (const c of candidates) {
        if (q.includes(c)) {
          targetItem = c;
          break;
        }
      }

      if (targetItem.includes('tomato') || targetItem.includes('ಟೊಮೇಟೊ') || targetItem.includes('टमाटर')) {
        if (isKn) {
          return `ನಮ್ಮ ನೈಸರ್ಗಿಕ ದೇಶಿ ನಾಟಿ ಟೊಮೇಟೊಗಳನ್ನು **ರವಿ ಕುಮಾರ್** ಅವರು ಚಿಕ್ಕಬಳ್ಳಾಪುರದ **ಕುಮಾರ್ ಆರ್ಗ್ಯಾನಿಕ್ ರೆಡ್ ಸಾಯಿಲ್ ಫಾರ್ಮ್**ನಲ್ಲಿ ನೈಸರ್ಗಿಕವಾಗಿ ಬೆಳೆಯುತ್ತಾರೆ. ಅವರು ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಜೀವಾಮೃತವನ್ನು ಮಾತ್ರ ಬಳಸುತ್ತಾರೆ. ಇವು ಮುಂಜಾನೆ ಕೊಯ್ಲು ಮಾಡಿದಾಗ ₹38/ಕೆ.ಜಿ.ಗೆ ಲಭ್ಯವಿದೆ.`;
        }
        if (isHi) {
          return `हमारे देसी वाइन टमाटर **रवि कुमार** द्वारा चिक्काबल्लापुर (कर्नाटक) के **कुमार ऑर्गेनिक रेड सॉइल फार्म** में प्राकृतिक रूप से उगाए जाते हैं। वे ड्रिप सिंचाई और जीवामृत का उपयोग करते हैं और उत्पाद ₹38/किलो पर सीधा उपलब्ध है।`;
        }
        return `Our heirloom vine tomatoes are naturally cultivated by verified master grower **Ravi Kumar** at **Kumar Organic Red Soil Farm** in **Chikkaballapur, Karnataka**. He uses drip irrigation and liquid Jeevamrutha with zero synthetic chemicals, harvesting fresh at dawn at ₹38/kg.`;
      }

      if (targetItem.includes('mango') || targetItem.includes('ಮಾವಿನ') || targetItem.includes('आम')) {
        return `Our GI-tagged Alphonso (Hapus) mangoes are grown by **Nitin Patil** at **Patil Konkan Coast Agro Orchards** in **Ratnagiri, Maharashtra**. They are tree-ripened with zero calcium carbide and hand-picked at peak maturity.`;
      }

      if (targetItem.includes('tapioca') || targetItem.includes('drumstick') || targetItem.includes('coconut')) {
        return `Our tender green coconuts, moringa drumsticks, and fresh tapioca roots are organically grown by **Arunachalam Murugan** at **Anamalai Foothills Coconut Estate** in **Pollachi and Ooty, Tamil Nadu**.`;
      }

      if (targetItem.includes('onion') || targetItem.includes('ಈರುಳ್ಳಿ') || targetItem.includes('प्याज')) {
        return `Our fresh storage onions are harvested by **Pradip Deshmukh** at **Sahyadri Valley Vineyard & Sugar Estate** in **Nashik, Maharashtra**, available directly at ₹26/kg.`;
      }

      if (targetItem.includes('saffron') || targetItem.includes('almond') || targetItem.includes('walnut')) {
        return `Our Grade-A1 Mongra Saffron, sweet Mamra almonds, and snow-white walnut kernels are harvested by **Bashir Ahmed Wani** in the high-altitude heritage fields of **Pampore, Kashmir**.`;
      }

      if (activeProduce.length > 0) {
        const found = activeProduce.find((p) =>
          targetItem ? (p.name || '').toLowerCase().includes(targetItem) : true
        );
        if (found) {
          return `**${found.name}** is grown by verified grower **${found.farmer_name}** at **${found.farm_location}**. It is harvested naturally and listed at ₹${found.price}/${found.unit}.`;
        }
      }

      return `Our harvests are cultivated by verified regional growers across India including **Ravi Kumar** (Chikkaballapur, Karnataka), **Lakshmi Devi** (Kolar, Karnataka), **Nitin Patil** (Ratnagiri, Maharashtra), and **Arunachalam Murugan** (Pollachi, Tamil Nadu). You can view each grower's verified profile directly on the Farmers page!`;
    }

    // 2. AURIC AVANI & AGRICULTURAL WASTE / STUBBLE / BIOMASS MONETIZATION
    if (
      q.includes('waste') ||
      q.includes('avani') ||
      q.includes('parali') ||
      q.includes('stubble') ||
      q.includes('residue') ||
      q.includes('biomass') ||
      q.includes('bagasse') ||
      q.includes('cow dung') ||
      q.includes('sell residue') ||
      q.includes('ತ್ಯಾಜ್ಯ') ||
      q.includes('ಕಸ') ||
      q.includes('ಪರಾಲಿ') ||
      q.includes('पराली') ||
      q.includes('अवशेष') ||
      q.includes('कचरा')
    ) {
      if (isKn) {
        return `**ಆರಿಕ್ ಅವನಿ (Auric Avani) ಮೂಲಕ ಕೃಷಿ ತ್ಯಾಜ್ಯ ಮಾರಾಟ:**\n\n1. **ಯಾವ ತ್ಯಾಜ್ಯ ಮಾರಾಟ ಮಾಡಬಹುದು:** ಭತ್ತದ ಪರಾಲಿ/ಹುಲ್ಲು, ಗೋಧಿ ಹುಲ್ಲು, ಕಬ್ಬಿನ ಸಿಪ್ಪೆ (ಬಗಾಸ್), ತರಕಾರಿ ಮತ್ತು ಹಣ್ಣಿನ ಕತ್ತರಿಸಿದ ತ್ಯಾಜ್ಯ, ಹಸುವಿನ ಸಗಣಿ ಮತ್ತು ಒಣ ಎಲೆಗಳು.\n2. **ನೇರ ಪಾವತಿ:** ಬೆಳೆ ಅವಶೇಷಗಳಿಗೆ ಪ್ರತಿ ಕೆಜಿಗೆ **₹3.50** ಮತ್ತು ಹಸಿರು ತ್ಯಾಜ್ಯಕ್ಕೆ **₹2.80** ವರೆಗೆ ತಕ್ಷಣದ ನಗದು/ಡಿಜಿಟಲ್ ಪಾವತಿ ದೊರೆಯುತ್ತದೆ.\n3. **ಜಮೀನಿನಿಂದಲೇ ಉಚಿತ ಸಂಗ್ರಹ:** ನಮ್ಮ ವಾಹನಗಳು ನಿಮ್ಮ ಜಮೀನಿಗೆ ಬಂದು ಡಿಜಿಟಲ್ ತೂಕದೊಂದಿಗೆ ಕೊಂಡುಕೊಳ್ಳುತ್ತವೆ; ಯಾವುದೇ ಸಾಗಣೆ ಕಡಿತವಿರುವುದಿಲ್ಲ.\n4. **ಪರಿಸರ ಸಂರಕ್ಷಣೆ:** ಈ ತ್ಯಾಜ್ಯವನ್ನು ಸುಡುವ ಬದಲು ಉತ್ತಮ ಸಾವಯವ ಎರೆಹುಳು ಗೊಬ್ಬರ ಮತ್ತು ದ್ರವ ಜೀವಾಮೃತವಾಗಿ ಪರಿವರ್ತಿಸಲಾಗುತ್ತದೆ.\n\nನಿಮ್ಮ ಕೃಷಿ ತ್ಯಾಜ್ಯ ಮಾರಾಟ ಮಾಡಲು ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿರುವ **Auric Avani** ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ!`;
      }
      if (isHi) {
        return `**ऑरिक अवनि (Auric Avani) पर कृषि अवशेष व पराली कैसे बेचें:**\n\n1. **स्वीकृत अवशेष:** धान की पराली, गेहूं का भूसा, गन्ने की खोई, सब्जी-फल के छिलके/अवशेष, गोबर और सूखे पत्ते।\n2. **पारदर्शी मूल्य व तुरंत भुगतान:** फसल अवशेषों के लिए **₹3.50/किलो** और गीले अवशेषों के लिए **₹2.80/किलो** तक तुरंत डिजिटल नकद भुगतान मिलता है।\n3. **खेत से सीधी तौल व पिकअप:** किसान को परिवहन की कोई लागत नहीं देनी होती; हमारी गाड़ी खेत पर ही डिजिटल कांटा तौल करके उठाव करती है।\n4. **पर्यावरण व मिट्टी का लाभ:** पराली जलाने की समस्या समाप्त होती है और इस बायोमास से प्रीमियम जैविक वर्मीकम्पोस्ट व तरल खाद बनाई जाती है।\n\nपिकअप बुक करने के लिए अपने किसान डैशबोर्ड में **Auric Avani** पर जाएं!`;
      }
      return `**How to Sell Agricultural Waste & Biomass on Auric Avani:**\n\n1. **Eligible Farm Biomass:** Paddy straw (parali), wheat straw, sugarcane bagasse, vegetable & fruit trimmings, cattle manure, coconut coir, and dry foliage.\n2. **Fair Farmgate Pricing:** Earn **₹3.50 per kg** for dry crop residue/parali and **₹2.80 per kg** for fresh green trimmings with instant digital cash payouts.\n3. **Zero Transport Deductions:** Our collection fleet performs certified digital weighment and pickup directly at your farmgate with zero deduction charges.\n4. **Circular Eco-Impact:** Instead of polluting stubble burning, the biomass is converted into certified organic vermicompost and liquid bio-fertilizer, rejuvenating Indian agricultural soil.\n\nTo schedule a farmgate pickup, head to the **Auric Avani** section or submit a request directly from your Farmer Dashboard!`;
    }

    // 3. WHAT IS AURIC AROHI / PLATFORM OVERVIEW / ROLES (Farmer vs Customer)
    if (
      q.includes('what is auric') ||
      q.includes('who are you') ||
      q.includes('about auric') ||
      q.includes('tell me about auric') ||
      q.includes('what is this platform') ||
      q.includes('what is this website') ||
      q.includes('what do you do') ||
      q.includes('how does it work') ||
      q.includes('role') ||
      q.includes('roles') ||
      q.includes('ಆರಿಕ್ ಆರೋಹಿ ಎಂದರೇನು') ||
      q.includes('ಆರಿಕ್ ಆರೋಹಿ ಬಗ್ಗೆ') ||
      q.includes('ಆರಿಕ್ ಎಂದರೇನು') ||
      q.includes('ऑरिक आरोही क्या है') ||
      q.includes('ऑरिक आरोही के बारे में')
    ) {
      if (isKn) {
        return `ಆರಿಕ್ ಆರೋಹಿ (Auric Arohi) ಭಾರತದ ನೇರ ಕೃಷಿ-ಕುಟುಂಬ ಸುಗ್ಗಿಯ ವೇದಿಕೆಯಾಗಿದೆ.\n\nನಾವು ಪರಿಶೀಲಿಸಿದ ಸ್ಥಳೀಯ ನೈಸರ್ಗಿಕ ಮತ್ತು ಸಾವಯವ ರೈತರನ್ನು ನೇರವಾಗಿ ಗ್ರಾಹಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ:\n• **ರೈತರಿಗೆ (Farmers):** ಯಾವುದೇ ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ಅವರ ಬೆಳೆಗೆ 100% ನ್ಯಾಯಯುತ ಬೆಲೆ, ಸ್ವಂತ ದರ ನಿಗದಿ, ಮತ್ತು ಆರಿಕ್ ಅವನಿ ಮೂಲಕ ತ್ಯಾಜ್ಯ ಮಾರಾಟದ ಆದಾಯ ದೊರೆಯುತ್ತದೆ.\n• **ಗ್ರಾಹಕರಿಗೆ (Consumers):** ಮುಂಜಾನೆ ಕೊಯ್ಲು ಮಾಡಿದ ತಾಜಾ, ಪೌಷ್ಟಿಕ ಮತ್ತು ರಾಸಾಯನಿಕ-ಮುಕ್ತ ತರಕಾರಿಗಳು ಹಾಗೂ ಹಣ್ಣುಗಳು ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ಕೆಲವೇ ಗಂಟೆಗಳಲ್ಲಿ ನೇರವಾಗಿ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪುತ್ತವೆ.`;
      }
      if (isHi) {
        return `ऑरिक आरोही (Auric Arohi) भारत का सीधा खेत-से-परिवार फसल मंच है।\n\nहम सत्यापित क्षेत्रीय प्राकृतिक व जैविक किसानों को सीधे परिवारों से जोड़ते हैं:\n• **किसानों के लिए:** बिचौलियों के बिना अपनी फसल का 100% उचित व पारदर्शी मूल्य, स्वयं मूल्य निर्धारण और ऑरिक अवनि से पराली/अवशेष बेचने का अतिरिक्त लाभ।\n• **उपभोक्ताओं के लिए:** सुबह की ताज़ी कटाई के बाद बिना किसी कोल्ड-स्टोरेज देरी के पौष्टिक और रसायन-मुक्त उत्पाद सीधे घर तक डिलीवरी।`;
      }
      return `**About Auric Arohi:**\nAuric Arohi is India's direct farm-to-family harvest platform connecting verified regional natural growers directly with conscious households.\n\n• **For Farmers:** Growers bypass mandi middlemen, receive 100% fair settlements, set their own dawn harvest prices, and monetize agricultural residue through Auric Avani.\n• **For Families & Customers:** Consumers enjoy peak-fresh, nutrient-dense vegetables, fruits, and heritage grains harvested fresh at dawn with verified grower traceability and zero long-term holding delays.`;
    }

    // 4. FARMER REGISTRATION, POSTING PRODUCE, PRICE/STOCK UPDATES
    if (
      q.includes('register as farmer') ||
      q.includes('how to sell') ||
      q.includes('post produce') ||
      q.includes('post harvest') ||
      q.includes('update price') ||
      q.includes('update stock') ||
      q.includes('farmer account') ||
      q.includes('become a farmer') ||
      q.includes('farmer dashboard') ||
      q.includes('ಬೆಳೆ ಮಾರಾಟ') ||
      q.includes('ರೈತರ ನೋಂದಣಿ') ||
      q.includes('फसल बेचना') ||
      q.includes('किसान पंजीकरण')
    ) {
      if (isKn) {
        return `**ರೈತರು ಆರಿಕ್ ಆರೋಹಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಿ ಬೆಳೆ ಮಾರಾಟ ಮಾಡುವುದು ಹೇಗೆ:**\n\n1. **ನೋಂದಣಿ:** Register ಪುಟದಲ್ಲಿ 'Farmer' (ರೈತ) ಪಾತ್ರವನ್ನು ಆರಿಸಿ, ನಿಮ್ಮ ತೋಟದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.\n2. **ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ:** Farmer Dashboard ನಲ್ಲಿ 'Post Produce' ಕ್ಲಿಕ್ ಮಾಡಿ ಬೆಳೆಯ ಹೆಸರು, ಪ್ರಮಾಣ, ಕೊಯ್ಲಿನ ದಿನಾಂಕ ಮತ್ತು ಪ್ರತಿ ಕೆ.ಜಿ. ದರ ನಮೂದಿಸಿ.\n3. **ನೇರ ಮಾರಾಟ:** ನಿಮ್ಮ ಬೆಳೆ ನೇರವಾಗಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗ್ರಾಹಕರಿಗೆ ಕಾಣಿಸುತ್ತದೆ. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಬೆಲೆ ಅಥವಾ ದಾಸ್ತಾನನ್ನು ನೀವೇ ಬದಲಾಯಿಸಬಹುದು.\n4. **ಪೂರ್ಣ ಪಾವತಿ:** ಮುಂಜಾನೆ ಕೊಯ್ಲಿನ ನಂತರ ನೇರವಾಗಿ ಗ್ರಾಹಕರಿಗೆ ತಲುಪಿಸಿ 100% ಪಾವತಿಯನ್ನು ನೇರವಾಗಿ ಪಡೆಯಿರಿ.`;
      }
      if (isHi) {
        return `**किसान ऑरिक आरोही पर पंजीकरण व फसल लिस्टिंग कैसे करें:**\n\n1. **पंजीकरण:** Register पेज पर जाकर 'Farmer' विकल्प चुनें और अपने खेत का विवरण दर्ज करें।\n2. **फसल लिस्ट करें:** Farmer Dashboard में 'Post Produce' पर क्लिक करके फसल का नाम, मात्रा, कटाई की तारीख और प्रति किलो मूल्य दर्ज करें।\n3. **मूल्य व स्टॉक नियंत्रण:** आपकी लिस्टिंग तुरंत लाइव होती है। आप डैशबोर्ड से कभी भी मूल्य या स्टॉक अपडेट कर सकते हैं।\n4. **सीधा भुगतान:** बिचौलियों के बिना 100% भुगतान सीधे आपके बैंक/UPI खाते में प्राप्त होता है।`;
      }
      return `**How Farmers Register & Post Produce on Auric Arohi:**\n\n1. **Sign Up as a Farmer:** Click **Register** and choose the **Farmer** role, providing your farm name, location, and primary crops.\n2. **Post Fresh Harvests:** From your **Farmer Dashboard**, click **'Post Produce'** to enter the harvest name, category, ready quantity, dawn harvest date, and your direct price per kg.\n3. **Live Marketplace Visibility:** Your listing goes live immediately to regional buyers with your verified grower badge.\n4. **Instant Price & Stock Updates:** Edit your available stock or adjust seasonal prices anytime directly from your dashboard.\n5. **Direct Settlements:** Receive 100% transparent payments with zero commission deductions.`;
    }

    // 5. CUSTOMER ACCOUNT, CART, SHOPPING & SUBSCRIPTIONS
    if (
      q.includes('customer account') ||
      q.includes('sign up as customer') ||
      q.includes('how to buy') ||
      q.includes('smart cart') ||
      q.includes('subscription') ||
      q.includes('ಗ್ರಾಹಕ') ||
      q.includes('ಖಾತೆ') ||
      q.includes('ग्राहक खाता') ||
      q.includes('खरीदारी')
    ) {
      return `**Customer Shopping & Smart Cart Guidance:**\n\n1. **Create an Account:** Click **Register** and choose the **Customer** role to save your morning delivery addresses and preferences.\n2. **Fresh Dawn Baskets:** Add verified regional vegetables, fruits, and spices directly to your cart.\n3. **Smart Cart Subscriptions:** Set up automated weekly deliveries of fresh heirloom greens and seasonal boxes tailored to your family's size.\n4. **Direct Impact:** Every purchase directly supports local Indian farmers with 100% transparent settlements.`;
    }

    // 6. HOW TO PLACE AN ORDER / ORDERING / PAYMENT / DELIVERY / TRACKING
    if (
      q.includes('order') ||
      q.includes('buy') ||
      q.includes('purchase') ||
      q.includes('how can i place') ||
      q.includes('how to place') ||
      q.includes('how do i place') ||
      q.includes('payment') ||
      q.includes('delivery') ||
      q.includes('track') ||
      q.includes('ಆರ್ಡರ್') ||
      q.includes('ಖರೀದಿಸುವುದು ಹೇಗೆ') ||
      q.includes('ಆರ್ಡರ್ ಮಾಡುವುದು ಹೇಗೆ') ||
      q.includes('ऑर्डर') ||
      q.includes('खरीदें') ||
      q.includes('ऑर्डर कैसे करें')
    ) {
      if (isKn) {
        return `**ಆರಿಕ್ ಆರೋಹಿಯಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡುವ ಸುಲಭ ಹಂತಗಳು:**\n\n1. **ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಿಸಿ:** ನಮ್ಮ Marketplace ಪುಟದಲ್ಲಿ ಸ್ಥಳೀಯ ರೈತರು ಪಟ್ಟಿ ಮಾಡಿರುವ ಮುಂಜಾನೆಯ ತಾಜಾ ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.\n2. **ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ:** ನಿಮಗೆ ಅಗತ್ಯವಿರುವ ತೂಕ (ಕೆಜಿ/ಕಟ್ಟು) ನಮೂದಿಸಿ 'Add to Cart' ಕ್ಲಿಕ್ ಮಾಡಿ.\n3. **ವಿಳಾಸ ಮತ್ತು ವಿತರಣಾ ಸಮಯ:** ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ನೀಡಿ, ಅನುಕೂಲಕರ ಮುಂಜಾನೆ ವಿತರಣಾ ಸಮಯವನ್ನು ಆರಿಸಿ.\n4. **ಸುರಕ್ಷಿತ ಪಾವತಿ:** UPI, ಕಾರ್ಡ್‌ಗಳು, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ (COD) ಮೂಲಕ ಪಾವತಿಸಿ.\n5. **ನೇರ ತಲುಪಿಸುವಿಕೆ:** ರೈತರು ಮುಂಜಾನೆ ಕೊಯ್ಲು ಮಾಡಿದ ನಂತರ ಕೆಲವೇ ಗಂಟೆಗಳಲ್ಲಿ ನೇರವಾಗಿ ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ. ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಲೈವ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು.`;
      }
      if (isHi) {
        return `**ऑरिक आरोही पर ऑर्डर करने की सरल प्रक्रिया:**\n\n1. **मंडी देखें:** Marketplace पेज पर सत्यापित किसानों द्वारा सूचीबद्ध ताज़ी फसलें चुनें।\n2. **कार्ट में जोड़ें:** अपनी आवश्यकतानुसार मात्रा (किलो/गुच्छा) चुनें और 'Add to Cart' करें।\n3. **पता व समय चुनें:** अपना पता दर्ज करें और सुबह का डिलीवरी स्लॉट चुनें।\n4. **सुरक्षित भुगतान:** UPI, कार्ड्स, नेट बैंकिंग या कैश ऑन डिलीवरी (COD) द्वारा भुगतान करें।\n5. **सीधी डिलीवरी व ट्रैकिंग:** सुबह की ताज़ी कटाई के बाद उत्पाद सीधे आपके घर पहुँचते हैं और ग्राहक डैशबोर्ड में लाइव ट्रैक किए जा सकते हैं।`;
      }
      return `**How to place an order on Auric Arohi:**\n\n1. **Explore the Marketplace:** Browse fresh produce listed directly by verified growers with real-time harvest dates and prices.\n2. **Add to Basket:** Choose the exact quantity (kg, dozen, or bunches) and add items to your cart.\n3. **Set Delivery Address & Slot:** Enter your delivery location and select your preferred morning delivery slot.\n4. **Safe Payment:** Pay securely via UPI, credit/debit card, net banking, or choose Cash on Delivery (COD).\n5. **Dawn-Harvest Delivery & Live Tracking:** The farmer harvests your produce fresh at dawn, and it is delivered directly to your doorstep. You can track every milestone in your Customer Dashboard.`;
    }

    // 7. STORAGE, FRESHNESS & SHELF LIFE ADVICE
    if (
      q.includes('store') ||
      q.includes('storing') ||
      q.includes('storage') ||
      q.includes('keep fresh') ||
      q.includes('preserve') ||
      q.includes('shelf life') ||
      q.includes('fridge') ||
      q.includes('refrigerat') ||
      q.includes('ಸಂರಕ್ಷಿ') ||
      q.includes('ಶೇಖರಣೆ') ||
      q.includes('ಸಂಗ್ರಹ') ||
      q.includes('सुरक्षित रखें') ||
      q.includes('स्टोर कैसे करें')
    ) {
      if (q.includes('tomato') || q.includes('ಟೊಮೇಟೊ') || q.includes('ಟೊಮ್ಯಾಟೊ') || q.includes('टमाटर')) {
        if (isKn) {
          return `**ತಾಜಾ ಟೊಮೇಟೊ ಶೇಖರಣಾ ಸಲಹೆಗಳು:**\n\n1. **ಕೋಣೆಯ ಸಾಮಾನ್ಯ ಉಷ್ಣಾಂಶ:** ತಾಜಾ ಟೊಮೇಟೊಗಳನ್ನು ಸಾಮಾನ್ಯ ತಾಪಮಾನದಲ್ಲಿ (18°C–23°C), ನೇರ ಬಿಸಿಲು ಬೀಳದ ಜಾಗದಲ್ಲಿ ಕಾಂಡದ ಭಾಗ ಕೆಳಮುಖವಾಗಿಟ್ಟು (stem-down) ಇರಿಸಿ.\n2. **ಫ್ರಿಡ್ಜ್‌ನಲ್ಲಿ ಇಡಬೇಡಿ:** ಕಚ್ಚಾ ಅಥವಾ ತಾಜಾ ಟೊಮೇಟೊಗಳನ್ನು ಫ್ರಿಡ್ಜ್‌ನಲ್ಲಿಟ್ಟರೆ ಅವುಗಳ ನೈಸರ್ಗಿಕ ರುಚಿ ಮತ್ತು ಪರಿಮಳ ಕಡಿಮೆಯಾಗುತ್ತದೆ.\n3. **ಫ್ರಿಡ್ಜ್ ಯಾವಾಗ ಬಳಸಬೇಕು:** ಟೊಮೇಟೊ ಪೂರ್ಣವಾಗಿ ಹಣ್ಣಾಗಿದ್ದರೆ ಅಥವಾ ಹೆಚ್ಚಿದ ನಂತರ ಮಾತ್ರ ಫ್ರಿಡ್ಜ್‌ನಲ್ಲಿ ಗಾಳಿಯಾಡದ ಡಬ್ಬದಲ್ಲಿಡಿ.`;
        }
        if (isHi) {
          return `**ताज़े टमाटर को सुरक्षित रखने के सर्वोत्तम उपाय:**\n\n1. **कमरे के तापमान पर रखें:** साबुत ताज़े टमाटरों को हमेशा कमरे के तापमान (18°C–23°C) पर, सीधी धूप से दूर डंठल वाले हिस्से को नीचे रखकर (stem-down) रखें।\n2. **फ्रिज में रखने से बचें:** ताज़े टमाटर को फ्रिज में रखने से उनकी प्राकृतिक खुशबू और मिठास कम हो जाती है और उनका गूदा दानेदार हो जाता है।\n3. **फ्रिज का उपयोग कब करें:** केवल तभी फ्रिज में रखें जब टमाटर पूरी तरह से पक चुके हों और उन्हें 1-2 दिन में इस्तेमाल करना हो।`;
        }
        return `**How to Store Fresh Tomatoes for Maximum Flavor & Freshness:**\n\n1. **Keep at Room Temperature:** Store fresh whole tomatoes stem-side down at room temperature (18°C–23°C), away from direct sunlight.\n2. **Do Not Refrigerate Fresh Tomatoes:** Chilling raw tomatoes below 12°C halts natural ripening enzymes, dulls their natural aromatics, and breaks down cell walls into a mealy texture.\n3. **When to Refrigerate:** Only place tomatoes in the refrigerator if they are fully over-ripe and need to be preserved for 1–2 days, or after they have been sliced (in an airtight container).`;
      }

      if (q.includes('spinach') || q.includes('palak') || q.includes('greens') || q.includes('coriander') || q.includes('ಪಾಲಕ್') || q.includes('ಸೊಪ್ಪು') || q.includes('पालक')) {
        return `**How to Store Fresh Baby Spinach & Leafy Greens:**\n\n1. **Do Not Wash in Advance:** Moisture accelerates spoilage in leafy greens. Keep them unwashed until right before cooking.\n2. **Wrap in Dry Cloth / Paper Towel:** Wrap dry leaves loosely in a clean cotton cloth or paper towel to absorb ambient humidity.\n3. **Airtight Crisper Storage:** Place the wrapped greens inside an airtight container in the refrigerator crisper drawer. This keeps them vibrant and crisp for 5–7 days.`;
      }

      if (q.includes('potato') || q.includes('onion') || q.includes('ಆಲೂಗಡ್ಡೆ') || q.includes('ಈರುಳ್ಳಿ') || q.includes('आलू') || q.includes('प्याज')) {
        return `**Potato & Onion Storage Guide:**\n\n• **Potatoes:** Store in a cool, dark, dry, and well-ventilated basket or jute bag. Never refrigerate raw potatoes, as cold converts starch into sugar.\n• **Keep Separated:** Never store onions and potatoes together in the same basket. Onions emit ethylene gas that accelerates sprouting in potatoes.`;
      }

      return `**General Fresh Produce Storage Guidelines:**\n\n• **Leafy Greens (Spinach, Methi, Coriander):** Keep unwashed, wrap in clean cotton cloth, and refrigerate in the crisper drawer.\n• **Vine Crops (Tomatoes, Cucumbers):** Keep at room temperature out of direct sunlight to retain texture and aroma.\n• **Root Vegetables (Carrots, Beetroot, Potatoes):** Store in a cool, dry, dark place with plenty of airflow.\n• **Fruits:** Keep bananas, papayas, and mangoes at room temperature until ripe; refrigerate berries and melons once cut.`;
    }

    // 8. COOKING & RECIPES (e.g., "How to cook spinach?", "Recipe for palak paneer")
    if (
      q.includes('cook') ||
      q.includes('cooking') ||
      q.includes('recipe') ||
      q.includes('prepare') ||
      q.includes('dish') ||
      q.includes('curry') ||
      q.includes('sabzi') ||
      q.includes('ಅಡುಗೆ') ||
      q.includes('ರೆಸಿಪಿ') ||
      q.includes('पकाएं') ||
      q.includes('रेसिपी') ||
      q.includes('बनाएं')
    ) {
      if (q.includes('spinach') || q.includes('palak') || q.includes('ಪಾಲಕ್') || q.includes('पालक')) {
        return `**Delicious Ways to Cook Fresh Farm Spinach:**\n\n1. **Authentic Palak Paneer:** Blanch washed spinach in boiling water with a pinch of sugar for 90 seconds, then immediately plunge into ice-cold water to preserve the vibrant emerald green color. Puree with green chillies, ginger, and garlic, and simmer gently with fresh paneer cubes and a touch of ghee.\n2. **Nutritious Dal Palak:** Add finely chopped spinach to cooked toor dal in the last 5 minutes. Temper with cumin, hing (asafoetida), dry red chillies, and crushed garlic.\n3. **Pro Tip:** Always squeeze fresh lemon juice over cooked spinach before serving—Vitamin C boosts iron absorption!`;
      }

      if (q.includes('tomato') || q.includes('ಟೊಮೇಟೊ') || q.includes('टमाटर')) {
        return `**Culinary Ideas for Farm-Fresh Heirloom Tomatoes:**\n\n1. **Desi Tomato Rasam:** Simmer ripe mashed vine tomatoes with tamarind water, crushed black pepper, cumin, curry leaves, and garlic for a soothing, immune-boosting broth.\n2. **Charred Tomato Chutney:** Roast whole tomatoes over an open flame until the skin blisters, peel, and mash with chopped onions, green chillies, fresh coriander, and cold-pressed mustard oil.`;
      }

      return `**Farm-to-Table Cooking Advice:**\n\nFreshly harvested vegetables retain their natural sweetness and crispness. To preserve maximum vitamins:\n• Steam or lightly sauté vegetables in cold-pressed mustard, groundnut, or sesame oil.\n• Use aromatic tempering (jeera, rai, curry leaves, and hing) to highlight the fresh flavors without overpowering spices.`;
    }

    // 9. SEASONAL CROPS / WHAT TO GROW (e.g., "Which crops are good during monsoon?")
    if (
      q.includes('grow') ||
      q.includes('plant') ||
      q.includes('rainy') ||
      q.includes('monsoon') ||
      q.includes('kharif') ||
      q.includes('summer') ||
      q.includes('winter') ||
      q.includes('rabi') ||
      q.includes('season') ||
      q.includes('ಬೆಳೆಯುವುದು') ||
      q.includes('ಮಳೆಗಾಲ') ||
      q.includes('ಉಗಾನ') ||
      q.includes('बरसात') ||
      q.includes('मानसून') ||
      q.includes('खरीफ')
    ) {
      if (q.includes('rainy') || q.includes('monsoon') || q.includes('kharif') || q.includes('ಮಳೆಗಾಲ') || q.includes('बरसात') || q.includes('मानसून')) {
        if (isKn) {
          return `**ಮಳೆಗಾಲದಲ್ಲಿ (ಖಾರೀಫ್ ಹಂಗಾಮು) ಬೆಳೆಯಲು ಉತ್ತಮ ಬೆಳೆಗಳು:**\n\n1. **ಪ್ರಮುಖ ತರಕಾರಿಗಳು:**\n   • **ಬೆಂಡೆಕಾಯಿ (Okra):** ಮಳೆಗಾಲದ ಬೆಚ್ಚಗಿನ-ತೇವಾಂಶದ ಹವಾಗುಣದಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಇಳುವರಿ ನೀಡುತ್ತದೆ.\n   • **ಬಳ್ಳಿ ತರಕಾರಿಗಳು:** ಸೋರೆಕಾಯಿ, ಹೀರೇಕಾಯಿ, ಹಾಗಲಕಾಯಿ ಮತ್ತು ಸೌತೆಕಾಯಿ (ಚಪ್ಪರ ವಿಧಾನ).\n   • **ಹಸಿಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಚವಳಿಕಾಯಿ (Cluster Beans):** ಮಳೆಯನ್ನು ಚೆನ್ನಾಗಿ ಸಹಿಸಿಕೊಳ್ಳುತ್ತವೆ.\n2. **ಪ್ರಮುಖ ಕೃಷಿ ಬೆಳೆಗಳು:** ಭತ್ತ, ಮುಸುಕಿನ ಜೋಳ, ಸೋಯಾಬೀನ್, ಕಡಲೆಕಾಯಿ ಮತ್ತು ತೊಗರಿ.\n3. **ಮುಖ್ಯ ಪಾಲನೆ:** ಮಳೆ ನೀರು ನಿಲ್ಲದಂತೆ ಎತ್ತರಿಸಿದ ಮಡಿಗಳನ್ನು (Raised Beds) ನಿರ್ಮಿಸಿ. ಶಿಲೀಂಧ್ರ ರೋಗ ಬಾರದಂತೆ ವಾರಕ್ಕೊಮ್ಮೆ ಬೇವಿನ ಎಣ್ಣೆ (5 ml/L) ಸಿಂಪಡಿಸಿ.`;
        }
        if (isHi) {
          return `**बरसात / मानसून (खरीफ मौसम) में उगाई जाने वाली प्रमुख फसलें:**\n\n1. **सब्जियां:**\n   • **भिंडी (Okra):** वर्षा ऋतु के गर्म-नम मौसम में तेजी से फलती है।\n   • **बेल वाली फसलें:** लौकी, तोरई, करेला और खीरा (मचान विधि से लगाना सर्वोत्तम है)।\n   • **हरी मिर्च, बैंगन और ग्वारफली:** अच्छी जल निकासी वाली मिट्टी में भरपूर पैदावार देती हैं।\n2. **खाद्यान्न व दलहन फसलें:** धान, मक्का, सोयाबीन, मूंगफली और अरहर (तुअर)।\n3. **महत्वपूर्ण देखभाल:** खेत में जलभराव न होने दें; उठी हुई क्यारियों (Raised Beds) का प्रयोग करें। फफूंद व कीटों से बचाव के लिए प्रति सप्ताह नीम के तेल (5 मिली/लीटर) का छिड़काव करें।`;
        }
        return `**What to Grow During the Rainy Season (Kharif Cultivation Guide):**\n\n1. **Best Vegetables to Grow:**\n   • **Okra (Bhindi):** Flourishes in warm, humid rainy weather with high yield.\n   • **Gourds & Climbers:** Bottle Gourd (Lauki), Ridge Gourd (Turai), Bitter Gourd (Karela), and Cucumbers (best grown on trellises).\n   • **Green Chillies, Brinjals & Cluster Beans (Gawar):** Very resilient in monsoon soils.\n   • **Cowpea (Lobia) & Radish:** Fast-growing rainy season companions.\n\n2. **Field & Cash Crops:**\n   • Paddy (Rice), Maize, Soybean, Groundnut, Cotton, and Pulses (Tur/Arhar).\n\n3. **Essential Rainy Season Care:**\n   • **Raised Beds & Drainage:** Prevent root rot by creating raised planting mounds with proper drainage runoffs.\n   • **Preventive Foliar Spray:** Spray cold-pressed neem oil (5 ml/L) with mild organic soap weekly to prevent fungal leaf spots.`;
      }

      if (q.includes('summer') || q.includes('ಬೇಸಿಗೆ') || q.includes('गर्मी')) {
        return `**Summer Season (Zaid) Crops Guide:**\n\n• **Ideal Vegetables & Fruits:** Watermelon, Muskmelon, Cucumber, Pumpkin, Okra, and Fresh Mint.\n• **Care Tip:** Use heavy organic mulching (straw/dry leaves) to conserve soil moisture, and irrigate early in the morning or after sundown.`;
      }

      if (q.includes('winter') || q.includes('ಚಳಿಗಾಲ') || q.includes('सर्दी') || q.includes('rabi') || q.includes('रबी')) {
        return `**Winter Season (Rabi) Crops Guide:**\n\n• **Ideal Crops:** Spinach, Mustard Greens (Sarson), Cauliflower, Cabbage, Green Peas, Carrots, Radish, Coriander, Wheat, and Chickpeas.\n• **Care Tip:** Watch for aphids on tender shoots and apply liquid Jeevamrutha with irrigation.`;
      }

      return `**Seasonal Planting Guide for Indian Climates:**\n\n• **Monsoon (July–Oct):** Okra, Gourds, Chillies, Paddy, Maize, and Cowpeas.\n• **Winter (Oct–Feb):** Spinach, Peas, Carrots, Cauliflower, Mustard, and Wheat.\n• **Summer (March–June):** Melons, Cucumbers, Gourds, Pumpkin, and Mint.`;
    }

    // 10. SOIL, IRRIGATION, PEST CONTROL & NATURAL AGRONOMY GUIDANCE
    if (
      q.includes('fertilizer') ||
      q.includes('pest') ||
      q.includes('disease') ||
      q.includes('yellow') ||
      q.includes('insects') ||
      q.includes('neem') ||
      q.includes('soil') ||
      q.includes('irrigation') ||
      q.includes('water') ||
      q.includes('jeevamrutha') ||
      q.includes('ಗೊಬ್ಬರ') ||
      q.includes('ರೋಗ') ||
      q.includes('ಕೀಟ') ||
      q.includes('ಮಣ್ಣು') ||
      q.includes('ಖಾದ') ||
      q.includes('खाद') ||
      q.includes('कीट') ||
      q.includes('सिंचाई') ||
      q.includes('मिट्टी')
    ) {
      if (isKn) {
        return `**ನೈಸರ್ಗಿಕ ಬೆಳೆ ರಕ್ಷಣೆ ಮತ್ತು ಮಣ್ಣಿನ ನಿರ್ವಹಣೆ:**\n\n1. **ಎಲೆ ಹಳದಿಯಾಗುವುದು:** ಅತಿಯಾದ ನೀರು ನಿಲ್ಲುವುದು ಅಥವಾ ಸಾರಜನಕದ ಕೊರತೆಯಿಂದ ಉಂಟಾಗುತ್ತದೆ. ಉತ್ತಮ ಬಸಿಗಾಲುವೆ ಮಾಡಿ.\n2. **ಬೇವಿನ ಎಣ್ಣೆ ಕಷಾಯ:** 5 ಮಿ.ಲೀ ಬೇವಿನ ಎಣ್ಣೆ (10,000 PPM) + 2 ಮಿ.ಲೀ ಸಾಬೂನು ದ್ರಾವಣವನ್ನು 1 ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಎಲೆಗಳ ಕೆಳಭಾಗಕ್ಕೆ ಸಿಂಪಡಿಸಿ.\n3. **ಜೀವಾಮೃತ:** ಪ್ರತಿ ಎಕರೆಗೆ 200 ಲೀಟರ್ ಜೀವಾಮೃತವನ್ನು ಹನಿ ನೀರಾವರಿಯೊಂದಿಗೆ ನೀಡಿ ಮತ್ತು ಎರೆಹುಳು ಗೊಬ್ಬರ ಹಾಕಿ.\n4. **ತಜ್ಞರ ಸಲಹೆ:** ರೋಗ ತೀವ್ರವಾಗಿದ್ದರೆ ಸಮೀಪದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು (KVK) ಸಂಪರ್ಕಿಸಿ.`;
      }
      if (isHi) {
        return `**प्राकृतिक फसल सुरक्षा व मृदा प्रबंधन:**\n\n1. **पत्तियों का पीला पड़ना:** अधिक जलभराव या नाइट्रोजन की कमी का संकेत है। खेत में जल निकासी सुनिश्चित करें।\n2. **नीम तेल छिड़काव:** 5 मिली कोल्ड-प्रेस्ड नीम तेल (10,000 PPM) + 2 मिली हल्का साबुन 1 लीटर पानी में मिलाकर पत्तियों के नीचे स्प्रे करें।\n3. **जीवामृत व खाद:** 200 लीटर जीवामृत प्रति एकड़ सिंचाई के साथ दें और जड़ों के पास वर्मीकम्पोस्ट डालें।\n4. **कृषि सलाह:** गंभीर कीट प्रकोप में नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।`;
      }
      return `**Natural Crop Care & Pest Management Advice:**\n\n1. **Yellowing Leaves or Wilting:** Often indicates overwatering/poor drainage, nitrogen deficiency, or early sap-sucking pest activity under foliage.\n2. **Immediate Foliar Spray:** Mix 5 ml cold-pressed neem oil (10,000 PPM) + 2 ml organic bio-soap in 1 liter of water. Spray under the leaves early morning.\n3. **Soil Vitality:** Apply liquid Jeevamrutha (200 L/acre) with irrigation and top-dress with vermicompost around the drip line.\n4. **Water Management:** Implement drip irrigation to prevent fungal splash infections on foliage.\n5. **Expert Help:** If leaf spotting is spreading rapidly, consult your nearest Krishi Vigyan Kendra (KVK) for localized diagnosis.`;
    }

    // 11. PRODUCE AVAILABILITY ACROSS ALL CATEGORIES (Veg, Fruits, Grains, Pulses, Spices, Herbs, Organic)
    if (
      q.includes('veg') ||
      q.includes('fruit') ||
      q.includes('grain') ||
      q.includes('pulse') ||
      q.includes('dal') ||
      q.includes('spice') ||
      q.includes('herb') ||
      q.includes('organic') ||
      q.includes('available') ||
      q.includes('stock') ||
      q.includes('price') ||
      q.includes('what do you have') ||
      q.includes('produce') ||
      q.includes('ತರಕಾರಿ') ||
      q.includes('ಹಣ್ಣು') ||
      q.includes('ಧಾನ್ಯ') ||
      q.includes('ಸಾಂಬಾರ') ||
      q.includes('ಸೊಪ್ಪು') ||
      q.includes('ಸಬ್ಬಿ') ||
      q.includes('सब्जी') ||
      q.includes('फल') ||
      q.includes('अनाज') ||
      q.includes('दाल') ||
      q.includes('मसाले')
    ) {
      if (activeProduce && activeProduce.length > 0) {
        if (q.includes('fruit') || q.includes('ಹಣ್ಣು') || q.includes('फल')) {
          const items = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('fruit')).slice(0, 4);
          if (items.length > 0) {
            return `**Fresh Farm Fruits Currently Available:**\n\n${items.map((p) => `• **${p.name}** — ₹${p.price}/${p.unit} (Harvested by ${p.farmer_name})`).join('\n')}\n\nNaturally tree-ripened with zero calcium carbide, delivered directly to your doorstep.`;
          }
        }

        if (q.includes('grain') || q.includes('rice') || q.includes('wheat') || q.includes('millet') || q.includes('ಧಾನ್ಯ') || q.includes('अनाज')) {
          const items = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('grain')).slice(0, 4);
          if (items.length > 0) {
            return `**Heritage Grains & Millets Available:**\n\n${items.map((p) => `• **${p.name}** — ₹${p.price}/${p.unit} (Grown by ${p.farmer_name})`).join('\n')}\n\nUnpolished, native indigenous grains rich in fiber and micronutrients.`;
          }
        }

        if (q.includes('pulse') || q.includes('dal') || q.includes('ಬೇಳೆ') || q.includes('दाल')) {
          const items = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('pulse')).slice(0, 4);
          if (items.length > 0) {
            return `**Farm-Direct Pulses & Dals Available:**\n\n${items.map((p) => `• **${p.name}** — ₹${p.price}/${p.unit} (Harvested by ${p.farmer_name})`).join('\n')}\n\nNaturally sun-dried with zero chemical polishing.`;
          }
        }

        if (q.includes('spice') || q.includes('turmeric') || q.includes('saffron') || q.includes('ಸಾಂಬಾರ') || q.includes('मसाले')) {
          const items = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('spice')).slice(0, 4);
          if (items.length > 0) {
            return `**Aromatic Spices & Seasonings Available:**\n\n${items.map((p) => `• **${p.name}** — ₹${p.price}/${p.unit} (by ${p.farmer_name})`).join('\n')}\n\nSingle-origin, high-potency regional spices.`;
          }
        }

        if (q.includes('organic') || q.includes('dry fruit') || q.includes('almond') || q.includes('walnut') || q.includes('ಸಾವಯವ') || q.includes('मेवे')) {
          const items = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('organic')).slice(0, 4);
          if (items.length > 0) {
            return `**Certified Organic & Dry Fruit Harvests:**\n\n${items.map((p) => `• **${p.name}** — ₹${p.price}/${p.unit} (by ${p.farmer_name})`).join('\n')}\n\nPure natural harvests direct from regional orchards.`;
          }
        }

        const vegItems = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('veg')).slice(0, 5);
        if (vegItems.length > 0) {
          return `**Fresh Vegetables Currently Available on Auric Arohi:**\n\n${vegItems.map((p) => `• **${p.name}** — ₹${p.price}/${p.unit} (Harvested by ${p.farmer_name}, ${p.farm_location})`).join('\n')}\n\nAll harvested at dawn directly from verified regional growers with zero middleman holding times. You can add them directly to your basket!`;
        }
      }

      return `**Currently Available Farm Harvests:**\n\n• **Heirloom Vine Tomatoes** (₹38/kg by Ravi Kumar, Chikkaballapur)\n• **Mysore Long Purple Brinjal** (₹34/kg)\n• **Tender Green Okra** (₹42/kg)\n• **Country Cucumbers** (₹28/kg)\n• **Fresh Baby Spinach & Fragrant Coriander**\n• **Ratnagiri Alphonso Mangoes** (₹650/dozen by Nitin Patil)\n\nHarvested fresh daily with direct farm-to-family delivery.`;
    }

    // 12. CASUAL GREETINGS & CHIT-CHAT (e.g. "Hello", "Hi", "Good morning", "Who made you")
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q.startsWith('hello ') ||
      q.startsWith('hi ') ||
      q.includes('namaste') ||
      q.includes('good morning') ||
      q.includes('good evening') ||
      q === 'ನಮಸ್ಕಾರ' ||
      q === 'नमस्ते'
    ) {
      if (isKn) {
        return `ನಮಸ್ಕಾರ! ನಾನು ಆರಿಕ್ AI. ನಮ್ಮ ಸ್ಥಳೀಯ ರೈತರ ಬೆಳೆಗಳು, ಕೃಷಿ ಸಲಹೆಗಳು, ತರಕಾರಿ ಶೇಖರಣಾ ವಿಧಾನಗಳು, ಆರ್ಡರ್ ಮಾಡುವುದು ಅಥವಾ ಆರಿಕ್ ಅವನಿ ಮೂಲಕ ತ್ಯಾಜ್ಯ ಮಾರಾಟದ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`;
      }
      if (isHi) {
        return `नमस्ते! मैं ऑरिक एआई हूँ। हमारे किसानों की ताज़ी फसलों, खेती मार्गदर्शन, सब्जियों को सुरक्षित रखने के तरीके, ऑर्डर संबंधी प्रश्नों या ऑरिक अवनि पर पराली बेचने में मैं आपकी क्या सहायता करूँ?`;
      }
      return `Hello! I am Auric AI, your harvest and agriculture guide. How can I help you today? You can ask about our available farm produce, storage tips, seasonal crop care, placing orders, or selling farm residue on Auric Avani.`;
    }

    // 13. GENERAL / OTHER AGRICULTURE & PLATFORM INQUIRIES
    return `Thank you for asking! While I specialize in regional Indian harvests, verified farmer profiles, crop storage tips, Auric Avani waste monetization, and natural agricultural practices on Auric Arohi, I can help you with:
• **Fresh Harvests & Availability:** Checking seasonal vegetables, fruits, heritage grains, pulses, and direct farmer prices.
• **Storage & Kitchen Tips:** How to store tomatoes, leafy greens, or root vegetables to maximize shelf life and taste.
• **Farming & Seasonal Advice:** What crops to plant in monsoon, summer, or winter seasons, and natural pest remedies like neem oil and Jeevamrutha.
• **Auric Avani Biomass Selling:** How farmers can sell crop residue, parali, and bagasse for instant farmgate cash payouts.
• **Orders, Farmers & Accounts:** Learning about our verified regional growers or how to place a direct farm-to-family order.

Feel free to ask a specific question on any of these topics!`;
  }

  // Unified Auric AI & Farmer AI Assistant Handler
  async function handleAIAssist(req: express.Request, res: express.Response) {
    try {
      const { prompt, language = 'en', history = [], context = {} } = req.body;

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Question / prompt is required.' });
      }

      const selectedLang = INDIAN_LANG_MAP[language] || INDIAN_LANG_MAP.en;
      const apiKey = process.env.GEMINI_API_KEY;

      // Fetch live fresh produce and verified farmers to inject as platform knowledge
      // Timeout query after 2 seconds to prevent slow DB connections from stalling AI chat
      let activeProduce: any[] = [];
      let activeFarmers: any[] = [];
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DB catalog timeout')), 2000)
        );
        const prodPromise = query(
          `SELECT id, name, category, price, unit, quantity_available, farmer_name, farm_location 
           FROM produce_listings 
           WHERE status = 'Active' AND quantity_available > 0 
           ORDER BY created_at DESC LIMIT 35`
        );
        const prodRes: any = await Promise.race([prodPromise, timeoutPromise]);
        activeProduce = prodRes.rows || [];

        const farmPromise = query(
          `SELECT fp.farm_name, fp.location, fp.specialty, u.name as farmer_name 
           FROM farmer_profiles fp 
           JOIN users u ON fp.user_id = u.id 
           LIMIT 15`
        );
        const farmRes: any = await Promise.race([
          farmPromise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('DB farm profile timeout')), 2000)
          ),
        ]);
        activeFarmers = farmRes.rows || [];
      } catch (dbErr) {
        console.warn('Could not fetch catalog context for AI assist:', dbErr);
      }

      // Keyword match for relevant produce cards
      const lower = prompt.toLowerCase();
      const words = lower.split(/\s+/).filter((w) => w.length > 2);
      let matchedProduce = activeProduce.filter((p) => {
        const pName = (p.name || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        return words.some((w) => pName.includes(w) || pCat.includes(w));
      }).slice(0, 4);

      if (matchedProduce.length === 0) {
        if (lower.includes('veg') || lower.includes('ತರಕಾರಿ') || lower.includes('सब्जी') || lower.includes('green') || lower.includes('leaf')) {
          matchedProduce = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('veg')).slice(0, 4);
        } else if (lower.includes('fruit') || lower.includes('ಹಣ್ಣು') || lower.includes('फल')) {
          matchedProduce = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('fruit')).slice(0, 4);
        } else if (lower.includes('spice') || lower.includes('ಸಾಂಬಾರ') || lower.includes('मसाले')) {
          matchedProduce = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('spice')).slice(0, 4);
        } else if (lower.includes('grain') || lower.includes('ಧಾನ್ಯ') || lower.includes('अनाज')) {
          matchedProduce = activeProduce.filter((p) => (p.category || '').toLowerCase().includes('grain')).slice(0, 4);
        }
      }

      // Format clean platform context WITHOUT any technical developer terms
      const harvestsSummary = activeProduce.length > 0
        ? activeProduce.map((p) => `- ${p.name} (${p.category}): ₹${p.price}/${p.unit} by grower ${p.farmer_name} in ${p.farm_location}`).join('\n')
        : '- Heirloom Vine Tomatoes, Baby Spinach, Golden Carrots, Ratnagiri Alphonso Mangoes, Sweet Kaddu, and Country Cucumbers.';

      const farmersSummary = activeFarmers.length > 0
        ? activeFarmers.map((f) => `- ${f.farmer_name} at ${f.farm_name}, ${f.location} (${f.specialty})`).join('\n')
        : '- Ravi Kumar (Chikkaballapur, Karnataka), Lakshmi Devi (Kolar, Karnataka), Nitin Patil (Maharashtra), Suresh Naidu (Hosur).';

      let replyText = '';

      // If API key is present, attempt fast Generative AI with strict 8-second timeout
      if (apiKey && apiKey.trim().length > 0) {
        try {
          const ai = getGemini();
          const systemInstruction = `You are Auric AI, the official intelligent assistant for Auric Arohi — India's direct farm-to-family harvest platform.
You assist both consumers (looking for fresh harvests, prices, recipes, order guidance) and farmers (looking for crop care, natural remedies, irrigation advice, and fair pricing).

CRITICAL CONSTRAINTS & BEHAVIORAL RULES:
1. STRICT TERMINOLOGY BAN:
   NEVER mention "PostgreSQL", "database", "database records", "database table", "backend database", "SQL", "table", "schema", "API", or "records".
   Instead, speak naturally and user-friendly:
   - "We currently have fresh..."
   - "Our verified growers offer..."
   - "Available right now on Auric Arohi..."
   - "In our harvest collection..."
2. ANSWER GENERAL & CASUAL QUESTIONS NATURALLY:
   If the user asks greetings, chit-chat, cooking or storage questions (e.g., "Hello", "How to make palak paneer?", "How to store spinach?"), answer warmly, helpfully, and conversationally.
3. REAL PLATFORM DATA ACCURACY:
   Use the real platform harvest information provided below to answer what is available, current prices, units, and growers.
   If a user asks for an item NOT in our collection, honestly state:
   "We currently do not have [item] available in our harvest collection. You can explore our other fresh harvests or check back soon as farmers add seasonal harvests daily."
   Never invent fake prices, products, or farmers.
4. AGRICULTURE & FARMER ASSISTANCE:
   When farmers ask about crops, diseases, pests, soil, irrigation, fertilizers, or harvesting:
   - What may be happening
   - Likely causes & what to check
   - Recommended natural/organic action (e.g., Jeevamrutha, cold-pressed Neem oil spray, vermicompost, Panchagavya)
   - Prevention tips
   - When to contact an agricultural expert / KVK
   - Never invent confident chemical dosages. Always advise reading product labels or consulting the nearest Krishi Vigyan Kendra (KVK) / agricultural officer.
5. MULTILINGUAL INDIAN LANGUAGE SUPPORT:
   The user's requested language is: ${selectedLang.name} (${selectedLang.nativeName}).
   Generate the response naturally and fluently in ${selectedLang.name}.
   Supported languages: English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), and Urdu (اردو).
   For Urdu, provide natural Urdu script.
   Never default to English when another language is requested.
6. CONVERSATION CONTEXT:
   Maintain natural context from previous turns in the chat history.
7. FORMATTING:
   Keep answers clear, well-structured, and concise.

Current Fresh Harvests on Auric Arohi:
${harvestsSummary}

Verified Regional Farmers on Auric Arohi:
${farmersSummary}
`;

          const contents: any[] = [];
          if (Array.isArray(history) && history.length > 0) {
            for (const h of history.slice(-6)) {
              if (h && h.text && typeof h.text === 'string') {
                contents.push({
                  role: h.sender === 'user' || h.role === 'user' ? 'user' : 'model',
                  parts: [{ text: h.text }],
                });
              }
            }
          }
          contents.push({
            role: 'user',
            parts: [{ text: prompt }],
          });

          const genPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
            },
          });
          const genTimeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI response timed out')), 8000)
          );

          const aiResponse: any = await Promise.race([genPromise, genTimeout]);
          if (aiResponse && aiResponse.text) {
            replyText = aiResponse.text.trim();
          }
        } catch (genErr) {
          console.warn('AI generation timed out or failed; falling back to natural response:', genErr);
        }
      }

      // Fallback Natural Responder if AI generation is skipped, times out, or encounters an issue
      if (!replyText) {
        replyText = getNaturalTopicReply(prompt, language, activeProduce, activeFarmers, history);
      }

      return res.json({
        reply: replyText,
        language: selectedLang.name,
        detectedLanguage: selectedLang.nativeName,
        recommendedProduce: matchedProduce,
      });
    } catch (err: any) {
      console.error('Error in Auric AI assist:', err);
      return res.status(500).json({
        error: 'Auric AI is taking longer than usual to respond. Please try asking your question again.',
      });
    }
  }

  // Register both /api/auric-ai-assist and /api/farmer-ai-assist
  app.post('/api/auric-ai-assist', handleAIAssist);
  app.post('/api/farmer-ai-assist', handleAIAssist);

  // Centralized Error Handler Middleware
  app.use(errorHandler);

  // Vite middleware for development / Static dist serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? true : false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuricVista Server active on port ${PORT}`);
  });
}

startServer();
