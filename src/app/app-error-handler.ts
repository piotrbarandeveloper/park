import {Injectable} from "@angular/core";
import {Alert, AlertController, ModalController} from "ionic-angular";

import {UserAuthenticationException} from "../data/user";
import {SignInPage} from "../pages/user/sign-in-page";

@Injectable()
export class AppErrorHandler {

    constructor(private alertController: AlertController, private modalController: ModalController) {
    }

    /**
     * Zajmuje sie wskazanym błedem. W zaleznosci od bledu zostanie podjeta
     * odpowiednia akcja - zazwyczaj komunikat o bledzie. Przykladowo brak autentykacji
     * uzytkownika spowoduje zaladowanie widoku logowania.
     */
    handle(error: any, message?: string) {

        if (error instanceof UserAuthenticationException) {
            SignInPage.open(this.modalController);
        } else {
            this.showMessage(error, message);
        }
    }

    handleError(error: any) {
        this.handle(error);
    }

    show(error: any, message?: string) {
        this.showMessage(error, message);
    }

    showMessage(error: any, message?: string) {
        console.error(error);
        let alert = this.createAlert(error);
        alert.present();
    }

    showPage(error: any, message?: string) {
        throw "Not implemented";
    }

    protected createAlert(error: any, message?: string): Alert {

        return this.alertController.create({
            title: "Błąd",
            subTitle: message ? message : this.message(error),
            buttons: ['Ok']
        });
    }

    protected message(error: any): string {
        return "Wystąpił nieznany błąd";
    }

}
