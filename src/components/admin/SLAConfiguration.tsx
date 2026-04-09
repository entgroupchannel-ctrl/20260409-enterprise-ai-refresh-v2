import { useState } from "react";
import { Clock, AlertCircle, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SLAConfigProps {
  orderId?: string;
  initialConfig?: SLAConfig;
  onSave?: (config: SLAConfig) => void;
}

interface SLAConfig {
  enabled: boolean;
  processingHours: number;
  processingUnit: 'hours' | 'days';
  shippingDays: number;
  shippingUnit: 'hours' | 'days';
  alert80Percent: boolean;
  alertExceeded: boolean;
}

const DEFAULT_CONFIG: SLAConfig = {
  enabled: false,
  processingHours: 24,
  processingUnit: 'hours',
  shippingDays: 5,
  shippingUnit: 'days',
  alert80Percent: true,
  alertExceeded: true,
};

const SLAConfiguration = ({ 
  orderId,
  initialConfig,
  onSave 
}: SLAConfigProps) => {
  const [config, setConfig] = useState<SLAConfig>(initialConfig || DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(config);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<SLAConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="text-sm font-bold">SLA Configuration</h3>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => updateConfig({ enabled })}
        />
      </div>

      {config.enabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
          {/* Info Banner */}
          <div className="flex items-start gap-2 text-xs text-yellow-800">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              กำหนดเวลามาตรฐานในการดำเนินการ Order นี้ 
              ระบบจะแจ้งเตือนอัตโนมัติเมื่อใกล้ถึงหรือเกิน SLA
            </p>
          </div>

          {/* Processing SLA */}
          <div className="bg-white rounded-lg p-3 border border-yellow-100">
            <Label className="text-xs font-medium mb-2 block">
              ⏱️ เวลาในการจัดเตรียมสินค้า (Processing)
            </Label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={config.processingHours}
                onChange={(e) => updateConfig({ processingHours: parseInt(e.target.value) })}
                className="w-20 px-3 py-2 border border-border rounded-md text-sm"
              />
              <select
                value={config.processingUnit}
                onChange={(e) => updateConfig({ processingUnit: e.target.value as 'hours' | 'days' })}
                className="px-3 py-2 border border-border rounded-md text-sm"
              >
                <option value="hours">ชั่วโมง</option>
                <option value="days">วัน</option>
              </select>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              เวลาตั้งแต่ยืนยัน Order จนถึงเริ่มจัดส่ง
            </p>
          </div>

          {/* Shipping SLA */}
          <div className="bg-white rounded-lg p-3 border border-yellow-100">
            <Label className="text-xs font-medium mb-2 block">
              🚚 เวลาในการจัดส่ง (Shipping)
            </Label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={config.shippingDays}
                onChange={(e) => updateConfig({ shippingDays: parseInt(e.target.value) })}
                className="w-20 px-3 py-2 border border-border rounded-md text-sm"
              />
              <select
                value={config.shippingUnit}
                onChange={(e) => updateConfig({ shippingUnit: e.target.value as 'hours' | 'days' })}
                className="px-3 py-2 border border-border rounded-md text-sm"
              >
                <option value="hours">ชั่วโมง</option>
                <option value="days">วัน</option>
              </select>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              เวลาตั้งแต่จัดส่งจนถึงส่งมอบ (ตามเงื่อนไข Delivery Terms)
            </p>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg p-3 border border-yellow-100 space-y-3">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Bell size={14} />
              การแจ้งเตือน
            </Label>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-xs text-foreground">
                  แจ้งเตือนที่ 80% ของ SLA
                </label>
                <p className="text-[10px] text-muted-foreground">
                  เตือนก่อนถึง SLA เพื่อให้เตรียมการ
                </p>
              </div>
              <Switch
                checked={config.alert80Percent}
                onCheckedChange={(checked) => updateConfig({ alert80Percent: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-xs text-foreground">
                  แจ้งเตือนเมื่อเกิน SLA
                </label>
                <p className="text-[10px] text-muted-foreground">
                  เตือนทันทีเมื่อเกินเวลาที่กำหนด
                </p>
              </div>
              <Switch
                checked={config.alertExceeded}
                onCheckedChange={(checked) => updateConfig({ alertExceeded: checked })}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save size={14} />
                  บันทึก SLA
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* SLA Preview */}
      {config.enabled && (
        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            📋 สรุป SLA
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Target:</span>
              <span className="font-medium">
                {config.processingHours} {config.processingUnit === 'hours' ? 'ชั่วโมง' : 'วัน'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Target:</span>
              <span className="font-medium">
                {config.shippingDays} {config.shippingUnit === 'hours' ? 'ชั่วโมง' : 'วัน'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notifications:</span>
              <span className="font-medium">
                {config.alert80Percent && config.alertExceeded 
                  ? 'ทั้งสองแบบ'
                  : config.alert80Percent 
                    ? 'แค่ 80%'
                    : config.alertExceeded
                      ? 'แค่เกิน SLA'
                      : 'ปิด'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLAConfiguration;
