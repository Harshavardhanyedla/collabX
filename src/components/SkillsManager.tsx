import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SkillItemProps {
    id: string;
    skill: string;
    isOwnProfile: boolean;
    onRemove: (skill: string) => void;
}

const SortableSkillItem = ({ id, skill, isOwnProfile, onRemove }: SkillItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm group ${isDragging ? 'shadow-lg ring-2 ring-blue-100' : ''}`}
        >
            <div className="flex items-center gap-3">
                {isOwnProfile && (
                    <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                )}
                <span className="text-sm font-bold text-gray-700">{skill}</span>
            </div>
            {isOwnProfile && (
                <button
                    onClick={() => onRemove(skill)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

interface SkillsManagerProps {
    skills: string[];
    isOwnProfile: boolean;
    onUpdate: (newSkills: string[]) => void;
}

const SUGGESTED_SKILLS = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Java', 'UI/UX Design',
    'Figma', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Go', 'Rust', 'Tailwind CSS'
];

const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, isOwnProfile, onUpdate }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = skills.indexOf(active.id as string);
            const newIndex = skills.indexOf(over.id as string);
            onUpdate(arrayMove(skills, oldIndex, newIndex));
        }
    };

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onUpdate([...skills, trimmed]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeSkill = (skillToRemove: string) => {
        onUpdate(skills.filter(s => s !== skillToRemove));
    };

    const filteredSuggestions = SUGGESTED_SKILLS.filter(
        s => s.toLowerCase().includes(inputValue.toLowerCase()) && !skills.includes(s)
    );

    return (
        <div className="space-y-6">
            <h3 className="font-black text-xl text-[#0f172a] mb-6 uppercase tracking-widest text-center">Tech Stack</h3>

            {isOwnProfile && (
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') addSkill(inputValue);
                        }}
                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-sm"
                        placeholder="Add a skill (e.g. Docker)..."
                    />
                    {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {filteredSuggestions.map(s => (
                                <button
                                    key={s}
                                    onClick={() => addSkill(s)}
                                    className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 gap-3">
                    <SortableContext items={skills} strategy={verticalListSortingStrategy}>
                        {skills.map(skill => (
                            <SortableSkillItem
                                key={skill}
                                id={skill}
                                skill={skill}
                                isOwnProfile={isOwnProfile}
                                onRemove={removeSkill}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {skills.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 text-sm font-medium">No skills added yet.</p>
                </div>
            )}
        </div>
    );
};

export default SkillsManager;
