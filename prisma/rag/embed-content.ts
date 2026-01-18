import { getWeaviateClient } from '../../lib/weaviate';
import { prisma } from '../../lib/prisma';

async function importAnatomy() {
  const client = getWeaviateClient();
  const nodes = await prisma.anatomyNode.findMany({
    include: { parent: true },
  });

  let batcher = client.batch.objectsBatcher();
  let count = 0;

  for (const node of nodes) {
    // Get region name - walk up the tree if needed
    let region = '';
    if (node.kind === 'region') {
      region = node.name;
    } else if (node.parent) {
      region = node.parent.kind === 'region' ? node.parent.name : node.parent.name;
    }

    const functions = Array.isArray(node.primaryFunctions)
      ? (node.primaryFunctions as string[]).join(', ')
      : '';

    const text = [
      `${node.name} (${node.kind})`,
      node.description,
      functions ? `Functions: ${functions}` : '',
      node.roleSummary,
    ].filter(Boolean).join('. ');

    batcher = batcher.withObject({
      class: 'Anatomy',
      properties: {
        sourceId: node.id,
        name: node.name,
        kind: node.kind,
        region,
        text,
      },
    });
    count++;

    if (count % 50 === 0) {
      await batcher.do();
      batcher = client.batch.objectsBatcher();
      console.log(`  Imported ${count} anatomy nodes...`);
    }
  }

  if (count % 50 !== 0) {
    await batcher.do();
  }
  console.log(`✓ Imported ${count} anatomy nodes`);
}

async function importExercises() {
  const client = getWeaviateClient();
  const exercises = await prisma.exercise.findMany({
    include: {
      anatomyLinks: { include: { anatomy: true } },
    },
  });

  let batcher = client.batch.objectsBatcher();
  let count = 0;

  for (const ex of exercises) {
    const primary = ex.anatomyLinks
      .filter(l => l.role === 'primary')
      .map(l => l.anatomy.name);
    const secondary = ex.anatomyLinks
      .filter(l => l.role === 'secondary')
      .map(l => l.anatomy.name);

    const text = [
      `${ex.name} is a ${ex.type} ${ex.movementPattern} exercise`,
      ex.cueSummary,
      primary.length ? `Primary muscles: ${primary.join(', ')}` : '',
      secondary.length ? `Secondary muscles: ${secondary.join(', ')}` : '',
    ].filter(Boolean).join('. ');

    batcher = batcher.withObject({
      class: 'Exercise',
      properties: {
        sourceId: ex.id,
        name: ex.name,
        type: ex.type,
        movementPattern: ex.movementPattern,
        text,
      },
    });
    count++;

    if (count % 50 === 0) {
      await batcher.do();
      batcher = client.batch.objectsBatcher();
      console.log(`  Imported ${count} exercises...`);
    }
  }

  if (count % 50 !== 0) {
    await batcher.do();
  }
  console.log(`✓ Imported ${count} exercises`);
}

async function importSections() {
  const client = getWeaviateClient();
  const sections = await prisma.section.findMany();

  let batcher = client.batch.objectsBatcher();
  let count = 0;

  for (const section of sections) {
    // Truncate very long sections
    const content = section.content.length > 8000
      ? section.content.slice(0, 8000) + '...'
      : section.content;

    batcher = batcher.withObject({
      class: 'Section',
      properties: {
        sourceId: section.id,
        guideId: section.guideId,
        title: section.title,
        kind: section.kind,
        text: `${section.title}: ${content}`,
      },
    });
    count++;

    if (count % 50 === 0) {
      await batcher.do();
      batcher = client.batch.objectsBatcher();
      console.log(`  Imported ${count} sections...`);
    }
  }

  if (count % 50 !== 0) {
    await batcher.do();
  }
  console.log(`✓ Imported ${count} sections`);
}

async function main() {
  console.log('Starting import to Weaviate...\n');

  console.log('Importing anatomy nodes...');
  await importAnatomy();

  console.log('\nImporting exercises...');
  await importExercises();

  console.log('\nImporting sections...');
  await importSections();

  console.log('\n✓ Import complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
