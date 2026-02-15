const ABILITY_SCORES_LABEL = "Ability Scores";
const ABILITY_HEADERS = ["Ability", "Modifier", "Score"] as const;
const SAVES_SELECTOR = ".ct-saving-throws-box";
const SAVES_LABEL = "Saving Throws";
const SAVES_HEADERS = ["Saving Throw", "Proficiency", "Bonus"] as const;

const isPatched = (el: Element, role: string) =>
    el.getAttribute("role") === role;

/** Reads the modifier text from a roll button, e.g. "+1" or "-2". */
const readModifier = (button: Element): string =>
    button.textContent?.trim() ?? "";

/** Hides an element from the accessibility tree. */
const hideFromA11yTree = (el: Element) => {
    el.setAttribute("role", "presentation");
    el.setAttribute("aria-hidden", "true");
};

/** Creates an sr-only ghost row with column headers for a table. */
const createGhostRow = (headers: readonly string[]): HTMLDivElement => {
    const row = document.createElement("div");
    row.setAttribute("role", "row");
    row.className = "sr-only";
    for (const name of headers) {
        const th = document.createElement("div");
        th.setAttribute("role", "columnheader");
        th.textContent = name;
        row.appendChild(th);
    }
    return row;
};

/**
 * Assigns ARIA roles to an ability score block's children.
 * Expected child order: icon (svg), name (span), modifier (button), score (text).
 */
const patchAbilityRow = (outer: Element) => {
    if (isPatched(outer, "row")) return;
    outer.setAttribute("role", "row");

    const inner = outer.querySelector(":scope > div");
    if (!inner) return;

    inner.setAttribute("role", "presentation");
    const children = Array.from(inner.children);
    if (children.length < 4) return;

    // Find the name div (has span, no svg/button) → rowheader
    for (const child of children) {
        if (
            child.querySelector("span") &&
            !child.querySelector("svg") &&
            !child.querySelector("button")
        ) {
            child.setAttribute("role", "rowheader");
            break;
        }
    }

    // Assign cell roles and hide icons
    for (const child of children) {
        if (child.querySelector("button")) {
            child.setAttribute("role", "cell");
            continue;
        }
        if (
            !child.querySelector("span") &&
            !child.querySelector("svg") &&
            !child.hasAttribute("role")
        ) {
            child.setAttribute("role", "cell");
            continue;
        }
        if (child.querySelector("svg") && !child.hasAttribute("role")) {
            hideFromA11yTree(child);
        }
    }
};

/**
 * Assigns ARIA roles to a saving throw row's children.
 * Expected children: icon (svg), name (h3), proficiency (span), abbreviation (abbr), modifier (button).
 * Check order matters: button before span before svg, because proficient entries
 * have SVGs inside their span, and the modifier div contains a dice SVG.
 */
const patchSaveRow = (row: Element) => {
    if (isPatched(row, "row")) return;
    row.setAttribute("role", "row");

    const h3 = row.querySelector("h3");
    if (h3) {
        h3.setAttribute("role", "rowheader");
    }

    for (const child of Array.from(row.children)) {
        if (child.tagName === "H3") continue;

        if (child.querySelector("button")) {
            child.setAttribute("role", "cell");
            continue;
        }
        if (child.querySelector("abbr")) {
            hideFromA11yTree(child);
            continue;
        }
        if (child.querySelector("span")) {
            child.setAttribute("role", "cell");
            continue;
        }
        if (child.querySelector("svg")) {
            hideFromA11yTree(child);
        }
    }
};

/** Updates a roll button's aria-label to match its current modifier text. */
const updateButtonLabel = (container: Element) => {
    const button = container.querySelector("button");
    if (!button) return;
    const modifier = readModifier(button);
    if (modifier && button.getAttribute("aria-label") !== modifier) {
        button.setAttribute("aria-label", modifier);
    } else if (!modifier && button.hasAttribute("aria-label")) {
        button.removeAttribute("aria-label");
    }
};

export const patchAbilityScores = () => {
    // Find the section containing an h2 with the ability scores heading
    const headings = document.querySelectorAll("h2");
    let section: Element | null = null;
    let h2: Element | null = null;
    for (const heading of headings) {
        if (
            heading.textContent?.trim() === ABILITY_SCORES_LABEL &&
            !heading.classList.contains("sr-only")
        ) {
            section = heading.closest("section");
            h2 = heading;
            break;
        }
    }
    if (!section || !h2) return;

    // Insert sr-only heading before the section so it's navigable via H key
    // outside the table. Can't restructure the DOM because React re-renders
    // ability blocks as direct children of the section.
    if (!document.querySelector("[data-ea-sr-heading='ability-scores']")) {
        const srHeading = document.createElement("h2");
        srHeading.className = "sr-only";
        srHeading.setAttribute("data-ea-sr-heading", "ability-scores");
        srHeading.textContent = ABILITY_SCORES_LABEL;
        section.before(srHeading);
    }

    // Hide original h2 from accessibility tree (visual text stays for sighted users)
    if (h2.getAttribute("aria-hidden") !== "true") {
        h2.setAttribute("role", "presentation");
        h2.setAttribute("aria-hidden", "true");
    }

    // Apply table role to the section
    if (!isPatched(section, "table")) {
        section.setAttribute("role", "table");
        section.setAttribute("aria-label", ABILITY_SCORES_LABEL);
    }

    // Insert ghost row with column headers (sr-only)
    if (!section.querySelector(".sr-only")) {
        h2.after(createGhostRow(ABILITY_HEADERS));
    }

    // Patch each ability score block
    // Structure: section > div(outer) > div(inner) > [icon, name, modifier, score]
    const abilityBlocks = Array.from(section.children).filter(
        (el) =>
            el.tagName === "DIV" &&
            !el.classList.contains("sr-only")
    );

    for (const outer of abilityBlocks) {
        patchAbilityRow(outer);
        updateButtonLabel(outer);
    }
};

export const patchSavingThrows = () => {
    const box = document.querySelector(SAVES_SELECTOR);
    if (!box) return;

    // The rows container is found by navigating from the first h3 upward
    const allH3s = box.querySelectorAll("h3");
    if (allH3s.length === 0) return;
    const firstSaveDiv = allH3s[0].parentElement;
    if (!firstSaveDiv) return;
    const container = firstSaveDiv.parentElement;
    if (!container) return;

    // Apply table role to the container
    if (!isPatched(container, "table")) {
        container.setAttribute("role", "table");
        container.setAttribute("aria-label", SAVES_LABEL);
    }

    // Insert ghost row with column headers
    if (!container.querySelector(".sr-only")) {
        container.prepend(createGhostRow(SAVES_HEADERS));
    }

    // Patch each saving throw row
    const saveRows = Array.from(container.children).filter(
        (el) => el.tagName === "DIV" && !el.classList.contains("sr-only")
    );

    for (const row of saveRows) {
        patchSaveRow(row);
        updateButtonLabel(row);
    }
};
