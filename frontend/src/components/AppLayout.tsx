'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
    AppLayout,
    AdminSideBar,
    AdminUserBar,
    GovBar,
    BreadCrumb,
    Badge,
    Icon,
    Toast,
    BreadcrumbProps,
    MenuAction
} from '@uigovpe/components';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import api from '@/services/api';

const menuUsuario = [
    { id: 'produtos', label: 'Produtos', link: '/produtos' },
    { id: 'categorias', label: 'Categorias', link: '/categorias' },
    { id: 'favoritos', label: 'Favoritos', link: '/favoritos' },
];

const menuAdmin = [
    { id: 'dashboard', label: 'Dashboard', link: '/dashboard' },
    { id: 'usuarios', label: 'Usuários', link: '/usuarios' },
    { id: 'produtos', label: 'Produtos', link: '/produtos' },
    { id: 'categorias', label: 'Categorias', link: '/categorias' },
    { id: 'relatorios', label: 'Relatórios', link: '/relatorios' },
];

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const toastRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            api.get('/notifications')
                .then(res => setNotifications(res.data))
                .catch(() => { });
        }
    }, [user]);

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

    const currentMenu = menuItems.find(item => item.link === pathname);
    const breadcrumb: BreadcrumbProps = {
        home: {
            label: 'Home',
            url: '/',
            template: <Link href="/"><Icon icon="home" /></Link>
        },
        items: [
            { label: currentMenu ? currentMenu.label : 'Página' }
        ]
    };

    const footerSidebarLogo = {
        src: 'govLogo.png',
        alt: 'Logo Secretaria',
        width: 179,
        height: 48,
    };

    const sidebarLogo = {
        src: 'perpartLogo.png',
        alt: 'Logo Sistema',
        width: 220,
        height: 110,
    };

    const userMenuActions: MenuAction = [
        {
            label: 'Perfil',
            icon: <Icon icon="account_circle" />,
            command: () => {
                router.push('/perfil');
            }
        },
        {
            label: 'Sair',
            icon: <Icon icon="logout" />,
            command: () => {
                logout();
            }
        },
    ];

    return (
        <AppLayout >
            <GovBar />

            <Toast ref={toastRef} />

            <AppLayout.MainLayout>
                <AdminSideBar
                    theme="primary"
                    sections={sections}
                    version="1.0.0"
                    title="Meu Sistema"
                    footerSidebarLogo={footerSidebarLogo}
                    logo={sidebarLogo}
                    ui={{
                        container: {
                            style: { minHeight: '90vh', height: '100%' }
                        },
                    }}
                />

                <AppLayout.ContentSection>
                    <div style={{ position: 'relative' }}>
                        <AdminUserBar
                            user={{
                                name: user?.name ?? '',
                                profile: isAdmin ? 'admin' : 'user',
                            }}
                            menuActions={userMenuActions}
                            breadcrumb={breadcrumb}
                            ui={{

                            }}
                        />

                        <div style={{
                            position: 'absolute',
                            right: '250px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Badge>
                                <span style={{ marginRight: '5px', fontWeight: 'bold' }}>
                                    {notifications.length}
                                </span>
                                <Icon icon="notifications" />
                            </Badge>
                        </div>
                    </div>

                    <AppLayout.MainContent>
                        <AppLayout.BreadCrumbSection>
                            <BreadCrumb
                                model={breadcrumb?.items}
                                home={breadcrumb?.home}
                            />
                        </AppLayout.BreadCrumbSection>

                        <AppLayout.PageContent>
                            {children}
                        </AppLayout.PageContent>

                    </AppLayout.MainContent>
                </AppLayout.ContentSection>
            </AppLayout.MainLayout>
        </AppLayout>
    );
}