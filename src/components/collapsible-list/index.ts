import {
    NgModule, ContentChildren, ContentChild,
    QueryList, Directive, Component, Input,
    ElementRef, HostListener, Optional, Inject, forwardRef
} from "@angular/core";

import {Item} from "ionic-angular";

@Component({
    selector: "ion-item-collapsible, ionx-item-collapsible",
    template: "<ng-content></ng-content>",
    //styleUrls: ["collapsible-list.scss"],
    host: {
        "class": "item-wrapper"
    }
})
export class CollapsibleItem {

    constructor(private element: ElementRef, @Optional() @Inject(forwardRef(() => CollapsibleList)) private parentList?: CollapsibleList) {
    }

    @ContentChild(Item)
    item: Item;

    @Input("collapsible")
    set collapsible(collapsible: boolean) {
        if (!collapsible) {
            this.element.nativeElement.classList.add("item-without-collapsible");
        }
    }

    @Input("expanded")
    set expanded(expanded: boolean) {

        let alreadyExpanded = this.element.nativeElement.classList.contains("item-expanded");

        if (expanded && !alreadyExpanded) {
            this.element.nativeElement.classList.add("item-expanded");

            if (this.parentList) {
                this.parentList.expand(this);
            }

        } else if (!expanded && alreadyExpanded) {
            this.element.nativeElement.classList.remove("item-expanded");
        }
    }

    get expanded() {
        return this.element.nativeElement.classList.contains("item-expanded");
    }

    @HostListener("click", ["$event"])
    clicked(event: Event) {

        if (this.isSelfOrChildOf(event.target, this.item.getElementRef().nativeElement)) {

            if (!this.expanded) {
                if (this.parentList) {
                    this.parentList.expand(this);
                } else {
                    this.expanded = true;
                }
            } else {
                this.expanded = false;
            }
        }
    }

    private isSelfOrChildOf (element: Element | EventTarget, parent: Element, topParent?: Element) {

        if (element === parent) {
            return true;
        }
    
        let par = (element as Element).parentElement;
        while (par) {
    
            if (par === parent) {
                return true;
            }
    
            if (par === topParent) {
                return false;
            }
    
            par = par.parentElement;
        }
    }
}

@Directive({
    selector: "ion-list[collapsible], ion-list[ionx-collapsible]"
})
export class CollapsibleList {

    @ContentChildren(CollapsibleItem)
    items: QueryList<CollapsibleItem>

    @Input()
    accordion: boolean;

    expand(itemToExpand: CollapsibleItem) {

        if (this.items) {
            for (let item of this.items.toArray()) {
                if (item === itemToExpand) {
                    item.expanded = true;
                } else if (this.accordion) {
                    item.expanded = false;
                }
            }
        }
    }

    ngAfterViewInit() {

        // if list is accordion, we need to make sure, that only one item is expanded        
        if (this.accordion) {

            // last expanded item
            let lastItem: CollapsibleItem;

            for (let item of this.items.toArray()) {

                if (item.expanded) {
                    lastItem = item;
                }
            }

            if (lastItem) {
                this.expand(lastItem);
            }
        }
    }
}

@NgModule({
    declarations: [CollapsibleList, CollapsibleItem],
    bootstrap: [CollapsibleItem],
    exports: [CollapsibleList, CollapsibleItem]
})
export class CollapsibleListModule {

}