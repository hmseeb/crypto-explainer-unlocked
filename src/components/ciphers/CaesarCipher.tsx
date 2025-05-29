
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CaesarCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [shift, setShift] = useState(3);
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const caesarEncrypt = (text: string, shift: number): string => {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        return char;
      })
      .join('');
  };

  const caesarDecrypt = (text: string, shift: number): string => {
    return caesarEncrypt(text, 26 - shift);
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    setError('');
    const encrypted = caesarEncrypt(plaintext, shift);
    setCiphertext(encrypted);
    // Clear decrypted text when encrypting
    setDecryptedText('');
  };

  const handleDecrypt = () => {
    if (!ciphertext.trim()) {
      setError('Please encrypt some text first');
      return;
    }
    setError('');
    const decrypted = caesarDecrypt(ciphertext, shift);
    setDecryptedText(decrypted);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Caesar Cipher</span>
                <Badge variant="secondary">Beginner</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                A simple substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.
                Named after Julius Caesar, who used it for military communications.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="shift">Shift Value (0-25)</Label>
                <Input
                  id="shift"
                  type="number"
                  min="0"
                  max="25"
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value) || 0)}
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

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Each letter in the plaintext is shifted by {shift} positions forward in the alphabet. 
              For example, with shift {shift}: A → {String.fromCharCode(((0 + shift) % 26) + 65)}, 
              B → {String.fromCharCode(((1 + shift) % 26) + 65)}, etc.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaesarCipher;
