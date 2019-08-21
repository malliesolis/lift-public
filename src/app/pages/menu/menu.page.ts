import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Log Workout',
      url: '/members/menu/log-workout',
      icon: 'body'
    },
    {
      title: 'History',
      url: '/members/menu/show-workout',
      icon: 'paper'
    },
    {
      title: 'Editing',
      children: [
        {
          title: 'Add Exercise',
          url: '/members/menu/add-exercise',
          icon: 'add'
        },
        {
          title: 'Add Exercise Group',
          url: '/members/menu/add-group',
          icon: 'add'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}