import { useState, useEffect } from 'react';
import { Table, Badge, Dropdown } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import { userService } from '../../services/api/userService';
import { toast } from 'sonner';
import UserDetailsModal from './UserDetailsModal';
import EditUserModal from '../modals/EditUserModal';

interface User {
    _id: string;
    username: string;
    email: string;
    current_level: string;
    is_verified: boolean;
    status: 'active' | 'disabled';
    createdAt: string;
}

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const formatDate = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const fetchUsers = async (page: number) => {
        try {
            const response = await userService.getUsers(page);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleStatusUpdate = async (userId: string, currentStatus: 'active' | 'disabled') => {
        try {
            const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
            await userService.updateUserStatus(userId, newStatus);
            
            setUsers(users.map(user => 
                user._id === userId 
                    ? { ...user, status: newStatus }
                    : user
            ));
            
            toast.success(`User ${newStatus === 'disabled' ? 'disabled' : 'activated'} successfully`);
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleViewDetails = (userId: string) => {
        setSelectedUser(userId);
        setIsDetailsModalOpen(true);
    };

    const handleEditUser = (userId: string) => {
        setSelectedUser(userId);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Users</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage and monitor user accounts
                    </p>
                </div>
                
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Level</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Joined</Table.HeadCell>
                                <Table.HeadCell>Actions</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {users.map((user) => (
                                    <Table.Row key={user._id}>
                                        <Table.Cell>{user.username}</Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell>{user.current_level}</Table.Cell>
                                        <Table.Cell>
                                            <Badge color={user.status === 'active' ? 'success' : 'danger'}>
                                                {user.status}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            <Dropdown
                                                label=""
                                                dismissOnClick={false}
                                                renderTrigger={() => (
                                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                                        <HiOutlineDotsVertical className="h-5 w-5" />
                                                    </button>
                                                )}
                                            >
                                                <Dropdown.Item
                                                    onClick={() => handleViewDetails(user._id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Icon icon="solar:eye-outline" className="h-4 w-4" />
                                                    View Details
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => handleEditUser(user._id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Icon icon="solar:pen-outline" className="h-4 w-4" />
                                                    Edit User
                                                </Dropdown.Item>
                                                {/* <Dropdown.Item
                                                    onClick={() => handleStatusUpdate(user._id, user.status)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Icon 
                                                        icon={user.status === 'active' ? 'solar:user-block-outline' : 'solar:user-check-outline'} 
                                                        className="h-4 w-4" 
                                                    />
                                                    {user.status === 'active' ? 'Disable' : 'Enable'} User
                                                </Dropdown.Item> */}
                                            </Dropdown>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            {/* Add your pagination component here */}
                        </div>
                    )}
                </div>
            </div>

            <UserDetailsModal 
                isOpen={isDetailsModalOpen} 
                onClose={() => setIsDetailsModalOpen(false)} 
                userId={selectedUser} 
            />

            <EditUserModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userId={selectedUser}
            />
        </>
    );
};

export default UsersTable;
