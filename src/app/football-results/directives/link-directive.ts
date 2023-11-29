import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appLink]'
})
export class LinkDirective {

  constructor(private el:ElementRef) { }

  @HostListener('mouseenter') onMouseEnter(){
    this.el.nativeElement.style.color = "#0056b3";
    this.el.nativeElement.style.textDecoration = "underline";
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.el.nativeElement.style.color = '';
    this.el.nativeElement.style.textDecoration = '';
  }

}
