import ContentPage from './ContentPage';
import { site } from '../lib/content';

export default function FoundersAndTeam({ onContactOpen }: { onContactOpen: () => void }) {
  return <ContentPage page={site.pages.team} onContactOpen={onContactOpen} />;
}
