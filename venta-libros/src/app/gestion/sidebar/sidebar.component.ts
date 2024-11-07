import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarHidden: boolean = false;
  isSubmenuHidden: boolean = true;
  isSubmenuHidden2: boolean = true;

  dropdown() {
    this.isSubmenuHidden = !this.isSubmenuHidden;
  }
  dropdown2() {
    this.isSubmenuHidden2 = !this.isSubmenuHidden2;
  }

  openSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
