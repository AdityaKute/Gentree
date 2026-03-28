import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { TreeProvider } from './store/useTreeStore';

export default function App() {
  return (
    <TreeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TreeProvider>
  );
}
