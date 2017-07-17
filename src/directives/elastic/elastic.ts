import { HostListener, Directive } from '@angular/core';

/**
 * Generated class for the ElasticDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
	selector: '[elastic]' // Attribute selector
})
export class ElasticDirective {
	constructor() {
		console.log('Hello ElasticDirective Directive');
	}

	@HostListener('input',['$event.target'])
	onInput(nativeElement: any): void {
		nativeElement.style.height = nativeElement.scrollHeight + "px";
	}

}
