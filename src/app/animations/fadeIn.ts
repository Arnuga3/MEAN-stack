import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'fixed', width:'100%' }),
                            { optional: true }),
    group([
        query(':enter', [style({ opacity: 0 }), 
                        animate('0.3s',
                        style({ opacity: 1 }))],
                        { optional: true }),
        query(':leave', [style({ opacity: 1 }),
                        animate('0.3s',
                        style({ opacity: 0 }))],
                        { optional: true }),
    ])
  ])
])