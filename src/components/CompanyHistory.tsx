import ContentPage from './ContentPage';
import { site } from '../lib/content';

export default function CompanyHistory({ onContactOpen }: { onContactOpen: () => void }) {
  return <ContentPage page={site.pages.history} onContactOpen={onContactOpen} />;
}
