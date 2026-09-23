import { useState, useCallback, useEffect, useRef } from 'react';
import { meetingService, type MeetingBalanceResponse } from '../services/api';

export function useMeetingDetail(id: string | undefined, isAnyModalOpen: boolean) {
  const [meeting, setMeeting] = useState<any>(null);
  const [balanceData, setBalanceData] = useState<MeetingBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const lastFetchTime = useRef<number>(0);

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && (now - lastFetchTime.current < 3000)) return;

    try {
      if (id) {
        lastFetchTime.current = now; 
        const [m, b] = await Promise.all([
          meetingService.getMeeting(id),
          meetingService.getBalance(id)
        ]);
        
        setMeeting(m);
        setBalanceData(b);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnyModalOpen) {
        fetchData();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchData, isAnyModalOpen]);

  return { meeting, balanceData, loading, error, fetchData };
}