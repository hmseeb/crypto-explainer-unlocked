
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TranspositionCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [keyword, setKeyword] = useState('SECRET');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const generateColumnOrder = (keyword: string): number[] => {
    const chars = keyword.toUpperCase().split('');
    const indexed = chars.map((char, index) => ({ char, index }));
    indexed.sort((a, b) => a.char.localeCompare(b.char));
    return indexed.map(item => item.index);
  };

  const transpositionEncrypt = (text: string, keyword: string): string => {
    const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
    const keyLength = keyword.length;
    const columnOrder = generateColumnOrder(keyword);
    
    // Pad text to fill complete rows
    const paddedLength = Math.ceil(cleanText.length / keyLength) * keyLength;
    const paddedText = cleanText.padEnd(paddedLength, 'X');
    
    // Create grid
    const grid: string[][] = [];
    for (let i = 0; i < paddedText.length; i += keyLength) {
      grid.push(paddedText.slice(i, i + keyLength).split(''));
    }
    
    // Read columns in key order
    let result = '';
    for (const colIndex of columnOrder) {
      for (const row of grid) {
        if (row[colIndex]) {
          result += row[colIndex];
        }
      }
    }
    
    return result;
  };

  const transpositionDecrypt = (text: string, keyword: string): string => {
    const keyLength = keyword.length;
    const columnOrder = generateColumnOrder(keyword);
    const numRows = Math.ceil(text.length / keyLength);
    
    // Create empty grid
    const grid: string[][] = Array(numRows).fill(null).map(() => Array(keyLength).fill(''));
    
    // Fill columns in key order
    let textIndex = 0;
    for (const colIndex of columnOrder) {
      for (let row = 0; row < numRows; row++) {
        if (textIndex < text.length) {
          grid[row][colIndex] = text[textIndex++];
        }
      }
    }
    
    // Read rows
    let result = '';
    for (const row of grid) {
      result += row.join('');
    }
    
    return result.replace(/X+$/, ''); // Remove padding
  };

  const createVisualization = (text: string, keyword: string): { grid: string[][], columnOrder: number[] } => {
    const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
    const keyLength = keyword.length;
    const columnOrder = generateColumnOrder(keyword);
    
    const paddedLength = Math.ceil(cleanText.length / keyLength) * keyLength;
    const paddedText = cleanText.padEnd(paddedLength, 'X');
    
    const grid: string[][] = [];
    for (let i = 0; i < paddedText.length; i += keyLength) {
      grid.push(paddedText.slice(i, i + keyLength).split(''));
    }
    
    return { grid, columnOrder };
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
    const encrypted = transpositionEncrypt(plaintext, keyword);
    setCiphertext(encrypted);
    setDecryptedText(transpositionDecrypt(encrypted, keyword));
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
    const decrypted = transpositionDecrypt(ciphertext, keyword);
    setDecryptedText(decrypted);
  };

  const { grid, columnOrder } = plaintext && keyword ? createVisualization(plaintext, keyword) : { grid: [], columnOrder: [] };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Transposition Cipher (Columnar)</span>
                <Badge variant="default">Intermediate</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Rearranges the order of characters without changing them. 
                Text is written in rows and read in columns according to a keyword-based order.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {grid.length > 0 && (
                <div>
                  <Label>Columnar Grid</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex space-x-1">
                      {keyword.split('').map((char, index) => (
                        <div key={index} className="w-8 h-8 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold bg-blue-100 dark:bg-blue-900">
                          {char.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-1 text-xs">
                      {columnOrder.map((order, index) => (
                        <div key={index} className="w-8 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          {order + 1}
                        </div>
                      ))}
                    </div>
                    {grid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex space-x-1">
                        {row.map((char, colIndex) => (
                          <div key={colIndex} className="w-8 h-8 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-mono bg-gray-50 dark:bg-gray-800">
                            {char}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

          <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">How it works:</h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-200">
              1. Text is arranged in rows under the keyword<br/>
              2. Columns are numbered based on alphabetical order of keyword letters<br/>
              3. Ciphertext is read column by column in numerical order<br/>
              4. This preserves all original letters but changes their positions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranspositionCipher;
