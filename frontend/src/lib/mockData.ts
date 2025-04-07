import { Exercise } from "./types";

export const mockExercises: Exercise[] = [
  {
    id: "217",
    name: "Contains Duplicate",
    difficulty: "Easy",
    description: "Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.",
    examples: [
      {
        input: "nums = [1, 2, 3, 1]",
        output: "true"
      },
      {
        input: "nums = [1, 2, 3, 4]",
        output: "false"
      },
      {
        input: "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
        output: "true"
      }
    ],
    hints: [
      "Use a hash set to track seen numbers.",
      "Alternatively, you could sort the array first.",
      "Check each number as you go to see if it's already in your tracking data structure."
    ],
    solution: `# Brute Force Solution - O(n²) time
def containsDuplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False

# Optimized Solution - O(n) time, O(n) space
def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
    video_url: "https://www.youtube.com/watch?v=3OamzN90kPg"
  },
  {
    id: "1",
    name: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]"
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]"
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]"
      }
    ],
    hints: [
      "A brute force approach would be to check every possible pair of numbers.",
      "To improve efficiency, think about using a hash map (dictionary).",
      "For each number, check if target - current number exists in the hash map."
    ],
    solution: `# Brute Force Solution - O(n²) time
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

# Optimized Solution - O(n) time
def twoSum(nums, target):
    prevMap = {}  # val -> index
    
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prevMap:
            return [prevMap[diff], i]
        prevMap[n] = i
    return []`,
    video_url: "https://www.youtube.com/watch?v=KLlXCFG5TnA"
  }
]; 