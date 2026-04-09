import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Download, FileText, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface POVersion {
  id: string;
  quote_id: string;
  version_number: number;
  files: any;
  change_reason: string | null;
  created_by: string | null;
  created_at: string;
}

interface POVersionHistoryProps {
  quoteId: string;
  currentFiles?: any[];
}

export default function POVersionHistory({ quoteId, currentFiles }: POVersionHistoryProps) {
  const { toast } = useToast();
  const [versions, setVersions] = useState<POVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [quoteId]);

  const loadVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('po_versions')
        .select('*')
        .eq('quote_id', quoteId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error: any) {
      console.error('Failed to load PO versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    window.open(fileUrl, '_blank');
  };

  if (loading || versions.length === 0) return null;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                ประวัติการแก้ไข PO
                <Badge variant="secondary" className="text-xs">
                  {versions.length} เวอร์ชัน
                </Badge>
              </CardTitle>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {versions.map((version, idx) => {
              const files = Array.isArray(version.files) ? version.files : [];
              const isCurrent = idx === 0;

              return (
                <div key={version.id} className={`rounded-lg border p-3 ${isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={isCurrent ? 'default' : 'outline'} className="text-xs">
                        v{version.version_number}
                        {isCurrent && ' (ปัจจุบัน)'}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(version.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                    </span>
                  </div>

                  {version.change_reason && (
                    <p className="text-xs text-muted-foreground mb-2">
                      💬 {version.change_reason}
                    </p>
                  )}

                  {version.created_by && (
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {version.created_by}
                    </p>
                  )}

                  {files.length > 0 && (
                    <div className="space-y-1">
                      {files.map((file: any, fi: number) => (
                        <div key={fi} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 truncate text-foreground">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            {file.name || file.file_name || `File ${fi + 1}`}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleDownload(file.url || file.file_url, file.name || file.file_name)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            ดาวน์โหลด
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
