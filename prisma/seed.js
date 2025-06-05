const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('🌱 Starting seeding...');

    // Seed Admin User
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@mathroadmap.com',
        name: 'Admin User',
        role: 'ADMIN',
      }
    });
    console.log('👤 Created admin user');

    // Seed Math Exercises
    const mathExercises = [
      {
        name: "Quadratic Equations",
        description: "Solve the quadratic equation: x² - 5x + 6 = 0",
        choices: ["x = 2, x = 3", "x = 1, x = 6", "x = -2, x = -3", "No real solutions"],
        correctAnswer: 0,
        explanation: "The equation factors to (x-2)(x-3)=0, so the solutions are x=2 and x=3.",
        difficulty: "MEDIUM",
        hints: ["Try factoring the quadratic expression.", "Look for two numbers that multiply to 6 and add to -5."],
        videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID_QUADRATIC",
        questionImageUrl: "https://example.com/quadratic.png",
        isActive: true
      },
      {
        name: "Pythagorean Theorem",
        description: "In a right triangle with legs 3 and 4, what is the length of the hypotenuse?",
        choices: ["5", "7", "12", "25"],
        correctAnswer: 0,
        explanation: "Using a² + b² = c², we get 3² + 4² = 9 + 16 = 25 = c², so c = 5.",
        difficulty: "EASY",
        hints: ["Remember the formula a² + b² = c²", "Calculate 3 squared plus 4 squared"],
        videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID_PYTHAGOREAN",
        questionImageUrl: "https://example.com/pythagorean.png",
        isActive: true
      },
      {
        name: "Derivative Basics",
        description: "What is the derivative of f(x) = 3x² + 2x - 5?",
        choices: ["6x + 2", "3x + 2", "6x² + 2x", "3x² + 2"],
        correctAnswer: 0,
        explanation: "Using the power rule: derivative of 3x² is 6x, derivative of 2x is 2, and derivative of a constant is 0.",
        difficulty: "HARD",
        hints: ["Use the power rule for derivatives", "The derivative of xⁿ is nxⁿ⁻¹"],
        videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID_DERIVATIVES",
        questionImageUrl: "https://example.com/derivative.png",
        isActive: true
      },
      // Add more math exercises as needed...
    ];

    const createdExercises = [];
    for (const exercise of mathExercises) {
      const created = await prisma.exercise.create({
        data: exercise
      });
      createdExercises.push(created);
    }
    console.log(`🏋️ Created ${createdExercises.length} math exercises`);

    // Seed Math Roadmap
    const mathRoadmap = await prisma.roadmap.create({
      data: {
        title: "High School Mathematics Journey",
        description: "A comprehensive roadmap covering essential high school math topics from algebra to calculus.",
        category: "MATH",
        imageUrl: "https://example.com/math-roadmap.jpg",
        duration: 90 // 90 days to complete
      }
    });
    console.log('🗺️ Created math roadmap');

    // Seed Nodes for Math Roadmap (structured learning path)
    const nodes = [
      {
        label: "Algebra Fundamentals",
        description: "Master basic algebraic concepts and equations",
        positionX: 200,
        positionY: 50
      },
      {
        label: "Functions",
        description: "Understand functions and their properties",
        positionX: 100,
        positionY: 150
      },
      {
        label: "Trigonometry",
        description: "Learn trigonometric functions and identities",
        positionX: 300,
        positionY: 150
      },
      {
        label: "Geometry",
        description: "Study shapes, angles, and geometric proofs",
        positionX: 50,
        positionY: 250
      },
      {
        label: "Pre-Calculus",
        description: "Prepare for calculus with advanced algebra",
        positionX: 200,
        positionY: 250
      },
      {
        label: "Calculus Intro",
        description: "Introduction to limits and derivatives",
        positionX: 350,
        positionY: 250
      },
    ];

    const createdNodes = [];
    for (const node of nodes) {
      const created = await prisma.roadmapNode.create({
        data: {
          ...node,
          roadmapId: mathRoadmap.id,
          type: "progressNode"
        }
      });
      createdNodes.push(created);
    }
    console.log(`🧠 Created ${createdNodes.length} roadmap nodes`);

    // Create edges between nodes (forming a learning path)
    const edges = [
      { sourceIndex: 0, targetIndex: 1 }, // Algebra -> Functions
      { sourceIndex: 0, targetIndex: 2 }, // Algebra -> Trigonometry
      { sourceIndex: 1, targetIndex: 3 }, // Functions -> Geometry
      { sourceIndex: 1, targetIndex: 4 }, // Functions -> Pre-Calculus
      { sourceIndex: 2, targetIndex: 5 }, // Trigonometry -> Calculus Intro
      { sourceIndex: 4, targetIndex: 5 }, // Pre-Calculus -> Calculus Intro
    ];

    for (const edge of edges) {
      await prisma.roadmapEdge.create({
        data: {
          roadmapId: mathRoadmap.id,
          sourceNodeId: createdNodes[edge.sourceIndex].id,
          targetNodeId: createdNodes[edge.targetIndex].id
        }
      });
    }
    console.log(`🔗 Created ${edges.length} edges between nodes`);

    // Assign exercises to nodes
    await prisma.nodeExercise.createMany({
      data: [
        { nodeId: createdNodes[0].id, exerciseId: createdExercises[0].id, orderIndex: 1 }, // Quadratic to Algebra
        { nodeId: createdNodes[0].id, exerciseId: createdExercises[1].id, orderIndex: 2 }, // Pythagorean to Algebra
        { nodeId: createdNodes[5].id, exerciseId: createdExercises[2].id, orderIndex: 1 }, // Derivative to Calculus
      ]
    });
    console.log('📚 Assigned exercises to nodes');

    // Create quiz for the roadmap
    const quiz = await prisma.quiz.create({
      data: {
        roadmapId: mathRoadmap.id,
        title: "Math Fundamentals Assessment"
      }
    });
    console.log('📝 Created roadmap quiz');

    // Add questions to quiz
    await prisma.quizQuestion.createMany({
      data: createdExercises.map((exercise, index) => ({
        quizId: quiz.id,
        exerciseId: exercise.id,
        orderIndex: index + 1
      }))
    });
    console.log(`❓ Added ${createdExercises.length} questions to quiz`);

    // Create admin user progress
    await prisma.userExerciseProgress.createMany({
      data: createdExercises.map(exercise => ({
        userId: adminUser.id,
        exerciseId: exercise.id,
        completed: true,
        completedAt: new Date()
      }))
    });
    console.log('✅ Created admin user progress records');

    // Create quiz result for admin
    await prisma.userQuizResult.create({
      data: {
        userId: adminUser.id,
        quizId: quiz.id,
        score: 100 // Admin got 100%
      }
    });
    console.log('🏆 Created admin quiz result');

    console.log('🌱 Seeding completed!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();