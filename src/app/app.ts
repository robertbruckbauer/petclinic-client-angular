import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeToggle } from './theme-toggle/theme-toggle';

@Component({
  imports: [RouterOutlet, RouterLink, ThemeToggle],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
