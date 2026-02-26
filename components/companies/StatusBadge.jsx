'use client';
import Badge from '@/components/ui/Badge';

const STATUS_MAP = {
    applied: 'primary',
    interviewing: 'warning',
    offered: 'success',
    rejected: 'danger',
    bookmarked: 'purple',
    none: 'default',
};

export default function StatusBadge({ status = 'none' }) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <Badge variant={STATUS_MAP[status] || 'default'} dot={status === 'interviewing'}>
            {label}
        </Badge>
    );
}
