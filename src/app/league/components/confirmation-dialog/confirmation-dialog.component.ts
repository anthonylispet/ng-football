import { Component, HostListener } from '@angular/core';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  standalone: false,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(readonly confirmationService: ConfirmationService) {}

  @HostListener('document:keydown.escape')
  cancel(): void {
    this.confirmationService.resolve(false);
  }
}
