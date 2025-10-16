/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useState, useEffect, useRef} from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void; // This prop remains, though its direct trigger (the X button) is removed.
  isAppOpen: boolean;
  appId?: string | null;
  onToggleParameters: () => void;
  onExitToDesktop: () => void;
  isParametersPanelOpen?: boolean;
}

const MenuItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({children, onClick, className}) => (
  <span
    className={`menu-item cursor-pointer hover:text-blue-600 ${className}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick?.();
    }}
    tabIndex={0}
    role="button">
    {children}
  </span>
);

export const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  isAppOpen,
  onToggleParameters,
  onExitToDesktop,
  isParametersPanelOpen,
}) => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target as Node)
      ) {
        setIsFileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[800px] h-[600px] bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col relative overflow-hidden font-sans backdrop-blur-sm bg-white/80">
      {/* Title Bar */}
      <div className="bg-gray-800/90 text-white py-2 px-4 font-semibold text-base flex justify-between items-center select-none cursor-default rounded-t-xl flex-shrink-0">
        <span className="title-bar-text">{title}</span>
        {/* "X" button removed from here */}
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-100/80 py-2 px-3 border-b border-gray-200 select-none flex gap-4 flex-shrink-0 text-sm text-gray-700 items-center">
        <div className="relative" ref={fileMenuRef}>
          <MenuItem onClick={() => setIsFileMenuOpen((prev) => !prev)}>
            <u>F</u>ile
          </MenuItem>
          {isFileMenuOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              {isAppOpen ? (
                <div
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onExitToDesktop();
                    setIsFileMenuOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onExitToDesktop();
                      setIsFileMenuOpen(false);
                    }
                  }}
                  tabIndex={0}
                  role="menuitem">
                  Exit
                </div>
              ) : (
                <span className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                  Exit
                </span>
              )}
            </div>
          )}
        </div>
        {!isParametersPanelOpen && (
          <MenuItem onClick={onToggleParameters}>
            <u>P</u>arameters
          </MenuItem>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};
