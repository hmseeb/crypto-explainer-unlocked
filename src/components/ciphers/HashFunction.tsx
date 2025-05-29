
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Hash, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const HashFunction: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const sha256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleHash = async () => {
    if (!input.trim()) {
      setError('Please enter text to hash');
      return;
    }
    
    try {
      setError('');
      const hashResult = await sha256(input);
      setHash(hashResult);
    } catch (err) {
      setError('Hashing failed');
    }
  };

  const handleCopy = async () => {
    if (hash) {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateStats = (text: string) => {
    return {
      characters: text.length,
      bytes: new TextEncoder().encode(text).length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0
    };
  };

  const stats = calculateStats(input);

  // Auto-hash as user types (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        handleHash();
      } else {
        setHash('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>SHA-256 Hash Function</span>
                <Badge variant="default">Intermediate</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                A one-way cryptographic hash function that produces a fixed 256-bit (32-byte) hash value. 
                Widely used for data integrity verification and digital signatures.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input">Input Text</Label>
                <Textarea
                  id="input"
                  placeholder="Enter any text to generate its SHA-256 hash..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="mt-1 h-40"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{stats.characters} characters, {stats.bytes} bytes</span>
                  <span>{stats.words} words</span>
                </div>
              </div>

              <Button onClick={handleHash} className="w-full">
                <Hash className="w-4 h-4 mr-2" />
                Generate Hash
              </Button>

              <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Try these examples:</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setInput('Hello, World!')}
                  >
                    "Hello, World!"
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setInput('The quick brown fox jumps over the lazy dog')}
                  >
                    "The quick brown fox jumps over the lazy dog"
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setInput('password123')}
                  >
                    "password123"
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="hash">SHA-256 Hash (64 hex characters)</Label>
                  {hash && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                      className="h-8"
                    >
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="hash"
                  value={hash}
                  readOnly
                  className="mt-1 h-24 bg-gray-50 dark:bg-gray-900 font-mono text-sm"
                  placeholder="Hash will appear here..."
                />
                {hash && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Length: {hash.length} characters (256 bits)
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium mb-2">Hash Properties:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Deterministic:</strong> Same input = same hash</li>
                  <li>• <strong>Fixed size:</strong> Always 256 bits (64 hex chars)</li>
                  <li>• <strong>One-way:</strong> Cannot reverse hash to get input</li>
                  <li>• <strong>Avalanche effect:</strong> Small input change = big hash change</li>
                  <li>• <strong>Collision resistant:</strong> Hard to find two inputs with same hash</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Common Uses:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Password storage (with salt)</li>
                  <li>• File integrity verification</li>
                  <li>• Digital signatures</li>
                  <li>• Blockchain and cryptocurrency</li>
                  <li>• Data deduplication</li>
                </ul>
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
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">⚠️ Important Security Note:</h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              This is a one-way function - there is no "decrypt" operation for hashes. 
              SHA-256 is cryptographically secure and used in production systems worldwide. 
              For password storage, always use additional techniques like salting and key stretching (e.g., bcrypt, scrypt, or Argon2).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HashFunction;
