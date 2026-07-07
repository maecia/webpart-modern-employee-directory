import { Member } from '../../../models/Member'
import { DirectoryConfig } from '../../../models/DirectoryConfig'

export interface DirectoryProps {
  config: DirectoryConfig;
  members: Member[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}
