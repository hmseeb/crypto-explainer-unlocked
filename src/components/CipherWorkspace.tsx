
import React from 'react';
import CaesarCipher from './ciphers/CaesarCipher';
import AffineCipher from './ciphers/AffineCipher';
import VigenereCipher from './ciphers/VigenereCipher';
import PlayfairCipher from './ciphers/PlayfairCipher';
import OneTimePad from './ciphers/OneTimePad';
import TranspositionCipher from './ciphers/TranspositionCipher';
import RailFenceCipher from './ciphers/RailFenceCipher';
import RSACipher from './ciphers/RSACipher';
import HashFunction from './ciphers/HashFunction';

interface CipherWorkspaceProps {
  selectedCipher: string;
}

const CipherWorkspace: React.FC<CipherWorkspaceProps> = ({ selectedCipher }) => {
  const renderCipher = () => {
    switch (selectedCipher) {
      case 'caesar':
        return <CaesarCipher />;
      case 'affine':
        return <AffineCipher />;
      case 'vigenere':
        return <VigenereCipher />;
      case 'playfair':
        return <PlayfairCipher />;
      case 'otp':
        return <OneTimePad />;
      case 'transposition':
        return <TranspositionCipher />;
      case 'railfence':
        return <RailFenceCipher />;
      case 'rsa':
        return <RSACipher />;
      case 'hash':
        return <HashFunction />;
      default:
        return <CaesarCipher />;
    }
  };

  return (
    <div className="space-y-6">
      {renderCipher()}
    </div>
  );
};

export default CipherWorkspace;
