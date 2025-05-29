
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BookOpen } from 'lucide-react';
import CipherSidebar from '@/components/CipherSidebar';
import CipherWorkspace from '@/components/CipherWorkspace';

const Index = () => {
  const [selectedCipher, setSelectedCipher] = useState('caesar');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">CryptoLearn</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Interactive Cryptography Education</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CipherSidebar 
                selectedCipher={selectedCipher}
                onCipherSelect={setSelectedCipher}
              />
            </div>

            {/* Workspace */}
            <div className="lg:col-span-3">
              <CipherWorkspace selectedCipher={selectedCipher} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
