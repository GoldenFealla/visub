<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';

    import { Subtitle } from './lib/subtitle'; 

    import NavigationBar from './components/NavigationBar.vue';
    import SubtitlePanel from './components/SubtitlePanel.vue';

    const subtitle = ref<Subtitle>(new Subtitle())
    const videoRef = ref<HTMLVideoElement | null>(null)
    function onLoadVideo(url: string) {
        if (videoRef.value) {
            videoRef.value.src = url
        }
    }

    function onLoadSubtitle(content: string) {
        subtitle.value.SetSubtitle(content)
    }

    const subtitleRef = ref<HTMLDivElement | null>(null)
    const activeSet = ref(new Set<number>())
    function loop() {
        if (videoRef.value && subtitle.value.dialogue) {
            const t = videoRef.value.currentTime
            const next = new Set<number>()

            for (let i = 0; i < subtitle.value.dialogue.length; i++) {
                const d = subtitle.value.dialogue[i]
                if (t >= d.Start && t <= d.End) {
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
        subtitle.value.SetVideoElement(videoRef.value!)
        subtitle.value.SetContainerElement(subtitleRef.value!)
        requestAnimationFrame(loop)
    })
</script>

<template>
    <div>
        <NavigationBar @subtitle="onLoadSubtitle" @video="onLoadVideo" />
    </div>
        <div class="relative h-96 p-2">
        <video ref="videoRef" class="absolute top-0 left-0" controls></video>
        <div ref="subtitleRef" class="absolute top-0 left-0"></div>
    </div>
     <div style="position: relative;">
        <SubtitlePanel :actives="activeSet" :dialogues="subtitle.dialogue" />
    </div>

   
</template>
