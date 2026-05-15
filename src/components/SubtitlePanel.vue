<script setup lang="ts">
    import type { ParsedASSEvent } from 'ass-compiler';
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from '@/components/ui/table'

    const props = defineProps<{
        actives: Set<number>
        dialogues: ParsedASSEvent[] | undefined
    }>()

    function format(seconds: number) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const centis = Math.floor((seconds % 1) * 100);

        return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
    }
</script>

<template>
    <div class="p-2">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead class="min-w-10">Line</TableHead>
                    <TableHead class="min-w-25">Start</TableHead>
                    <TableHead class="min-w-25">End</TableHead>
                    <TableHead class="min-w-30">Style</TableHead>
                    <TableHead class="w-full">Text</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow 
                    v-if="dialogues" 
                    v-for="(dialogue, index) in dialogues" :key="index"
                    :class="{ 'text-red-400': actives.has(index) }"
                >
                    <TableCell class="py-0.5 min-w-10">{{ index + 1 }}</TableCell>
                    <TableCell class="py-0.5 min-w-25">{{ format(dialogue.Start) }}</TableCell>
                    <TableCell class="py-0.5 min-w-25">{{ format(dialogue.End) }}</TableCell>
                    <TableCell class="py-0.5 min-w-30">{{ dialogue.Style }}</TableCell>
                    <TableCell class="py-0.5 w-full">{{ dialogue.Text.combined }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>