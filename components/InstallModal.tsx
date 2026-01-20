import React, { useEffect, useRef } from 'react';
import { X, ArrowRight, MousePointerClick, Globe } from 'lucide-react';
import { getBookmarkletCode } from '../utils/bookmarklet';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const bookmarkletHref = getBookmarkletCode();

  useEffect(() => {
    if (isOpen && linkRef.current) {
      linkRef.current.href = bookmarkletHref;
    }
  }, [isOpen, bookmarkletHref]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Take it with you</h2>
              <p className="text-blue-100 mt-1">Install FrostFrame on any website.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-center">
             <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 hidden sm:block">
               <MousePointerClick className="text-blue-500" size={24} />
             </div>
             <div className="flex-1">
               <h3 className="font-semibold text-blue-900 text-sm">How to install</h3>
               <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                 Drag the button below to your browser's <strong>Bookmarks Bar</strong>.
                 <br/>
                 <span className="text-blue-500/80">You can also click it now to test!</span>
               </p>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 border-dashed border-2 border-gray-200 rounded-xl bg-gray-50/50">
            <a 
              ref={linkRef}
              className="cursor-move group relative inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Drag to bookmarks or click to test"
            >
              <span>❄️ FrostFrame Activate</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[10px] text-gray-400 mt-3">← Drag this button to your bookmarks bar</p>
          </div>

          <div className="space-y-3">
             <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
               <Globe size={14} /> 
               Try it out
             </h4>
             <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside marker:text-blue-500 marker:font-bold">
               <li>Navigate to <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google.com</a> or any other site.</li>
               <li>Click the <strong>FrostFrame Activate</strong> bookmark you just created.</li>
               <li>Enjoy the snow! (Controls will appear in the bottom right).</li>
             </ol>
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center text-xs text-gray-400">
           100% Client-side JavaScript. No data is collected.
        </div>
      </div>
    </div>
  );
};

export default InstallModal;