import Handler from "./Handler";
import Utils from "./Utils";


let random = Utils.random(0, 100000);
setTimeout(() => new Handler().handle(), random);
