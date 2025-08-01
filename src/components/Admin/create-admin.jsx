import React from 'react';
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import { Functions } from '@mui/icons-material';

export default function createAdmin({toggleForm}) {
    
    function handleSubmit(e){
        e.preventDefault();
        console.log("Form submitted");
    }

    return (
        <>
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="w-full max-w-2xl p-6 rounded-xl" style={{
                            background: 'var(--secondary-bg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 15px 25px rgba(0,0,0,0.5)'}}>
                    
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold" style={{ color: 'var(--text-light)' }}>Create New Admin</h2>
                                <button
                                    className= "text-sm text-white px-3 py-1"
                                    onClick={toggleForm}>
                                    <IoClose />
                                </button>
                            </div> 
                            <form className="space-y-4" style={{ color: 'var(--text-light)' }} onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="p-2 rounded border border-[var(--accent-purple)] focus:outline-none focus:border-3 focus:border-[var(--accent-purple)]" placeholder="First Name" />
                                    <input className="p-2 rounded border border-[var(--accent-purple)] focus:outline-none focus:border-3 focus:border-[var(--accent-purple)]" placeholder="Last Name" />
                                </div>
                                <input className="w-full p-2 rounded border border-[var(--accent-purple)] focus:outline-none focus:border-3 focus:border-[var(--accent-purple)]" placeholder="Email" />
                                <input className="w-full p-2 rounded border border-[var(--accent-purple)] focus:outline-none focus:border-3 focus:border-[var(--accent-purple)]" placeholder="Phone Number" />
                                <input className="w-full p-2 rounded border border-[var(--accent-purple)] focus:outline-none focus:border-3 focus:border-[var(--accent-purple)]" placeholder="Roles (comma-separated)" />
                                <select className="w-full p-2 rounded border border-[var(--accent-purple)] focus:outline-none focus:border-3 focus:border-[var(--accent-purple)]" >
                                    <option>Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <button
                                    type="submit"
                                    className="w-full py-2 rounded text-white"
                                    style={{ backgroundColor: 'var(--accent-purple)' }} >
                                    Submit
                                </button>
                                
                            </form>
                        </div>
                    </div>
        </>
    )
}