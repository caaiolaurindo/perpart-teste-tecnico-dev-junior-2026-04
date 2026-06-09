'use client';

import { Button, Card, InputText, Typography, Message } from "@uigovpe/components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/register', { name, email, password });
            
            setSuccess('Conta criada com sucesso! Redirecionando para o login...');
            
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err : any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
            }
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
                    
                    {error && <Message severity="error" text={error} style={{ marginBottom: '1rem', width: '100%' }} />}
                    {success && <Message severity="success" text={success} style={{ marginBottom: '1rem', width: '100%' }} />}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <InputText
                                label="Nome Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="seu nome completo"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <InputText
                                label="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
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
                            label={loading ? 'Registrando...' : 'Registrar'}
                            onClick={handleSubmit} 
                            disabled={loading}
                            style={{ width: '100%' }}
                        />
                    </div>
                </Card>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href="/login" style={{ color: '#003580', textDecoration: 'underline' }}>
                        Já tem uma conta? Faça login aqui
                    </a>
                </div>
            </div>
        </div>
    );
}