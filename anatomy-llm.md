# ANATOMY GRAPH FOR LLM

## Format: Compact hierarchical with exercise mappings

## ANATOMY TREE

```
R: Arms
  G: Biceps
    M: Biceps Brachii [9 ex]
      P: Biceps Long Head [9 ex]
      P: Biceps Short Head [10 ex]
    M: Brachialis [27 ex]
  G: Forearms
    M: Brachioradialis [21 ex]
  G: Triceps
    M: Triceps Brachii [22 ex]
      P: Triceps Lateral Head [11 ex]
      P: Triceps Long Head [22 ex]
      P: Triceps Medial Head [19 ex]

R: Back
  G: Erector Spinae
    M: Erector Spinae (Spinal Erectors) [27 ex]
  G: Lats & Lat Complex [1 ex]
    M: Latissimus Dorsi (Lats) [28 ex]
    M: Teres Major [13 ex]
  G: Rhomboid Complex
    M: Rhomboids (Major & Minor) [29 ex]
  G: Scapular Control Complex [2 ex]
  G: Trapezius Group
    M: Trapezius (Traps) [15 ex]
      P: Lower Traps [11 ex]
      P: Middle Traps [22 ex]
      P: Upper Traps [11 ex]
  G: Upper Back & Scapular

R: Chest
  M: Pectoralis Major
    P: Lower Chest (Abdominal Head) [9 ex]
    P: Mid Chest (Sternocostal Head) [18 ex]
    P: Upper Chest (Clavicular Head) [11 ex]
  M: Pectoralis Minor [1 ex]

R: Legs
  G: Anterior Shin
    M: Tibialis Anterior [2 ex]
  G: Calves & Achilles Complex [5 ex]
    T: Achilles Tendon
    M: Gastrocnemius [1 ex]
    M: Soleus [1 ex]
  G: Glute Complex [2 ex]
    M: Gluteus Maximus [23 ex]
    M: Gluteus Medius [6 ex]
    M: Gluteus Minimus [4 ex]
  G: Hamstring Complex [22 ex]
    M: Biceps Femoris (Long Head) [2 ex]
    M: Biceps Femoris (Short Head) [1 ex]
    M: Semimembranosus [4 ex]
    M: Semitendinosus [3 ex]
  G: Hip Abductors & TFL [3 ex]
    M: Tensor Fasciae Latae (TFL) [3 ex]
  G: Hip Adductors & Groin
    M: Adductor Complex [7 ex]
    M: Gracilis [1 ex]
  G: Hip Flexors (Psoas & Iliacus) [3 ex]
    M: Iliacus [2 ex]
    M: Psoas [1 ex]
  G: Quadriceps [16 ex]
    M: Rectus Femoris [4 ex]
    M: Vastus Intermedius [3 ex]
    M: Vastus Lateralis [2 ex]
    M: Vastus Medialis [2 ex]
    P: Vastus Medialis Oblique (VMO) [5 ex]

R: Shoulders (Deltoid & Cuff Complex)
  M: Front Delts (Anterior Deltoid) [38 ex]
  M: Rear Delts (Posterior Deltoid) [28 ex]
  G: Rotator Cuff [16 ex]
    M: Infraspinatus [2 ex]
    M: Subscapularis [1 ex]
    M: Supraspinatus
    M: Teres Minor [7 ex]
  M: Side Delts (Lateral Deltoid) [21 ex]

```

## MUSCLE EXERCISES

Format: `muscle: primary=[ex1, ex2] secondary=[ex3]`

