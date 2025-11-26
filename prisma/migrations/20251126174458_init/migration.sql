-- CreateTable
CREATE TABLE "AnatomyNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT,
    "roleSummary" TEXT,
    "primaryFunctions" JSONB,
    "aestheticNotes" JSONB,
    "meta" JSONB,
    CONSTRAINT "AnatomyNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AnatomyNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "primaryRegionId" TEXT,
    CONSTRAINT "Guide_primaryRegionId_fkey" FOREIGN KEY ("primaryRegionId") REFERENCES "AnatomyNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Section_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectionAnatomy" (
    "sectionId" TEXT NOT NULL,
    "anatomyNodeId" TEXT NOT NULL,

    PRIMARY KEY ("sectionId", "anatomyNodeId"),
    CONSTRAINT "SectionAnatomy_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionAnatomy_anatomyNodeId_fkey" FOREIGN KEY ("anatomyNodeId") REFERENCES "AnatomyNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectionExercise" (
    "sectionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    PRIMARY KEY ("sectionId", "exerciseId"),
    CONSTRAINT "SectionExercise_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "movementPattern" TEXT NOT NULL,
    "equipment" JSONB,
    "videoUrl" TEXT,
    "cueSummary" TEXT
);

-- CreateTable
CREATE TABLE "ExerciseAnatomy" (
    "exerciseId" TEXT NOT NULL,
    "anatomyNodeId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("exerciseId", "anatomyNodeId", "role"),
    CONSTRAINT "ExerciseAnatomy_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExerciseAnatomy_anatomyNodeId_fkey" FOREIGN KEY ("anatomyNodeId") REFERENCES "AnatomyNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Formula" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pattern" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FormulaStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "formulaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "FormulaStep_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "Formula" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormulaStep_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormulaTarget" (
    "formulaId" TEXT NOT NULL,
    "anatomyNodeId" TEXT NOT NULL,

    PRIMARY KEY ("formulaId", "anatomyNodeId"),
    CONSTRAINT "FormulaTarget_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "Formula" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormulaTarget_anatomyNodeId_fkey" FOREIGN KEY ("anatomyNodeId") REFERENCES "AnatomyNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "priorityRules" TEXT,
    "primaryRegionId" TEXT,
    CONSTRAINT "Workout_primaryRegionId_fkey" FOREIGN KEY ("primaryRegionId") REFERENCES "AnatomyNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "schemeStyle" TEXT NOT NULL,
    "schemeDesc" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "WorkoutBlock_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutBlockTarget" (
    "blockId" TEXT NOT NULL,
    "anatomyNodeId" TEXT NOT NULL,

    PRIMARY KEY ("blockId", "anatomyNodeId"),
    CONSTRAINT "WorkoutBlockTarget_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "WorkoutBlock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkoutBlockTarget_anatomyNodeId_fkey" FOREIGN KEY ("anatomyNodeId") REFERENCES "AnatomyNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutBlockExercise" (
    "blockId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,

    PRIMARY KEY ("blockId", "exerciseId"),
    CONSTRAINT "WorkoutBlockExercise_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "WorkoutBlock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkoutBlockExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AnatomyNode_slug_key" ON "AnatomyNode"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_slug_key" ON "Workout"("slug");
