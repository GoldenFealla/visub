<script setup lang="ts">
    import { type  DialogueWithTime } from '@/lib/subtitle';
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from '@/components/ui/table'

    const props = defineProps<{
        actives: Set<number>,
        format: string[] | undefined,
        dialogues: DialogueWithTime[] | undefined
    }>()
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
                    <TableCell class="py-0.5 min-w-25">{{ dialogue.Start }}</TableCell>
                    <TableCell class="py-0.5 min-w-25">{{ dialogue.End }}</TableCell>
                    <TableCell class="py-0.5 min-w-30">{{ dialogue.Style }}</TableCell>
                    <TableCell class="py-0.5 w-full">{{ dialogue.Text }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>