```
Adductor Complex (Legs): primary=[Cossack Dumbbell Squat, Wide Stance Box Squats, Sumo Deadlift, Copenhagen Planks, Hip Adduction Machine, Cossack Barbell Squats] secondary=[Deficit Deadlifts]
Biceps Brachii (Arms): primary=[Waiter Curls, Uncle Rommy Curls] secondary=[Double Hammer Curls, Single Arm Hammer Curls, Wide Dumbbell Curls, Wide Grip Barbell Curl, Double Hammer Curls, Waiter Curls, Wide Dumbbell Curls]
Biceps Femoris (Long Head) (Legs): primary=[Romanian Deadlift, Nordic Curls]
Biceps Femoris (Short Head) (Legs): primary=[Leg Curls]
Biceps Long Head (Arms): primary=[Drag Curls, Close Grip Bar Curl, Uncle Rommy Curls, Wide Dumbbell Curls, Barbell/EZ Bar Curl, Cable Curls, Incline Dumbbell Curls] secondary=[Preacher Bar Curls, Preacher Curl Machine]
Biceps Short Head (Arms): primary=[Preacher Bar Curls, Preacher Machine Hammer Curl, Wide Dumbbell Curls, Wide Grip Barbell Curl, Uncle Rommy Curls, Waiter Curls, Barbell/EZ Bar Curl, Cable Curls, Preacher Curl Machine] secondary=[Preacher Machine Hammer Curl]
Brachialis (Arms): primary=[Reverse Dumbbell Curls, Double Hammer Curls, Single Arm Hammer Curls, Preacher Machine Hammer Curl, Single Arm Brachialis Cable Curls, Reverse Barbell Curls, Reverse Plate Curls, Double Hammer Curls, Single Arm Brachialis Cable Curls, Double Arm Hammer Curls, Single Arm Hammer Curls, Reverse Barbell Curls, Reverse Barbell/EZ Bar Curls, Reverse Plate Curls] secondary=[Drag Curls, Close Grip Bar Curl, Waiter Curls, Uncle Rommy Curls, Dumbbell Forearm Circuit, Sledgehammer Forearm Sequence, Dead Hangs, Farmer Carries + Shrugs, Single Arm Farmer Carries, Uncle Rommy Curls, Barbell/EZ Bar Curl, Cable Curls, Incline Dumbbell Curls]
Brachioradialis (Arms): primary=[Reverse Dumbbell Curls, Double Hammer Curls, Single Arm Hammer Curls, Reverse Barbell Curls, Reverse Plate Curls, Dumbbell Forearm Circuit, Sledgehammer Forearm Sequence, Dead Hangs, Farmer Carries + Shrugs, Single Arm Farmer Carries, Reverse Barbell Curls, Reverse Barbell/EZ Bar Curls, Reverse Plate Curls, Dumbbell Forearm Circuit, Sledgehammer Forearm Sequence] secondary=[Preacher Machine Hammer Curl, Single Arm Brachialis Cable Curls, Double Hammer Curls, Single Arm Brachialis Cable Curls, Double Arm Hammer Curls, Single Arm Hammer Curls]
Erector Spinae (Spinal Erectors) (Back): primary=[Rack Pulls, Supermans, Back Bridges, Overhead Squat / Snatch Holds, Hyperextension Rows, Standing Good Mornings, Barbell Good Mornings, Cable Good Mornings, Deadlifts, Dumbbell Deadlifts, Weighted Plate Mobility, Reverse Hyperextensions, Seated Barbell Good Mornings, Seated Dumbbell Good Mornings] secondary=[T-Bar Rows, Dead Rows, Neutral Grip Hammer Strength Row, Front Squats, Zercher Squats, Sumo Deadlift, Romanian Deadlift, Zercher Deadlifts, Zercher RDLs, Deficit Deadlifts, Weighted Pull Ups, Reverse Hyperextensions, Neutral Grip Barbell Rows]
Front Delts (Anterior Deltoid) (Shoulders (Deltoid & Cuff Complex)): primary=[Standing Barbell Press, Seated Dumbbell Press, Seated Barbell Press, Hammer Strength Shoulder Press, Arnold Press, Reverse Grip Barbell Press, Modified Bradford Press, Front Dumbbell Raises (Incline), Front Dumbbell Raises (Standing), Front Dumbbell Raises (Seated), Front Plate Raise, Front Dumbbell Raises to the Sky, Front Cable Raises, 21’s (Shoulder), Single Arm Dumbbell Press (Standing Overhead), Handstand Push-Ups, Double Trouble] secondary=[Upright Dips (Tricep Dips), Weighted Dips (Upright), Incline Dumbbell Press, Incline Barbell Press, Incline Press Hammer Strength, Feet Elevated Push-Ups, Feet Elevated Plate Push-Ups, Landmine Chest Press, Banded INCLINE Dumbbell Presses, Flat Dumbbell Press, Flat Barbell Bench, Flat Press Hammer Strength, Push-Ups, Flat Plate Push-Ups, Banded FLAT Dumbbell Presses, Chest Dips, Weighted Dips, Decline Dumbbell Press, The Double Dip, Single Arm Decline Cable Presses, Banded DECLINE Dumbbell Presses]
Gastrocnemius (Legs): primary=[Standing Calf Raises]
Gluteus Maximus (Legs): primary=[Wide Stance Box Squats, Zercher Squats, Sumo Deadlift, Barbell Hip Thrusts, Standing Good Mornings, Glute Bridge (Feet Elevated), Hyperextension Rows, Zercher Deadlifts, Zercher RDLs, Reverse Lunges, Barbell Split Squats, Bulgarian Split Squats, Single‑Leg DB RDLs, Pistol Squats, DB RDLs, Deficit Deadlifts, Full ROM Back Squats, Leg Press Machine, Reverse Hyperextensions] secondary=[Front Squats, Romanian Deadlift, Heel Elevated Squats, Seated Barbell Good Mornings]
Gluteus Medius (Legs): primary=[Sumo Deadlift, Side‑Lying Leg Lift] secondary=[Cossack Dumbbell Squat, Side-Lying Leg Raises, Single‑Leg DB RDLs, Cossack Barbell Squats]
Gluteus Minimus (Legs): primary=[Side‑Lying Leg Lift, Side-Lying Leg Raises] secondary=[Cossack Dumbbell Squat, Cossack Barbell Squats]
Gracilis (Legs): secondary=[Copenhagen Planks]
Iliacus (Legs): secondary=[Reverse Lunges, Reverse Squats]
Infraspinatus (Shoulders (Deltoid & Cuff Complex)): primary=[Cable Handle External Rotations, Dumbbell Shoulder External Rotations]
Latissimus Dorsi (Lats) (Back): primary=[Regular Pull Ups, Lat Pulldowns, T-Bar Rows, Supinated Barbell Rows, Supinated Dumbbell Rows, Neutral Grip Dumbbell Rows, Dead Hangs, Active Hangs, Dead Rows, Close Grip Pull-Ups, High to Low Cable Rows, Neutral Grip Hammer Strength Row, Single Arm Cable Row, Super Wide Pulldowns, Underhand Pulldown, Wide Grip Hammer Strength Row, Barbell/EZ Bar Pullovers, Weighted Pull Ups, Wide Grip Pull Ups, Wide Neutral Grip Pull Ups, Neutral Grip Barbell Rows, Lat Pull Ins, Neutral Grip Pulldown, Regular Lat Pulldowns] secondary=[Chest Supported Rows, Rack Pulls, Hyperextension Rows, High Elbow Hammer Strength Rows]
Lower Chest (Abdominal Head) (Chest): primary=[Chest Dips, Weighted Dips, Decline Dumbbell Press, The Double Dip, Decline Cable Crossovers, Dog Pounds, Single Arm Decline Cable Presses, Banded DECLINE Dumbbell Presses] secondary=[Push-Up Circuit]
Lower Traps (Back): primary=[Supermans, Y Raises, Active Hangs, PVC Pipe Shoulder Sequence, Wall Drags] secondary=[Seated Cable Rows, Turtle Raises, Chest Supported Rows, Face Pulls, Face Pulls (Back-Focused), T Raises]
Mid Chest (Sternocostal Head) (Chest): primary=[Flat Dumbbell Press, Flat Barbell Bench, Flat Press Hammer Strength, Flat Cable Flyes, Pec Dec Flyes, Push-Ups, Flat Plate Push-Ups, Floor Flyes, Floor Press, Reverse Grip Bench, Dumbbell Pullovers, Banded FLAT Dumbbell Presses, Push-Up Circuit] secondary=[Close Grip Bench Press, Upright Dips (Tricep Dips), JM Press, Dips, Weighted Dips (Upright)]
Middle Traps (Back): primary=[Seated Cable Rows, Chest Supported Rows, Reverse Incline Flyes, Upper Back Barbell Rows, Upper Back Dumbbell Rows, Standing Reverse Incline Flyes, Seated Reverse Incline Flyes, High Elbow Hammer Strength Rows, High Elbow Rows, Rope Attachment Upright Rows, T Raises, Upright Rows (Straight Bar/EZ Bar), Chest Supported Shrugs] secondary=[Triple Rear Delt Delight, Reverse Pec Dec Flyes, Supermans, Y Raises, T-Bar Rows, Face Pulls, Face Pulls (Back-Focused), Wide Grip Hammer Strength Row, High Elbow Cable Rows]
Pectoralis Minor (Chest): primary=[Dumbbell Pullovers]
Psoas (Legs): primary=[Reverse Squats]
Rear Delts (Posterior Deltoid) (Shoulders (Deltoid & Cuff Complex)): primary=[Triple Rear Delt Delight, Reverse Pec Dec Flyes, Y Raises, Reverse Incline Flyes, Standing Reverse Incline Flyes, Shoulder Elixir Potion, Face Pulls, Face Pulls (Back-Focused), Seated Reverse Incline Flyes, T Raises, Behind Neck Press, High Elbow Cable Rows, Hip Huggers, Behind the Ankle Barbell Raise, Behind the Arse Bar Raise, Inverted Raises, Powell Raises, LU Raises] secondary=[Turtle Raises, Upper Back Barbell Rows, Upper Back Dumbbell Rows, High Elbow Hammer Strength Rows, High Elbow Rows, Inverted Raises, Rope Attachment Upright Rows, Upright Rows (Straight Bar/EZ Bar), Behind Ass Lateral Raises, Behind the Arse Upright Rows (Straight Bar / EZ Bar)]
Rectus Femoris (Legs): primary=[Front Squats, Sissy Squats, Reverse Nordics] secondary=[Reverse Squats]
Rhomboids (Major & Minor) (Back): primary=[Seated Cable Rows, Turtle Raises, Chest Supported Rows, T-Bar Rows, Upper Back Barbell Rows, Upper Back Dumbbell Rows, Dead Rows, Face Pulls, Face Pulls (Back-Focused), Hyperextension Rows, High Elbow Hammer Strength Rows, High Elbow Rows, Neutral Grip Hammer Strength Row, Wide Grip Hammer Strength Row, High Elbow Cable Rows, Neutral Grip Barbell Rows] secondary=[Regular Pull Ups, Supinated Barbell Rows, Supinated Dumbbell Rows, Neutral Grip Dumbbell Rows, High to Low Cable Rows, Inverted Raises, Single Arm Cable Row, Super Wide Pulldowns, Underhand Pulldown, Hip Huggers, Weighted Pull Ups, Wide Grip Pull Ups, Wide Neutral Grip Pull Ups]
Semimembranosus (Legs): primary=[Romanian Deadlift, Glute Bridge (Feet Elevated), Nordic Curls, Seated Barbell Good Mornings]
Semitendinosus (Legs): primary=[Romanian Deadlift, Nordic Curls, Seated Barbell Good Mornings]
Side Delts (Lateral Deltoid) (Shoulders (Deltoid & Cuff Complex)): primary=[Standing Barbell Press, Seated Dumbbell Press, Seated Barbell Press, Hammer Strength Shoulder Press, Arnold Press, Modified Bradford Press, Behind Neck Press, Lateral Raises, Chest Supported Lateral Raises, Behind Ass Lateral Raises, Single Arm Incline Lateral Raise, Upright Rows (Straight Bar / EZ Bar), Behind the Arse Upright Rows (Straight Bar / EZ Bar), Behind the Arse Cable Upright Rows (Straight Bar Attachment), 21’s (Shoulder), Mid Delt Drop Set, Inverted Raises, Rope Attachment Upright Rows, Single Arm Dumbbell Press (Standing Overhead), Handstand Push-Ups, Double Trouble]
Soleus (Legs): primary=[Standing Calf Raises]
Subscapularis (Shoulders (Deltoid & Cuff Complex)): primary=[Cable Handle Internal Rotations]
Tensor Fasciae Latae (TFL) (Legs): primary=[Side-Lying Leg Raises] secondary=[Side‑Lying Leg Lift, Hip Abduction Machine]
Teres Major (Back): primary=[Supinated Barbell Rows, High to Low Cable Rows, Underhand Pulldown, Weighted Pull Ups, Wide Neutral Grip Pull Ups] secondary=[Regular Pull Ups, Lat Pulldowns, Supinated Dumbbell Rows, Close Grip Pull-Ups, Barbell/EZ Bar Pullovers, Wide Grip Pull Ups, Lat Pull Ins, Neutral Grip Pulldown]
Teres Minor (Shoulders (Deltoid & Cuff Complex)): primary=[Super Wide Pulldowns, Cable Handle External Rotations, Dumbbell Shoulder External Rotations] secondary=[Lat Pulldowns, Close Grip Pull-Ups, Neutral Grip Pulldown, Regular Lat Pulldowns]
Tibialis Anterior (Legs): primary=[Kettlebell Toe Raises, Backward Walking on the Treadmill]
Trapezius (Traps) (Back): primary=[Overhead Squat / Snatch Holds, Handstand Holds, Overhead Barbell Press Holds, Inverted Raises, Ring Around The Rommy’s] secondary=[Standing Barbell Press, Seated Dumbbell Press, Seated Barbell Press, Hammer Strength Shoulder Press, Arnold Press, Modified Bradford Press, Behind Neck Press, Behind the Ankle Barbell Raise, Single Arm Dumbbell Press (Standing Overhead), Handstand Push-Ups]
Triceps Brachii (Arms): secondary=[Incline Dumbbell Press, Incline Barbell Press, Incline Press Hammer Strength, Feet Elevated Push-Ups, Feet Elevated Plate Push-Ups, Landmine Chest Press, Banded INCLINE Dumbbell Presses, Flat Dumbbell Press, Flat Barbell Bench, Flat Press Hammer Strength, Push-Ups, Flat Plate Push-Ups, Floor Press, Reverse Grip Bench, Banded FLAT Dumbbell Presses, Push-Up Circuit, Chest Dips, Weighted Dips, Decline Dumbbell Press, The Double Dip, Single Arm Decline Cable Presses, Banded DECLINE Dumbbell Presses]
Triceps Lateral Head (Arms): primary=[Triangle Attachment Pushdowns, Upright Dips (Tricep Dips), Rope Attachment Tricep Superset, Criss Cross Cable Pushdowns, Dumbbell Kickbacks, Triangle Attachment Tricep Superset, Criss Cross Cable Pushdowns, Dips, Weighted Dips (Upright)] secondary=[Hammer Strength Tricep Extensions, Rope Attachment Tricep Superset]
Triceps Long Head (Arms): primary=[Close Grip Bench Press, Incline Close Grip Bench Press, Skull Crushers, Single Arm DB Extensions, Upright Dips (Tricep Dips), JM Press, Dumbbell JM Press, Dumbbell Tricep Lying Extensions, Dumbbell Tricep Lying Extensions with Twist, Single Arm Tricep Extensions (DB Overhead), Hammer Strength Tricep Extensions, Dumbbell Tricep Extensions, Incline Dumbbell Power Bombs, Single Arm DB Overhead Extensions, Dumbbell Tricep Lying Extensions, Dumbbell Tricep Lying Extensions (with Twist), Rope Attachment Tricep Superset, Incline Dumbbell Power Bombs, Hammer Strength Tricep Extensions, Dips, Weighted Dips (Upright)] secondary=[Dumbbell Kickbacks]
Triceps Medial Head (Arms): primary=[Close Grip Bench Press, Incline Close Grip Bench Press, Reverse Grip Pushdowns, JM Press, Dumbbell JM Press] secondary=[Skull Crushers, Triangle Attachment Pushdowns, Dumbbell Tricep Lying Extensions, Dumbbell Tricep Lying Extensions with Twist, Single Arm Tricep Extensions (DB Overhead), Rope Attachment Tricep Superset, Criss Cross Cable Pushdowns, Hammer Strength Tricep Extensions, Dumbbell Tricep Extensions, Incline Dumbbell Power Bombs, JM Press, Dumbbell JM Press, Triangle Attachment Tricep Superset, Hammer Strength Tricep Extensions]
Upper Chest (Clavicular Head) (Chest): primary=[Incline Dumbbell Press, Incline Barbell Press, Incline Press Hammer Strength, Cable Upper Chest Flyes, Feet Elevated Push-Ups, Feet Elevated Plate Push-Ups, Landmine Chest Press, Banded INCLINE Dumbbell Presses, Reverse Grip Bench] secondary=[Incline Close Grip Bench Press, Push-Up Circuit]
Upper Traps (Back): primary=[Neck Bridges, Rope Attachment Upright Rows, Upright Rows (Straight Bar/EZ Bar), Upright Rows (Straight Bar / EZ Bar), Behind the Arse Upright Rows (Straight Bar / EZ Bar), Behind the Arse Cable Upright Rows (Straight Bar Attachment), Chest Supported Shrugs] secondary=[Dead Hangs, Reverse Grip Barbell Press, Behind the Arse Bar Raise, Inverted Raises]
Vastus Intermedius (Legs): primary=[Sissy Squats, Reverse Nordics, Leg Extensions]
Vastus Lateralis (Legs): primary=[Cossack Dumbbell Squat, Cossack Barbell Squats]
Vastus Medialis (Legs): primary=[Heel Elevated Squats, Leg Extensions]
Vastus Medialis Oblique (VMO) (Legs): primary=[Front Squats, Heel Elevated Squats, Sissy Squats, Leg Extensions] secondary=[Reverse Nordics]
```

