'use client';
import CompanyCard from './CompanyCard';

export default function CompanyGrid({ companies = [], userStatuses = {}, onStatusChange }) {
    if (!companies.length) return (
        <div className="col-span-full text-center py-12 text-text-secondary">No companies found</div>
    );
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {companies.map((company, i) => {
                // Merge user status into company object
                const mergedCompany = {
                    ...company,
                    status: userStatuses[company.name] || company.status || 'Not Applied',
                };
                return (
                    <CompanyCard
                        key={company._id || company.name || i}
                        company={mergedCompany}
                        onStatusChange={onStatusChange}
                    />
                );
            })}
        </div>
    );
}

