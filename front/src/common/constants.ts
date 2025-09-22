export const blogPostColors = new Map<string | null, string>(
    [
        ['events', 'oklch(45% 0.187 3.815)'],
        ['music_theory', 'oklch(68% 0.169 237.323)'],
        ['personal', 'oklch(79% 0.184 86.047)'],
        [null, 'oklch(27% 0.006 286.033)']
    ]
);

export const blogPostTypes = [
    {
        displayName: 'Events',
        name: 'events',
    },
    {
        displayName: 'Music Theory',
        name: 'music_theory',
    },
    {
        displayName: 'Other',
        name: null,
    },
    {
        displayName: 'Personal',
        name: 'personal',
    }
];

export const emailTypes = [
    {
        displayName: 'Events',
        name: 'events',
    },
    {
        displayName: 'Updates',
        name: 'updates',
    }
];

export const eventTypes = [
    {
        displayName: 'Class',
        name: 'class',
    },
    {
        displayName: 'Concert',
        name: 'concert',
    },
    {
        displayName: 'External',
        name: 'external',
    },
    {
        displayName: 'Other',
        name: null,
    },
    {
        displayName: 'Workshop',
        name: 'workshop',
    }
];

export const locales = [
    {
        displayName: 'EN',
        name: 'en',
    },
    {
        displayName: 'FR',
        name: 'fr',
    }
];