## EXERCISE TARGETS

Format: `exercise (type/pattern): primary=[m1, m2] secondary=[m3]`

```
21’s (Shoulder) (intensity_technique/raise): primary=[Side Delts (Lateral Deltoid), Front Delts (Anterior Deltoid)]
Active Hangs (isolation/hang): primary=[Latissimus Dorsi (Lats), Lower Traps] secondary=[Rotator Cuff]
Arnold Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps)]
Back Bridges (isolation/bridge): primary=[Erector Spinae (Spinal Erectors)]
Backward Walking on the Treadmill (mobility/walk): primary=[Calves & Achilles Complex, Quadriceps, Tibialis Anterior]
Banded DECLINE Dumbbell Presses (compound/press): primary=[Lower Chest (Abdominal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Banded FLAT Dumbbell Presses (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Banded INCLINE Dumbbell Presses (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Barbell Good Mornings (compound/hinge): primary=[Erector Spinae (Spinal Erectors)]
Barbell Hip Thrusts (compound/bridge): primary=[Gluteus Maximus] secondary=[Hamstring Complex]
Barbell Split Squats (compound/lunge): primary=[Quadriceps, Gluteus Maximus] secondary=[Hamstring Complex, Hip Abductors & TFL]
Barbell/EZ Bar Curl (compound/curl): primary=[Biceps Long Head, Biceps Short Head] secondary=[Brachialis]
Barbell/EZ Bar Pullovers (compound/pullover): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major]
Behind Ass Lateral Raises (isolation/raise): primary=[Side Delts (Lateral Deltoid)] secondary=[Rear Delts (Posterior Deltoid)]
Behind Neck Press (compound/overhead_press): primary=[Side Delts (Lateral Deltoid), Rear Delts (Posterior Deltoid)] secondary=[Trapezius (Traps)]
Behind the Ankle Barbell Raise (isolation/raise): primary=[Rear Delts (Posterior Deltoid)] secondary=[Trapezius (Traps)]
Behind the Arse Bar Raise (isolation/raise): primary=[Rear Delts (Posterior Deltoid)] secondary=[Upper Traps]
Behind the Arse Cable Upright Rows (Straight Bar Attachment) (compound/upright_row): primary=[Side Delts (Lateral Deltoid), Upper Traps]
Behind the Arse Upright Rows (Straight Bar / EZ Bar) (compound/upright_row): primary=[Side Delts (Lateral Deltoid), Upper Traps] secondary=[Rear Delts (Posterior Deltoid)]
Bulgarian Split Squats (compound/lunge): primary=[Quadriceps, Gluteus Maximus] secondary=[Hamstring Complex]
Cable Curls (isolation/curl): primary=[Biceps Long Head, Biceps Short Head] secondary=[Brachialis]
Cable Good Mornings (compound/hinge): primary=[Erector Spinae (Spinal Erectors)]
Cable Hamstring Curls (isolation/curl): primary=[Hamstring Complex]
Cable Handle External Rotations (isolation/rotation): primary=[Infraspinatus, Teres Minor]
Cable Handle Internal Rotations (isolation/rotation): primary=[Subscapularis]
Cable Upper Chest Flyes (isolation/fly): primary=[Upper Chest (Clavicular Head)]
Chest Dips (compound/dip): primary=[Lower Chest (Abdominal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Chest Supported Lateral Raises (isolation/raise): primary=[Side Delts (Lateral Deltoid)]
Chest Supported Rows (compound/row): primary=[Rhomboids (Major & Minor), Middle Traps] secondary=[Lower Traps, Latissimus Dorsi (Lats)]
Chest Supported Shrugs (isolation/shrug): primary=[Middle Traps, Upper Traps]
Close Grip Bar Curl (compound/curl): primary=[Biceps Long Head] secondary=[Brachialis]
Close Grip Bench Press (compound/press): primary=[Triceps Long Head, Triceps Medial Head] secondary=[Mid Chest (Sternocostal Head)]
Close Grip Pull-Ups (compound/pull_up): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major, Teres Minor]
Copenhagen Planks (mobility/hold): primary=[Adductor Complex] secondary=[Gracilis]
Cossack Barbell Squats (mobility/squat): primary=[Adductor Complex, Quadriceps, Vastus Lateralis] secondary=[Gluteus Medius, Gluteus Minimus]
Cossack Dumbbell Squat (mobility/squat): primary=[Vastus Lateralis, Adductor Complex] secondary=[Gluteus Medius, Gluteus Minimus]
Criss Cross Cable Pushdowns (isolation/extension): primary=[Triceps Lateral Head] secondary=[Triceps Medial Head]
Criss Cross Cable Pushdowns (isolation/extension): primary=[Triceps Lateral Head]
DB RDLs (compound/hinge): primary=[Gluteus Maximus, Hamstring Complex]
Dead Hangs (compound/hang): primary=[Brachioradialis] secondary=[Brachialis]
Dead Hangs (isolation/hang): primary=[Latissimus Dorsi (Lats)] secondary=[Rotator Cuff, Upper Traps]
Dead Rows (compound/row): primary=[Latissimus Dorsi (Lats), Rhomboids (Major & Minor)] secondary=[Erector Spinae (Spinal Erectors)]
Deadlifts (compound/hinge): primary=[Erector Spinae (Spinal Erectors)]
Decline Cable Crossovers (isolation/fly): primary=[Lower Chest (Abdominal Head)]
Decline Dumbbell Press (compound/press): primary=[Lower Chest (Abdominal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Deficit Deadlifts (compound/hinge): primary=[Gluteus Maximus, Hamstring Complex] secondary=[Adductor Complex, Erector Spinae (Spinal Erectors)]
Dips (compound/dip): primary=[Triceps Lateral Head, Triceps Long Head] secondary=[Mid Chest (Sternocostal Head)]
Dog Pounds (isolation/fly): primary=[Lower Chest (Abdominal Head)]
Double Arm Hammer Curls (isolation/curl): primary=[Brachialis] secondary=[Brachioradialis]
Double Hammer Curls (compound/curl): primary=[Brachialis, Brachioradialis] secondary=[Biceps Brachii]
Double Hammer Curls (isolation/curl): primary=[Brachialis] secondary=[Brachioradialis, Biceps Brachii]
Double Trouble (intensity_technique/raise): primary=[Side Delts (Lateral Deltoid), Front Delts (Anterior Deltoid)]
Drag Curls (compound/curl): primary=[Biceps Long Head] secondary=[Brachialis]
Dumbbell Deadlifts (compound/hinge): primary=[Erector Spinae (Spinal Erectors)]
Dumbbell Forearm Circuit (isolation/forearm_circuit): primary=[Brachioradialis]
Dumbbell Forearm Circuit (compound/forearm_circuit): primary=[Brachioradialis] secondary=[Brachialis]
Dumbbell JM Press (compound/extension): primary=[Triceps Long Head, Triceps Medial Head] secondary=[Triceps Medial Head]
Dumbbell Kickbacks (isolation/extension): primary=[Triceps Lateral Head] secondary=[Triceps Long Head]
Dumbbell Pullovers (compound/pullover): primary=[Pectoralis Minor, Mid Chest (Sternocostal Head)] secondary=[Lats & Lat Complex]
Dumbbell Shoulder External Rotations (isolation/rotation): primary=[Infraspinatus, Teres Minor] secondary=[Rotator Cuff]
Dumbbell Tricep Extensions (isolation/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Dumbbell Tricep Lying Extensions (isolation/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Dumbbell Tricep Lying Extensions (isolation/extension): primary=[Triceps Long Head]
Dumbbell Tricep Lying Extensions (with Twist) (isolation/extension): primary=[Triceps Long Head]
Dumbbell Tricep Lying Extensions with Twist (isolation/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Face Pulls (isolation/row): primary=[Rear Delts (Posterior Deltoid), Rhomboids (Major & Minor)] secondary=[Lower Traps, Middle Traps]
Face Pulls (Back-Focused) (isolation/row): primary=[Rear Delts (Posterior Deltoid), Rhomboids (Major & Minor)] secondary=[Lower Traps, Middle Traps]
Farmer Carries + Shrugs (compound/carry): primary=[Brachioradialis] secondary=[Brachialis]
Feet Elevated Plate Push-Ups (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Feet Elevated Push-Ups (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Flat Barbell Bench (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Flat Cable Flyes (isolation/fly): primary=[Mid Chest (Sternocostal Head)]
Flat Dumbbell Press (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Flat Plate Push-Ups (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Flat Press Hammer Strength (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Floor Flyes (isolation/fly): primary=[Mid Chest (Sternocostal Head)]
Floor Press (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Triceps Brachii]
Front Cable Raises (isolation/raise): primary=[Front Delts (Anterior Deltoid)]
Front Dumbbell Raises (Incline) (isolation/raise): primary=[Front Delts (Anterior Deltoid)]
Front Dumbbell Raises (Seated) (isolation/raise): primary=[Front Delts (Anterior Deltoid)]
Front Dumbbell Raises (Standing) (isolation/raise): primary=[Front Delts (Anterior Deltoid)]
Front Dumbbell Raises to the Sky (isolation/raise): primary=[Front Delts (Anterior Deltoid)]
Front Plate Raise (isolation/raise): primary=[Front Delts (Anterior Deltoid)]
Front Squats (compound/squat): primary=[Quadriceps, Vastus Medialis Oblique (VMO), Rectus Femoris] secondary=[Gluteus Maximus, Erector Spinae (Spinal Erectors)]
Full Body Mobility Movement (mobility/sequence): primary=[Scapular Control Complex, Quadriceps, Hamstring Complex, Hip Flexors (Psoas & Iliacus)] secondary=[Glute Complex, Calves & Achilles Complex]
Full ROM Back Squats (compound/squat): primary=[Gluteus Maximus, Quadriceps] secondary=[Calves & Achilles Complex, Hamstring Complex]
Glute Bridge (Feet Elevated) (compound/bridge): primary=[Semimembranosus, Gluteus Maximus] secondary=[Hamstring Complex]
Hammer Strength Shoulder Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps)]
Hammer Strength Tricep Extensions (isolation/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head, Triceps Lateral Head]
Hammer Strength Tricep Extensions (isolation/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Handstand Holds (isolation/hold): primary=[Rotator Cuff, Trapezius (Traps)]
Handstand Push-Ups (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps), Rotator Cuff]
Heel Elevated Squats (compound/squat): primary=[Vastus Medialis Oblique (VMO), Vastus Medialis, Quadriceps] secondary=[Gluteus Maximus]
High Elbow Cable Rows (compound/row): primary=[Rear Delts (Posterior Deltoid), Rhomboids (Major & Minor)] secondary=[Middle Traps]
High Elbow Hammer Strength Rows (compound/row): primary=[Rhomboids (Major & Minor), Middle Traps] secondary=[Rear Delts (Posterior Deltoid), Latissimus Dorsi (Lats)]
High Elbow Rows (compound/row): primary=[Rhomboids (Major & Minor), Middle Traps] secondary=[Rear Delts (Posterior Deltoid)]
High to Low Cable Rows (compound/row): primary=[Latissimus Dorsi (Lats), Teres Major] secondary=[Rhomboids (Major & Minor)]
Hindu Squats (compound/squat): primary=[Calves & Achilles Complex, Quadriceps]
Hip Abduction Machine (isolation/hold): primary=[Hip Abductors & TFL] secondary=[Tensor Fasciae Latae (TFL)]
Hip Adduction Machine (isolation/hold): primary=[Adductor Complex]
Hip Huggers (compound/raise): primary=[Rear Delts (Posterior Deltoid)] secondary=[Rhomboids (Major & Minor)]
Hyperextension Rows (compound/hinge): primary=[Erector Spinae (Spinal Erectors), Rhomboids (Major & Minor), Gluteus Maximus] secondary=[Latissimus Dorsi (Lats), Hamstring Complex]
Incline Barbell Press (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Incline Close Grip Bench Press (compound/press): primary=[Triceps Long Head, Triceps Medial Head] secondary=[Upper Chest (Clavicular Head)]
Incline Dumbbell Curls (compound/curl): primary=[Biceps Long Head] secondary=[Brachialis]
Incline Dumbbell Power Bombs (compound/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Incline Dumbbell Power Bombs (compound/extension): primary=[Triceps Long Head]
Incline Dumbbell Press (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Incline Press Hammer Strength (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Inverted Raises (isolation/raise): primary=[Trapezius (Traps), Side Delts (Lateral Deltoid), Rear Delts (Posterior Deltoid)] secondary=[Rhomboids (Major & Minor), Rear Delts (Posterior Deltoid), Upper Traps]
JM Press (compound/extension): primary=[Triceps Long Head, Triceps Medial Head] secondary=[Mid Chest (Sternocostal Head), Triceps Medial Head]
Kettlebell Toe Raises (isolation/raise): primary=[Tibialis Anterior]
Landmine Chest Press (compound/press): primary=[Upper Chest (Clavicular Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Lat Pull Ins (isolation/pull_down): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major]
Lat Pulldowns (compound/pull_down): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major, Teres Minor]
Lateral Raises (isolation/raise): primary=[Side Delts (Lateral Deltoid)]
Leg Curls (isolation/curl): primary=[Biceps Femoris (Short Head), Hamstring Complex]
Leg Extensions (isolation/extension): primary=[Vastus Intermedius, Vastus Medialis, Vastus Medialis Oblique (VMO)]
Leg Press Machine (compound/squat): primary=[Gluteus Maximus, Quadriceps] secondary=[Hamstring Complex]
LU Raises (isolation/raise): primary=[Rear Delts (Posterior Deltoid), Rotator Cuff]
Mid Delt Drop Set (intensity_technique/raise): primary=[Side Delts (Lateral Deltoid)]
Mobility Wall Routine (mobility/sequence): primary=[Scapular Control Complex, Rotator Cuff]
Modified Bradford Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps)]
Neck Bridges (isolation/bridge): primary=[Upper Traps]
Neutral Grip Barbell Rows (compound/row): primary=[Latissimus Dorsi (Lats), Rhomboids (Major & Minor)] secondary=[Erector Spinae (Spinal Erectors)]
Neutral Grip Dumbbell Rows (compound/row): primary=[Latissimus Dorsi (Lats)] secondary=[Rhomboids (Major & Minor)]
Neutral Grip Hammer Strength Row (compound/row): primary=[Latissimus Dorsi (Lats), Rhomboids (Major & Minor)] secondary=[Erector Spinae (Spinal Erectors)]
Neutral Grip Pulldown (compound/pull_down): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major, Teres Minor]
Nordic Curls (isolation/hinge): primary=[Biceps Femoris (Long Head), Semitendinosus, Semimembranosus]
Overhead Barbell Press Holds (isolation/press_hold): primary=[Rotator Cuff, Trapezius (Traps)]
Overhead Squat / Snatch Holds (compound/squat_hold): primary=[Trapezius (Traps), Erector Spinae (Spinal Erectors)] secondary=[Rotator Cuff]
Pec Dec Flyes (isolation/fly): primary=[Mid Chest (Sternocostal Head)]
Pistol Squats (compound/squat): primary=[Quadriceps, Gluteus Maximus] secondary=[Hamstring Complex, Hip Abductors & TFL]
Powell Raises (isolation/raise): primary=[Rear Delts (Posterior Deltoid), Rotator Cuff]
Preacher Bar Curls (isolation/curl): primary=[Biceps Short Head] secondary=[Biceps Long Head]
Preacher Curl Machine (isolation/curl): primary=[Biceps Short Head] secondary=[Biceps Long Head]
Preacher Machine Hammer Curl (isolation/curl): primary=[Brachialis, Biceps Short Head] secondary=[Brachioradialis, Biceps Short Head]
Push-Up Circuit (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Lower Chest (Abdominal Head), Triceps Brachii, Upper Chest (Clavicular Head)]
Push-Ups (compound/press): primary=[Mid Chest (Sternocostal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
PVC Pipe Shoulder Sequence (mobility/car): primary=[Lower Traps, Rotator Cuff]
Rack Pulls (compound/hinge): primary=[Erector Spinae (Spinal Erectors)] secondary=[Latissimus Dorsi (Lats)]
Regular Lat Pulldowns (compound/pull_down): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Minor]
Regular Pull Ups (compound/pull_up): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major, Rhomboids (Major & Minor)]
Reverse Barbell Curls (compound/curl): primary=[Brachialis, Brachioradialis]
Reverse Barbell Curls (isolation/curl): primary=[Brachialis, Brachioradialis]
Reverse Barbell/EZ Bar Curls (isolation/curl): primary=[Brachialis, Brachioradialis]
Reverse Dumbbell Curls (isolation/curl): primary=[Brachialis, Brachioradialis]
Reverse Grip Barbell Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid)] secondary=[Upper Traps]
Reverse Grip Bench (compound/press): primary=[Mid Chest (Sternocostal Head), Upper Chest (Clavicular Head)] secondary=[Triceps Brachii]
Reverse Grip Pushdowns (isolation/extension): primary=[Triceps Medial Head]
Reverse Hyperextensions (compound/hinge): primary=[Erector Spinae (Spinal Erectors), Gluteus Maximus, Hamstring Complex] secondary=[Erector Spinae (Spinal Erectors)]
Reverse Incline Flyes (isolation/fly): primary=[Middle Traps, Rear Delts (Posterior Deltoid)]
Reverse Lunges (compound/lunge): primary=[Gluteus Maximus, Quadriceps] secondary=[Hamstring Complex, Iliacus]
Reverse Nordics (mobility/squat): primary=[Rectus Femoris, Vastus Intermedius] secondary=[Vastus Medialis Oblique (VMO)]
Reverse Pec Dec Flyes (isolation/fly): primary=[Rear Delts (Posterior Deltoid)] secondary=[Middle Traps]
Reverse Plate Curls (isolation/curl): primary=[Brachialis, Brachioradialis]
Reverse Plate Curls (isolation/curl): primary=[Brachialis, Brachioradialis]
Reverse Squats (isolation/leg_raise): primary=[Psoas] secondary=[Iliacus, Rectus Femoris]
Ring Around The Rommy’s (mobility/circle): primary=[Rotator Cuff, Trapezius (Traps)]
Romanian Deadlift (compound/hinge): primary=[Biceps Femoris (Long Head), Semitendinosus, Semimembranosus] secondary=[Gluteus Maximus, Erector Spinae (Spinal Erectors)]
Rope Attachment Tricep Superset (isolation/extension): primary=[Triceps Lateral Head, Triceps Long Head] secondary=[Triceps Medial Head, Triceps Lateral Head]
Rope Attachment Upright Rows (isolation/shrug): primary=[Upper Traps, Middle Traps, Side Delts (Lateral Deltoid)] secondary=[Rear Delts (Posterior Deltoid)]
Seated Barbell Good Mornings (compound/hinge): primary=[Erector Spinae (Spinal Erectors), Semimembranosus, Semitendinosus] secondary=[Gluteus Maximus]
Seated Barbell Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps)]
Seated Cable Rows (compound/row): primary=[Rhomboids (Major & Minor), Middle Traps] secondary=[Lower Traps]
Seated Dumbbell Good Mornings (compound/hinge): primary=[Erector Spinae (Spinal Erectors)]
Seated Dumbbell Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps)]
Seated Reverse Incline Flyes (isolation/fly): primary=[Middle Traps, Rear Delts (Posterior Deltoid)]
Shoulder Elixir Potion (mobility/sequence): primary=[Rotator Cuff, Rear Delts (Posterior Deltoid)]
Side-Lying Leg Raises (isolation/leg_raise): primary=[Tensor Fasciae Latae (TFL), Gluteus Minimus] secondary=[Gluteus Medius]
Side‑Lying Leg Lift (isolation/leg_raise): primary=[Gluteus Minimus, Gluteus Medius] secondary=[Tensor Fasciae Latae (TFL)]
Single Arm Brachialis Cable Curls (isolation/curl): primary=[Brachialis] secondary=[Brachioradialis]
Single Arm Brachialis Cable Curls (isolation/curl): primary=[Brachialis] secondary=[Brachioradialis]
Single Arm Cable Row (compound/row): primary=[Latissimus Dorsi (Lats)] secondary=[Rhomboids (Major & Minor)]
Single Arm DB Extensions (isolation/extension): primary=[Triceps Long Head]
Single Arm DB Overhead Extensions (isolation/extension): primary=[Triceps Long Head]
Single Arm Decline Cable Presses (compound/press): primary=[Lower Chest (Abdominal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Single Arm Dumbbell Press (Standing Overhead) (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps), Rotator Cuff]
Single Arm Farmer Carries (compound/carry): primary=[Brachioradialis] secondary=[Brachialis]
Single Arm Hammer Curls (isolation/curl): primary=[Brachialis, Brachioradialis] secondary=[Biceps Brachii]
Single Arm Hammer Curls (isolation/curl): primary=[Brachialis] secondary=[Brachioradialis]
Single Arm Incline Lateral Raise (isolation/raise): primary=[Side Delts (Lateral Deltoid)]
Single Arm Tricep Extensions (DB Overhead) (isolation/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Single‑Leg DB RDLs (compound/hinge): primary=[Hamstring Complex, Gluteus Maximus] secondary=[Gluteus Medius]
Sissy Squats (isolation/squat): primary=[Rectus Femoris, Vastus Intermedius, Vastus Medialis Oblique (VMO)]
Skull Crushers (compound/extension): primary=[Triceps Long Head] secondary=[Triceps Medial Head]
Sledgehammer Forearm Sequence (compound/forearm_circuit): primary=[Brachioradialis] secondary=[Brachialis]
Sledgehammer Forearm Sequence (isolation/forearm_circuit): primary=[Brachioradialis]
Standing Barbell Press (compound/overhead_press): primary=[Front Delts (Anterior Deltoid), Side Delts (Lateral Deltoid)] secondary=[Trapezius (Traps), Rotator Cuff]
Standing Calf Raises (isolation/raise): primary=[Gastrocnemius, Soleus]
Standing Good Mornings (compound/hinge): primary=[Erector Spinae (Spinal Erectors), Hamstring Complex, Gluteus Maximus]
Standing Reverse Incline Flyes (isolation/fly): primary=[Middle Traps, Rear Delts (Posterior Deltoid)]
Sumo Deadlift (compound/hinge): primary=[Gluteus Maximus, Gluteus Medius, Adductor Complex] secondary=[Hamstring Complex, Erector Spinae (Spinal Erectors)]
Super Wide Pulldowns (compound/pull_down): primary=[Latissimus Dorsi (Lats), Teres Minor] secondary=[Rhomboids (Major & Minor)]
Supermans (isolation/extension): primary=[Lower Traps, Erector Spinae (Spinal Erectors)] secondary=[Middle Traps]
Supinated Barbell Rows (compound/row): primary=[Latissimus Dorsi (Lats), Teres Major] secondary=[Rhomboids (Major & Minor)]
Supinated Dumbbell Rows (compound/row): primary=[Latissimus Dorsi (Lats)] secondary=[Teres Major, Rhomboids (Major & Minor)]
T Raises (isolation/raise): primary=[Middle Traps, Rear Delts (Posterior Deltoid)] secondary=[Lower Traps]
T-Bar Rows (compound/row): primary=[Rhomboids (Major & Minor), Latissimus Dorsi (Lats)] secondary=[Erector Spinae (Spinal Erectors), Middle Traps]
The Double Dip (compound/dip): primary=[Lower Chest (Abdominal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Triangle Attachment Pushdowns (isolation/extension): primary=[Triceps Lateral Head] secondary=[Triceps Medial Head]
Triangle Attachment Tricep Superset (isolation/extension): primary=[Triceps Lateral Head] secondary=[Triceps Medial Head]
Triple Rear Delt Delight (isolation/raise): primary=[Rear Delts (Posterior Deltoid)] secondary=[Middle Traps]
Turtle Raises (isolation/raise): primary=[Rhomboids (Major & Minor)] secondary=[Lower Traps, Rear Delts (Posterior Deltoid)]
Uncle Rommy Curls (isolation/curl): primary=[Biceps Long Head, Biceps Short Head] secondary=[Brachialis]
Uncle Rommy Curls (isolation/curl): primary=[Biceps Brachii] secondary=[Brachialis]
Underhand Pulldown (compound/pull_down): primary=[Latissimus Dorsi (Lats), Teres Major] secondary=[Rhomboids (Major & Minor)]
Upper Back Barbell Rows (compound/row): primary=[Rhomboids (Major & Minor), Middle Traps] secondary=[Rear Delts (Posterior Deltoid)]
Upper Back Dumbbell Rows (compound/row): primary=[Rhomboids (Major & Minor), Middle Traps] secondary=[Rear Delts (Posterior Deltoid)]
Upright Dips (Tricep Dips) (compound/dip): primary=[Triceps Long Head, Triceps Lateral Head] secondary=[Mid Chest (Sternocostal Head), Front Delts (Anterior Deltoid)]
Upright Rows (Straight Bar / EZ Bar) (compound/upright_row): primary=[Side Delts (Lateral Deltoid), Upper Traps]
Upright Rows (Straight Bar/EZ Bar) (isolation/shrug): primary=[Upper Traps, Middle Traps] secondary=[Rear Delts (Posterior Deltoid)]
Waiter Curls (isolation/curl): primary=[Biceps Brachii] secondary=[Brachialis]
Waiter Curls (isolation/curl): primary=[Biceps Short Head] secondary=[Biceps Brachii]
Wall Drags (mobility/wall_slide): primary=[Lower Traps, Rotator Cuff]
Weighted Dips (compound/dip): primary=[Lower Chest (Abdominal Head)] secondary=[Front Delts (Anterior Deltoid), Triceps Brachii]
Weighted Dips (Upright) (compound/dip): primary=[Triceps Lateral Head, Triceps Long Head] secondary=[Front Delts (Anterior Deltoid), Mid Chest (Sternocostal Head)]
Weighted Plate Mobility (mobility/sequence): primary=[Erector Spinae (Spinal Erectors), Glute Complex, Hip Flexors (Psoas & Iliacus), Quadriceps] secondary=[Calves & Achilles Complex, Hamstring Complex]
Weighted Pull Ups (compound/pull_up): primary=[Latissimus Dorsi (Lats), Teres Major] secondary=[Erector Spinae (Spinal Erectors), Rhomboids (Major & Minor)]
Wide Dumbbell Curls (isolation/curl): primary=[Biceps Short Head] secondary=[Biceps Brachii]
Wide Dumbbell Curls (isolation/curl): primary=[Biceps Long Head] secondary=[Biceps Brachii]
Wide Grip Barbell Curl (compound/curl): primary=[Biceps Short Head] secondary=[Biceps Brachii]
Wide Grip Hammer Strength Row (compound/row): primary=[Rhomboids (Major & Minor), Latissimus Dorsi (Lats)] secondary=[Middle Traps]
Wide Grip Pull Ups (compound/pull_up): primary=[Latissimus Dorsi (Lats)] secondary=[Rhomboids (Major & Minor), Teres Major]
Wide Neutral Grip Pull Ups (compound/pull_up): primary=[Latissimus Dorsi (Lats), Teres Major] secondary=[Rhomboids (Major & Minor)]
Wide Stance Box Squats (compound/squat): primary=[Gluteus Maximus, Hamstring Complex, Adductor Complex] secondary=[Quadriceps]
Y Raises (isolation/raise): primary=[Lower Traps, Rear Delts (Posterior Deltoid)] secondary=[Middle Traps]
Zercher Deadlifts (compound/hinge): primary=[Gluteus Maximus, Hamstring Complex, Quadriceps] secondary=[Erector Spinae (Spinal Erectors)]
Zercher RDLs (compound/hinge): primary=[Hamstring Complex, Gluteus Maximus] secondary=[Erector Spinae (Spinal Erectors)]
Zercher Squats (compound/squat): primary=[Quadriceps, Gluteus Maximus] secondary=[Erector Spinae (Spinal Erectors), Hip Flexors (Psoas & Iliacus)]
```

