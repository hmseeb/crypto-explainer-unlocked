import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RailFenceCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [rails, setRails] = useState(3);
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const railFenceEncrypt = (text: string, numRails: number): string => {
    if (numRails <= 1) return text;
    
    const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
    const fence: string[][] = Array(numRails).fill(null).map(() => []);
    
    let rail = 0;
    let direction = 1;
    
    for (const char of cleanText) {
      fence[rail].push(char);
      
      rail += direction;
      if (rail === numRails - 1 || rail === 0) {
        direction *= -1;
      }
    }
    
    return fence.flat().join('');
  };

  const railFenceDecrypt = (text: string, numRails: number): string => {
    if (numRails <= 1) return text;
    
    const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
    const fence: string[][] = Array(numRails).fill(null).map(() => []);
    
    // Calculate positions for each rail
    const railLengths = Array(numRails).fill(0);
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
      railLengths[rail]++;
      rail += direction;
      if (rail === numRails - 1 || rail === 0) {
        direction *= -1;
      }
    }
    
    // Fill the fence with characters
    let textIndex = 0;
    for (let i = 0; i < numRails; i++) {
      for (let j = 0; j < railLengths[i]; j++) {
        fence[i].push(cleanText[textIndex++]);
      }
    }
    
    // Read the fence in zigzag pattern
    let result = '';
    rail = 0;
    direction = 1;
    const railIndices = Array(numRails).fill(0);
    
    for (let i = 0; i < cleanText.length; i++) {
      result += fence[rail][railIndices[rail]++];
      rail += direction;
      if (rail === numRails - 1 || rail === 0) {
        direction *= -1;
      }
    }
    
    return result;
  };

  const createRailVisualization = (text: string, numRails: number): string[][] => {
    if (numRails <= 1 || !text) return [];
    
    const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
    const visualization: string[][] = Array(numRails).fill(null).map(() => Array(cleanText.length).fill(' '));
    
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < cleanText.length; i++) {
      visualization[rail][i] = cleanText[i];
      
      rail += direction;
      if (rail === numRails - 1 || rail === 0) {
        direction *= -1;
      }
    }
    
    return visualization;
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (rails < 2) {
      setError('Number of rails must be at least 2');
      return;
    }
    setError('');
    const encrypted = railFenceEncrypt(plaintext, rails);
    setCiphertext(encrypted);
    // Clear decrypted text when encrypting
    setDecryptedText('');
  };

  const handleDecrypt = () => {
    if (!ciphertext.trim()) {
      setError('Please encrypt some text first');
      return;
    }
    if (rails < 2) {
      setError('Number of rails must be at least 2');
      return;
    }
    setError('');
    const decrypted = railFenceDecrypt(ciphertext, rails);
    setDecryptedText(decrypted);
  };

  const visualization = plaintext ? createRailVisualization(plaintext, rails) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Rail Fence Cipher</span>
                <Badge variant="secondary">Beginner</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                A transposition cipher that writes the message in a zigzag pattern across multiple rails, 
                then reads off each rail to create the ciphertext.
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
                <Label htmlFor="rails">Number of Rails</Label>
                <Input
                  id="rails"
                  type="number"
                  min="2"
                  max="10"
                  value={rails}
                  onChange={(e) => setRails(parseInt(e.target.value) || 2)}
                  className="mt-1"
                />
              </div>

              {visualization.length > 0 && (
                <div>
                  <Label>Rail Pattern</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 rounded border font-mono text-sm overflow-x-auto">
                    {visualization.map((rail, railIndex) => (
                      <div key={railIndex} className="whitespace-nowrap">
                        Rail {railIndex + 1}: {rail.join(' ')}
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

          <div className="bg-cyan-50 dark:bg-cyan-950 rounded-lg p-4">
            <h4 className="font-medium text-cyan-900 dark:text-cyan-100 mb-2">How it works:</h4>
            <p className="text-sm text-cyan-800 dark:text-cyan-200">
              1. Write the message in a zigzag pattern across {rails} rails<br/>
              2. Move down and up alternately between the top and bottom rails<br/>
              3. Read each rail from left to right to form the ciphertext<br/>
              4. To decrypt, reverse the process by filling the pattern and reading in zigzag order
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RailFenceCipher;
