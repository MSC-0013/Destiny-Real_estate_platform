import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Heart, User, LogOut, Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'seller':
        return '/seller-dashboard';
      case 'tenant':
        return '/tenant-dashboard';
      case 'contractor':
        return '/contractor-dashboard';
      case 'worker':
        return '/worker-dashboard';
      case 'designer':
        return '/designer-dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-luxury" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-luxury bg-clip-text text-transparent">
              Destiny
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/properties" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Properties
            </Link>
            <Link to="/properties?category=rent" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Rentals
            </Link>
            <Link to="/properties?category=sale" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Buy
            </Link>
            <Link to="/construction" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Construction
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/wishlist')}
                className="relative"
              >
                <Heart className="h-5 w-5" />
              </Button>

              {(user.role === 'seller' || user.role === 'admin') && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/add-property')}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Search className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;