import { Get } from './request';
import { Stats } from './types';

export const getStats = () => {
  return Get<Stats>('/tool/stats');
}
