<script setup lang="ts">
    import { ref } from 'vue';
    
    import NavigationBar from './components/NavigationBar.vue';
    import SubtitlePanel from './components/SubtitlePanel.vue';

    import { ReadASS, type Subtitle } from '@/lib/subtitle';

    const subtitle = ref<Subtitle | null>(null)

    function onLoadSubtitle(content: string) {
        subtitle.value = ReadASS(content)
    }

</script>

<template>
    <div>
        <NavigationBar @subtitle="onLoadSubtitle" />
    </div>
    <div>
        <SubtitlePanel :format="subtitle?.events.format" :dialogues="subtitle?.events.dialogues" />
    </div>
</template>
