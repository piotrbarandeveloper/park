import { Component, ViewChild, Inject, forwardRef, ElementRef } from "@angular/core";
import { TextInput, LoadingController, AlertController, ViewController, ModalController } from "ionic-angular";

import { AppErrorHandler } from "../../app/app-error-handler";
import { RestService, UserAuthenticationException } from "../../data";

@Component({
    templateUrl: "sign-in-page.html",
    selector: "samar-sign-in-page"
})
export class SignInPage {

	private static opened: boolean = false;

	public static open(modalController: ModalController) {

		if (!SignInPage.opened) {
			SignInPage.opened = true;
			
			let modal = modalController.create(SignInPage, {}, {enableBackdropDismiss: false});
			modal.onDidDismiss(() => SignInPage.opened = false);
			modal.present();
		}

	}


    constructor(private element: ElementRef, @Inject(forwardRef(() => RestService)) private restService: RestService, @Inject(forwardRef(() => AppErrorHandler)) private errorHandler: AppErrorHandler, private loadingController: LoadingController, private alertController: AlertController,  private viewController: ViewController) {
    }

    cancelable: boolean = false;

    @ViewChild("emailInput")
    emailInput: TextInput;

    @ViewChild("passwordInput")
    passwordInput: TextInput;

    cancelClicked() {
        this.viewController.dismiss();
    }

    signIn(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        let email = this.emailInput.value;
        let password = this.passwordInput.value;

        if (email && password) {

            let loader = this.loadingController.create({ content: "Trwa logowanie użytkownika..." });
            loader.present();

            this.restService.signIn(this.emailInput.value, this.passwordInput.value).subscribe((user) => {
                loader.dismiss();
                window.location.reload();
            }, (error) => {
                loader.dismiss();

                if (error instanceof UserAuthenticationException) {

                    this.alertController.create({
                        title: "Błąd logowania",
                        subTitle: error.message,
                        buttons: ['Ok']
                    }).present();
                } else {
                    this.errorHandler.showMessage(error);
                }
            });
        }
    }

	public ionViewDidLoad() {
		let modal = this.getParentElementByClassName(this.element.nativeElement, "modal-wrapper");
		if (modal) modal.classList.add("modal-fullscreen");
    }

    private getParentElementByClassName (element: Element, className: string) : Element {

        let parent = element.parentElement;
    
        while (parent) {
            if (this.hasClassName(parent, className)) return parent;
            parent = parent.parentElement;
        }
    
        return null;
    }

    private hasClassName (element: Element, className: string) : boolean {
        return element.classList.contains(className);
    }
}
