import * as React from 'react';
import './style.css';
import './constant.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import CommentSection from './components/CommentSection';

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CommentSection />
    </QueryClientProvider>
  );
}
