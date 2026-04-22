'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Typography, Message } from '@uigovpe/components';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import api from '@/services/api';

interface Favorite {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data);
    } catch {
      setError('Erro ao carregar favoritos');
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleRemove = async (productId: string) => {
    try {
      await api.post(`/favorites/${productId}`);
      fetchFavorites();
    } catch {
      setError('Erro ao remover favorito');
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <Typography variant="h2" style={{ marginBottom: '1.5rem' }}>Meus Favoritos</Typography>

        {error && <Message severity="error" text={error} style={{ marginBottom: '1rem' }} />}

        {favorites.length === 0 ? (
          <Card>
            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Você ainda não favoritou nenhum produto.
            </p>
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {favorites.map((fav) => (
              <Card key={fav.id}>
                {fav.product.imageUrl && (
                  <img
                    src={`http://localhost:3001${fav.product.imageUrl}`}
                    alt={fav.product.name}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div style={{ padding: '0.75rem' }}>
                  <Typography variant="h4">{fav.product.name}</Typography>
                  <Typography variant="p">{fav.product.description}</Typography>
                  <Typography variant="p" style={{ fontWeight: 'bold', color: '#1e7e34' }}>
                    R$ {Number(fav.product.price).toFixed(2)}
                  </Typography>
                  <Button
                    label="Remover dos Favoritos"
                    severity="danger"
                    onClick={() => handleRemove(fav.product.id)}
                    style={{ width: '100%', marginTop: '0.75rem' }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}