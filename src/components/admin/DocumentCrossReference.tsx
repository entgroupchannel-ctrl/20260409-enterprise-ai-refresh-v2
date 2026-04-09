import { FileText, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentReference {
  type: 'quote' | 'po' | 'so' | 'bl' | 'invoice' | 'dn';
  number: string;
  id: string;
  status?: string;
  createdAt?: string;
}

interface DocumentCrossReferenceProps {
  currentDoc: DocumentReference;
  relatedDocs: DocumentReference[];
  onNavigate?: (docType: string, docId: string) => void;
}

const DOC_CONFIG = {
  quote: { label: 'ใบเสนอราคา', icon: '📄', color: 'text-purple-600', bg: 'bg-purple-50' },
  po: { label: 'PO', icon: '📎', color: 'text-blue-600', bg: 'bg-blue-50' },
  so: { label: 'Sales Order', icon: '📋', color: 'text-green-600', bg: 'bg-green-50' },
  bl: { label: 'Billing Note', icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50' },
  dn: { label: 'Delivery Note', icon: '📦', color: 'text-teal-600', bg: 'bg-teal-50' },
  invoice: { label: 'Tax Invoice', icon: '🧾', color: 'text-red-600', bg: 'bg-red-50' },
};

const DocumentCrossReference = ({ 
  currentDoc, 
  relatedDocs,
  onNavigate 
}: DocumentCrossReferenceProps) => {
  
  const handleNavigate = (doc: DocumentReference) => {
    if (onNavigate) {
      onNavigate(doc.type, doc.id);
    }
  };

  // แยก docs ตาม type
  const quote = relatedDocs.find(d => d.type === 'quote');
  const po = relatedDocs.find(d => d.type === 'po');
  const so = relatedDocs.find(d => d.type === 'so');
  const bl = relatedDocs.find(d => d.type === 'bl');
  const dn = relatedDocs.find(d => d.type === 'dn');
  const invoice = relatedDocs.find(d => d.type === 'invoice');

  return (
    <div className="space-y-4">
      {/* Document Flow Timeline */}
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          เอกสารที่เกี่ยวข้อง
        </h4>
        
        {/* Flow Visualization */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {quote && (
            <>
              <DocumentBadge 
                doc={quote} 
                isCurrent={currentDoc.type === 'quote'}
                onClick={() => handleNavigate(quote)}
              />
              <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
            </>
          )}
          
          {po && (
            <>
              <DocumentBadge 
                doc={po} 
                isCurrent={currentDoc.type === 'po'}
                onClick={() => handleNavigate(po)}
              />
              <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
            </>
          )}
          
          {so && (
            <>
              <DocumentBadge 
                doc={so} 
                isCurrent={currentDoc.type === 'so'}
                onClick={() => handleNavigate(so)}
              />
              <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
            </>
          )}
          
          {bl && (
            <>
              <DocumentBadge 
                doc={bl} 
                isCurrent={currentDoc.type === 'bl'}
                onClick={() => handleNavigate(bl)}
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {relatedDocs
            .filter(doc => doc.type !== currentDoc.type)
            .map(doc => {
              const config = DOC_CONFIG[doc.type];
              return (
                <Button
                  key={doc.id}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleNavigate(doc)}
                >
                  <span className="mr-1">{config.icon}</span>
                  {config.label} {doc.number}
                  <ExternalLink size={10} className="ml-1" />
                </Button>
              );
            })}
        </div>
      </div>

      {/* Document History (if needed) */}
      {relatedDocs.some(d => d.createdAt) && (
        <div className="bg-secondary/20 p-3 rounded-lg">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            ประวัติเอกสาร
          </h4>
          <div className="space-y-1 text-xs">
            {relatedDocs
              .filter(d => d.createdAt)
              .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
              .map(doc => {
                const config = DOC_CONFIG[doc.type];
                return (
                  <div key={doc.id} className="flex items-center gap-2 text-muted-foreground">
                    <span>{config.icon}</span>
                    <span className="font-medium text-foreground">
                      {config.label} {doc.number}
                    </span>
                    {doc.createdAt && (
                      <span className="ml-auto text-[10px]">
                        {new Date(doc.createdAt).toLocaleDateString('th-TH', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component: Document Badge
const DocumentBadge = ({ 
  doc, 
  isCurrent,
  onClick 
}: { 
  doc: DocumentReference;
  isCurrent: boolean;
  onClick: () => void;
}) => {
  const config = DOC_CONFIG[doc.type];
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 transition-all
        ${isCurrent 
          ? 'border-primary bg-primary/5 font-bold' 
          : 'border-border bg-background hover:border-primary/30'
        }
      `}
    >
      <span className="text-sm">{config.icon}</span>
      <div className="text-left">
        <div className={`text-[10px] leading-none ${config.color}`}>
          {config.label}
        </div>
        <div className="text-xs font-mono leading-tight mt-0.5">
          {doc.number}
        </div>
      </div>
    </button>
  );
};

export default DocumentCrossReference;
