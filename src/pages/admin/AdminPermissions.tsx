import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPermissions() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Phase 6.1: /admin/permissions → /admin/employees
    navigate('/admin/employees', { replace: true });
  }, [navigate]);
  
  return null;
}
