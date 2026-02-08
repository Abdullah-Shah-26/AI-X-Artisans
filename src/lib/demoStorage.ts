// Demo mode localStorage utilities

const DEMO_PRODUCTS_KEY = "demo_products";
const DEMO_CERTIFICATES_KEY = "demo_certificates";
const DEMO_PROJECTS_KEY = "demo_projects";
const DEMO_CAMPAIGNS_KEY = "demo_campaigns";

export interface DemoProduct {
  id: string;
  name: string;
  description: string | null;
  longDescription?: string | null;
  price: number;
  category: string | null;
  craftTradition: string | null;
  image: string | null;
  dateAdded: Date;
}

export interface DemoCertificate {
  id: string;
  productId: string;
  productName: string;
  heritageStory: string | null;
  craftTradition: string;
  createdAt: Date;
  image?: string | null;
}

export interface DemoProject {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  status: string;
  createdAt: Date;
}

export interface DemoCampaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  endDate: string;
  imageUrl: string | null;
  status: string;
  createdAt: Date;
}

// Product functions
export function saveDemoProduct(product: DemoProduct): void {
  if (typeof window === "undefined") return;

  const products = getDemoProducts();
  products.push(product);
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
}

export function getDemoProducts(): DemoProduct[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
  if (!stored) return [];

  try {
    const products = JSON.parse(stored);
    // Convert date strings back to Date objects
    return products.map((p: DemoProduct) => ({
      ...p,
      dateAdded: new Date(p.dateAdded),
    }));
  } catch {
    return [];
  }
}

export function updateDemoProduct(
  productId: string,
  updates: Partial<DemoProduct>,
): void {
  if (typeof window === "undefined") return;

  const products = getDemoProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
  }
}

export function clearDemoProducts(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_PRODUCTS_KEY);
}

// Certificate functions
export function saveDemoCertificate(certificate: DemoCertificate): void {
  if (typeof window === "undefined") return;

  const certificates = getDemoCertificates();
  certificates.push(certificate);
  localStorage.setItem(DEMO_CERTIFICATES_KEY, JSON.stringify(certificates));
}

export function getDemoCertificates(): DemoCertificate[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(DEMO_CERTIFICATES_KEY);
  if (!stored) return [];

  try {
    const certificates = JSON.parse(stored);
    // Convert date strings back to Date objects
    return certificates.map((c: DemoCertificate) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
  } catch {
    return [];
  }
}

export function clearDemoCertificates(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_CERTIFICATES_KEY);
}

// Project functions
export function saveDemoProject(project: DemoProject): void {
  if (typeof window === "undefined") return;

  const projects = getDemoProjects();
  projects.push(project);
  localStorage.setItem(DEMO_PROJECTS_KEY, JSON.stringify(projects));
}

export function getDemoProjects(): DemoProject[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(DEMO_PROJECTS_KEY);
  if (!stored) return [];

  try {
    const projects = JSON.parse(stored);
    // Convert date strings back to Date objects
    return projects.map((p: DemoProject) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }));
  } catch {
    return [];
  }
}

export function clearDemoProjects(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_PROJECTS_KEY);
}

// Campaign functions
export function saveDemoCampaign(campaign: DemoCampaign): void {
  if (typeof window === "undefined") return;

  const campaigns = getDemoCampaigns();
  campaigns.push(campaign);
  localStorage.setItem(DEMO_CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export function updateDemoCampaign(
  campaignId: string,
  updates: Partial<DemoCampaign>,
): void {
  if (typeof window === "undefined") return;

  const campaigns = getDemoCampaigns();
  const index = campaigns.findIndex((c) => c.id === campaignId);
  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...updates };
    localStorage.setItem(DEMO_CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }
}

export function getDemoCampaigns(): DemoCampaign[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(DEMO_CAMPAIGNS_KEY);
  if (!stored) return [];

  try {
    const campaigns = JSON.parse(stored);
    // Convert date strings back to Date objects
    return campaigns.map((c: DemoCampaign) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
  } catch {
    return [];
  }
}

export function clearDemoCampaigns(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_CAMPAIGNS_KEY);
}

export function clearAllDemoData(): void {
  clearDemoProducts();
  clearDemoCertificates();
  clearDemoProjects();
  clearDemoCampaigns();
}
