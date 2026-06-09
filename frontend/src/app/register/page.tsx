'use client';

import { Button, Card, InputText, Typography } from "@uigovpe/components";
import { useState } from "react";
export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username || !email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao registrar usuário');
            } else {
                setError('');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
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

                    <Typography variant="h4" style={{ marginBottom: '1rem' }}>Registrar</Typography>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <InputText
                                label="Nome de usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="seu nome de usuário"
                                style={{ width: '100%' }}
                            />
                        </div>
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
                        {error && <p>{error}</p>}
                        <Button
                            label={loading ? 'Registrando...' : 'Registrar'}
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ width: '100%' }}
                        />
                    </form>
                </Card>
                <a href="/login">Já tem uma conta? Faça login aqui</a>

            </div>
        </div>
    );
}