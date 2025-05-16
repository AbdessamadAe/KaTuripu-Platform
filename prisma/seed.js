const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker/locale/fr');
const { hash } = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('🌱 Starting seeding...');

    // Clear existing data in correct dependency order
    await prisma.userExerciseProgress.deleteMany();
    await prisma.nodeExercise.deleteMany();
    await prisma.roadmapEdge.deleteMany();
    await prisma.roadmapNode.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.roadmap.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Database cleared');

    // Seed Users
    const users = [];
    for (let i = 0; i < 1; i++) {
      const user = await prisma.user.create({
        data: {
          id: `user_2wtpRa9c3zkxE2q2CBeLhwUVkz2`,
          email: faker.internet.email(),
          name: faker.person.fullName(),
          image: faker.image.avatar(),
          role: i === 0 ? 'ADMIN' : 'USER',
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        }
      });
      users.push(user);
    }
    console.log(`👥 Created ${users.length} users`);

    // Seed Exercises
    const exerciseTypes = ['QUIZ', 'CODING', 'THEORETICAL'];
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];

    const exercises = [];
    for (let i = 0; i < 30; i++) {
      const exercise = await prisma.exercise.create({
        data: {
          id: `ex_${faker.string.uuid()}`,
          name: faker.lorem.words(3),
          difficulty: faker.helpers.arrayElement(difficulties),
          hints: [faker.lorem.paragraph(), faker.lorem.paragraph()], // Array of strings
          solution: faker.lorem.paragraph(),
          videoUrl: "https://www.youtube.com/watch?v=9XzosPEdnWA&t=1s",
          description: faker.lorem.paragraphs(3),
          questionImageUrl: "https://wmyedjqjxixlmdlgnjzy.supabase.co/storage/v1/object/public/exercises/question_images/medicine-e1-2023.png",
          type: faker.helpers.arrayElement(exerciseTypes),
          isActive: faker.datatype.boolean(0.9) // 90% chance of being active
        }
      });
      exercises.push(exercise);
    }
    console.log(`🏋️ Created ${exercises.length} exercises`);

    // Seed Roadmaps
    const roadmapCategories = ['PC', 'SM'];

    const roadmaps = [];
    for (let i = 0; i < 2; i++) {
      const roadmap = await prisma.roadmap.create({
        data: {
          id: faker.string.uuid(),
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          category: faker.helpers.arrayElement(roadmapCategories),
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ZxOCMznxGcjBhMPkS8cI5K8Ka3_owCf0q4luMEOTtMuon3LKYART4xpMkKF_Atu73f0&usqp=CAU",
          createdAt: faker.date.past()
        }
      });
      roadmaps.push(roadmap);
    }
    console.log(`🗺️ Created ${roadmaps.length} roadmaps`);

    // Seed Nodes for each Roadmap in a binary tree structure
    const nodes = [];
    const edges = [];
    
    for (const roadmap of roadmaps) {
      const nodeCount = faker.number.int({ min: 3, max: 7 }); // Need enough nodes for binary tree
      const roadmapNodes = [];
      
      // Create nodes in a way that forms a binary tree
      const levels = Math.ceil(Math.log2(nodeCount + 1));
      const horizontalSpacing = 110;
      const verticalSpacing = 150;
      
      let nodeIndex = 0;
      
      for (let level = 0; level < levels; level++) {
        const nodesInLevel = Math.min(Math.pow(2, level), nodeCount - nodeIndex);
        const startX = (Math.pow(2, levels - level - 1) - 0.5) * horizontalSpacing;
        
        for (let i = 0; i < nodesInLevel; i++) {
          const x = startX + i * Math.pow(2, levels - level) * horizontalSpacing;
          const y = level * verticalSpacing;
          
          const node = await prisma.roadmapNode.create({
            data: {
              id: faker.string.uuid(),
              roadmapId: roadmap.id,
              label: faker.lorem.words(2),
              description: faker.lorem.sentence(),
              type: "progressNode",
              positionX: x,
              positionY: y
            }
          });
          
          roadmapNodes.push(node);
          nodeIndex++;
          
          // If this isn't the first level, create edges to parent
          if (level > 0) {
            const parentIndex = Math.floor((i) / 2);
            const parentNode = roadmapNodes[Math.pow(2, level - 1) - 1 + parentIndex];
            
            const edge = await prisma.roadmapEdge.create({
              data: {
                id: faker.string.uuid(),
                roadmapId: roadmap.id,
                sourceNodeId: parentNode.id,
                targetNodeId: node.id
              }
            });
            edges.push(edge);
          }
        }
      }
      
      nodes.push(...roadmapNodes);
    }
    console.log(`🧠 Created ${nodes.length} nodes`);
    console.log(`🔗 Created ${edges.length} edges`);

    // Assign Exercises to Nodes
    const nodeExercises = [];
    for (const node of nodes) {
      const exerciseCount = faker.number.int({ min: 1, max: 4 });
      const selectedExercises = faker.helpers.arrayElements(exercises, exerciseCount);

      for (let i = 0; i < selectedExercises.length; i++) {
        const nodeExercise = await prisma.nodeExercise.create({
          data: {
            nodeId: node.id,
            exerciseId: selectedExercises[i].id,
            orderIndex: i + 1
          }
        });
        nodeExercises.push(nodeExercise);
      }
    }
    console.log(`📚 Created ${nodeExercises.length} node-exercise relationships`);

    // Create User Progress (random completion)
    const userProgressRecords = [];
    for (const user of users) {
      // Each user completes 10-80% of exercises
      const exercisesToComplete = faker.helpers.arrayElements(
        exercises,
        faker.number.int({
          min: Math.floor(exercises.length * 0.1),
          max: Math.floor(exercises.length * 0.8)
        })
      );

      for (const exercise of exercisesToComplete) {
        const progress = await prisma.userExerciseProgress.create({
          data: {
            userId: user.id,
            exerciseId: exercise.id,
            completed: true,
            completedAt: faker.date.recent()
          }
        });
        userProgressRecords.push(progress);
      }
    }
    console.log(`✅ Created ${userProgressRecords.length} user progress records`);

    console.log('🌱 Seeding completed!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();