import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { TreeProvider } from './store/useTreeStore';
import { AuthProvider } from './store/useAuthStore';

export default function App() {
  return (
    <AuthProvider>
      <TreeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TreeProvider>
    </AuthProvider>
  );
}
