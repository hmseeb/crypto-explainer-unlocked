import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AffineCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [a, setA] = useState(5);
  const [b, setB] = useState(8);
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const modInverse = (a: number, m: number): number => {
    for (let i = 1; i < m; i++) {
      if ((a * i) % m === 1) {
        return i;
      }
    }
    return -1;
  };

  const affineEncrypt = (text: string, a: number, b: number): string => {
    return text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          const x = char.charCodeAt(0) - 65;
          const encrypted = (a * x + b) % 26;
          return String.fromCharCode(encrypted + 65);
        } else if (char >= 'a' && char <= 'z') {
          const x = char.charCodeAt(0) - 97;
          const encrypted = (a * x + b) % 26;
          return String.fromCharCode(encrypted + 97);
        }
        return char; // Keep spaces, punctuation, and numbers unchanged
      })
      .join('');
  };

  const affineDecrypt = (text: string, a: number, b: number): string => {
    const aInverse = modInverse(a, 26);
    if (aInverse === -1) return 'Invalid key';
    
    return text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          const y = char.charCodeAt(0) - 65;
          const decrypted = (aInverse * (y - b + 26)) % 26;
          return String.fromCharCode(decrypted + 65);
        } else if (char >= 'a' && char <= 'z') {
          const y = char.charCodeAt(0) - 97;
          const decrypted = (aInverse * (y - b + 26)) % 26;
          return String.fromCharCode(decrypted + 97);
        }
        return char; // Keep spaces, punctuation, and numbers unchanged
      })
      .join('');
  };

  const validateKey = (a: number): boolean => {
    return gcd(a, 26) === 1;
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (!validateKey(a)) {
      setError('Key "a" must be coprime to 26 (valid values: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25)');
      return;
    }
    setError('');
    const encrypted = affineEncrypt(plaintext, a, b);
    setCiphertext(encrypted);
    // Clear decrypted text when encrypting
    setDecryptedText('');
  };

  const handleDecrypt = () => {
    if (!ciphertext.trim()) {
      setError('Please encrypt some text first');
      return;
    }
    if (!validateKey(a)) {
      setError('Key "a" must be coprime to 26');
      return;
    }
    setError('');
    const decrypted = affineDecrypt(ciphertext, a, b);
    setDecryptedText(decrypted);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Affine Cipher</span>
                <Badge variant="secondary">Beginner</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                A type of monoalphabetic substitution cipher using modular arithmetic. 
                Each letter is mapped to its numeric equivalent, encrypted using a mathematical function, then converted back to a letter.
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="a">Key A (must be coprime to 26)</Label>
                  <Input
                    id="a"
                    type="number"
                    value={a}
                    onChange={(e) => setA(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="b">Key B (0-25)</Label>
                  <Input
                    id="b"
                    type="number"
                    min="0"
                    max="25"
                    value={b}
                    onChange={(e) => setB(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
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

          <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Mathematical Formula:</h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Encryption: E(x) = (ax + b) mod 26<br/>
              Decryption: D(y) = a⁻¹(y - b) mod 26<br/>
              Current keys: a = {a}, b = {b} {validateKey(a) ? '✓' : '✗ (invalid)'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffineCipher;
