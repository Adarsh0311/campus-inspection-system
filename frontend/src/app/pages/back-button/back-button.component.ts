import { Component, Input, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent {
  @Input() className: string = 'btn btn-outline-secondary me-2';

  goBack() {
    window.history.back();
  }

}
