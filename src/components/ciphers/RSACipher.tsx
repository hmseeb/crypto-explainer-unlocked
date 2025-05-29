
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Unlock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RSACipher: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [publicKey, setPublicKey] = useState({ n: 3233, e: 17 });
  const [privateKey, setPrivateKey] = useState({ n: 3233, d: 2753 });
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

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

  const modPow = (base: number, exp: number, mod: number): number => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const generateKeys = () => {
    // Small primes for educational purposes
    const primes = [61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
    const p = primes[Math.floor(Math.random() * primes.length)];
    let q = primes[Math.floor(Math.random() * primes.length)];
    while (q === p) {
      q = primes[Math.floor(Math.random() * primes.length)];
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Common choice for e
    const e = 65537;
    const d = modInverse(e, phi);
    
    if (d === -1) {
      // Fallback to smaller e
      const smallE = 17;
      const smallD = modInverse(smallE, phi);
      setPublicKey({ n, e: smallE });
      setPrivateKey({ n, d: smallD });
    } else {
      setPublicKey({ n, e });
      setPrivateKey({ n, d });
    }
  };

  const rsaEncrypt = (text: string, pubKey: { n: number, e: number }): string => {
    const bytes = new TextEncoder().encode(text);
    const encrypted: number[] = [];
    
    for (const byte of bytes) {
      if (byte >= pubKey.n) {
        throw new Error(`Character value ${byte} is too large for key size. Use shorter text or generate larger keys.`);
      }
      encrypted.push(modPow(byte, pubKey.e, pubKey.n));
    }
    
    return encrypted.join(',');
  };

  const rsaDecrypt = (ciphertext: string, privKey: { n: number, d: number }): string => {
    const encrypted = ciphertext.split(',').map(Number);
    const decrypted: number[] = [];
    
    for (const num of encrypted) {
      decrypted.push(modPow(num, privKey.d, privKey.n));
    }
    
    return new TextDecoder().decode(new Uint8Array(decrypted));
  };

  const handleGenerateKeys = () => {
    generateKeys();
    setError('');
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    
    try {
      setError('');
      const encrypted = rsaEncrypt(plaintext, publicKey);
      setCiphertext(encrypted);
      setDecryptedText(rsaDecrypt(encrypted, privateKey));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  const handleDecrypt = () => {
    if (!ciphertext.trim()) {
      setError('Please encrypt some text first');
      return;
    }
    
    try {
      setError('');
      const decrypted = rsaDecrypt(ciphertext, privateKey);
      setDecryptedText(decrypted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>RSA Cipher</span>
                <Badge variant="destructive">Advanced</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Public-key cryptography using the mathematical properties of large prime numbers. 
                Uses separate keys for encryption and decryption.
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
                  placeholder="Enter your message here (keep it short for demo)..."
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  className="mt-1 h-32"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>RSA Key Pair</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateKeys}
                    className="h-8"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Generate New Keys
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                    <strong>Public Key:</strong><br/>
                    n = {publicKey.n}<br/>
                    e = {publicKey.e}
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-950 rounded">
                    <strong>Private Key:</strong><br/>
                    n = {privateKey.n}<br/>
                    d = {privateKey.d}
                  </div>
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
                <Label htmlFor="ciphertext">Ciphertext (Numbers)</Label>
                <Textarea
                  id="ciphertext"
                  value={ciphertext}
                  readOnly
                  className="mt-1 h-32 bg-gray-50 dark:bg-gray-900 text-xs"
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
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">RSA Process:</h4>
            <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <p>1. Choose two prime numbers p and q</p>
              <p>2. Calculate n = p × q and φ(n) = (p-1)(q-1)</p>
              <p>3. Choose e such that gcd(e, φ(n)) = 1</p>
              <p>4. Calculate d such that (d × e) mod φ(n) = 1</p>
              <p>5. Public key: (n, e), Private key: (n, d)</p>
              <p className="text-xs mt-2 italic">Note: This demo uses small primes for educational purposes. Real RSA uses much larger primes (1024+ bits).</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSACipher;
