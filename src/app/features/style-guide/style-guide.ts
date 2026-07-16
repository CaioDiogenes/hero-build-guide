import { Component } from "@angular/core";
import { BadgeComponent } from "../../shared/components/badge/badge";
import { ChipComponent } from "../../shared/components/chip/chip";
import { FactionBadgeComponent } from "../../shared/components/faction-badge/faction-badge";
import { PanelComponent } from "../../shared/components/panel/panel";
import { StatusMessageComponent } from "../../shared/components/status-message/status-message";
import { TierBadgeComponent } from "../../shared/components/tier-badge/tier-badge";

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    BadgeComponent,
    ChipComponent,
    FactionBadgeComponent,
    PanelComponent,
    StatusMessageComponent,
    TierBadgeComponent,
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide { }