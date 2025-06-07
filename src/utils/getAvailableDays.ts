export interface OrderDay {
  label: string;
  date: string;
}

const getCutoffDate = (targetDay: number): Date => {
  const now = new Date();
  const result = new Date(now);
  const currentDay = now.getDay();
  let daysUntil = (targetDay - currentDay + 7) % 7;

  if (
    daysUntil === 0 &&
    (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() >= 30))
  ) {
    daysUntil = 7;
  }

  result.setDate(now.getDate() + daysUntil);
  result.setHours(9, 30, 0, 0);
  return result;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const getOrderStatus = (): OrderDay[] => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const cutoffPassed = hour > 9 || (hour === 9 && minute >= 30);

  const results: OrderDay[] = [];

  if (day === 5) {
    if (!cutoffPassed) results.push({ label: 'Friday', date: formatDate(getCutoffDate(5)) });
    results.push({ label: 'Saturday', date: formatDate(getCutoffDate(6)) });
  } else if (day === 6) {
    if (!cutoffPassed) {
      results.push({ label: 'Saturday', date: formatDate(getCutoffDate(6)) });
    } else {
      results.push({ label: 'Next Friday', date: formatDate(getCutoffDate(5)) });
      results.push({ label: 'Next Saturday', date: formatDate(getCutoffDate(6)) });
    }
  } else {
    results.push({ label: 'Next Friday', date: formatDate(getCutoffDate(5)) });
    results.push({ label: 'Next Saturday', date: formatDate(getCutoffDate(6)) });
  }

  return results;
};
