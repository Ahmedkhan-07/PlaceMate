'use client';
import Image from 'next/image';
import { MapPin, Calendar, Github, Linkedin, Globe, Edit } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ProfileHeader({ user, isOwner }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-700 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
                    {user?.avatar
                        ? <Image src={user.avatar} alt={user.name} width={80} height={80} className="w-full h-full object-cover" />
                        : user?.name?.[0]?.toUpperCase()
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
                            <p className="text-gray-500 text-sm">@{user?.username}</p>
                        </div>
                        {isOwner && (
                            <Link href="/profile/settings">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-emerald-700 hover:text-emerald-700 transition-all">
                                    <Edit className="h-3.5 w-3.5" /> Edit Profile
                                </button>
                            </Link>
                        )}
                    </div>

                    {user?.bio && (
                        <p className="text-sm text-gray-700 mt-2 max-w-md leading-relaxed">{user.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3">
                        {user?.college && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5" /> {user.college}
                            </span>
                        )}
                        {user?.location && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin className="h-3.5 w-3.5" /> {user.location}
                            </span>
                        )}
                        {user?.githubUrl && (
                            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-700 transition-colors">
                                <Github className="h-3.5 w-3.5" /> GitHub
                            </a>
                        )}
                        {user?.linkedinUrl && (
                            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-700 transition-colors">
                                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
