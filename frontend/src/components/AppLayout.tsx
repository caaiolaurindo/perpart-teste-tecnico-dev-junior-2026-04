'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AdminSideBar, AdminUserBar, GovBar } from '@uigovpe/components';
import { useRouter, usePathname } from 'next/navigation';

const menuUsuario = [
    {
        id: 'produtos',
        label: 'Produtos',
        link: '/produtos',
    },
    {
        id: 'categorias',
        label: 'Categorias',
        link: '/categorias',
    },
    {
        id: 'favoritos',
        label: 'Favoritos',
        link: '/favoritos',
    },
];

const menuAdmin = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        link: '/dashboard',
    },
    {
        id: 'usuarios',
        label: 'Usuários',
        link: '/usuarios',
    },
    {
        id: 'produtos',
        label: 'Produtos',
        link: '/produtos',
    },
    {
        id: 'categorias',
        label: 'Categorias',
        link: '/categorias',
    },
    {
        id: 'relatorios',
        label: 'Relatórios',
        link: '/relatorios',
    },
];

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = isAdmin ? menuAdmin : menuUsuario;

    const sections = [
        {
            id: 'main',
            title: 'Menu',
            items: menuItems.map((item) => ({
                id: item.id,
                label: item.label,
                link: item.link,
                selected: pathname === item.link,
            })),
        },
    ];

    return (
        <div>
            <GovBar />

            <AdminUserBar
                user={{
                    name: user?.name || '',
                    profile: isAdmin ? 'Administrador' : 'Usuário',
                }}
            />

            <div className="flex">
                <AdminSideBar
                    title="Sistema de Gestão"
                    version="1.0.0"
                    sections={sections}
                />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}