## CROSS-REGION LINKS

Muscles that share exercises across body regions:

```
19x: Triceps Brachii (Arms) <-> Front Delts (Anterior Deltoid) (Shoulders (Deltoid & Cuff Complex))
16x: Rear Delts (Posterior Deltoid) (Shoulders (Deltoid & Cuff Complex)) <-> Middle Traps (Back)
11x: Gluteus Maximus (Legs) <-> Erector Spinae (Spinal Erectors) (Back)
10x: Rhomboids (Major & Minor) (Back) <-> Rear Delts (Posterior Deltoid) (Shoulders (Deltoid & Cuff Complex))
10x: Trapezius (Traps) (Back) <-> Side Delts (Lateral Deltoid) (Shoulders (Deltoid & Cuff Complex))
9x: Upper Chest (Clavicular Head) (Chest) <-> Triceps Brachii (Arms)
9x: Triceps Brachii (Arms) <-> Mid Chest (Sternocostal Head) (Chest)
8x: Front Delts (Anterior Deltoid) (Shoulders (Deltoid & Cuff Complex)) <-> Mid Chest (Sternocostal Head) (Chest)
8x: Hamstring Complex (Legs) <-> Erector Spinae (Spinal Erectors) (Back)
8x: Trapezius (Traps) (Back) <-> Front Delts (Anterior Deltoid) (Shoulders (Deltoid & Cuff Complex))
7x: Trapezius (Traps) (Back) <-> Rotator Cuff (Shoulders (Deltoid & Cuff Complex))
7x: Upper Chest (Clavicular Head) (Chest) <-> Front Delts (Anterior Deltoid) (Shoulders (Deltoid & Cuff Complex))
7x: Triceps Brachii (Arms) <-> Lower Chest (Abdominal Head) (Chest)
6x: Front Delts (Anterior Deltoid) (Shoulders (Deltoid & Cuff Complex)) <-> Lower Chest (Abdominal Head) (Chest)
5x: Rear Delts (Posterior Deltoid) (Shoulders (Deltoid & Cuff Complex)) <-> Lower Traps (Back)
5x: Teres Minor (Shoulders (Deltoid & Cuff Complex)) <-> Latissimus Dorsi (Lats) (Back)
5x: Upper Traps (Back) <-> Rear Delts (Posterior Deltoid) (Shoulders (Deltoid & Cuff Complex))
5x: Upper Traps (Back) <-> Side Delts (Lateral Deltoid) (Shoulders (Deltoid & Cuff Complex))
5x: Triceps Long Head (Arms) <-> Mid Chest (Sternocostal Head) (Chest)
4x: Quadriceps (Legs) <-> Erector Spinae (Spinal Erectors) (Back)
3x: Rotator Cuff (Shoulders (Deltoid & Cuff Complex)) <-> Lower Traps (Back)
3x: Teres Minor (Shoulders (Deltoid & Cuff Complex)) <-> Teres Major (Back)
3x: Trapezius (Traps) (Back) <-> Rear Delts (Posterior Deltoid) (Shoulders (Deltoid & Cuff Complex))
3x: Triceps Medial Head (Arms) <-> Mid Chest (Sternocostal Head) (Chest)
3x: Triceps Lateral Head (Arms) <-> Mid Chest (Sternocostal Head) (Chest)
2x: Hip Flexors (Psoas & Iliacus) (Legs) <-> Erector Spinae (Spinal Erectors) (Back)
2x: Rotator Cuff (Shoulders (Deltoid & Cuff Complex)) <-> Latissimus Dorsi (Lats) (Back)
2x: Semimembranosus (Legs) <-> Erector Spinae (Spinal Erectors) (Back)
2x: Semitendinosus (Legs) <-> Erector Spinae (Spinal Erectors) (Back)
2x: Erector Spinae (Spinal Erectors) (Back) <-> Adductor Complex (Legs)
```

## ALIASES & SYNONYMS

```
biceps: bicep, guns, pythons, bis
triceps: tris, horseshoe
chest: pecs, pectorals
back: lats, upper back, lower back
shoulders: delts, deltoids, caps
legs: quads, hamstrings, glutes
abs: core, six pack, abdominals
front delts: anterior deltoid, front shoulder
rear delts: posterior deltoid, rear shoulder
side delts: lateral deltoid, medial delt
```

## STATS

- Regions: 5
- Total anatomy nodes: 73
- Exercises: 230
- Exercise-muscle links: 589
