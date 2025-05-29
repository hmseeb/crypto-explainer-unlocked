import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const OneTimePad: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const generateRandomKey = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const otpEncrypt = (text: string, key: string): string => {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char >= 'A' && char <= 'Z') {
        if (keyIndex >= cleanKey.length) {
          throw new Error('Key must be at least as long as the message (letters only)');
        }
        const textChar = char.charCodeAt(0) - 65;
        const keyChar = cleanKey.charCodeAt(keyIndex) - 65;
        const encrypted = (textChar + keyChar) % 26;
        result += String.fromCharCode(encrypted + 65);
        keyIndex++;
      } else if (char >= 'a' && char <= 'z') {
        if (keyIndex >= cleanKey.length) {
          throw new Error('Key must be at least as long as the message (letters only)');
        }
        const textChar = char.charCodeAt(0) - 97;
        const keyChar = cleanKey.charCodeAt(keyIndex) - 65;
        const encrypted = (textChar + keyChar) % 26;
        result += String.fromCharCode(encrypted + 97);
        keyIndex++;
      } else {
        result += char; // Keep spaces, punctuation, and numbers unchanged
      }
    }
    return result;
  };

  const otpDecrypt = (text: string, key: string): string => {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char >= 'A' && char <= 'Z') {
        const cipherChar = char.charCodeAt(0) - 65;
        const keyChar = cleanKey.charCodeAt(keyIndex) - 65;
        const decrypted = (cipherChar - keyChar + 26) % 26;
        result += String.fromCharCode(decrypted + 65);
        keyIndex++;
      } else if (char >= 'a' && char <= 'z') {
        const cipherChar = char.charCodeAt(0) - 97;
        const keyChar = cleanKey.charCodeAt(keyIndex) - 65;
        const decrypted = (cipherChar - keyChar + 26) % 26;
        result += String.fromCharCode(decrypted + 97);
        keyIndex++;
      } else {
        result += char; // Keep spaces, punctuation, and numbers unchanged
      }
    }
    return result;
  };

  const handleGenerateKey = () => {
    const letterCount = plaintext.replace(/[^A-Za-z]/g, '').length;
    if (!letterCount) {
      setError('Please enter some text first to generate an appropriate key length');
      return;
    }
    const newKey = generateRandomKey(letterCount);
    setKey(newKey);
    setError('');
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (!key.trim()) {
      setError('Please enter or generate a key');
      return;
    }
    
    try {
      setError('');
      const encrypted = otpEncrypt(plaintext, key);
      setCiphertext(encrypted);
      // Clear decrypted text when encrypting
      setDecryptedText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  const handleDecrypt = () => {
    if (!ciphertext.trim()) {
      setError('Please encrypt some text first');
      return;
    }
    if (!key.trim()) {
      setError('Please enter the key');
      return;
    }
    setError('');
    const decrypted = otpDecrypt(ciphertext, key);
    setDecryptedText(decrypted);
  };

  const cleanPlaintext = plaintext.replace(/[^A-Za-z]/g, '');
  const cleanKey = key.replace(/[^A-Z]/gi, '');
  const keyLength = cleanKey.length;
  const messageLength = cleanPlaintext.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>One-Time Pad</span>
                <Badge variant="destructive">Advanced</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Theoretically unbreakable encryption when used correctly. 
                Requires a truly random key that is as long as the message and used only once.
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
                <p className="text-xs text-muted-foreground mt-1">
                  Letters only: {messageLength} characters
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="key">Random Key</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateKey}
                    className="h-8"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Generate
                  </Button>
                </div>
                <Textarea
                  id="key"
                  placeholder="Enter or generate a random key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1 h-24 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Key length: {keyLength} characters 
                  {messageLength > 0 && (
                    <span className={keyLength >= messageLength ? 'text-green-600' : 'text-red-600'}>
                      {keyLength >= messageLength ? ' ✓ Sufficient' : ' ✗ Too short'}
                    </span>
                  )}
                </p>
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

          <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Security Requirements:</h4>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
              <li>• Key must be truly random (not pseudo-random)</li>
              <li>• Key must be at least as long as the message</li>
              <li>• Key must never be reused</li>
              <li>• Key must be kept completely secret</li>
              <li>• When used correctly, this cipher is unbreakable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OneTimePad;
