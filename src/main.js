import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import Toaster from "@meforma/vue-toaster";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

createApp(App)
  .use(router)
  .use(Toaster)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
