import { Button } from "../tailgrids/core/button";
import { Input } from "../tailgrids/core/input";
import type { FilterType } from '@/types';

interface TaskFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}



export function TaskFilters({ searchQuery, onSearchChange, activeFilter, onFilterChange }: TaskFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
            <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1"
            />
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                {(['all', 'active', 'done', 'high'] as const).map((filter) => (
                    <Button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        variant={activeFilter === filter ? 'primary' : 'ghost'}
                        className="flex-1 sm:flex-initial capitalize"
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </div>
    );
}
