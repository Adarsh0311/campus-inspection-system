import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  handleSubmit() {
    console.log({
      email: this.email,
      password: this.password,
    });
    alert(`Login attempt with email: ${this.email}`);
  }
}
