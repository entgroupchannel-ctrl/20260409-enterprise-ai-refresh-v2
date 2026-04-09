import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, Clock, Activity, Zap, RotateCcw } from "lucide-react";
import { useSessionMetrics, resetMetrics, type SessionEvent } from "@/hooks/useSessionMetrics";

const statusConfig: Record<string, { label: string; color: string }> = {
  healthy: { label: "Healthy", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  expiring: { label: "Expiring", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  expired: { label: "Expired", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  none: { label: "No Session", color: "bg-muted text-muted-foreground border-border" },
};

const eventIcons: Record<SessionEvent["type"], string> = {
  refresh_ok: "🔄",
  refresh_fail: "❌",
  tab_switch: "👁️",
  permission_load: "🔑",
  timeout: "⏱️",
  session_check: "🔍",
};

const AdminSessionMonitor = () => {
  const metrics = useSessionMetrics();
  const [countdown, setCountdown] = useState<string>("");

  // Live countdown timer
  useEffect(() => {
    const tick = () => {
      if (!metrics.tokenExpiresAt) {
        setCountdown("—");
        return;
      }
      const diff = metrics.tokenExpiresAt - Date.now();
      if (diff <= 0) {
        setCountdown("Expired");
        return;
      }
      const m = Math.floor(diff / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setCountdown(`${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [metrics.tokenExpiresAt]);

  const status = statusConfig[metrics.sessionStatus] || statusConfig.none;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-foreground">Session Health Monitor</h2>
          <Badge className={`${status.color} border text-xs`}>{status.label}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={resetMetrics} className="gap-1.5">
          <RotateCcw size={14} /> Reset
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock size={12} /> Token Expiry
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className={`text-2xl font-bold ${metrics.sessionStatus === "expired" ? "text-red-500" : metrics.sessionStatus === "expiring" ? "text-yellow-500" : "text-foreground"}`}>
              {countdown}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <RefreshCw size={12} /> JWT Refreshes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-foreground">{metrics.jwtRefreshCount}</span>
            {metrics.jwtRefreshErrors > 0 && (
              <span className="text-xs text-red-500 ml-2">({metrics.jwtRefreshErrors} fails)</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Zap size={12} /> Permission Load
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-foreground">
              {metrics.permissionLoadTimeMs > 0 ? `${metrics.permissionLoadTimeMs}ms` : "—"}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Activity size={12} /> Tab Switches
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-bold text-foreground">{metrics.tabSwitchCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Event Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Recent Events ({metrics.events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              ยังไม่มี event — ลอง switch tab หรือรอ token refresh
            </p>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {metrics.events.map((evt, i) => (
                <div
                  key={`${evt.timestamp}-${i}`}
                  className="flex items-center gap-3 py-1.5 px-2 rounded text-sm hover:bg-secondary/40 transition-colors"
                >
                  <span className="text-base">{eventIcons[evt.type] || "📌"}</span>
                  <span className="text-xs text-muted-foreground font-mono w-20 shrink-0">
                    {formatTime(evt.timestamp)}
                  </span>
                  <span className="font-medium text-foreground">{evt.type.replace(/_/g, " ")}</span>
                  {evt.detail && (
                    <span className="text-xs text-muted-foreground ml-auto">{evt.detail}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        💡 ข้อมูลนี้เก็บใน memory เท่านั้น — จะ reset เมื่อ refresh หน้า
      </p>
    </div>
  );
};

export default AdminSessionMonitor;
