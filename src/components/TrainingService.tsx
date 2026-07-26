import ContentPage from './ContentPage';
import { site } from '../lib/content';

export default function TrainingService({ onContactOpen }: { onContactOpen: () => void }) {
  return <ContentPage page={site.pages.training} onContactOpen={onContactOpen} />;
}
