import { MariadbAdapter } from './MariadbAdapter.js';
import { mariadbPool } from '../../db/connections.js';

export const mariadbAdapter = new MariadbAdapter(mariadbPool);
