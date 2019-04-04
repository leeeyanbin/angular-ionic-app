import {Injectable} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Network} from '@ionic-native/network/ngx';
import {Badge} from '@ionic-native/badge/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {Device} from '@ionic-native/device/ngx';
import {Screenshot} from '@ionic-native/screenshot/ngx';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';


@Injectable({
    providedIn: 'root'
})
export class NativeService {
    keyboard = null;
    constructor(
        public screenshot: Screenshot,
        public device: Device,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public keyboard1: Keyboard,
        public appVersion: AppVersion,
        public barcodeScanner: BarcodeScanner,
        public camera: Camera,
        public network: Network,
        public badge: Badge,
        public photoViewer: PhotoViewer,
        public transfer: FileTransfer) {
        this.keyboard = {...keyboard1};
        this.keyboard.close = keyboard1.hide;
    }

}
