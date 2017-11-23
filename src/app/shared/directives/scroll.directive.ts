import { Directive, HostListener, Inject, Output, ElementRef, EventEmitter} from '@angular/core';


@Directive({
    selector: '[nxScroller]'
})
export class ScrollerDirective {

    scrolled = false;
    @Output() public scrollEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    @HostListener('scroll') onScroll() {
        const nPixels = this.el.nativeElement.scrollTop || 0;
        if (nPixels > 64) {
           this.scrollEvent.emit(this.scrolled = true);
            console.log('true');
        } else if (this.scrolled && nPixels < 10) {
            this.scrollEvent.emit(this.scrolled = false);
            console.log('false');
        }

    }

    @HostListener('click') clicking() {
        console.log('clicking...');
        
    }

    @HostListener('hover') onHover() {
        console.log('hovering...!!!');
        
    }

    constructor(private el: ElementRef) { }


}
