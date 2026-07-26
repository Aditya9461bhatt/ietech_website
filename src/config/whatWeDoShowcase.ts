import { site, type ShowcaseTabContent } from '../lib/content';

export type ShowcaseTabKey = 'manufacturing-erp' | 'restaurant-erp' | 'iot' | 'cad';

export interface ShowcaseScreenshot {
  id: string;
  label: string;
  hint: string;
  aspectRatio: '16 / 10' | '16 / 9';
  src?: string;
}

export interface ShowcaseTab extends ShowcaseTabContent {
  key: ShowcaseTabKey;
  screenshots: ShowcaseScreenshot[];
}

// Screenshot metadata stays in code; all visible text comes from content/site.json.
const SCREENSHOTS: Record<string, ShowcaseScreenshot[]> = {
  'manufacturing-erp': [
    {
      id: 'erp-overview',
      label: 'Accounts Dashboard',
      hint: 'Live financial dashboard with receivables/payables and P&L trends',
      aspectRatio: '16 / 9',
    },
    {
      id: 'erp-onboarding',
      label: 'Onboarding Flow',
      hint: 'Step-by-step setup wizard for language, locale, timezone, and currency',
      aspectRatio: '16 / 9',
    },
  ],
  'restaurant-erp': [],
  cad: [
    {
      id: 'cad-canvas',
      label: 'Model Canvas',
      hint: 'Primary CAD canvas with tool panels visible',
      aspectRatio: '16 / 9',
    },
    {
      id: 'cad-assistant',
      label: 'AI Assistant',
      hint: 'Assistant prompt panel with task/result context',
      aspectRatio: '16 / 9',
    },
    {
      id: 'cad-iterations',
      label: 'Version Iterations',
      hint: 'Design history/iterations comparison view',
      aspectRatio: '16 / 9',
    },
  ],
};

export const showcaseTabs: ShowcaseTab[] = site.products.tabs.map((tab) => ({
  ...tab,
  key: tab.key as ShowcaseTabKey,
  screenshots: SCREENSHOTS[tab.key] ?? [],
}));
