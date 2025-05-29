import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VigenereCipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [keyword, setKeyword] = useState('SECRET');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const vigenereEncrypt = (text: string, key: string): string => {
    if (!key) return text;
    
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char >= 'A' && char <= 'Z') {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const encrypted = String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        result += encrypted;
        keyIndex++;
      } else if (char >= 'a' && char <= 'z') {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const encrypted = String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        result += encrypted;
        keyIndex++;
      } else {
        result += char; // Keep spaces, punctuation, and numbers unchanged
      }
    }
    return result;
  };

  const vigenereDecrypt = (text: string, key: string): string => {
    if (!key) return text;
    
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char >= 'A' && char <= 'Z') {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const decrypted = String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        result += decrypted;
        keyIndex++;
      } else if (char >= 'a' && char <= 'z') {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const decrypted = String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        result += decrypted;
        keyIndex++;
      } else {
        result += char; // Keep spaces, punctuation, and numbers unchanged
      }
    }
    return result;
  };

  const generateKeyPattern = (text: string, key: string): string => {
    if (!key) return '';
    
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let pattern = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
        pattern += cleanKey[keyIndex % cleanKey.length];
        keyIndex++;
      } else {
        pattern += ' ';
      }
    }
    return pattern;
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
    const encrypted = vigenereEncrypt(plaintext, keyword);
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
    const decrypted = vigenereDecrypt(ciphertext, keyword);
    setDecryptedText(decrypted);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Vigenère Cipher</span>
                <Badge variant="default">Intermediate</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                A polyalphabetic substitution cipher using a repeating keyword. 
                Much stronger than Caesar cipher as it uses different shifts for different letters.
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
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="Enter keyword (letters only)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="mt-1"
                />
              </div>

              {plaintext && keyword && (
                <div>
                  <Label>Key Pattern</Label>
                  <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm font-mono">
                    <div>Text: {plaintext}</div>
                    <div>Key:  {generateKeyPattern(plaintext, keyword)}</div>
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

          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">How it works:</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Each letter in the plaintext is shifted by a different amount based on the corresponding letter in the keyword. 
              The keyword repeats throughout the message, making frequency analysis much more difficult than simple substitution ciphers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VigenereCipher;
