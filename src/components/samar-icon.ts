import {Directive, ElementRef, Input, OnInit, Type} from "@angular/core";
import {Icon} from "ionic-angular";

function iconName(icon: string): String {
	return "samar-icon-" + icon;
}

@Directive({
	selector: "samar-icon"
})
export class SamarIconComponent {

	constructor(private element: ElementRef) {
		this.element.nativeElement.classList.add("samar-icon");
	}

	private _name: any;

	@Input("name")
	get name(): any {
		return this._name;
	}

	set name(name: any) {
		this._name = name;

		let className = iconName(name);

		let classes = this.element.nativeElement.classList;

		for (let i = classes.length - 1; i >= 0; i--) {
			let c = classes.item(i);
			if (c.indexOf("samar-icon-") > -1) classes.remove(c);
		}

		classes.add(className);
	}
}

@Directive({
	selector: "ion-icon[samarIcon]"
})
export class SamarIonIconDirective implements OnInit {

	constructor(private element: ElementRef, private ionIcon: Icon) {
	}

	@Input("samarIcon")
	name: string;

	ngOnInit() {

		this.ionIcon.name = "samar-";

		this.element.nativeElement.classList.add("samar-icon");
		this.element.nativeElement.classList.add(iconName(this.name));
	}
}

export const samarIconDirectives: Type<any>[] = [SamarIconComponent, SamarIonIconDirective];
