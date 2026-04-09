import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface StatsTab {
  label: string;
  value: string;
  count: number;
}

interface ActionButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface AdminPageLayoutProps {
  title: string;
  description: string;
  actionButton?: ActionButton;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  statsTabs?: StatsTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  resultsCount?: number;
  children: ReactNode;
}

export function AdminPageLayout({
  title,
  description,
  actionButton,
  searchPlaceholder = 'ค้นหา...',
  searchValue,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  statsTabs,
  activeTab,
  onTabChange,
  resultsCount,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
        {actionButton && (
          <Button onClick={actionButton.onClick}>
            {actionButton.icon}
            {actionButton.label}
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      {(onSearchChange || onFilterChange) && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-4">
              {onSearchChange && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={searchPlaceholder}
                      className="pl-10"
                      value={searchValue}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {onFilterChange && filterOptions && (
                <Select value={filterValue} onValueChange={onFilterChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="เรียงตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Tabs */}
      {statsTabs && onTabChange && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statsTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTabChange(tab.value)}
              className="gap-1.5 whitespace-nowrap"
            >
              {tab.label}
              <Badge
                variant={activeTab === tab.value ? 'secondary' : 'outline'}
                className="ml-1 text-xs px-1.5 py-0"
              >
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      {/* Results Count */}
      {resultsCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          พบ {resultsCount} รายการ
        </p>
      )}

      {/* Content */}
      {children}
    </div>
  );
}

export default AdminPageLayout;
