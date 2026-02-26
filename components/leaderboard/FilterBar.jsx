'use client';
import { Select } from '@/components/ui/Input';

export default function FilterBar({ filters, onChange }) {
    return (
        <div className="flex flex-wrap gap-3">
            <Select
                value={filters.timeframe || 'all'}
                onChange={e => onChange({ ...filters, timeframe: e.target.value })}
                className="w-36"
            >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
            </Select>
            <Select
                value={filters.category || 'overall'}
                onChange={e => onChange({ ...filters, category: e.target.value })}
                className="w-40"
            >
                <option value="overall">Overall</option>
                <option value="aptitude">Aptitude</option>
                <option value="coding">Coding</option>
                <option value="technical">Technical</option>
                <option value="mock">Mock Drive</option>
            </Select>
        </div>
    );
}
