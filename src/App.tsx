import './style.css';
import './constant.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CommentSection from './components/CommentSection';
import Modal from 'react-modal';

// Create a client
const queryClient = new QueryClient();
Modal.setAppElement('#root');

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CommentSection />
    </QueryClientProvider>
  );
}
