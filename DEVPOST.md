# AI-X-Artisans

### Bridging the Digital Divide with Google AI

---

## Inspiration

Small-scale artisans and traditional craftsmen create breathtaking, one-of-a-kind work, but they often struggle to survive in the digital-first economy. Professional product photography, SEO-optimized descriptions, and global marketing are expensive and technically daunting. **AI-X-Artisans** was built to provide every local creator with a world-class marketing team and a studio-grade digital storefront, ensuring that ancient traditions can thrive in a modern marketplace.

## What it does

AI-X-Artisans is an all-in-one AI-powered commerce assistant that handles the "heavy lifting" of digital sales for artisans:

- **AI Photo Studio:** Transforms raw, handheld mobile photos into professional catalog-ready shots using advanced style transfer and image enhancement.
- **Voice-to-Listing:** Allows artisans who may not be tech-savvy to simply _speak_ about their product. The AI extracts structured data (name, tradition, materials, price) and builds a complete listing in seconds.
- **Heritage Storytelling:** Generates culturally accurate "Heritage Stories" for every product, embedded in Digital Authenticity Certificates with QR codes.
- **AI Negotiation Advisor:** Helps artisans navigate price negotiations with customers, ensuring they earn a fair wage while remaining competitive.
- **Multi-Role Ecosystem:** Connects artisans with **Volunteers** (who offer marketing/design skills) and **Customers** (who seek verified, authentic handcrafted goods).

## How we built it

We built AI-X-Artisans using a modern, scalable stack centered on Google AI:

- **Frontend:** Next.js (App Router) with Tailwind CSS for a premium, responsive UI.
- **Backend & Database:** Supabase (PostgreSQL) for real-time chat, authentication, and secure file storage.
- **Google AI Engine (Backend):**
  - **Gemini 3 Flash:** Voice-to-Listing structured extraction (JSON), visual price appraisal, and negotiation advice.
  - **Gemini 3 Pro:** Deep reasoning for culturally accurate Heritage Stories.
  - **Vertex AI:** Video generation pipeline blueprint and deployment-ready path for Veo integration.
  - **Vision & Voice:** Web Speech API for capture, Gemini 3 for multimodal understanding and structured output.
- **Architecture:** Prisma ORM for type-safe database management and a middleware-based role switching system for the demo environment.

## Challenges we ran into

- **Maintaining Texture Authenticity:** It was critical that the AI didn't "over-process" handmade goods. We fine-tuned prompts to ensure unique textures (like handloom weaves) were preserved, not smoothed over.
- **Multilingual Support:** Creating a seamless experience that works across languages (English/Hindi) while maintaining the nuance of traditional craft terms.
- **Agentic Extraction:** Turning unstructured voice input into valid, schema-compliant JSON required rigorous prompt engineering and error handling.

## Accomplishments that we're proud of

- **End-to-End Workflow:** Successfully reduced the time to create a professional listing from 30+ minutes to under 30 seconds.
- **User-Centric Design:** Creating a "Warm AI" experience that feels like a helper to the artisan rather than a complex technical tool.
- **Authenticity Verification:** Building a system where consumers can actually verify the roots of what they buy, connecting the buyer to the maker.

## What we learned

- **Accessibility is Key:** For local artisans, multimodal input (voice/vision) isn't just a "feature"—it's an essential accessibility requirement for digital inclusion.
- **Hybrid AI Models:** We learned that combining the speed of Gemini Flash with the depth of Gemini Pro creates the best user experience.

## What's next for AI-X-Artisans

- **Hyper-Local Language Support:** Expanding beyond Hindi/English to regional dialects.
- **Real-time Voice Negotiator:** An audio-based agent that can handle live price negotiations between artisans and customers.
- **Supply Chain Transparency:** Integration with blockchain to track the raw material journey for 100% ethical sourcing proof.

---

**Built with passion to preserve heritage through innovation.**
