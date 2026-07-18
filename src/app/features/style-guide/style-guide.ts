import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '../../shared/components/badge/badge';
import { Chip } from '../../shared/components/chip/chip';
import { FactionBadge } from '../../shared/components/faction-badge/faction-badge';
import { Panel } from '../../shared/components/panel/panel';
import { StatusMessage } from '../../shared/components/status-message/status-message';
import { TierBadge } from '../../shared/components/tier-badge/tier-badge';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-style-guide',
  imports: [Badge, Chip, FactionBadge, Panel, StatusMessage, TierBadge],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide {}
