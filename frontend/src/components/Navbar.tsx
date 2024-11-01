import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../APIServices/User.ts';
import '../assets/css/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                setUsername(user.username);
                setProfilePicture(user.profile_picture);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l’utilisateur', error);
            }
        };

        fetchUserData();
    }, []);

    const itemRenderer = (item: MenuItem) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
        </a>
    );

    const items: MenuItem[] = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            template: itemRenderer,
            command: () => {
                navigate('/home/me');
            }
        },
        {
            label: 'Search',
            icon: 'pi pi-search',
            command: () => {
                navigate('/search');
            }
        },
        {
            label: 'New Post',
            icon: 'pi pi-plus-circle',
            template: itemRenderer,
            command: () => {
                navigate('/newpost/me');
            }
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('username');
                navigate('/');
            }
        }
    ];

    const start = <img alt="logo" src="../../public/file.png" height="50" className="ml-5" />;

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const end = (
        <div className="flex align-items-center gap-3">
            <InputText
                placeholder="Search user"
                type="text"
                className="w-8rem sm:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button
                icon="pi pi-search"
                onClick={handleSearch}
                className="p-button-text"
                style={{color:'darkgrey'}}
            />
            <div className="flex align-items-center text-secondary m-0 p-0 font-light">Connected as</div>
            <Button onClick={() => navigate('/profile/me')} className="p-button-text">
                @{username}
            </Button>
            <Avatar
                image={profilePicture}
                shape="circle"
                size={"large"}
                onClick={() => navigate('/profile/me')}
            />
            <div className="pr-5" />
        </div>
    );

    return (
        <div className="mt-2">
            <div className="container-fluid">
                <div className="card">
                    <Menubar className="custom-menubar" model={items} start={start} end={end} />
                </div>
            </div>
        </div>
    );
}
