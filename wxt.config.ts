import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        name: "Enhance Ability: better a11y for D&D Beyond",
        short_name: "Enhance Ability",
        description: "Improves screen reader accessibility on D&D Beyond.",
        permissions: ["storage"],
        host_permissions: ["*://*.dndbeyond.com/*"],
        browser_specific_settings: {
            gecko: {
                data_collection_permissions: {
                    required: ["none"],
                },
            } as any,
        },
    },
    runner: {
        startUrls: ["https://www.dndbeyond.com/"],
    },
});
