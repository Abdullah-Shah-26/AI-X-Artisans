"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.search": "Search products, artisans...",
    "header.switchRole": "Switch Role",
    "header.myProfile": "My Profile",
    "header.settings": "Settings",
    "header.signOut": "Sign Out",

    // Roles
    "role.artisan": "Artisan",
    "role.volunteer": "Volunteer",
    "role.customer": "Customer",

    // Sidebar
    "sidebar.dashboard": "Dashboard",
    "sidebar.myProducts": "My Products",
    "sidebar.photoStudio": "Photo Studio",
    "sidebar.videoStudio": "Video Studio",
    "sidebar.volunteers": "Collaboration Hub",
    "sidebar.connections": "Connections",
    "sidebar.messages": "Messages",
    "sidebar.financeHub": "Finance Hub",
    "sidebar.collabHub": "Collaboration Hub",
    "sidebar.profile": "My Profile",
    "sidebar.artisans": "Artisans",
    "sidebar.training": "Training",
    "sidebar.theme": "Theme",
    "sidebar.logout": "Logout",
    "sidebar.certificates": "Certificates",
    "sidebar.findProjects": "Find Projects",
    "sidebar.findArtisans": "Find Artisans",
    "sidebar.earnings": "Earnings",
    "sidebar.impact": "Impact",
    "sidebar.authenticity": "Authenticity",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.artisanMessage": "Ready to showcase your craft to the world?",
    "dashboard.volunteerMessage": "Find projects and help artisans succeed!",
    "dashboard.customerMessage": "Discover unique handcrafted treasures!",
    "dashboard.productsListed": "Products Listed",
    "dashboard.activeProjects": "Active Projects",
    "dashboard.messages": "Messages",
    "dashboard.applicationsSent": "Applications Sent",
    "dashboard.collaborations": "Collaborations",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.addProduct": "Add Product",
    "dashboard.findHelp": "Find Help",
    "dashboard.startCampaign": "Start Campaign",
    "dashboard.browseProjects": "Browse Projects",
    "dashboard.myWork": "My Work",
    "dashboard.updateProfile": "Update Profile",

    // Products
    "products.title": "My Products",
    "products.demoProducts": "Demo products (add your own!)",
    "products.productsListed": "products listed",
    "products.addProduct": "Add Product",
    "products.demoMode": "These are demo products",
    "products.addOwn": "Add your own handcrafted products to replace them!",
    "products.edit": "Edit",
    "products.view": "View",
    "products.addYourOwn": "Add Your Own",

    // Volunteers
    "volunteers.title": "Collaboration Hub",
    "volunteers.subtitle": "Find skilled volunteers to help grow your business",
    "volunteers.postProject": "Post Project",
    "volunteers.demoMode": "Demo Mode",
    "volunteers.demoMessage":
      "Sample data shown. Real content will appear when available!",
    "volunteers.availableVolunteers": "Available Volunteers",
    "volunteers.myProjects": "My Projects",
    "volunteers.postNewProject": "Post a New Project",
    "volunteers.projectTitle": "Project Title",
    "volunteers.description": "Description",
    "volunteers.skillsNeeded": "Skills Needed",
    "volunteers.cancel": "Cancel",
    "volunteers.posting": "Posting...",

    // Connections
    "connections.title": "Connections",
    "connections.subtitle": "Manage your network and messages",
    "connections.messages": "Messages",
    "connections.requests": "Requests",
    "connections.pendingRequests": "Pending Requests",
    "connections.myConnections": "My Connections",
    "connections.noConnections": "No connections yet",
    "connections.connectVolunteers":
      "Connect with volunteers to grow your network",
    "connections.artisansWillSend":
      "Artisans will send you connection requests",
    "connections.pastRequests": "Past Requests",
    "connections.accept": "Accept",
    "connections.decline": "Decline",
    "connections.viewProfile": "View Profile",
    "connections.message": "Message",

    // Chat
    "chat.title": "Messages",
    "chat.search": "Search conversations...",
    "chat.noConversations": "No conversations found",
    "chat.online": "Online",
    "chat.typeMessage": "Type your message...",
    "chat.yourMessages": "Your Messages",
    "chat.selectConversation":
      "Select a conversation from the sidebar to start chatting with artisans, volunteers, or customers.",

    // Photo Studio
    "photoStudio.title": "AI Photo Studio",
    "photoStudio.subtitle":
      "Transform your product photos with AI-powered enhancement and generate marketing content",
    "photoStudio.uploadImage": "Upload Product Image",
    "photoStudio.clickOrDrag": "Click or drag to upload",
    "photoStudio.chooseTheme": "Choose Style Theme",
    "photoStudio.targetPlatform": "Target Platform",
    "photoStudio.additionalInstructions": "Additional Instructions (Optional)",
    "photoStudio.customInstructions": "Custom Instructions",
    "photoStudio.describePlaceholder":
      "Describe your product or add specific instructions...",
    "photoStudio.generate": "Enhance & Generate Content",
    "photoStudio.generating": "Generating...",
    "photoStudio.result": "Result",
    "photoStudio.resultPlaceholder": "Your enhanced image will appear here",
    "photoStudio.clean": "Clean",
    "photoStudio.cleanDesc": "White background, studio lighting",
    "photoStudio.festive": "Festive",
    "photoStudio.festiveDesc": "Warm, celebratory mood",
    "photoStudio.artistic": "Artistic",
    "photoStudio.artisticDesc": "Creative, unique style",
    "photoStudio.rustic": "Rustic",
    "photoStudio.rusticDesc": "Natural, handcrafted feel",
    "photoStudio.price": "Product Price",
    "photoStudio.priceHint":
      "Price will be included when sharing to social media",
  },
  hi: {
    // Header
    "header.search": "उत्पाद, कारीगर खोजें...",
    "header.switchRole": "भूमिका बदलें",
    "header.myProfile": "मेरी प्रोफ़ाइल",
    "header.settings": "सेटिंग्स",
    "header.signOut": "साइन आउट",

    // Roles
    "role.artisan": "कारीगर",
    "role.volunteer": "स्वयंसेवक",
    "role.customer": "ग्राहक",

    // Sidebar
    "sidebar.dashboard": "डैशबोर्ड",
    "sidebar.myProducts": "मेरे उत्पाद",
    "sidebar.photoStudio": "फोटो स्टूडियो",
    "sidebar.volunteers": "स्वयंसेवक",
    "sidebar.connections": "कनेक्शन",
    "sidebar.messages": "संदेश",
    "sidebar.financeHub": "फाइनेंस हब",
    "sidebar.collabHub": "सहयोग हब",
    "sidebar.profile": "मेरी प्रोफाइल",
    "sidebar.training": "प्रशिक्षण",
    "sidebar.theme": "थीम",
    "sidebar.logout": "लॉगआउट",
    "sidebar.certificates": "प्रमाणपत्र",
    "sidebar.findProjects": "प्रोजेक्ट खोजें",
    "sidebar.findArtisans": "कारीगर खोजें",
    "sidebar.videoStudio": "वीडियो स्टूडियो",
    "sidebar.earnings": "कमाई",
    "sidebar.impact": "प्रभाव",
    "sidebar.authenticity": "प्रामाणिकता",

    // Dashboard
    "dashboard.welcome": "वापसी पर स्वागत है",
    "dashboard.artisanMessage":
      "अपनी कला को दुनिया को दिखाने के लिए तैयार हैं?",
    "dashboard.volunteerMessage": "प्रोजेक्ट खोजें और कारीगरों की मदद करें!",
    "dashboard.customerMessage": "अनूठे हस्तनिर्मित खजाने खोजें!",
    "dashboard.productsListed": "सूचीबद्ध उत्पाद",
    "dashboard.activeProjects": "सक्रिय प्रोजेक्ट",
    "dashboard.messages": "संदेश",
    "dashboard.applicationsSent": "भेजे गए आवेदन",
    "dashboard.collaborations": "सहयोग",
    "dashboard.quickActions": "त्वरित कार्य",
    "dashboard.addProduct": "उत्पाद जोड़ें",
    "dashboard.findHelp": "मदद खोजें",
    "dashboard.startCampaign": "अभियान शुरू करें",
    "dashboard.browseProjects": "प्रोजेक्ट देखें",
    "dashboard.myWork": "मेरा काम",
    "dashboard.updateProfile": "प्रोफ़ाइल अपडेट करें",

    // Products
    "products.title": "मेरे उत्पाद",
    "products.demoProducts": "डेमो उत्पाद (अपने जोड़ें!)",
    "products.productsListed": "उत्पाद सूचीबद्ध",
    "products.addProduct": "उत्पाद जोड़ें",
    "products.demoMode": "ये डेमो उत्पाद हैं",
    "products.addOwn": "इन्हें बदलने के लिए अपने हस्तनिर्मित उत्पाद जोड़ें!",
    "products.edit": "संपादित करें",
    "products.view": "देखें",
    "products.addYourOwn": "अपना जोड़ें",

    // Volunteers
    "volunteers.title": "सहयोग हब",
    "volunteers.subtitle":
      "अपने व्यवसाय को बढ़ाने में मदद के लिए कुशल स्वयंसेवक खोजें",
    "volunteers.postProject": "प्रोजेक्ट पोस्ट करें",
    "volunteers.demoMode": "डेमो मोड",
    "volunteers.demoMessage":
      "नमूना डेटा दिखाया गया। उपलब्ध होने पर वास्तविक सामग्री दिखाई देगी!",
    "volunteers.availableVolunteers": "उपलब्ध स्वयंसेवक",
    "volunteers.myProjects": "मेरे प्रोजेक्ट",
    "volunteers.postNewProject": "नया प्रोजेक्ट पोस्ट करें",
    "volunteers.projectTitle": "प्रोजेक्ट शीर्षक",
    "volunteers.description": "विवरण",
    "volunteers.skillsNeeded": "आवश्यक कौशल",
    "volunteers.cancel": "रद्द करें",
    "volunteers.posting": "पोस्ट हो रहा है...",

    // Connections
    "connections.title": "कनेक्शन",
    "connections.subtitle": "अपने नेटवर्क और संदेशों का प्रबंधन करें",
    "connections.messages": "संदेश",
    "connections.requests": "अनुरोध",
    "connections.pendingRequests": "लंबित अनुरोध",
    "connections.myConnections": "मेरे कनेक्शन",
    "connections.noConnections": "अभी तक कोई कनेक्शन नहीं",
    "connections.connectVolunteers":
      "अपना नेटवर्क बढ़ाने के लिए स्वयंसेवकों से जुड़ें",
    "connections.artisansWillSend": "कारीगर आपको कनेक्शन अनुरोध भेजेंगे",
    "connections.pastRequests": "पिछले अनुरोध",
    "connections.accept": "स्वीकार करें",
    "connections.decline": "अस्वीकार करें",
    "connections.viewProfile": "प्रोफ़ाइल देखें",
    "connections.message": "संदेश",

    // Chat
    "chat.title": "संदेश",
    "chat.search": "बातचीत खोजें...",
    "chat.noConversations": "कोई बातचीत नहीं मिली",
    "chat.online": "ऑनलाइन",
    "chat.typeMessage": "अपना संदेश लिखें...",
    "chat.yourMessages": "आपके संदेश",
    "chat.selectConversation":
      "कारीगरों, स्वयंसेवकों या ग्राहकों के साथ चैट शुरू करने के लिए साइडबार से बातचीत चुनें।",

    // Photo Studio
    "photoStudio.title": "AI फोटो स्टूडियो",
    "photoStudio.subtitle":
      "AI-संचालित एन्हांसमेंट के साथ अपनी उत्पाद तस्वीरों को बदलें और मार्केटिंग सामग्री बनाएं",
    "photoStudio.uploadImage": "उत्पाद छवि अपलोड करें",
    "photoStudio.clickOrDrag": "अपलोड करने के लिए क्लिक करें या खींचें",
    "photoStudio.chooseTheme": "स्टाइल थीम चुनें",
    "photoStudio.targetPlatform": "लक्ष्य प्लेटफ़ॉर्म",
    "photoStudio.additionalInstructions": "अतिरिक्त निर्देश (वैकल्पिक)",
    "photoStudio.customInstructions": "कस्टम निर्देश",
    "photoStudio.describePlaceholder":
      "अपने उत्पाद का वर्णन करें या विशिष्ट निर्देश जोड़ें...",
    "photoStudio.generate": "एन्हांस और सामग्री बनाएं",
    "photoStudio.generating": "बना रहा है...",
    "photoStudio.result": "परिणाम",
    "photoStudio.resultPlaceholder": "आपकी एन्हांस्ड छवि यहां दिखाई देगी",
    "photoStudio.clean": "साफ",
    "photoStudio.cleanDesc": "सफेद पृष्ठभूमि, स्टूडियो लाइटिंग",
    "photoStudio.festive": "उत्सव",
    "photoStudio.festiveDesc": "गर्म, उत्सव का माहौल",
    "photoStudio.artistic": "कलात्मक",
    "photoStudio.artisticDesc": "रचनात्मक, अनूठी शैली",
    "photoStudio.rustic": "देहाती",
    "photoStudio.rusticDesc": "प्राकृतिक, हस्तनिर्मित अनुभव",
    "photoStudio.price": "उत्पाद मूल्य",
    "photoStudio.priceHint":
      "सोशल मीडिया पर शेयर करते समय मूल्य शामिल किया जाएगा",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
