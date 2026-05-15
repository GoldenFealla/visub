import { ref, computed, type Ref, watchEffect } from "vue";

import { parse, stringify, type ParsedASS } from "ass-compiler";
import ASS from "assjs";

export class Subtitle {
  private _ps: Ref<ParsedASS | null> = ref(null);
  private _vel: Ref<HTMLVideoElement | null> = ref(null);
  private _cel: Ref<HTMLDivElement | null> = ref(null);

  constructor() {
    watchEffect(() => {
      console.log("new");

      if (!this._ps.value) return;
      const content = stringify(this._ps.value);

      if (this._vel.value && this._cel.value) {
        return new ASS(content, this._vel.value, { container: this._cel.value });
      }
    });
  }

  public dialogue = computed(() => {
    return this._ps.value?.events.dialogue ?? [];
  });

  public SetSubtitle = (content: string) => {
    this._ps.value = parse(content);
  };

  public SetVideoElement = (video: HTMLVideoElement) => {
    this._vel.value = video;
  };

  public SetContainerElement = (container: HTMLDivElement) => {
    this._cel.value = container;
  };
}
