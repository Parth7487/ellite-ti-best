import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, CheckCircle, CreditCard } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'expedited'>('standard');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const shippingCost = shippingMethod === 'standard' ? 120 : 350; // High end freight charges for widebody kits/hoods
  const grandTotal = subtotal + (cartItems.length > 0 ? shippingCost : 0);

  const handleCheckout = () => {
    setCheckoutStatus('processing');
    setTimeout(() => {
      setCheckoutStatus('success');
    }, 2000);
  };

  const handleResetCheckout = () => {
    setCheckoutStatus('idle');
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#080808] border-l border-neutral-800 flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c0f20c]" />
              <h2 className="font-display font-medium text-lg text-white uppercase tracking-wider">YOUR CAR CART</h2>
              <span className="text-xs font-mono bg-[#c0f20c]/10 text-[#c0f20c] px-2 py-0.5 rounded border border-[#c0f20c]/20">
                {cartItems.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            </div>
            <button 
              onClick={onClose}
              id="close-cart-btn"
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout state controllers */}
          {checkoutStatus === 'idle' && (
            <>
              {/* Cart items list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="p-4 rounded-full bg-neutral-950 border border-neutral-900 text-neutral-600">
                      <ShoppingBag className="w-10 h-10 stroke-1" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-medium text-white uppercase text-sm tracking-widest">BUILD IS EMPTY</p>
                      <p className="text-xs text-neutral-500 max-w-xs">You have not added any high-performance components to your build yet.</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-mono font-medium rounded border border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300 transition-colors uppercase tracking-wider"
                    >
                      Browse Components
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-4 rounded bg-neutral-950 border border-neutral-900 relative group transition-all hover:border-neutral-800"
                    >
                      {/* Product Thumbnail representation */}
                      <div className="w-16 h-16 shrink-0 rounded bg-black border border-neutral-800 flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                        {item.imageType === 'tier1' && (
                          <div className="text-[11px] font-display font-bold text-[#c0f20c]">ETi <span className="text-[8px] block font-mono text-neutral-500">KIT</span></div>
                        )}
                        {item.imageType === 'tier2' && (
                          <div className="text-[11px] font-display font-semibold text-white">HOOD <span className="text-[8px] block font-mono text-neutral-500">CARBON</span></div>
                        )}
                        {item.imageType === 'tier3' && (
                          <div className="text-[11px] font-display font-medium text-neutral-300">TI <span className="text-[8px] block font-mono text-[#c0f20c]">HARDWARE</span></div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider truncate">
                            {item.title}
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#c0f20c] shrink-0">
                            ${item.totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-medium tracking-wide mt-0.5 uppercase">
                          {item.subtitle}
                        </p>

                        {/* Selected Options chips */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.selectedOptions.map((opt, idx) => (
                            <span 
                              key={idx} 
                              className="text-[8.5px] font-mono px-1.5 py-0.5 rounded-[2px] bg-neutral-900 border border-neutral-800/60 text-neutral-300 uppercase shrink-0"
                            >
                              <span className="text-neutral-500 mr-1">{opt.label}:</span>{opt.value}
                            </span>
                          ))}
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-900/40">
                          <div className="flex items-center gap-2 border border-neutral-800 rounded bg-black h-7">
                            <button 
                              onClick={() => onUpdateQty(item.id, item.qty - 1)}
                              className="p-1 text-neutral-500 hover:text-white transition-colors"
                              disabled={item.qty <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold text-white px-1.5 min-w-[16px] text-center">
                              {item.qty}
                            </span>
                            <button 
                              onClick={() => onUpdateQty(item.id, item.qty + 1)}
                              className="p-1 text-neutral-500 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Calculations */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-black border-t border-neutral-900 space-y-4">
                  {/* Shipping option */}
                  <div className="bg-neutral-950 p-3 rounded border border-neutral-900">
                    <label className="text-[10px] font-mono tracking-wider text-neutral-500 block uppercase mb-2">Freight Shipping Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShippingMethod('standard')}
                        className={`p-2 text-left rounded border transition-all ${
                          shippingMethod === 'standard'
                            ? 'bg-[#c0f20c]/5 border-[#c0f20c]':'bg-black border-neutral-900 hover:border-neutral-800'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-white uppercase">Sea Freight</div>
                        <div className="text-[9px] font-mono text-neutral-500">6-8 Weeks • $120</div>
                      </button>

                      <button
                        onClick={() => setShippingMethod('expedited')}
                        className={`p-2 text-left rounded border transition-all ${
                          shippingMethod === 'expedited'
                            ? 'bg-[#c0f20c]/5 border-[#c0f20c]':'bg-black border-neutral-900 hover:border-neutral-800'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-[#c0f20c] uppercase flex items-center gap-1">Air Cargo <Sparkles className="w-2.5 h-2.5" /></div>
                        <div className="text-[9px] font-mono text-neutral-500">10-14 days • $350</div>
                      </button>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mt-1">
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>subtotal:</span>
                      <span className="text-white">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>freight:</span>
                      <span className="text-white">${shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-neutral-900 my-2" />
                    <div className="flex justify-between text-sm font-display font-bold">
                      <span className="uppercase text-neutral-200 tracking-wider">Estimated Total:</span>
                      <span className="text-[#c0f20c] text-lg">${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCheckout}
                      id="checkout-trigger-btn"
                      className="w-full py-4 rounded bg-[#c0f20c] text-black font-display font-bold uppercase tracking-wider text-xs hover:bg-[#aacc00] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" /> SECURE CHECKOUT (SIMULATED)
                    </button>
                    <p className="text-[8px] font-mono text-center text-neutral-600 uppercase tracking-widest">
                      🔒 256-bit ssl encrypted connection • shopify checkout API
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Processing simulated state */}
          {checkoutStatus === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-neutral-800 border-t-[#c0f20c] animate-spin" />
              <div className="space-y-1">
                <p className="font-display font-medium text-white uppercase tracking-wider text-sm">PROCESSING BULK ORDER</p>
                <p className="text-xs text-neutral-500 font-mono">Connecting with ELITE TI secure Shopify server...</p>
              </div>
            </div>
          )}

          {/* Success state */}
          {checkoutStatus === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="p-4 bg-[#c0f20c]/10 rounded-full border border-[#c0f20c]/40 text-[#c0f20c] animate-bounce">
                <CheckCircle className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-bold text-white text-lg uppercase tracking-wider">ORDER RECEIVED!</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Your customized build has been logged with the ETi Atelier. Our master fabricator has initiated the carbon curation process.
                </p>
              </div>

              <div className="bg-neutral-950 border border-neutral-900 rounded p-4 w-full text-left space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">BUILD ID:</span>
                  <span className="text-neutral-300">#ETI-FD3S-{(Math.floor(Math.random() * 90000) + 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">EST. DEPARTURE:</span>
                  <span className="text-[#c0f20c]">6-8 WEEKS (CURATED TO MATCH)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">STATUS:</span>
                  <span className="text-white bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[9px] uppercase border border-green-500/20">PRE-PRODUCTION</span>
                </div>
              </div>

              <p className="text-[10px] text-neutral-500">
                A confirmation email with full diagnostic configurations and digital blueprints has been sent.
              </p>

              <button
                onClick={handleResetCheckout}
                className="w-full py-3 bg-neutral-900 border border-neutral-800 text-white rounded font-display font-bold uppercase tracking-wider text-xs hover:border-[#c0f20c] hover:text-[#c0f20c] transition-colors"
                id="reset-checkout-btn"
              >
                Assemble Another Build
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
