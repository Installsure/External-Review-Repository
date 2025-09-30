import { useState, useEffect } from 'react';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus } from 'lucide-react';

export default function SlimFuseStorePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // For demo, use mock data
      const mockProducts = [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium noise-cancelling headphones with 30-hour battery life',
          price_cents: 12999,
          price_dollars: '129.99',
          image_url:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
          inventory_count: 45,
          is_active: true,
        },
        {
          id: 2,
          name: 'Smart Fitness Watch',
          description: 'Track your health and fitness with GPS and heart rate monitoring',
          price_cents: 24999,
          price_dollars: '249.99',
          image_url:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center',
          inventory_count: 23,
          is_active: true,
        },
        {
          id: 3,
          name: 'Portable Phone Charger',
          description: '10000mAh power bank with fast charging for all devices',
          price_cents: 3999,
          price_dollars: '39.99',
          image_url:
            'https://images.unsplash.com/photo-1609091839311-d5365f9ff1d5?w=300&h=300&fit=crop&crop=center',
          inventory_count: 78,
          is_active: true,
        },
        {
          id: 4,
          name: 'Laptop Stand',
          description: 'Ergonomic aluminum laptop stand for better posture',
          price_cents: 5999,
          price_dollars: '59.99',
          image_url:
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop&crop=center',
          inventory_count: 34,
          is_active: true,
        },
        {
          id: 5,
          name: 'USB-C Hub',
          description: '7-in-1 USB-C hub with 4K HDMI, USB 3.0, and SD card slots',
          price_cents: 7999,
          price_dollars: '79.99',
          image_url:
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop&crop=center',
          inventory_count: 56,
          is_active: true,
        },
        {
          id: 6,
          name: 'Mechanical Keyboard',
          description: 'RGB backlit mechanical keyboard with blue switches',
          price_cents: 14999,
          price_dollars: '149.99',
          image_url:
            'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop&crop=center',
          inventory_count: 12,
          is_active: true,
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        );
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price_cents * item.quantity, 0);
  };

  const getCartItemCount = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#E5E7EB] dark:border-[#374151] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg transition-colors hover:bg-[#F3F4F6] dark:hover:bg-[#374151] active:scale-95"
              >
                <ArrowLeft size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-black dark:text-white font-sora">
                  SlimFuse Store
                </h1>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Modern e-commerce blueprint demo
                </p>
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 rounded-lg border border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors">
                  <ShoppingCart size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                </button>
                {cart.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#059669] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="text-right">
                  <div className="font-bold text-lg text-black dark:text-white font-sora">
                    ${(getCartTotal() / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                    Cart Total
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:border-[#059669] dark:focus:border-[#10B981] focus:ring-1 focus:ring-[#059669] dark:focus:ring-[#10B981] transition-colors font-inter"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#E5E7EB] dark:border-[#374151] border-t-[#059669] dark:border-t-[#10B981] rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const cartCount = getCartItemCount(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E7EB] dark:border-[#374151] overflow-hidden hover:shadow-lg transition-all duration-200 group"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-[#F3F4F6] dark:bg-[#374151] overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-black dark:text-white mb-2 font-poppins text-sm">
                        {product.name}
                      </h3>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-4 font-inter line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-black dark:text-white font-sora">
                          ${product.price_dollars}
                        </div>
                        <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                          {product.inventory_count} in stock
                        </div>
                      </div>

                      {/* Add to Cart Controls */}
                      {cartCount > 0 ? (
                        <div className="flex items-center justify-between bg-[#F0FDF4] dark:bg-[rgba(16,185,129,0.1)] border border-[#BBF7D0] dark:border-[#10B981]/30 rounded-lg p-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#374151] rounded-md flex items-center justify-center hover:bg-[#F9FAFB] dark:hover:bg-[#374151] active:scale-95 transition-all"
                          >
                            <Minus size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                          </button>

                          <span className="font-semibold text-black dark:text-white font-inter">
                            {cartCount}
                          </span>

                          <button
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 bg-[#059669] text-white rounded-md flex items-center justify-center hover:bg-[#047857] active:scale-95 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full py-2 px-4 bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-semibold rounded-lg hover:from-[#047857] hover:to-[#059669] active:scale-95 transition-all duration-150 font-inter"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  No products found matching your search.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
