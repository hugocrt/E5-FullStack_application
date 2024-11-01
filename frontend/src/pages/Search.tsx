import React, { useEffect, useState } from 'react';
import BaseModel from "../layout/BaseModel.tsx";
import { User } from "../type/User.ts";
import { searchUsers } from "../APIServices/User.ts";
import { useLocation, useNavigate } from 'react-router-dom';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import {Loader} from "../components/Loader.tsx";

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [layout, setLayout] = useState('grid');
    const [totalUsers, setTotalUser] = useState<number>(0);
    const [skip, setSkip] = useState<number>(0);
    const [limit] = useState<number>(12);

    const getQuery = (): string => {
        const params = new URLSearchParams(location.search);
        return params.get('query') || '';
    };

    const fetchUsers = async () => {
        const query = getQuery();
        if (query) {
            setLoading(true);
            try {
                const [data, total] = await searchUsers(query, skip, limit);
                setUsers(data);
                setTotalUser(total);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [location.search, skip]);

    const user_template = (user: User) => {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4 w-100">
                    <div className="d-flex align-items-center">
                        {user.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt={user.username}
                                className="img-fluid rounded-circle me-3"
                                style={{width: '80px', height: '80px'}}
                            />
                        ) : (
                            <div
                                className="d-flex justify-content-center align-items-center me-3"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e0e0e0',
                                }}
                            >
                                <i className="pi pi-user" style={{fontSize: '2rem'}}></i>
                            </div>
                        )}
                    </div>
                    <div className="text-end">
                        <h5 className="text-dark">@{user.username}</h5>
                        <p className="text-secondary">{user.followers_count} followers</p>
                    </div>
                </div>

                <Button
                    label="View Profile"
                    icon="pi pi-external-link"
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="p-button-text mt-2"
                />
            </>
        );
    };

    const listItem = (user: User) => {
        return (
            <div className="container border border-light rounded shadow-sm mb-4" key={user.id}>
                <div className="d-flex flex-column align-items-center p-3">
                    {user_template(user)}
                </div>
            </div>
        );
    };

    const gridItem = (user: User) => {
        return (
            <div className="col-12 col-md-6 col-lg-4 p-2" key={user.id}>
                <div className="p-4 border border-light rounded shadow-sm d-flex flex-column align-items-center">
                    {user_template(user)}
                </div>
            </div>
        );
    };


    const itemTemplate = (user: User) => {
        return layout === 'list' ? listItem(user) : gridItem(user);
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions onChange={(e) => setLayout(e.value)}/>
            </div>
        );
    };

    return (
        <BaseModel>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="font-weight-bolder text-primary mb-0">Results</h3>
                    <small className="text-muted font-light font-italic mb-0">({totalUsers} users match your search: @{getQuery()})</small>
                </div>
                <div className="pt-2">
                    {loading ? (
                            <Loader></Loader>
                    ) : users.length > 0 ? (
                        <>
                            <DataView value={users} itemTemplate={itemTemplate} header={header()} />
                            <Paginator
                                first={skip}
                                rows={limit}
                                totalRecords={totalUsers}
                                onPageChange={(e) => setSkip(e.first)}
                                className="mt-4"
                            />
                        </>
                    ) : (
                        <p>No users found for your search.</p>
                    )}
                </div>
            </div>
        </BaseModel>
    );
};

export default SearchPage;
