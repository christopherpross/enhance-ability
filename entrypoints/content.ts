import "./style.css";
import {
    patchSpells,
    patchActions,
    patchExtras,
    patchInventory,
} from "@/utils/tables";
import { patchComboboxes } from "@/utils/combobox";
import { initNavEngine } from "@/utils/focusManager";
import { initSpeech } from "@/utils/speech";
import { patchDice } from "@/utils/dice";
import { registerStatusKeys } from "@/utils/status";

export default defineContentScript({
    matches: ["*://*.dndbeyond.com/*"],
    runAt: "document_end",

    main(ctx) {
        console.log("Enhance Ability: Content script loaded");
        const runAllPatches = () => {
            patchSpells();
            patchActions();
            patchExtras();
            patchInventory();
            patchDice();
            patchComboboxes();
        };

        console.log("Enhance Ability: Initializing navigation engin");
        initNavEngine(ctx);
        console.log("Enhance Ability: Initializing speech");
        initSpeech();

        registerStatusKeys(ctx);

        const observer = new MutationObserver(() => runAllPatches());
        observer.observe(document.body, { childList: true, subtree: true });

        ctx.addEventListener(window, "wxt:locationchange" as any, () => {
            setTimeout(runAllPatches, 150);
        });

        ctx.onInvalidated(() => {
            observer.disconnect();
        });

        console.log("Enhance Ability: Running initial patches");
        runAllPatches();
    },
});
