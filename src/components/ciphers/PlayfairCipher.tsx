import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PlayfairCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [keyword, setKeyword] = useState('PLAYFAIR');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const generateKeySquare = (key: string): string[][] => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted, I/J are treated as same
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const seen = new Set<string>();
    const keySquare: string[][] = [];
    let currentRow: string[] = [];
    
    // Add unique letters from key
    for (const char of cleanKey) {
      if (!seen.has(char)) {
        seen.add(char);
        currentRow.push(char);
        if (currentRow.length === 5) {
          keySquare.push(currentRow);
          currentRow = [];
        }
      }
    }
    
    // Add remaining letters from alphabet
    for (const char of alphabet) {
      if (!seen.has(char)) {
        seen.add(char);
        currentRow.push(char);
        if (currentRow.length === 5) {
          keySquare.push(currentRow);
          currentRow = [];
        }
      }
    }
    
    return keySquare;
  };

  const findPosition = (char: string, keySquare: string[][]): [number, number] => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (keySquare[i][j] === char) {
          return [i, j];
        }
      }
    }
    return [0, 0];
  };

  const preparePlaintext = (text: string): string => {
    let prepared = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let result = '';
    
    for (let i = 0; i < prepared.length; i += 2) {
      let first = prepared[i];
      let second = prepared[i + 1];
      
      if (!second) {
        second = 'X'; // Padding
      } else if (first === second) {
        result += first + 'X';
        i--; // Process the second character again
        continue;
      }
      
      result += first + second;
    }
    
    return result;
  };

  const playfairEncrypt = (text: string, key: string): string => {
    const keySquare = generateKeySquare(key);
    const prepared = preparePlaintext(text);
    let result = '';
    
    for (let i = 0; i < prepared.length; i += 2) {
      const char1 = prepared[i];
      const char2 = prepared[i + 1];
      
      const [row1, col1] = findPosition(char1, keySquare);
      const [row2, col2] = findPosition(char2, keySquare);
      
      if (row1 === row2) {
        // Same row - shift right
        result += keySquare[row1][(col1 + 1) % 5];
        result += keySquare[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
        // Same column - shift down
        result += keySquare[(row1 + 1) % 5][col1];
        result += keySquare[(row2 + 1) % 5][col2];
      } else {
        // Rectangle - swap columns
        result += keySquare[row1][col2];
        result += keySquare[row2][col1];
      }
    }
    
    return result;
  };

  const playfairDecrypt = (text: string, key: string): string => {
    const keySquare = generateKeySquare(key);
    let result = '';
    
    for (let i = 0; i < text.length; i += 2) {
      const char1 = text[i];
      const char2 = text[i + 1];
      
      const [row1, col1] = findPosition(char1, keySquare);
      const [row2, col2] = findPosition(char2, keySquare);
      
      if (row1 === row2) {
        // Same row - shift left
        result += keySquare[row1][(col1 + 4) % 5];
        result += keySquare[row2][(col2 + 4) % 5];
      } else if (col1 === col2) {
        // Same column - shift up
        result += keySquare[(row1 + 4) % 5][col1];
        result += keySquare[(row2 + 4) % 5][col2];
      } else {
        // Rectangle - swap columns
        result += keySquare[row1][col2];
        result += keySquare[row2][col1];
      }
    }
    
    return result;
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }
    setError('');
    const encrypted = playfairEncrypt(plaintext, keyword);
    setCiphertext(encrypted);
    // Clear decrypted text when encrypting
    setDecryptedText('');
  };

  const handleDecrypt = () => {
    if (!ciphertext.trim()) {
      setError('Please encrypt some text first');
      return;
    }
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }
    setError('');
    const decrypted = playfairDecrypt(ciphertext, keyword);
    setDecryptedText(decrypted);
  };

  const keySquare = generateKeySquare(keyword);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Playfair Cipher</span>
                <Badge variant="default">Intermediate</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                A digraph substitution cipher using a 5×5 key square. 
                Encrypts pairs of letters instead of individual letters, making it more secure than monoalphabetic ciphers.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="plaintext">Plaintext</Label>
                <Textarea
                  id="plaintext"
                  placeholder="Enter your message here..."
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  className="mt-1 h-32"
                />
              </div>
              
              <div>
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="Enter keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleEncrypt} className="flex-1">
                  <Lock className="w-4 h-4 mr-2" />
                  Encrypt
                </Button>
                <Button onClick={handleDecrypt} variant="outline" className="flex-1">
                  <Unlock className="w-4 h-4 mr-2" />
                  Decrypt
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>5×5 Key Square</Label>
                <div className="mt-1 grid grid-cols-5 gap-1 w-fit">
                  {keySquare.flat().map((char, index) => (
                    <div key={index} className="w-8 h-8 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-mono bg-gray-50 dark:bg-gray-800">
                      {char}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: I and J are treated as the same letter
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="ciphertext">Ciphertext</Label>
                <Textarea
                  id="ciphertext"
                  value={ciphertext}
                  readOnly
                  className="mt-1 h-32 bg-gray-50 dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="decrypted">Decrypted Text</Label>
                <Textarea
                  id="decrypted"
                  value={decryptedText}
                  readOnly
                  className="mt-1 h-20 bg-gray-50 dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Playfair Rules:</h4>
            <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
              <li>• Same row: move right (encrypt) / left (decrypt)</li>
              <li>• Same column: move down (encrypt) / up (decrypt)</li>
              <li>• Rectangle: swap columns</li>
              <li>• Duplicate letters in pairs are separated with 'X'</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayfairCipher;
