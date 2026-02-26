'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CompanyFilter from '@/components/companies/CompanyFilter';
import CompanyGrid from '@/components/companies/CompanyGrid';
import { Building2 } from 'lucide-react';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [userStatuses, setUserStatuses] = useState({});
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const token = localStorage.getItem('placemate_token');
                const res = await fetch('/api/companies', { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                setCompanies(data.companies || []);
                setUserStatuses(data.userStatuses || {});
            } catch { } finally { setLoading(false); }
        }
        load();
    }, []);

    const handleStatusChange = async (companyName, status) => {
        const token = localStorage.getItem('placemate_token');
        setUserStatuses(s => ({ ...s, [companyName]: status }));
        await fetch('/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ companyName, status }),
        });
    };

    const filtered = companies.filter(c => {
        const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = !category || c.category === category;
        return matchSearch && matchCat;
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Company Tracker</h1>
                        <p className="text-text-secondary text-sm">{companies.length} companies — track your applications</p>
                    </div>
                </div>

                <CompanyFilter
                    search={search}
                    category={category}
                    onSearchChange={setSearch}
                    onCategoryChange={setCategory}
                />

                {loading ? (
                    <div className="text-center py-16 text-text-secondary">Loading companies...</div>
                ) : (
                    <CompanyGrid
                        companies={filtered}
                        userStatuses={userStatuses}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>
        </AppLayout>
    );
}
