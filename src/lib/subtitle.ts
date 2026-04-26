export type ScriptInfo = Record<string, string>;

export type Style = Record<string, string>;

export type Styles = {
  format: string[];
  items: Style[];
};

export type Dialogue = Record<string, string>;

export type Events = {
  format: string[];
  dialogues: Dialogue[];
};

export type Subtitle = {
  scriptInfo: ScriptInfo;
  styles: Styles;
  events: Events;
};

export function ReadASS(content: string): Subtitle {
  const lines = content.split(/\r?\n/);

  let section: "script" | "styles" | "events" | null = null;

  const subtitle: Subtitle = {
    scriptInfo: {},
    styles: {
      format: [],
      items: [],
    },
    events: {
      format: [],
      dialogues: [],
    },
  };

  const splitOnce = (line: string) => {
    const i = line.indexOf(":");
    if (i === -1) return [line, ""];
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  };

  const splitByCommaWithLimit = (line: string, limit: number) => {
    const result: string[] = [];
    let current = "";
    let count = 0;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === "," && count < limit - 1) {
        result.push(current.trim());
        current = "";
        count++;
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith(";")) continue;

    // Section switch
    if (line.startsWith("[") && line.endsWith("]")) {
      const name = line.slice(1, -1);

      section = null;
      if (name === "Script Info") section = "script";
      else if (name === "V4+ Styles" || name === "V4 Styles") section = "styles";
      else if (name === "Events") section = "events";

      continue;
    }

    const [key, value] = splitOnce(line);

    // --- Script Info ---
    if (section === "script") {
      subtitle.scriptInfo[key] = value;
    }

    // --- Styles ---
    if (section === "styles") {
      if (key === "Format") {
        subtitle.styles.format = value.split(",").map((s) => s.trim());
      }

      if (key === "Style") {
        const values = splitByCommaWithLimit(value, subtitle.styles.format.length);
        const obj: Style = {};

        subtitle.styles.format.forEach((k, i) => {
          obj[k] = values[i] ?? "";
        });

        subtitle.styles.items.push(obj);
      }
    }

    // --- Events ---
    if (section === "events") {
      if (key === "Format") {
        subtitle.events.format = value.split(",").map((s) => s.trim());
      }

      if (key === "Dialogue") {
        const values = splitByCommaWithLimit(value, subtitle.events.format.length);
        const obj: Dialogue = {};

        subtitle.events.format.forEach((k, i) => {
          obj[k] = values[i] ?? "";
        });

        subtitle.events.dialogues.push(obj);
      }
    }
  }

  return subtitle;
}
