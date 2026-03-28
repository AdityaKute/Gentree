import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { TreePine, Home, Search, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../store/useAuthStore';

const navigationItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const initials = auth.user
    ? auth.user.username.slice(0, 2).toUpperCase()
    : 'JD';

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF5E6' }}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#FAF3E0] border-r border-[#2D5A27]/15 transition-all duration-300 z-30 shadow-sm ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#2D5A27]/15">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#4A7C59] flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-[#2D5A27]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  GenTree
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#2D5A27]/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-[#2D5A27]" />
              ) : (
                <Menu className="w-5 h-5 text-[#2D5A27]" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#2D5A27]/10 text-[#2D5A27] font-medium'
                      : 'text-gray-700 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[#2D5A27]/15">
            {sidebarOpen ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2D5A27]/5 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt={auth.user?.username || 'User'} />
                      <AvatarFallback className="bg-[#C2A878] text-white">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{auth.user?.username ?? 'John Doe'}</p>
                      <p className="text-xs text-gray-600">{auth.user?.email ?? 'john.doe@email.com'}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#FAF3E0] border-[#2D5A27]/15">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#2D5A27]/15" />
                  <DropdownMenuItem className="focus:bg-[#2D5A27]/10">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2D5A27]/15" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="focus:bg-destructive/10 text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
