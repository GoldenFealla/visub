<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    
    import NavigationBar from './components/NavigationBar.vue';
    import SubtitlePanel from './components/SubtitlePanel.vue';

    import { ReadASS, type Subtitle, type DialogueWithTime } from '@/lib/subtitle';

    const video = ref("")
    function onLoadVideo(url: string) {
        video.value = url
    }

    const subtitle = ref<Subtitle | null>(null)
    function onLoadSubtitle(content: string) {
        subtitle.value = ReadASS(content)
    }



    function toSeconds(timeStr: any) {
      const [h, m, s] = timeStr.split(':')
      return (+h * 3600) + (+m * 60) + parseFloat(s)
    }

    const dialoguesWithTime = computed<DialogueWithTime[] | undefined>(() =>
        subtitle.value?.events.dialogues.map(d => ({
            ...d,
            startSec: toSeconds(d.Start),
            endSec: toSeconds(d.End)
        }))
    )


    const videoRef = ref<HTMLMediaElement | null>(null)
    const activeSet = ref(new Set<number>())
    function loop() {
        if (videoRef.value && dialoguesWithTime.value) {
            const t = videoRef.value.currentTime
            const next = new Set<number>()

            for (let i = 0; i < dialoguesWithTime.value.length; i++) {
                const d = dialoguesWithTime.value[i]
                if (t >= d.startSec && t <= d.endSec) {
                    next.add(i)
                }
            }

            if (!isSameSet(activeSet.value, next)) {
                activeSet.value = next
            }
        }
        requestAnimationFrame(loop)
    }

    function isSameSet(a: Set<number>, b: Set<number>) {
        if (a.size !== b.size) return false
        for (const v of a) if (!b.has(v)) return false
        return true
    }

    onMounted(() => {
        requestAnimationFrame(loop)
    })
</script>

<template>
    <div>
        <NavigationBar @subtitle="onLoadSubtitle" @video="onLoadVideo" />
    </div>
    <div class="p-2">
        <video ref="videoRef" class="max-h-96" :src="video" controls ></video>
    </div>
    <div>
        <SubtitlePanel :actives="activeSet" :format="subtitle?.events.format" :dialogues="dialoguesWithTime" />
    </div>
</template>
