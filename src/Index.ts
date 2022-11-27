import Handler from "./Handler";
import Utils from "./Utils";


let random = Utils.random(0, 10000);
setTimeout(async () => {
    await new Handler().handle();
    await new Handler().handle();
    await new Handler().handle();
}, random);
