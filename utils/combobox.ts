export const patchComboboxes = () => {
    const triggers = document.querySelectorAll('button[role="combobox"]');

    triggers.forEach((button) => {
        const controlledId = button.getAttribute("aria-controls");
        const content = controlledId
            ? document.getElementById(controlledId)
            : null;

        // Is this actually one of the radio-dropdowns?
        const hasRadios = content?.querySelector('input[type="radio"]');

        if (!content || !hasRadios) return;

        if (button.getAttribute("role") !== "button") {
            button.setAttribute("role", "button");
            button.removeAttribute("aria-haspopup");
        }

        const listContainer = content.querySelector('[role="menu"]') || content;

        if (listContainer.getAttribute("role") !== "radiogroup") {
            listContainer.setAttribute("role", "radiogroup");

            // Guess the label from the button's text or aria-label
            const groupLabel =
                button.getAttribute("aria-label") ||
                button.textContent ||
                "Options";
            if (
                !listContainer.hasAttribute("aria-label") &&
                !listContainer.hasAttribute("aria-labelledby")
            ) {
                listContainer.setAttribute("aria-label", groupLabel);
            }
        }

        const labelledBy = button.getAttribute("aria-labelledby");
        if (labelledBy) {
            const labelEl = document.getElementById(labelledBy);
            const checkedRadio = listContainer.querySelector(
                'input[type="radio"]:checked',
            );
            const clean = (s: string | null | undefined) => s?.trim() || "";

            const fieldName = clean(labelEl?.textContent);
            const valueText =
                clean(button.textContent) ||
                clean(checkedRadio?.parentElement?.textContent);

            if (fieldName && valueText) {
                const isPlaceholder =
                    valueText.startsWith("--") || valueText === "";
                const newLabel = isPlaceholder
                    ? fieldName
                    : `${fieldName}: ${valueText}`;

                if (button.getAttribute("aria-label") !== newLabel) {
                    button.setAttribute("aria-label", newLabel);
                    button.removeAttribute("aria-labelledby");
                }
            }
        }

        const labels = listContainer.querySelectorAll("label");
        labels.forEach((label) => {
            const radioInput = label.querySelector(
                'input[type="radio"]',
            ) as HTMLInputElement;
            if (radioInput) {
                radioInput.setAttribute("aria-hidden", "true");
                radioInput.setAttribute("tabindex", "-1");

                label.setAttribute("role", "radio");
                const isChecked = radioInput.checked;
                if (
                    label.getAttribute("aria-checked") !== isChecked.toString()
                ) {
                    label.setAttribute("aria-checked", isChecked.toString());
                }

                label.removeAttribute("aria-selected");

                const svg = label.querySelector("svg");
                if (
                    svg &&
                    (!svg.getAttribute("aria-hidden") ||
                        svg.getAttribute("aria-hidden") === "false")
                ) {
                    svg.setAttribute("aria-hidden", "true");
                }
            }
        });
    });
};
