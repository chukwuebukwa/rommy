# Rommy's Workout Guide Browser

A Next.js app for browsing Uncle Rommy's workout guides, anatomy, exercises, formulas, and workout programs.

## Features

- 🦾 **Anatomy Browser**: Navigate through hierarchical body regions → muscle groups → muscles → muscle parts
- 📖 **Training Guides**: Read complete guides with sections on mindset, anatomy, and programming
- 🏋️ **Exercise Library**: Browse all exercises with videos, form cues, and muscle targets
- 🧪 **Formula Browser**: Explore exercise supersets and combinations
- 📋 **Workout Programs**: View complete workout routines with rep schemes and exercise blocks
- 🔗 **Relationship Navigation**: Every entity links to related entities (exercises ↔ muscles, formulas ↔ exercises, etc.)

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM** with SQLite database
- **React 19**

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- The database is already seeded with arm workout data in `prisma/dev.db`

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Database Commands

```bash
# View database in Prisma Studio
npm run studio

# Re-seed the database
npm run db:seed

# Reset and re-seed database
npm run db:reset

# Create a new migration
npm run db:migrate
```

## Project Structure

```
/Users/jimmyjiggler/Documents/rommy/ts/
├── app/
│   ├── anatomy/          # Anatomy browser and detail pages
│   ├── exercises/        # Exercise library and detail pages
│   ├── formulas/         # Formula browser and detail pages
│   ├── guides/           # Training guide browser and reader
│   ├── workouts/         # Workout program browser
│   ├── layout.tsx        # Root layout with navigation
│   ├── page.tsx          # Homepage
│   └── globals.css       # Tailwind styles
├── lib/
│   └── prisma.ts         # Prisma client singleton
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── dev.db            # SQLite database
│   └── seed/
│       └── seed-arms.ts  # Seed data for arms guide
└── package.json
```

## Navigation

The app has a browser-style interface:

1. **Main Navigation**: Top bar with links to all entity types
2. **List Pages**: Browse all entities of a type (e.g., all exercises)
3. **Detail Pages**: View individual entities with all their relationships
4. **Cross-linking**: Click any linked entity to navigate to its detail page

## Example Workflows

### Explore a Muscle
1. Go to **Anatomy** → Find "Biceps Long Head"
2. See primary exercises (e.g., Incline Dumbbell Curls)
3. Click an exercise to see form cues and video
4. View which formulas use that exercise
5. See which workout blocks include it

### Read a Training Guide
1. Go to **Guides** → "Conceal & Carry Pythons"
2. Browse sections with table of contents
3. Click linked muscles to learn anatomy details
4. Click linked exercises to see demonstrations

### Build a Workout
1. Go to **Workouts** → "The Sniper's Arm Day"
2. See exercise options for each block
3. Click exercises to learn proper form
4. View target muscles for each movement

## Database Schema

The database uses a hierarchical anatomy graph:
- **AnatomyNode**: Regions → Groups → Muscles → Parts
- **Exercise**: Movements with equipment, videos, form cues
- **Formula**: Exercise combinations (supersets, straight sets)
- **Workout**: Complete programs with blocks
- **Guide**: Training guides with sections
- **Linking Tables**: Connect entities (e.g., Exercise ↔ Anatomy)

## Future Enhancements

- [ ] Search functionality
- [ ] User workout logs
- [ ] Progress tracking
- [ ] Exercise substitution suggestions
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle
- [ ] Export workout plans to PDF
- [ ] Add more body regions (back, chest, legs, shoulders)

## License

For Uncle Rommy's Natural Crusaders 💪

