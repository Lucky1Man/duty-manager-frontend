import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { YesNoShareService } from '../services/yes-no-share.service';

@Component({
  selector: 'app-yes-no-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.scss',
})
export class YesNoDialogComponent<TIssuer> {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; issuer: TIssuer },
    public yesNoShareService: YesNoShareService<TIssuer>
  ) {}

  nextDecision(decision: boolean) {
    this.yesNoShareService.nextDecision({
      issuer: this.data.issuer,
      decision: decision,
    });
  }
}
