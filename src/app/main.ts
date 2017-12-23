import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

/* @if development */
import {enableProdMode} from "@angular/core";

if (window.location.search.indexOf("dev.enableProdMode") > -1) {
	enableProdMode();
}
/* @endif */

platformBrowserDynamic().bootstrapModule(AppModule);
