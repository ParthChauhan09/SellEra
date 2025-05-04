
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, Menu, X, Package, LogOut, Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const userInitials = authUser.user?.name
    ? authUser.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-white/95 shadow-sm py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.h1
              className="text-2xl font-bold text-sellera-purple"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SellEra
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'text-sellera-purple' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link to="/products" className={`nav-link ${location.pathname.includes('/products') ? 'text-sellera-purple' : 'text-gray-700'}`}>
              Products
            </Link>
            {authUser.role === 'vendor' && (
              <Link to="/vendor/dashboard" className={`nav-link ${location.pathname.includes('/vendor') ? 'text-sellera-purple' : 'text-gray-700'}`}>
                Vendor Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="p-2">
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Wishlist - Only for users */}
            {(!authUser.role || authUser.role === 'user') && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="p-2">
                  <Heart className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Shopping Cart - Only for users */}
            {(!authUser.role || authUser.role === 'user') && (
              <Link to="/cart" className="relative">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="p-2">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 bg-sellera-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="p-1">
                      <Avatar>
                        <AvatarFallback className="bg-sellera-purple text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="animate-fade-in">
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register">
                    <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">Register</Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.nav
            className="md:hidden mt-4 py-2 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/"
                  className={`block px-2 py-1 ${location.pathname === '/' ? 'text-sellera-purple font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/products"
                  className={`block px-2 py-1 ${location.pathname.includes('/products') ? 'text-sellera-purple font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </motion.li>
              {authUser.role === 'vendor' && (
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/vendor/dashboard"
                    className={`block px-2 py-1 ${location.pathname.includes('/vendor') ? 'text-sellera-purple font-medium' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vendor Dashboard
                  </Link>
                </motion.li>
              )}
              {!isAuthenticated ? (
                <>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/login"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/register"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </motion.li>
                </>
              ) : (
                <>
                  {authUser.role === 'user' ? (
                    <>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          to="/profile"
                          className={`block px-2 py-1 ${location.pathname === '/profile' ? 'text-sellera-purple font-medium' : ''}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/orders"
                          className={`block px-2 py-1 ${location.pathname.includes('/orders') ? 'text-sellera-purple font-medium' : ''}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Orders
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          to="/cart"
                          className={`block px-2 py-1 ${location.pathname === '/cart' ? 'text-sellera-purple font-medium' : ''}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Cart {totalItems > 0 && (
                            <span className="inline-block ml-1 bg-sellera-purple text-white rounded-full px-2 py-0.5 text-xs">
                              {totalItems}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    </>
                  ) : (
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        to="/vendor/dashboard"
                        className={`block px-2 py-1 ${location.pathname.includes('/vendor') ? 'text-sellera-purple font-medium' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.li>
                  )}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 text-red-500"
                    >
                      Logout
                    </button>
                  </motion.li>
                </>
              )}
            </ul>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
