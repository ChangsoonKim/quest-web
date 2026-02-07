## Summary
Implemented basic layout and main page for Quest Service (Phase 1).

## Changes
- **Added `QuestLayout`**: Mobile-first layout with header and bottom navigation
- **Added `PhotoUploader`**: Camera/file input component with preview
- **Added `QuestListPage`**: Main page displaying dummy quest data
- **Updated `App.tsx`**: Render `QuestListPage` as entry point
- **Added Storybook stories**: Stories for all new components

## Testing
- **Local Build**: `pnpm build` (Passed)
- **Lint**: `pnpm lint` (Passed)
- **Storybook**: `pnpm build-storybook` (Passed)
