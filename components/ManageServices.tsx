import React, { useState } from 'react';
import { Service } from '../types';
import { getServices, saveServices } from '../data/storage';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const ManageServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>(getServices());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const openModal = (service: Service | null = null) => {
        setEditingService(service);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    }
    
    const handleSave = (serviceData: Omit<Service, 'id' | 'icon'>) => {
        let updatedServices;
        if (editingService) {
            // Update
            const updatedService = { ...editingService, ...serviceData, icon: serviceData.status === 'চালু' ? <CheckCircleIcon /> : <XCircleIcon />};
            updatedServices = services.map(s => s.id === editingService.id ? updatedService : s);
        } else {
            // Create
            const newService: Service = { ...serviceData, id: `s${Date.now()}`, icon: serviceData.status === 'চালু' ? <CheckCircleIcon /> : <XCircleIcon />};
            updatedServices = [newService, ...services];
        }
        setServices(updatedServices);
        saveServices(updatedServices);
        closeModal();
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">সার্ভিস ম্যানেজমেন্ট</h1>
                <button onClick={() => openModal()} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700">
                     <span className="font-bold text-xl mr-2">+</span> নতুন সার্ভিস
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">সার্ভিসের নাম</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">মূল্য (টাকা)</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">স্ট্যাটাস</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">কার্যক্রম</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id} className="border-b">
                                    <td className="px-4 py-3 font-medium">{service.name}</td>
                                    <td className="px-4 py-3">{service.price.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${service.status === 'চালু' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {service.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => openModal(service)} className="text-indigo-600 hover:text-indigo-900 font-medium">সম্পাদনা</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            {isModalOpen && <ServiceModal service={editingService} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

interface ServiceModalProps {
    service: Service | null;
    onSave: (service: Omit<Service, 'id' | 'icon'>) => void;
    onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Service, 'id' | 'icon'>>(
        service 
        ? { name: service.name, price: service.price, status: service.status }
        : { name: '', price: 0, status: 'চালু' }
    );
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-6">{service ? 'সার্ভিস সম্পাদনা করুন' : 'নতুন সার্ভিস তৈরি করুন'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">সার্ভিসের নাম</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">মূল্য (টাকা)</label>
                        <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">স্ট্যাটাস</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
                            <option value="চালু">চালু</option>
                            <option value="বন্ধ">বন্ধ</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">বাতিল</button>
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md">সংরক্ষণ করুন</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageServices;