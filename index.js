/* Uygulamanin giris noktasi. Acik giris dosyasi Expo'nun kendi yolundan daha
 * saglam: o yol surumden surume degisiyor ve degistiginde hata "bundle
 * bulunamadi" diye cikip sebebini gostermiyor. */
import { registerRootComponent } from "expo";

import App from "./App";

registerRootComponent(App);
