import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';

import { Welcome } from '@/components/Admin/Dashboard/Welcome';
import { Stats } from '@/components/Admin/Dashboard/Stats';

export default function Dashboard() {
  return (
    <>
      <Welcome />
      <Stats />
    </>
  );
}
