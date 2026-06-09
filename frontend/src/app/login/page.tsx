'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, InputText, Card, Typography, Message } from '@uigovpe/components';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Typography variant="h2">Sistema de Gestão</Typography>
            <Typography variant="h3">Governo do Estado de Pernambuco</Typography>
          </div>

          {error && (
            <Message severity="error" text={error} style={{ marginBottom: '1rem', width: '100%' }} />
          )}

          <div style={{ marginBottom: '1rem' }}>
            <InputText
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <InputText
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              style={{ width: '100%' }}
            />
          </div>

          <Button
            label={loading ? 'Entrando...' : 'Entrar'}
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%' }}
          />
        </Card>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/register"  style={{ color: '#003580', textDecoration: 'underline' }}>Não tem uma conta? Cadastre-se aqui</a>
        </div>
      </div>
    </div>
  );
}