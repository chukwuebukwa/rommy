# Anatomy Graph Analysis Report

Generated: 2026-01-16

## Overview

| Metric | Value |
|--------|-------|
| Total anatomy nodes | 73 |
| Root regions | 5 |
| Max tree depth | 3 |
| Total exercises | 230 |
| Exercises without anatomy links | 0 |

## Regions

- Arms
- Back
- Chest
- Legs
- Shoulders (Deltoid & Cuff Complex)

## Issues

### Leaf Nodes Without Exercises

These nodes have no exercises linked and no children:

| Node | Kind | Action Needed |
|------|------|---------------|
| Supraspinatus | muscle | Add exercise links (external rotation, face pulls) |
| Achilles Tendon | tendon | OK - connective tissue, not directly trained |
| Upper Back & Scapular | group | Remove or add children/exercises |

### Broken References

None found. All parent references are valid.

## Cross-Region Connections

### Region Overlap Summary

| Regions | Connections |
|---------|-------------|
| Back ↔ Shoulders | 90 |
| Back ↔ Legs | 46 |
| Arms ↔ Chest | 37 |
| Arms ↔ Shoulders | 23 |
| Chest ↔ Shoulders | 21 |
| Back ↔ Chest | 2 |

### Top Bridge Muscles

Muscles that connect multiple body regions through shared exercises:

| Muscle | Home Region | Bridges To | Connections |
|--------|-------------|------------|-------------|
| Front Delts | Shoulders | Chest, Back, Arms | 53 |
| Triceps Brachii | Arms | Chest, Shoulders | 44 |
| Rear Delts | Shoulders | Back | 40 |
| Erector Spinae | Back | Legs, Shoulders | 38 |
| Mid Chest | Chest | Shoulders, Back, Arms | 29 |
| Trapezius | Back | Shoulders | 29 |
| Upper Chest | Chest | Shoulders, Arms | 18 |
| Middle Traps | Back | Shoulders | 17 |
| Side Delts | Shoulders | Back | 17 |

### Top Muscle Relationships

Muscles that frequently work together across different regions:

| Count | Muscle A | Muscle B |
|-------|----------|----------|
| 19 | Front Delts (Shoulders) | Triceps (Arms) |
| 16 | Middle Traps (Back) | Rear Delts (Shoulders) |
| 11 | Glutes (Legs) | Erector Spinae (Back) |
| 10 | Rear Delts (Shoulders) | Rhomboids (Back) |
| 10 | Traps (Back) | Side Delts (Shoulders) |
| 9 | Mid Chest | Triceps (Arms) |
| 9 | Upper Chest | Triceps (Arms) |
| 8 | Mid Chest | Front Delts (Shoulders) |
| 8 | Hamstrings (Legs) | Erector Spinae (Back) |

## Functional Clusters

Based on exercise overlap analysis:

### 1. Push Cluster
- **Muscles:** Chest + Front Delts + Triceps
- **Pattern:** Fire together on pressing movements
- **Cross-region connections:** 58+

### 2. Pull/Upper Back Cluster
- **Muscles:** Lats + Traps + Rhomboids + Rear Delts + Rotator Cuff
- **Pattern:** Back and Shoulders heavily intertwined
- **Cross-region connections:** 90

### 3. Posterior Chain Cluster
- **Muscles:** Glutes + Hamstrings + Erector Spinae
- **Pattern:** Connect through hip hinge movements
- **Cross-region connections:** 46

### 4. Isolated Groups
- **Biceps:** Works within Arms region only
- **Calves:** Minimal cross-region activation
- **Quads:** Some erector connection via squats

## Tree Structure

| Depth | Node Count | Examples |
|-------|------------|----------|
| 0 | 5 | Root regions |
| 1 | 23 | Major muscle groups |
| 2 | 37 | Specific muscles |
| 3 | 8 | Muscle heads/parts |

## Recommendations

1. **Add Supraspinatus exercises** - It's part of the rotator cuff and should have external rotation exercises linked

2. **Review Upper Back & Scapular** - This grouping node has no children or exercises. Either populate it or remove it

3. **Consider splitting Shoulders** - The 90 connections to Back suggest Shoulders might benefit from being split into:
   - Anterior (push-related, connects to Chest)
   - Posterior (pull-related, connects to Back)

4. **Data is healthy** - No orphans, no circular refs, all exercises have anatomy links
