# HalfBuilt

## Current State
Backend submitProject has no contactLink. Stats are hardcoded. Directory shows generic empty state. ProjectCard has no buyer contact mechanism. Categories missing Prototypes.

## Requested Changes (Diff)

### Add
- contactLink stored per project in separate contactLinks map
- unlockContact(id) backend function requiring auth
- contactLink field to Submit and Landing quick-submit forms
- Unlock Contact button on ProjectCard with auth gate
- useUnlockContact mutation hook

### Modify
- submitProject: add contactLink 5th param
- Landing STATS: live project count, static 5 Active Sectors, Forensic Shield Active
- Directory empty state: sector-specific message vs search message
- Categories: add Prototypes (5 total)

### Remove
- Hardcoded marketing numbers from STATS

## Implementation Plan
1. Update main.mo with contactLinks map and unlockContact function
2. Update backend.d.ts and declarations
3. Update useQueries.ts hooks
4. Update Landing.tsx stats
5. Update Submit.tsx with contactLink field
6. Update Directory.tsx empty state and categories
7. Update ProjectCard.tsx with Unlock Contact button
