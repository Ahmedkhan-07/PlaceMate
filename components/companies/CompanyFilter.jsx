'use client';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Product', 'Service', 'Startup', 'FAANG', 'Unicorn', 'MNC'];

export default function CompanyFilter({ search, category, onSearchChange, onCategoryChange }) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <Input
                icon={Search}
                placeholder="Search companies..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                className="flex-1"
            />
            <Select
                value={category}
                onChange={e => onCategoryChange(e.target.value)}
                className="w-full sm:w-48"
            >
                {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
            </Select>
        </div>
    );
}
