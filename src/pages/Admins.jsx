import React from 'react';
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import CreateAdmin from '../components/Admin/create-admin';
import { FilterList, Padding } from '@mui/icons-material';


export default function Admins(){
    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => setShowForm(!showForm);

    
    
    return(
        <>
        <div className="min-h-screen p-6" style={{ background: 'var(--primary-bg)' }}>
            <div className="mb-8">
                <h1 
                    className="text-4xl font-bold mb-2"
                    style={{ 
                    color: 'var(--text-light)',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
                }}> Admin Management
                </h1>
                <p 
                    className="text-lg"
                    style={{ color: 'var(--text-dark)' }}>
                    Manage and monitor all Admin's Information
                </p>
            </div>
            <div 
                className="rounded-xl overflow-hidden"
                style={{
                background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
                border: '1px solid var(--border-color)',
                }}>     
                <div className="p-6 border-b flex flex-col md:flex-row gap-4 items-center justify-between" 
                    style={{ borderColor: 'var(--border-color)',
                    gap: '230px',
                    display: 'flex'}}>
                    <h3 
                        className="text-xl font-semibold"
                        style={{ 
                        color: 'var(--text-light)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        }}> Admin List
                    </h3>
                    <div className="flex items-center gap-30" 
                        style={{display: 'flex',
                        gap:'10px'

                        }}>
                        <FilterList style={{ color: 'var(--text-dark)', fontSize: '20px' }} />
                        <select
                        className="px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                            background: 'linear-gradient(145deg, #1a1d2e, #15182a)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-light)',
                            fontSize: '14px',
                        }}
                        >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Disabled">Disabled</option>
                        </select>

                        <button
                            onClick={toggleForm}
                            className="px-4 py-2 rounded-md text-white text-sm ml-100 hover:rotate-90"
                            style={{ backgroundColor: 'var(--accent-purple)'}}>
                            Create Admin
                        </button>
                    </div>
                    
                </div>
            </div>
            <div className="overflow-x-auto p-6 rounded-lg" style={{ 
                borderColor: 'var(--border-color)',
                // background: 'linear-gradient(145deg, var(--secondary-bg), #1a1d3a)',
                border: '1px solid var(--border-color)',
                boxShadow: `
                    0 15px 35px rgba(0, 0, 0, 0.3),
                    0 5px 15px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08)
                ` 
                }}>
                {/* <table className="w-full"> */}
                <thead>
                    <tr 
                            className="border-b-2 flex flex-col md:flex-row gap-4 items-center justify-between " 
                            style={{ borderColor: 'var(--accent-purple)',
                                position: 'relative',
                                gap: '70px'

                             }} >
                        <th 
                            className="text-left py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Admin ID
                        </th>
                        <th 
                            className="text-left py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Firstname
                        </th>
                        <th 
                            className="text-left py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Lastname
                        </th>
                        <th 
                            className="text-left py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Email
                        </th>
                        <th 
                            className="text-left py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Gender
                        </th>
                        <th 
                            className="text-left py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Status
                        </th>
                        <th 
                            className="text-center py-4 px-6 text-sm font-semibold"
                            style={{ color: 'var(--text-light)' }}>
                            Action
                        </th>
                    </tr>
                </thead>
            </div>
            {showForm && ( <CreateAdmin toggleForm={toggleForm} />
      
    )

            }

        </div>
        
        </>
    )
}
