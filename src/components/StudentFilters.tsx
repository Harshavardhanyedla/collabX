import React from 'react';

interface StudentFiltersProps {
    onSearchChange: (value: string) => void;
    onFilterChange: (type: string, value: string) => void;
    onSortChange: (value: string) => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
    onSearchChange,
    onFilterChange,
    onSortChange
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-grow">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name, headline, or skill..."
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all text-sm"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <select
                        onChange={(e) => onFilterChange('institution', e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    >
                        <option value="">University (All)</option>
                        <option value="IIT Bombay">IIT Bombay</option>
                    </select>

                    <select
                        onChange={(e) => onFilterChange('role', e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    >
                        <option value="">Role (All)</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Fullstack">Fullstack</option>
                        <option value="Designer">Designer</option>
                        <option value="Researcher">Researcher</option>
                    </select>

                    <select
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    >
                        <option value="recent">Recently Active</option>
                        <option value="connections">Most Connections</option>
                        <option value="university">Same University</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default StudentFilters;
