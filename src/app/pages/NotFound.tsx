import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { TreePine, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FDF5E6' }}>
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#4A7C59] flex items-center justify-center">
            <TreePine className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-[#2D5A27]" style={{ fontFamily: 'Playfair Display, serif' }}>
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/">
          <Button className="bg-[#2D5A27] hover:bg-[#4A7C59]">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
