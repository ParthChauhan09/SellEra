
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, Menu, X, Package, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { authUser, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const userInitials = authUser.user?.name 
    ? authUser.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-sellera-purple">
              SellEra
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-sellera-purple transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-sellera-purple transition-colors">
              Products
            </Link>
            {authUser.role === 'vendor' && (
              <Link to="/vendor/dashboard" className="text-gray-700 hover:text-sellera-purple transition-colors">
                Vendor Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Cart - Only for users */}
            {(!authUser.role || authUser.role === 'user') && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" className="p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-sellera-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <Avatar>
                      <AvatarFallback className="bg-sellera-purple text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authUser.role === 'user' ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />Orders
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/vendor/dashboard" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="flex items-center text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-2 border-t">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="block px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="block px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              {authUser.role === 'vendor' && (
                <li>
                  <Link 
                    to="/vendor/dashboard" 
                    className="block px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vendor Dashboard
                  </Link>
                </li>
              )}
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {authUser.role === 'user' ? (
                    <>
                      <li>
                        <Link 
                          to="/profile" 
                          className="block px-2 py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/orders" 
                          className="block px-2 py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/cart" 
                          className="block px-2 py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Cart {totalItems > 0 && `(${totalItems})`}
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link 
                        to="/vendor/dashboard" 
                        className="block px-2 py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 text-red-500"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
