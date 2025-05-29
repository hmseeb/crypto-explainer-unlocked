
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Key, 
  Hash, 
  RotateCcw, 
  Grid3X3, 
  Square, 
  Shuffle, 
  Columns, 
  Zap 
} from 'lucide-react';

interface CipherSidebarProps {
  selectedCipher: string;
  onCipherSelect: (cipher: string) => void;
}

const ciphers = [
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    icon: RotateCcw,
    description: 'Simple substitution cipher with fixed shift',
    difficulty: 'Beginner'
  },
  {
    id: 'affine',
    name: 'Affine Cipher',
    icon: Grid3X3,
    description: 'Mathematical substitution using modular arithmetic',
    difficulty: 'Beginner'
  },
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    icon: Key,
    description: 'Polyalphabetic substitution with keyword',
    difficulty: 'Intermediate'
  },
  {
    id: 'playfair',
    name: 'Playfair Cipher',
    icon: Square,
    description: 'Digraph substitution using 5×5 key square',
    difficulty: 'Intermediate'
  },
  {
    id: 'otp',
    name: 'One-Time Pad',
    icon: Zap,
    description: 'Theoretically unbreakable with random key',
    difficulty: 'Advanced'
  },
  {
    id: 'transposition',
    name: 'Transposition Cipher',
    icon: Columns,
    description: 'Rearranges letters using columnar method',
    difficulty: 'Intermediate'
  },
  {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    icon: Shuffle,
    description: 'Zigzag pattern transposition cipher',
    difficulty: 'Beginner'
  },
  {
    id: 'rsa',
    name: 'RSA Cipher',
    icon: Shield,
    description: 'Public-key cryptography with large primes',
    difficulty: 'Advanced'
  },
  {
    id: 'hash',
    name: 'SHA-256 Hash',
    icon: Hash,
    description: 'One-way cryptographic hash function',
    difficulty: 'Intermediate'
  }
];

const CipherSidebar: React.FC<CipherSidebarProps> = ({ selectedCipher, onCipherSelect }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cipher Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ciphers.map((cipher) => {
          const IconComponent = cipher.icon;
          return (
            <Button
              key={cipher.id}
              variant={selectedCipher === cipher.id ? "default" : "ghost"}
              className="w-full justify-start h-auto p-3 text-left"
              onClick={() => onCipherSelect(cipher.id)}
            >
              <div className="flex items-start space-x-3 w-full min-w-0">
                <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="font-medium text-sm leading-tight mb-1">{cipher.name}</div>
                  <div className="text-xs text-muted-foreground leading-tight mb-2 break-words">
                    {cipher.description}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(cipher.difficulty)}`}>
                    {cipher.difficulty}
                  </span>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CipherSidebar;
