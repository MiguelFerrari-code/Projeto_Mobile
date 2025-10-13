import React from 'react';
import { AuthProvider } from './src/context/auth';
import { Navigation } from './src/navigations';
import { MedicamentoProvider } from './src/context/MedicamentoContext';

export default function App() {
  return (
    <AuthProvider>
      <MedicamentoProvider>
        <Navigation />
      </MedicamentoProvider>
    </AuthProvider>
  );
}


