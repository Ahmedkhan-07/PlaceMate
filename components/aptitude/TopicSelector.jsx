'use client';
import { Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Brain } from 'lucide-react';

const TOPICS = [
    'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability',
    'Data Interpretation', 'Abstract Reasoning', 'Spatial Reasoning',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function TopicSelector({ onStart, loading }) {
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    onStart({ topic: fd.get('topic'), difficulty: fd.get('difficulty') });
                }}
                className="space-y-4"
            >
                <Select label="Topic" name="topic" defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                <Select label="Difficulty" name="difficulty" defaultValue="">
                    <option value="" disabled>Select difficulty</option>
                    {DIFFICULTIES.map(d => <option key={d} value={d.toLowerCase()}>{d}</option>)}
                </Select>
                <Button type="submit" fullWidth loading={loading} icon={Brain}>
                    Generate Questions
                </Button>
            </form>
        </div>
    );
}
