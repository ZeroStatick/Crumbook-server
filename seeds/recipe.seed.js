require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model.js");
const Ingredient = require("../models/ingredient.model.js");
const User = require("../models/user.model.js");
const connectDB = require("../config/connectDB.js");

const recipesData = [
  // BREAKFAST (1-14)
  {
    title: "Classic Buttermilk Pancakes",
    description: "Fluffy and light pancakes, perfect for a weekend breakfast.",
    ingredients: [
      { name: "Wheat Flour", quantity: 250, unit: "g" },
      { name: "Milk", quantity: 300, unit: "ml" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Sugar", quantity: 2, unit: "tbsp" },
      { name: "Baking Powder", quantity: 1, unit: "tsp" },
      { name: "Salt", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Whisk flour, sugar, baking powder, and salt in a bowl.",
      "In another bowl, whisk milk, eggs, and melted butter.",
      "Pour wet ingredients into dry and mix until just combined.",
      "Heat a lightly oiled griddle over medium-high heat.",
      "Pour batter onto the griddle and cook until bubbles form.",
      "Flip and cook until brown on both sides. Serve hot."
    ],
    prepTime: 10, cookTime: 15, servings: 4, difficulty: "Easy",
    tags: ["Breakfast", "Pancakes", "Classic"],
    source: "Family Recipe", public: true
  },
  {
    title: "Avocado Toast with Poached Eggs",
    description: "Creamy avocado on toasted sourdough topped with perfectly poached eggs.",
    ingredients: [
      { name: "Sourdough", quantity: 2, unit: "slice" },
      { name: "Avocado", quantity: 1, unit: "piece" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Lemon", quantity: 0.5, unit: "piece" },
      { name: "Salt", quantity: 1, unit: "pinch" },
      { name: "Black Pepper", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Toast the sourdough slices until golden brown.",
      "Mash avocado with lemon juice, salt, and pepper.",
      "Bring a pot of water to a gentle simmer for poaching.",
      "Carefully poach eggs for 3-4 minutes until whites are set.",
      "Spread avocado mash onto toast. Top with poached eggs.",
      "Season with extra pepper and serve immediately."
    ],
    prepTime: 10, cookTime: 10, servings: 2, difficulty: "Medium",
    tags: ["Breakfast", "Healthy", "Avocado"],
    source: "Modern Cafe", public: true
  },
  {
    title: "Veggie Omelette",
    description: "A nutritious omelette packed with fresh vegetables.",
    ingredients: [
      { name: "Eggs", quantity: 3, unit: "piece" },
      { name: "Bell Pepper", quantity: 0.5, unit: "piece" },
      { name: "Onion", quantity: 0.25, unit: "piece" },
      { name: "Spinach", quantity: 1, unit: "handful" },
      { name: "Cheddar Cheese", quantity: 30, unit: "g" },
      { name: "Olive Oil", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Chop peppers and onions finely. Sauté in oil until soft.",
      "Add spinach and cook until wilted. Remove from pan.",
      "Beat eggs with a pinch of salt. Pour into the same pan.",
      "Cook until edges set. Add veggies and cheese to one side.",
      "Fold omelette and cook for another minute. Serve warm."
    ],
    prepTime: 5, cookTime: 10, servings: 1, difficulty: "Easy",
    tags: ["Breakfast", "Eggs", "Vegetarian"],
    source: "Healthy Eats", public: true
  },
  {
    title: "Berry Smoothie Bowl",
    description: "A thick and refreshing smoothie bowl topped with fresh fruit and nuts.",
    ingredients: [
      { name: "Banana", quantity: 1, unit: "piece" },
      { name: "Blueberry", quantity: 100, unit: "g" },
      { name: "Raspberry", quantity: 50, unit: "g" },
      { name: "Milk", quantity: 100, unit: "ml" },
      { name: "Chia Seeds", quantity: 1, unit: "tbsp" },
      { name: "Walnuts", quantity: 1, unit: "handful" }
    ],
    instructions: [
      "Blend banana, blueberries, and milk until smooth.",
      "Pour the mixture into a shallow bowl.",
      "Top with raspberries, walnuts, and chia seeds.",
      "Serve chilled immediately for best texture."
    ],
    prepTime: 5, cookTime: 0, servings: 1, difficulty: "Easy",
    tags: ["Breakfast", "Vegan", "Smoothie"],
    source: "Fruit Bar", public: true
  },
  {
    title: "Breakfast Burrito",
    description: "Hearty burrito filled with eggs, beans, and cheese.",
    ingredients: [
      { name: "Tortilla", quantity: 1, unit: "piece" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Black Beans", quantity: 50, unit: "g" },
      { name: "Cheddar Cheese", quantity: 30, unit: "g" },
      { name: "Salsa", quantity: 2, unit: "tbsp" },
      { name: "Avocado", quantity: 0.5, unit: "piece" }
    ],
    instructions: [
      "Scramble eggs in a pan until just cooked.",
      "Warm the tortilla in a dry skillet for 30 seconds.",
      "Place eggs, beans, cheese, and avocado on the tortilla.",
      "Add salsa. Fold in the sides and roll up tightly.",
      "Optional: Toast the rolled burrito for a crispy exterior."
    ],
    prepTime: 10, cookTime: 5, servings: 1, difficulty: "Medium",
    tags: ["Breakfast", "Mexican", "Filling"],
    source: "Street Food Guide", public: true
  },
  {
    title: "Shakshuka",
    description: "Eggs poached in a spicy tomato and pepper sauce.",
    ingredients: [
      { name: "Eggs", quantity: 4, unit: "piece" },
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Bell Pepper", quantity: 1, unit: "piece" },
      { name: "Cumin", quantity: 1, unit: "tsp" },
      { name: "Paprika", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Sauté onion, garlic, and pepper until soft.",
      "Add spices and tomatoes. Simmer for 10 minutes.",
      "Make four wells in the sauce. Crack an egg into each.",
      "Cover and cook until egg whites are set but yolks runny.",
      "Garnish with fresh herbs and serve with bread."
    ],
    prepTime: 10, cookTime: 20, servings: 2, difficulty: "Medium",
    tags: ["Breakfast", "Middle Eastern", "Vegetarian"],
    source: "Jerusalem Kitchen", public: true
  },
  {
    title: "Overnight Oats",
    description: "A quick and healthy make-ahead breakfast.",
    ingredients: [
      { name: "Rolled Oats", quantity: 50, unit: "g" },
      { name: "Milk", quantity: 120, unit: "ml" },
      { name: "Greek Yogurt", quantity: 60, unit: "g" },
      { name: "Honey", quantity: 1, unit: "tbsp" },
      { name: "Chia Seeds", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Combine all ingredients in a glass jar.",
      "Stir well to ensure everything is mixed.",
      "Cover and refrigerate overnight or for at least 6 hours.",
      "In the morning, top with fresh fruit if desired."
    ],
    prepTime: 5, cookTime: 0, servings: 1, difficulty: "Easy",
    tags: ["Breakfast", "Healthy", "Meal Prep"],
    source: "Fitness Food", public: true
  },
  {
    title: "French Toast",
    description: "Classic French toast topped with maple syrup and berries.",
    ingredients: [
      { name: "Brioche", quantity: 4, unit: "slice" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Milk", quantity: 100, unit: "ml" },
      { name: "Cinnamon", quantity: 1, unit: "tsp" },
      { name: "Maple Syrup", quantity: 2, unit: "tbsp" },
      { name: "Butter", quantity: 20, unit: "g" }
    ],
    instructions: [
      "Whisk eggs, milk, and cinnamon in a shallow bowl.",
      "Dip bread slices into the egg mixture, soaking both sides.",
      "Melt butter in a pan over medium heat.",
      "Fry bread until golden brown on both sides.",
      "Serve hot with maple syrup and fresh berries."
    ],
    prepTime: 5, cookTime: 10, servings: 2, difficulty: "Easy",
    tags: ["Breakfast", "Sweet", "Classic"],
    source: "Parisian Bakery", public: true
  },
  {
    title: "Eggs Benedict",
    description: "Poached eggs and ham on English muffins with hollandaise sauce.",
    ingredients: [
      { name: "English Muffin", quantity: 2, unit: "piece" },
      { name: "Eggs", quantity: 4, unit: "piece" },
      { name: "Ham", quantity: 4, unit: "slice" },
      { name: "Butter", quantity: 100, unit: "g" },
      { name: "Lemon", quantity: 0.5, unit: "piece" }
    ],
    instructions: [
      "Toast the English muffin halves.",
      "Warm the ham slices in a pan.",
      "Poach the eggs in simmering water.",
      "Whisk egg yolks and lemon juice over heat; add melted butter.",
      "Assemble: muffin, ham, egg, and hollandaise sauce."
    ],
    prepTime: 15, cookTime: 15, servings: 2, difficulty: "Hard",
    tags: ["Breakfast", "Fancy", "Eggs"],
    source: "Hotel Brunch", public: true
  },
  {
    title: "Tofu Scramble",
    description: "A savory vegan alternative to scrambled eggs.",
    ingredients: [
      { name: "Firm Tofu", quantity: 200, unit: "g" },
      { name: "Turmeric", quantity: 0.5, unit: "tsp" },
      { name: "Nutritional Yeast", quantity: 1, unit: "tbsp" },
      { name: "Onion", quantity: 0.25, unit: "piece" },
      { name: "Kale", quantity: 1, unit: "handful" }
    ],
    instructions: [
      "Crumble tofu into a bowl using your hands.",
      "Sauté onion in a pan until translucent.",
      "Add tofu, turmeric, and yeast. Cook for 5 minutes.",
      "Stir in kale and cook until wilted. Serve warm."
    ],
    prepTime: 5, cookTime: 10, servings: 1, difficulty: "Easy",
    tags: ["Breakfast", "Vegan", "Protein"],
    source: "Vegan Kitchen", public: true
  },
  {
    title: "Chia Pudding",
    description: "Simple and nutritious pudding made with chia seeds.",
    ingredients: [
      { name: "Chia Seeds", quantity: 3, unit: "tbsp" },
      { name: "Milk", quantity: 200, unit: "ml" },
      { name: "Honey", quantity: 1, unit: "tbsp" },
      { name: "Vanilla Extract", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Whisk chia seeds, milk, honey, and vanilla in a jar.",
      "Wait 10 minutes and stir again to prevent clumps.",
      "Refrigerate for at least 4 hours or overnight.",
      "Top with fresh fruit or nuts before serving."
    ],
    prepTime: 5, cookTime: 0, servings: 1, difficulty: "Easy",
    tags: ["Breakfast", "Healthy", "Vegan"],
    source: "Daily Healthy", public: true
  },
  {
    title: "Belgian Waffles",
    description: "Deep-pocketed waffles that are crispy outside and soft inside.",
    ingredients: [
      { name: "Wheat Flour", quantity: 250, unit: "g" },
      { name: "Milk", quantity: 300, unit: "ml" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Butter", quantity: 80, unit: "g" },
      { name: "Sugar", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Separate egg yolks and whites. Beat whites to stiff peaks.",
      "Mix yolks, flour, milk, sugar, and melted butter.",
      "Gently fold the egg whites into the batter.",
      "Cook in a preheated waffle iron until golden brown.",
      "Serve with cream and fresh berries."
    ],
    prepTime: 15, cookTime: 10, servings: 4, difficulty: "Medium",
    tags: ["Breakfast", "Sweet", "Waffles"],
    source: "Belgian Delights", public: true
  },
  {
    title: "Eggs in Purgatory",
    description: "Italian-style eggs poached in a spicy marinara sauce.",
    ingredients: [
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Eggs", quantity: 3, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Red Wine Vinegar", quantity: 1, unit: "tsp" },
      { name: "Basil", quantity: 1, unit: "sprig" }
    ],
    instructions: [
      "Simmer garlic and tomatoes in a pan for 15 minutes.",
      "Stir in vinegar and torn basil leaves.",
      "Crack eggs into the sauce and cover the pan.",
      "Cook until eggs are set to your preference.",
      "Serve with crusty bread for dipping."
    ],
    prepTime: 5, cookTime: 20, servings: 2, difficulty: "Easy",
    tags: ["Breakfast", "Italian", "Eggs"],
    source: "Nonna's Kitchen", public: true
  },
  {
    title: "Spinach and Feta Quiche",
    description: "Savory pie filled with eggs, spinach, and salty feta.",
    ingredients: [
      { name: "Puff Pastry", quantity: 1, unit: "piece" },
      { name: "Eggs", quantity: 4, unit: "piece" },
      { name: "Spinach", quantity: 200, unit: "g" },
      { name: "Feta", quantity: 100, unit: "g" },
      { name: "Milk", quantity: 100, unit: "ml" }
    ],
    instructions: [
      "Line a pie dish with the puff pastry.",
      "Sauté spinach until wilted; drain excess water.",
      "Whisk eggs, milk, and salt in a bowl.",
      "Spread spinach and crumbled feta over the pastry.",
      "Pour egg mixture over and bake at 180°C for 30 minutes."
    ],
    prepTime: 15, cookTime: 30, servings: 6, difficulty: "Medium",
    tags: ["Breakfast", "Savory", "Brunch"],
    source: "Country Cafe", public: true
  },

  // ITALIAN (15-28)
  {
    title: "Spaghetti Carbonara",
    description: "A classic Roman pasta dish with eggs, cheese, and pancetta.",
    ingredients: [
      { name: "Fettuccine Pasta", quantity: 200, unit: "g" },
      { name: "Pancetta", quantity: 100, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Parmesan Cheese", quantity: 50, unit: "g" },
      { name: "Black Pepper", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Boil pasta in salted water until al dente.",
      "Fry pancetta in a pan until crispy.",
      "Whisk eggs and parmesan together in a small bowl.",
      "Drain pasta, reserving some water. Mix with pancetta.",
      "Remove from heat. Quickly stir in egg mixture and water.",
      "Serve immediately with plenty of black pepper."
    ],
    prepTime: 10, cookTime: 15, servings: 2, difficulty: "Medium",
    tags: ["Italian", "Pasta", "Classic"],
    source: "Rome Travel Guide", public: true
  },
  {
    title: "Classic Margherita Pizza",
    description: "The quintessential Italian pizza.",
    ingredients: [
      { name: "Pizza Dough", quantity: 1, unit: "piece" },
      { name: "Tomato", quantity: 2, unit: "piece" },
      { name: "Mozzarella Cheese", quantity: 200, unit: "g" },
      { name: "Basil", quantity: 5, unit: "sprig" },
      { name: "Olive Oil", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 250°C. Roll out the dough.",
      "Spread crushed tomatoes over the surface.",
      "Top with fresh mozzarella slices.",
      "Bake for 10-12 minutes until crust is charred.",
      "Add fresh basil and drizzle with olive oil before serving."
    ],
    prepTime: 15, cookTime: 12, servings: 2, difficulty: "Medium",
    tags: ["Italian", "Pizza", "Vegetarian"],
    source: "Napoli Pizza School", public: true
  },
  {
    title: "Mushroom Risotto",
    description: "Creamy arborio rice with earthy mushrooms.",
    ingredients: [
      { name: "Arborio Rice", quantity: 300, unit: "g" },
      { name: "Mushroom", quantity: 200, unit: "g" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Parmesan Cheese", quantity: 50, unit: "g" },
      { name: "Water", quantity: 1, unit: "l" }
    ],
    instructions: [
      "Sauté onion and garlic in butter. Add mushrooms.",
      "Stir in rice and cook for 2 minutes until translucent.",
      "Add warm water/stock one ladle at a time, stirring.",
      "Wait for liquid to absorb before adding more.",
      "Finish with butter and parmesan when rice is tender."
    ],
    prepTime: 10, cookTime: 30, servings: 4, difficulty: "Medium",
    tags: ["Italian", "Rice", "Vegetarian"],
    source: "Milan Gourmet", public: true
  },
  {
    title: "Pesto Pasta",
    description: "Fresh basil pesto tossed with pasta.",
    ingredients: [
      { name: "Fettuccine Pasta", quantity: 400, unit: "g" },
      { name: "Basil", quantity: 50, unit: "g" },
      { name: "Pine Nuts", quantity: 30, unit: "g" },
      { name: "Parmesan Cheese", quantity: 50, unit: "g" },
      { name: "Garlic", quantity: 1, unit: "clove" },
      { name: "Olive Oil", quantity: 100, unit: "ml" }
    ],
    instructions: [
      "Blend basil, nuts, garlic, and cheese in a processor.",
      "Slowly stream in olive oil until a paste forms.",
      "Cook pasta in boiling salted water.",
      "Toss pasta with pesto and a splash of cooking water.",
      "Serve with extra cheese on top."
    ],
    prepTime: 15, cookTime: 10, servings: 4, difficulty: "Easy",
    tags: ["Italian", "Pasta", "Quick"],
    source: "Genova Flavors", public: true
  },
  {
    title: "Lasagna Bolognese",
    description: "Classic layered pasta with meat sauce and bechamel.",
    ingredients: [
      { name: "Ground Beef", quantity: 500, unit: "g" },
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Milk", quantity: 500, unit: "ml" },
      { name: "Wheat Flour", quantity: 50, unit: "g" },
      { name: "Mozzarella Cheese", quantity: 200, unit: "g" }
    ],
    instructions: [
      "Make a meat sauce with beef, onion, and tomatoes.",
      "Prepare bechamel by whisking flour, butter, and milk.",
      "Layer pasta, meat sauce, and bechamel in a dish.",
      "Top with mozzarella cheese.",
      "Bake at 180°C for 45 minutes until bubbly."
    ],
    prepTime: 30, cookTime: 45, servings: 6, difficulty: "Hard",
    tags: ["Italian", "Pasta", "Hearty"],
    source: "Bologna Tradition", public: true
  },
  {
    title: "Chicken Piccata",
    description: "Chicken breasts in a lemon caper butter sauce.",
    ingredients: [
      { name: "Chicken Breast", quantity: 2, unit: "piece" },
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Wheat Flour", quantity: 2, unit: "tbsp" },
      { name: "Parsley", quantity: 1, unit: "sprig" }
    ],
    instructions: [
      "Flatten chicken and coat in flour.",
      "Pan-fry chicken in butter until golden. Remove.",
      "Add lemon juice and butter to the pan to make sauce.",
      "Pour sauce over chicken and garnish with parsley."
    ],
    prepTime: 10, cookTime: 15, servings: 2, difficulty: "Medium",
    tags: ["Italian", "Chicken", "Lemon"],
    source: "Classic Italian", public: true
  },
  {
    title: "Eggplant Parmesan",
    description: "Breaded eggplant layers with sauce and cheese.",
    ingredients: [
      { name: "Eggplant", quantity: 2, unit: "piece" },
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Mozzarella Cheese", quantity: 200, unit: "g" },
      { name: "Parmesan Cheese", quantity: 50, unit: "g" },
      { name: "Breadsticks", quantity: 100, unit: "g" } // Using breadsticks as breadcrumbs substitute
    ],
    instructions: [
      "Slice and bread the eggplant. Bake until tender.",
      "Layer eggplant with tomato sauce and cheeses.",
      "Bake at 190°C for 25 minutes.",
      "Serve hot with a side of pasta."
    ],
    prepTime: 20, cookTime: 30, servings: 4, difficulty: "Medium",
    tags: ["Italian", "Vegetarian", "Classic"],
    source: "Sicily Food", public: true
  },
  {
    title: "Minestrone Soup",
    description: "Hearty vegetable soup with beans and pasta.",
    ingredients: [
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Carrot", quantity: 2, unit: "piece" },
      { name: "Celery", quantity: 2, unit: "sprig" },
      { name: "Zucchini", quantity: 1, unit: "piece" },
      { name: "Cannellini Beans", quantity: 400, unit: "g" },
      { name: "Tomato", quantity: 200, unit: "g" }
    ],
    instructions: [
      "Sauté chopped veggies in a large pot.",
      "Add water and simmer for 20 minutes.",
      "Stir in beans and small pasta.",
      "Cook until pasta is tender. Serve with parmesan."
    ],
    prepTime: 15, cookTime: 30, servings: 4, difficulty: "Easy",
    tags: ["Italian", "Soup", "Healthy"],
    source: "Family Cookbook", public: true
  },
  {
    title: "Osso Buco",
    description: "Braised veal shanks in a vegetable wine sauce.",
    ingredients: [
      { name: "Veal Shank", quantity: 2, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Carrot", quantity: 1, unit: "piece" },
      { name: "Tomato", quantity: 2, unit: "piece" },
      { name: "Celery", quantity: 1, unit: "sprig" }
    ],
    instructions: [
      "Brown the veal shanks in a heavy pot.",
      "Add chopped veggies and sauté until soft.",
      "Add tomatoes and water/stock to cover.",
      "Simmer for 2 hours until meat falls off the bone."
    ],
    prepTime: 20, cookTime: 120, servings: 2, difficulty: "Hard",
    tags: ["Italian", "Meat", "Slow-Cook"],
    source: "Lombardy Kitchen", public: true
  },
  {
    title: "Gnocchi with Sage Butter",
    description: "Soft potato dumplings in a fragrant butter sauce.",
    ingredients: [
      { name: "Gnocchi", quantity: 500, unit: "g" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Sage", quantity: 10, unit: "piece" },
      { name: "Parmesan Cheese", quantity: 30, unit: "g" }
    ],
    instructions: [
      "Boil gnocchi until they float. Drain.",
      "Melt butter in a pan until it starts to brown.",
      "Add sage leaves and fry until crispy.",
      "Toss gnocchi in the sage butter and serve."
    ],
    prepTime: 5, cookTime: 10, servings: 2, difficulty: "Easy",
    tags: ["Italian", "Pasta", "Quick"],
    source: "Tuscany Eats", public: true
  },
  {
    title: "Bruschetta",
    description: "Toasted bread topped with fresh tomato and basil.",
    ingredients: [
      { name: "Baguette", quantity: 1, unit: "piece" },
      { name: "Tomato", quantity: 3, unit: "piece" },
      { name: "Garlic", quantity: 1, unit: "clove" },
      { name: "Basil", quantity: 5, unit: "sprig" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Dice tomatoes and mix with oil and basil.",
      "Slice baguette and toast until crisp.",
      "Rub toasted bread with a raw garlic clove.",
      "Spoon tomato mixture onto bread and serve."
    ],
    prepTime: 10, cookTime: 5, servings: 4, difficulty: "Easy",
    tags: ["Italian", "Appetizer", "Classic"],
    source: "Aperitivo Bar", public: true
  },
  {
    title: "Caprese Salad",
    description: "Simple salad of mozzarella, tomatoes, and basil.",
    ingredients: [
      { name: "Mozzarella Cheese", quantity: 200, unit: "g" },
      { name: "Tomato", quantity: 3, unit: "piece" },
      { name: "Basil", quantity: 1, unit: "handful" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" },
      { name: "Balsamic Vinegar", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Slice mozzarella and tomatoes into rounds.",
      "Alternate slices on a platter.",
      "Tuck basil leaves between the slices.",
      "Drizzle with oil and balsamic vinegar."
    ],
    prepTime: 10, cookTime: 0, servings: 2, difficulty: "Easy",
    tags: ["Italian", "Salad", "Fresh"],
    source: "Capri Island", public: true
  },
  {
    title: "Penne Arrabbiata",
    description: "Spicy tomato pasta sauce.",
    ingredients: [
      { name: "Fusilli Pasta", quantity: 400, unit: "g" }, // Using fusilli as penne substitute
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Chili Powder", quantity: 1, unit: "tsp" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Sauté garlic and chili in oil.",
      "Add tomatoes and simmer for 15 minutes.",
      "Cook pasta and toss with the sauce.",
      "Garnish with parsley and serve hot."
    ],
    prepTime: 5, cookTime: 15, servings: 4, difficulty: "Easy",
    tags: ["Italian", "Pasta", "Spicy"],
    source: "Rome Streets", public: true
  },
  {
    title: "Fettuccine Alfredo",
    description: "Creamy pasta with butter and parmesan cheese.",
    ingredients: [
      { name: "Fettuccine Pasta", quantity: 400, unit: "g" },
      { name: "Butter", quantity: 100, unit: "g" },
      { name: "Parmesan Cheese", quantity: 100, unit: "g" },
      { name: "Cream Cheese", quantity: 50, unit: "g" } // Using cream cheese for creaminess
    ],
    instructions: [
      "Cook pasta until al dente.",
      "Melt butter and cream cheese in a pan.",
      "Whisk in parmesan until smooth.",
      "Toss pasta with the sauce and serve immediately."
    ],
    prepTime: 5, cookTime: 10, servings: 4, difficulty: "Easy",
    tags: ["Italian", "Pasta", "Rich"],
    source: "Alfredo's Rome", public: true
  },

  // ASIAN (29-42)
  {
    title: "Kung Pao Chicken",
    description: "Spicy stir-fried chicken with peanuts and vegetables.",
    ingredients: [
      { name: "Chicken Breast", quantity: 500, unit: "g" },
      { name: "Peanut Oil", quantity: 2, unit: "tbsp" },
      { name: "Soy Sauce", quantity: 3, unit: "tbsp" },
      { name: "Chili Powder", quantity: 1, unit: "tsp" },
      { name: "Bell Pepper", quantity: 1, unit: "piece" },
      { name: "Cashews", quantity: 50, unit: "g" } // Using cashews for peanuts substitute
    ],
    instructions: [
      "Dice chicken and stir-fry in oil until cooked.",
      "Add peppers and nuts; cook for 3 minutes.",
      "Stir in soy sauce and chili powder.",
      "Serve hot over steamed rice."
    ],
    prepTime: 15, cookTime: 10, servings: 3, difficulty: "Medium",
    tags: ["Asian", "Chinese", "Spicy"],
    source: "Sichuan Taste", public: true
  },
  {
    title: "Pad Thai",
    description: "Classic Thai fried noodles.",
    ingredients: [
      { name: "Rice Vermicelli", quantity: 200, unit: "g" },
      { name: "Shrimp", quantity: 150, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Bean Sprouts", quantity: 100, unit: "g" }, // Using mung bean sprouts substitute
      { name: "Peanut Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Soak noodles in warm water until soft.",
      "Stir-fry shrimp and set aside.",
      "Scramble eggs in the pan; add noodles and sauce.",
      "Toss in bean sprouts and shrimp. Serve with lime."
    ],
    prepTime: 20, cookTime: 10, servings: 2, difficulty: "Medium",
    tags: ["Asian", "Thai", "Noodles"],
    source: "Bangkok Street", public: true
  },
  {
    title: "Miso Soup",
    description: "Traditional Japanese soup with tofu and seaweed.",
    ingredients: [
      { name: "Miso", quantity: 3, unit: "tbsp" },
      { name: "Soft Tofu", quantity: 100, unit: "g" },
      { name: "Water", quantity: 1, unit: "l" },
      { name: "Green Garlic", quantity: 1, unit: "piece" } // Using green garlic as scallion substitute
    ],
    instructions: [
      "Heat water to a gentle simmer.",
      "Whisk in miso paste until dissolved.",
      "Add cubed tofu and simmer for 2 minutes.",
      "Garnish with chopped green garlic and serve."
    ],
    prepTime: 5, cookTime: 5, servings: 2, difficulty: "Easy",
    tags: ["Asian", "Japanese", "Healthy"],
    source: "Kyoto Zen", public: true
  },
  {
    title: "Beef and Broccoli",
    description: "Classic Chinese-American stir-fry.",
    ingredients: [
      { name: "Steak", quantity: 400, unit: "g" },
      { name: "Broccoli", quantity: 300, unit: "g" },
      { name: "Soy Sauce", quantity: 3, unit: "tbsp" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tsp" } // Ginger might be missing in seeds, using other spice
    ],
    instructions: [
      "Thinly slice beef and sauté with garlic.",
      "Add broccoli and a splash of water. Cover and steam.",
      "Stir in soy sauce and cook until thickened.",
      "Serve immediately over rice."
    ],
    prepTime: 15, cookTime: 10, servings: 3, difficulty: "Easy",
    tags: ["Asian", "Stir-fry", "Beef"],
    source: "Peking Express", public: true
  },
  {
    title: "Chicken Teriyaki",
    description: "Grilled chicken with a sweet soy glaze.",
    ingredients: [
      { name: "Chicken Thigh", quantity: 4, unit: "piece" },
      { name: "Soy Sauce", quantity: 4, unit: "tbsp" },
      { name: "Honey", quantity: 2, unit: "tbsp" },
      { name: "Rice Vinegar", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Mix soy sauce, honey, and vinegar to make glaze.",
      "Grill chicken thighs until fully cooked.",
      "Brush with glaze during the last 5 minutes of cooking.",
      "Slice and serve with steamed vegetables."
    ],
    prepTime: 10, cookTime: 15, servings: 2, difficulty: "Easy",
    tags: ["Asian", "Japanese", "Chicken"],
    source: "Tokyo Grill", public: true
  },
  {
    title: "Vegetable Stir-Fry",
    description: "A quick mix of fresh vegetables in a savory sauce.",
    ingredients: [
      { name: "Carrot", quantity: 2, unit: "piece" },
      { name: "Bok Choy", quantity: 2, unit: "piece" },
      { name: "Mushroom", quantity: 100, unit: "g" },
      { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
      { name: "Sesame Oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Chop all vegetables into uniform pieces.",
      "Heat oil in a wok and stir-fry veggies for 5 minutes.",
      "Add soy sauce and toss to coat.",
      "Serve hot with a drizzle of sesame oil."
    ],
    prepTime: 10, cookTime: 5, servings: 2, difficulty: "Easy",
    tags: ["Asian", "Vegan", "Healthy"],
    source: "Veggie Wok", public: true
  },
  {
    title: "Sushi Rolls (Maki)",
    description: "Homemade sushi rolls with cucumber and avocado.",
    ingredients: [
      { name: "Sushi Rice", quantity: 300, unit: "g" },
      { name: "Rice Vinegar", quantity: 2, unit: "tbsp" },
      { name: "Cucumber", quantity: 1, unit: "piece" },
      { name: "Avocado", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Cook sushi rice and season with vinegar.",
      "Spread rice onto a seaweed sheet (not in seeds, using substitute).",
      "Place cucumber and avocado strips in the center.",
      "Roll tightly and slice into 8 pieces."
    ],
    prepTime: 30, cookTime: 20, servings: 2, difficulty: "Hard",
    tags: ["Asian", "Japanese", "Fresh"],
    source: "Sushi Master", public: true
  },
  {
    title: "Red Curry with Tofu",
    description: "Spicy Thai curry with coconut milk and vegetables.",
    ingredients: [
      { name: "Firm Tofu", quantity: 200, unit: "g" },
      { name: "Coconut Milk", quantity: 400, unit: "ml" },
      { name: "Curry Powder", quantity: 2, unit: "tbsp" },
      { name: "Bell Pepper", quantity: 1, unit: "piece" },
      { name: "Bamboo Shoot", quantity: 50, unit: "g" }
    ],
    instructions: [
      "Simmer curry paste with a bit of coconut milk.",
      "Add tofu, peppers, and remaining milk.",
      "Simmer for 10 minutes until veggies are tender.",
      "Serve with jasmine rice."
    ],
    prepTime: 10, cookTime: 15, servings: 2, difficulty: "Medium",
    tags: ["Asian", "Thai", "Vegan"],
    source: "Thai Kitchen", public: true
  },
  {
    title: "Pho (Beef Noodle Soup)",
    description: "Traditional Vietnamese beef noodle soup.",
    ingredients: [
      { name: "Beef Chuck Roast", quantity: 500, unit: "g" },
      { name: "Rice Vermicelli", quantity: 200, unit: "g" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Star Anise", quantity: 2, unit: "piece" },
      { name: "Cinnamon", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Simmer beef, spices, and charred onion for 2 hours.",
      "Strain broth and thinly slice the beef.",
      "Place cooked noodles in a bowl; top with beef.",
      "Pour hot broth over and serve with herbs."
    ],
    prepTime: 20, cookTime: 120, servings: 4, difficulty: "Hard",
    tags: ["Asian", "Vietnamese", "Soup"],
    source: "Hanoi Street", public: true
  },
  {
    title: "Bibimbap",
    description: "Korean mixed rice bowl with veggies and beef.",
    ingredients: [
      { name: "White Rice", quantity: 200, unit: "g" },
      { name: "Ground Beef", quantity: 150, unit: "g" },
      { name: "Spinach", quantity: 100, unit: "g" },
      { name: "Carrot", quantity: 1, unit: "piece" },
      { name: "Gochujang", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Cook rice and sauté veggies separately.",
      "Fry beef with soy sauce and garlic.",
      "Assemble rice in a bowl; arrange veggies/beef on top.",
      "Add a dollop of gochujang and a fried egg."
    ],
    prepTime: 20, cookTime: 15, servings: 1, difficulty: "Medium",
    tags: ["Asian", "Korean", "Healthy"],
    source: "Seoul Food", public: true
  },
  {
    title: "General Tso's Chicken",
    description: "Sweet and spicy deep-fried chicken.",
    ingredients: [
      { name: "Chicken Breast", quantity: 500, unit: "g" },
      { name: "Wheat Flour", quantity: 100, unit: "g" },
      { name: "Soy Sauce", quantity: 3, unit: "tbsp" },
      { name: "Sugar", quantity: 2, unit: "tbsp" },
      { name: "Chili Powder", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Coat chicken in flour and deep fry until crispy.",
      "Mix soy sauce, sugar, and chili to make sauce.",
      "Toss chicken in the sauce until coated.",
      "Serve with broccoli and rice."
    ],
    prepTime: 20, cookTime: 15, servings: 3, difficulty: "Hard",
    tags: ["Asian", "Chinese", "Spicy"],
    source: "Chef's Special", public: true
  },
  {
    title: "Spring Rolls",
    description: "Crispy vegetable-filled rolls.",
    ingredients: [
      { name: "Spring Roll Wrappers", quantity: 10, unit: "piece" },
      { name: "Cabbage", quantity: 200, unit: "g" },
      { name: "Carrot", quantity: 1, unit: "piece" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Stir-fry chopped veggies with soy sauce.",
      "Place filling on wrappers and roll tightly.",
      "Deep fry until golden and crispy.",
      "Serve with sweet chili sauce."
    ],
    prepTime: 25, cookTime: 10, servings: 5, difficulty: "Medium",
    tags: ["Asian", "Appetizer", "Crispy"],
    source: "Wok N Roll", public: true
  },
  {
    title: "Dumplings (Potstickers)",
    description: "Pan-fried pork and cabbage dumplings.",
    ingredients: [
      { name: "Wonton Wrappers", quantity: 20, unit: "piece" },
      { name: "Ground Beef", quantity: 200, unit: "g" }, // Using beef instead of pork
      { name: "Cabbage", quantity: 100, unit: "g" },
      { name: "Garlic", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Mix beef, cabbage, and garlic for filling.",
      "Fold filling into wrappers and seal edges.",
      "Pan-fry until bottom is brown; steam with water.",
      "Serve with a soy-vinegar dipping sauce."
    ],
    prepTime: 40, cookTime: 15, servings: 4, difficulty: "Hard",
    tags: ["Asian", "Chinese", "Appetizer"],
    source: "Dim Sum House", public: true
  },
  {
    title: "Ramen",
    description: "Simple home-style ramen.",
    ingredients: [
      { name: "Ramen Noodles", quantity: 200, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Spinach", quantity: 50, unit: "g" },
      { name: "Soy Sauce", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Boil noodles in water with soy sauce.",
      "Add a soft-boiled egg and wilted spinach.",
      "Serve in a deep bowl with hot broth."
    ],
    prepTime: 10, cookTime: 10, servings: 2, difficulty: "Easy",
    tags: ["Asian", "Japanese", "Soup"],
    source: "Midnight Diner", public: true
  },

  // MEXICAN (43-56)
  {
    title: "Beef Tacos",
    description: "Classic street-style beef tacos.",
    ingredients: [
      { name: "Corn Tortilla", quantity: 6, unit: "piece" },
      { name: "Ground Beef", quantity: 400, unit: "g" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Cilantro", quantity: 1, unit: "handful" },
      { name: "Lime", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Cook beef with salt and cumin until brown.",
      "Warm tortillas on a griddle.",
      "Fill tortillas with beef, onion, and cilantro.",
      "Serve with lime wedges and salsa."
    ],
    prepTime: 10, cookTime: 10, servings: 2, difficulty: "Easy",
    tags: ["Mexican", "Street-Food", "Classic"],
    source: "Taco Stand", public: true
  },
  {
    title: "Chicken Enchiladas",
    description: "Rolled tortillas with chicken and red sauce.",
    ingredients: [
      { name: "Tortilla", quantity: 8, unit: "piece" },
      { name: "Chicken Breast", quantity: 400, unit: "g" },
      { name: "Cheddar Cheese", quantity: 200, unit: "g" },
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Chili Powder", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Shred cooked chicken and mix with cheese.",
      "Dip tortillas in tomato-chili sauce and fill with chicken.",
      "Roll and place in a baking dish. Top with more sauce.",
      "Bake at 180°C for 20 minutes until cheese melts."
    ],
    prepTime: 20, cookTime: 20, servings: 4, difficulty: "Medium",
    tags: ["Mexican", "Chicken", "Baked"],
    source: "Abuela's Kitchen", public: true
  },
  {
    title: "Guacamole",
    description: "Fresh and creamy avocado dip.",
    ingredients: [
      { name: "Avocado", quantity: 3, unit: "piece" },
      { name: "Tomato", quantity: 1, unit: "piece" },
      { name: "Onion", quantity: 0.5, unit: "piece" },
      { name: "Cilantro", quantity: 1, unit: "handful" },
      { name: "Lime", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Mash avocados in a bowl.",
      "Fold in finely diced tomato, onion, and cilantro.",
      "Add lime juice and salt to taste.",
      "Serve with corn chips immediately."
    ],
    prepTime: 10, cookTime: 0, servings: 4, difficulty: "Easy",
    tags: ["Mexican", "Dip", "Vegan"],
    source: "Fiesta Bar", public: true
  },
  {
    title: "Beef Fajitas",
    description: "Sizzling beef with peppers and onions.",
    ingredients: [
      { name: "Steak", quantity: 500, unit: "g" },
      { name: "Bell Pepper", quantity: 2, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Tortilla", quantity: 8, unit: "piece" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Slice steak and veggies into thin strips.",
      "Sear steak in a hot skillet. Remove.",
      "Sauté peppers and onions until slightly charred.",
      "Mix meat back in and serve with warm tortillas."
    ],
    prepTime: 15, cookTime: 10, servings: 4, difficulty: "Easy",
    tags: ["Mexican", "Beef", "Sizzling"],
    source: "Grill Master", public: true
  },
  {
    title: "Quesadillas",
    description: "Cheesy folded tortillas.",
    ingredients: [
      { name: "Tortilla", quantity: 2, unit: "piece" },
      { name: "Mozzarella Cheese", quantity: 100, unit: "g" },
      { name: "Bell Pepper", quantity: 0.5, unit: "piece" },
      { name: "Onion", quantity: 0.25, unit: "piece" }
    ],
    instructions: [
      "Place cheese and chopped veggies on half a tortilla.",
      "Fold the tortilla over the filling.",
      "Cook in a dry pan over medium heat until golden.",
      "Flip and cook until cheese is melted. Slice into wedges."
    ],
    prepTime: 5, cookTime: 5, servings: 1, difficulty: "Easy",
    tags: ["Mexican", "Quick", "Vegetarian"],
    source: "Fast Meals", public: true
  },
  {
    title: "Chilaquiles",
    description: "Fried tortilla chips tossed in salsa.",
    ingredients: [
      { name: "Corn Tortilla", quantity: 10, unit: "piece" },
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Goat Cheese", quantity: 50, unit: "g" }, // Using goat cheese as queso fresco substitute
      { name: "Onion", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Cut tortillas into triangles and fry until crisp.",
      "Simmer tomatoes and onions to make a sauce.",
      "Toss chips in the sauce until slightly softened.",
      "Top with fried eggs and crumbled cheese."
    ],
    prepTime: 15, cookTime: 15, servings: 2, difficulty: "Medium",
    tags: ["Mexican", "Breakfast", "Classic"],
    source: "Morning Mexico", public: true
  },
  {
    title: "Pozole",
    description: "Traditional hominy soup with pork.",
    ingredients: [
      { name: "Pork Shoulder", quantity: 500, unit: "g" },
      { name: "Corn", quantity: 400, unit: "g" }, // Hominy substitute
      { name: "Chili Powder", quantity: 2, unit: "tbsp" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Radish", quantity: 4, unit: "piece" }
    ],
    instructions: [
      "Slow cook pork and garlic in water for 2 hours.",
      "Add corn and chili powder. Simmer for 30 minutes.",
      "Serve in bowls with sliced radishes and cabbage."
    ],
    prepTime: 20, cookTime: 150, servings: 6, difficulty: "Hard",
    tags: ["Mexican", "Soup", "Traditional"],
    source: "Puebla Flavors", public: true
  },
  {
    title: "Tamales",
    description: "Corn dough filled with meat and steamed.",
    ingredients: [
      { name: "Cornmeal", quantity: 500, unit: "g" },
      { name: "Lard", quantity: 100, unit: "g" }, // Using butter if lard not available, but let's assume other
      { name: "Beef Chuck Roast", quantity: 300, unit: "g" },
      { name: "Chili Powder", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Make a dough with cornmeal and fat.",
      "Spread dough on corn husks (not in seeds).",
      "Add cooked shredded beef in the center.",
      "Fold and steam for 1 hour until firm."
    ],
    prepTime: 60, cookTime: 60, servings: 10, difficulty: "Hard",
    tags: ["Mexican", "Traditional", "Labor-Intensive"],
    source: "Holiday Traditions", public: true
  },
  {
    title: "Pico de Gallo",
    description: "Fresh tomato and onion salsa.",
    ingredients: [
      { name: "Tomato", quantity: 4, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Cilantro", quantity: 1, unit: "handful" },
      { name: "Lime", quantity: 1, unit: "piece" },
      { name: "Jalapeno", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Finely dice all vegetables.",
      "Mix together in a bowl with lime juice and salt.",
      "Let sit for 15 minutes to allow flavors to meld.",
      "Serve as a topping for tacos or with chips."
    ],
    prepTime: 10, cookTime: 0, servings: 4, difficulty: "Easy",
    tags: ["Mexican", "Salsa", "Fresh"],
    source: "Fresh Mex", public: true
  },
  {
    title: "Ceviche",
    description: "Fresh fish cured in citrus juices.",
    ingredients: [
      { name: "Snapper", quantity: 500, unit: "g" },
      { name: "Lime", quantity: 5, unit: "piece" },
      { name: "Onion", quantity: 0.5, unit: "piece" },
      { name: "Cilantro", quantity: 1, unit: "handful" },
      { name: "Cucumber", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Dice fish into small cubes.",
      "Submerge in lime juice and refrigerate for 30 minutes.",
      "Toss with diced onion, cilantro, and cucumber.",
      "Serve chilled with tostadas."
    ],
    prepTime: 15, cookTime: 30, servings: 4, difficulty: "Medium",
    tags: ["Mexican", "Seafood", "Fresh"],
    source: "Coastal Kitchen", public: true
  },
  {
    title: "Elote",
    description: "Mexican street corn with mayo and cheese.",
    ingredients: [
      { name: "Corn", quantity: 4, unit: "piece" },
      { name: "Greek Yogurt", quantity: 100, unit: "g" }, // Mayo substitute
      { name: "Goat Cheese", quantity: 50, unit: "g" },
      { name: "Chili Powder", quantity: 1, unit: "tsp" },
      { name: "Lime", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Grill corn until slightly charred.",
      "Slather with yogurt/mayo.",
      "Roll in crumbled cheese and chili powder.",
      "Serve hot with a squeeze of lime."
    ],
    prepTime: 5, cookTime: 10, servings: 4, difficulty: "Easy",
    tags: ["Mexican", "Street-Food", "Vegetarian"],
    source: "Market Vendor", public: true
  },
  {
    title: "Mole Poblano",
    description: "Chicken in a rich chocolate and chili sauce.",
    ingredients: [
      { name: "Chicken Breast", quantity: 500, unit: "g" },
      { name: "Chocolate Chips", quantity: 50, unit: "g" },
      { name: "Chili Powder", quantity: 3, unit: "tbsp" },
      { name: "Peanut Oil", quantity: 2, unit: "tbsp" },
      { name: "Sesame Oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Cook chicken in simmering water. Save broth.",
      "Sauté chili and spices; add chocolate and broth.",
      "Simmer until sauce is thick and glossy.",
      "Pour over chicken and serve with rice."
    ],
    prepTime: 30, cookTime: 45, servings: 4, difficulty: "Hard",
    tags: ["Mexican", "Rich", "Complex"],
    source: "Oaxaca Secret", public: true
  },
  {
    title: "Huevos Rancheros",
    description: "Farm-style eggs on tortillas with salsa.",
    ingredients: [
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Corn Tortilla", quantity: 2, unit: "piece" },
      { name: "Black Beans", quantity: 100, unit: "g" },
      { name: "Tomato", quantity: 200, unit: "g" },
      { name: "Avocado", quantity: 0.5, unit: "piece" }
    ],
    instructions: [
      "Fry tortillas until slightly crisp.",
      "Spread warm beans on tortillas.",
      "Top with fried eggs and tomato salsa.",
      "Garnish with avocado slices."
    ],
    prepTime: 10, cookTime: 10, servings: 1, difficulty: "Easy",
    tags: ["Mexican", "Breakfast", "Eggs"],
    source: "Sonora Sunrise", public: true
  },
  {
    title: "Carne Asada",
    description: "Marinated and grilled flank steak.",
    ingredients: [
      { name: "Beef Flank Steak", quantity: 1, unit: "kg" },
      { name: "Lime", quantity: 3, unit: "piece" },
      { name: "Garlic", quantity: 4, unit: "clove" },
      { name: "Cilantro", quantity: 1, unit: "handful" },
      { name: "Olive Oil", quantity: 3, unit: "tbsp" }
    ],
    instructions: [
      "Marinate steak in lime, garlic, and oil for 4 hours.",
      "Grill over high heat for 5-7 minutes per side.",
      "Let rest for 10 minutes before slicing.",
      "Serve with tortillas and salsa."
    ],
    prepTime: 15, cookTime: 15, servings: 6, difficulty: "Medium",
    tags: ["Mexican", "Meat", "Grilled"],
    source: "Baja BBQ", public: true
  },

  // FRENCH (57-66)
  {
    title: "Coq au Vin",
    description: "Chicken braised with wine, mushrooms, and garlic.",
    ingredients: [
      { name: "Chicken Thigh", quantity: 6, unit: "piece" },
      { name: "Mushroom", quantity: 200, unit: "g" },
      { name: "Bacon", quantity: 100, unit: "g" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    instructions: [
      "Fry bacon until crisp. Remove.",
      "Brown chicken in bacon fat.",
      "Add wine (not in seeds), mushrooms, and onions.",
      "Simmer for 1 hour until chicken is tender."
    ],
    prepTime: 20, cookTime: 60, servings: 4, difficulty: "Hard",
    tags: ["French", "Classic", "Chicken"],
    source: "Julia's Guide", public: true
  },
  {
    title: "Ratatouille",
    description: "Provencal stewed vegetables.",
    ingredients: [
      { name: "Eggplant", quantity: 1, unit: "piece" },
      { name: "Zucchini", quantity: 1, unit: "piece" },
      { name: "Tomato", quantity: 3, unit: "piece" },
      { name: "Bell Pepper", quantity: 1, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    instructions: [
      "Slice all vegetables into uniform rounds.",
      "Sauté onions and garlic in a pan.",
      "Layer vegetables in a spiral pattern.",
      "Bake at 170°C for 45 minutes until soft."
    ],
    prepTime: 20, cookTime: 45, servings: 4, difficulty: "Medium",
    tags: ["French", "Vegan", "Vegetable"],
    source: "Provence Table", public: true
  },
  {
    title: "Beef Bourguignon",
    description: "Slow-cooked beef in red wine sauce.",
    ingredients: [
      { name: "Beef Chuck Roast", quantity: 1, unit: "kg" },
      { name: "Carrot", quantity: 3, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Bacon", quantity: 100, unit: "g" },
      { name: "Garlic", quantity: 3, unit: "clove" }
    ],
    instructions: [
      "Sear beef cubes in a heavy pot.",
      "Add bacon, carrots, and onions.",
      "Cover with liquid and simmer for 3 hours.",
      "Serve with mashed potatoes or bread."
    ],
    prepTime: 30, cookTime: 180, servings: 6, difficulty: "Hard",
    tags: ["French", "Beef", "Slow-Cook"],
    source: "French Bistro", public: true
  },
  {
    title: "Quiche Lorraine",
    description: "Savory tart with bacon and cheese.",
    ingredients: [
      { name: "Puff Pastry", quantity: 1, unit: "piece" },
      { name: "Eggs", quantity: 4, unit: "piece" },
      { name: "Bacon", quantity: 150, unit: "g" },
      { name: "Gruyere Cheese", quantity: 100, unit: "g" },
      { name: "Milk", quantity: 200, unit: "ml" }
    ],
    instructions: [
      "Blind bake the pastry crust.",
      "Fry bacon and spread over the crust.",
      "Whisk eggs, milk, and cheese; pour over bacon.",
      "Bake at 180°C for 30 minutes until set."
    ],
    prepTime: 15, cookTime: 30, servings: 6, difficulty: "Medium",
    tags: ["French", "Savory", "Pastry"],
    source: "Paris Bakery", public: true
  },
  {
    title: "Croque Monsieur",
    description: "Classic French grilled ham and cheese sandwich.",
    ingredients: [
      { name: "Brioche", quantity: 2, unit: "slice" },
      { name: "Ham", quantity: 2, unit: "slice" },
      { name: "Gruyere Cheese", quantity: 50, unit: "g" },
      { name: "Butter", quantity: 20, unit: "g" },
      { name: "Milk", quantity: 50, unit: "ml" } // For bechamel
    ],
    instructions: [
      "Make a sandwich with ham and cheese.",
      "Top with bechamel sauce and extra cheese.",
      "Grill or bake until bubbly and golden brown.",
      "Serve hot with a side salad."
    ],
    prepTime: 10, cookTime: 10, servings: 1, difficulty: "Easy",
    tags: ["French", "Quick", "Ham"],
    source: "Cafe de Paris", public: true
  },
  {
    title: "Onion Soup",
    description: "Sweet caramelized onion soup with a cheesy crust.",
    ingredients: [
      { name: "Onion", quantity: 5, unit: "piece" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Baguette", quantity: 4, unit: "slice" },
      { name: "Gruyere Cheese", quantity: 100, unit: "g" },
      { name: "Water", quantity: 1, unit: "l" }
    ],
    instructions: [
      "Caramelize onions in butter for 45 minutes.",
      "Add water and simmer for 20 minutes.",
      "Pour into bowls; top with bread and cheese.",
      "Broil until cheese is melted and brown."
    ],
    prepTime: 15, cookTime: 70, servings: 4, difficulty: "Medium",
    tags: ["French", "Soup", "Onion"],
    source: "Traditional France", public: true
  },
  {
    title: "Cassoulet",
    description: "Slow-cooked white bean stew with meat.",
    ingredients: [
      { name: "Cannellini Beans", quantity: 500, unit: "g" },
      { name: "Sausage", quantity: 4, unit: "piece" },
      { name: "Duck Leg", quantity: 2, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    instructions: [
      "Soak beans overnight.",
      "Sauté meats until brown. Remove.",
      "Layer beans and meat in a heavy pot.",
      "Cover and bake slowly for 3 hours."
    ],
    prepTime: 30, cookTime: 180, servings: 6, difficulty: "Hard",
    tags: ["French", "Hearty", "Slow-Cook"],
    source: "Toulouse Traditions", public: true
  },
  {
    title: "Bouillabaisse",
    description: "Classic Provençal fish stew.",
    ingredients: [
      { name: "Cod", quantity: 300, unit: "g" },
      { name: "Shrimp", quantity: 200, unit: "g" },
      { name: "Mussels", quantity: 200, unit: "g" },
      { name: "Tomato", quantity: 2, unit: "piece" },
      { name: "Saffron", quantity: 1, unit: "pinch" }
    ],
    instructions: [
      "Sauté onions and tomatoes with saffron.",
      "Add water and simmer for 15 minutes.",
      "Add fish and shellfish; cook until opened.",
      "Serve with bread and garlic mayo."
    ],
    prepTime: 20, cookTime: 30, servings: 4, difficulty: "Hard",
    tags: ["French", "Seafood", "Soup"],
    source: "Marseille Port", public: true
  },
  {
    title: "Salade Niçoise",
    description: "Fresh salad with tuna, eggs, and olives.",
    ingredients: [
      { name: "Tuna", quantity: 200, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Potato", quantity: 2, unit: "piece" },
      { name: "Green Garlic", quantity: 1, unit: "piece" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Boil potatoes and eggs. Slice.",
      "Arrange tuna, potatoes, eggs, and greens on a plate.",
      "Drizzle with olive oil and vinegar.",
      "Serve chilled."
    ],
    prepTime: 20, cookTime: 15, servings: 2, difficulty: "Easy",
    tags: ["French", "Salad", "Healthy"],
    source: "Nice Beach", public: true
  },
  {
    title: "Duck Confit",
    description: "Duck legs slow-cooked in their own fat.",
    ingredients: [
      { name: "Duck Leg", quantity: 4, unit: "piece" },
      { name: "Salt", quantity: 2, unit: "tbsp" },
      { name: "Thyme", quantity: 2, unit: "sprig" },
      { name: "Garlic", quantity: 4, unit: "clove" }
    ],
    instructions: [
      "Cure duck legs in salt and herbs for 24 hours.",
      "Rinse and submerge in fat (not in seeds).",
      "Cook at 100°C for 4 hours until tender.",
      "Crisp the skin in a pan before serving."
    ],
    prepTime: 30, cookTime: 240, servings: 4, difficulty: "Hard",
    tags: ["French", "Duck", "Slow-Cook"],
    source: "Gourmet France", public: true
  },

  // DESSERTS (67-81)
  {
    title: "Chocolate Lava Cake",
    description: "Individual cakes with a molten chocolate center.",
    ingredients: [
      { name: "Chocolate Chips", quantity: 100, unit: "g" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Sugar", quantity: 50, unit: "g" },
      { name: "Wheat Flour", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Melt chocolate and butter together.",
      "Whisk eggs and sugar until thick.",
      "Fold chocolate and flour into eggs.",
      "Bake in ramekins at 200°C for 12 minutes."
    ],
    prepTime: 10, cookTime: 12, servings: 2, difficulty: "Medium",
    tags: ["Dessert", "Chocolate", "Baking"],
    source: "Dessert Bar", public: true
  },
  {
    title: "Tiramisu",
    description: "Italian coffee-flavored dessert.",
    ingredients: [
      { name: "Mascarpone Cheese", quantity: 250, unit: "g" },
      { name: "Eggs", quantity: 3, unit: "piece" },
      { name: "Sugar", quantity: 100, unit: "g" },
      { name: "Cocoa Powder", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Whisk egg yolks and sugar; fold in mascarpone.",
      "Dip ladyfingers (not in seeds) in coffee.",
      "Layer cream and biscuits in a dish.",
      "Dust with cocoa and chill for 4 hours."
    ],
    prepTime: 20, cookTime: 0, servings: 6, difficulty: "Medium",
    tags: ["Dessert", "Italian", "Coffee"],
    source: "Venetian Sweets", public: true
  },
  {
    title: "Apple Pie",
    description: "Classic American fruit pie.",
    ingredients: [
      { name: "Apple", quantity: 6, unit: "piece" },
      { name: "Puff Pastry", quantity: 2, unit: "piece" },
      { name: "Sugar", quantity: 100, unit: "g" },
      { name: "Cinnamon", quantity: 1, unit: "tsp" },
      { name: "Butter", quantity: 30, unit: "g" }
    ],
    instructions: [
      "Slice apples and toss with sugar and cinnamon.",
      "Line a pie dish with pastry; fill with apples.",
      "Top with second pastry sheet and seal edges.",
      "Bake at 190°C for 45 minutes until golden."
    ],
    prepTime: 20, cookTime: 45, servings: 8, difficulty: "Medium",
    tags: ["Dessert", "Baking", "Fruit"],
    source: "Grandma's Pies", public: true
  },
  {
    title: "New York Cheesecake",
    description: "Dense and creamy classic cheesecake.",
    ingredients: [
      { name: "Cream Cheese", quantity: 600, unit: "g" },
      { name: "Sugar", quantity: 150, unit: "g" },
      { name: "Eggs", quantity: 3, unit: "piece" },
      { name: "Sour Cream", quantity: 100, unit: "g" },
      { name: "Vanilla Extract", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Beat cream cheese and sugar until smooth.",
      "Add eggs one at a time, then sour cream.",
      "Pour onto a crust and bake at 150°C for 1 hour.",
      "Cool and chill overnight before serving."
    ],
    prepTime: 15, cookTime: 60, servings: 12, difficulty: "Hard",
    tags: ["Dessert", "Baking", "Cheese"],
    source: "NY Deli", public: true
  },
  {
    title: "Chocolate Brownies",
    description: "Fudgy and rich chocolate squares.",
    ingredients: [
      { name: "Butter", quantity: 100, unit: "g" },
      { name: "Sugar", quantity: 200, unit: "g" },
      { name: "Cocoa Powder", quantity: 50, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Wheat Flour", quantity: 100, unit: "g" }
    ],
    instructions: [
      "Melt butter and sugar together.",
      "Whisk in eggs and cocoa powder.",
      "Fold in flour until just combined.",
      "Bake at 180°C for 25 minutes."
    ],
    prepTime: 10, cookTime: 25, servings: 12, difficulty: "Easy",
    tags: ["Dessert", "Chocolate", "Quick"],
    source: "Kids Choice", public: true
  },
  {
    title: "Crème Brûlée",
    description: "Custard topped with a layer of hardened caramelized sugar.",
    ingredients: [
      { name: "Milk", quantity: 500, unit: "ml" },
      { name: "Eggs", quantity: 5, unit: "piece" }, // Using yolks
      { name: "Sugar", quantity: 100, unit: "g" },
      { name: "Vanilla Bean", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Heat milk with vanilla. Whisk yolks and sugar.",
      "Combine milk and eggs; pour into ramekins.",
      "Bake in a water bath at 150°C for 40 minutes.",
      "Chill. Sprinkle sugar on top and caramelize with torch."
    ],
    prepTime: 15, cookTime: 40, servings: 4, difficulty: "Hard",
    tags: ["Dessert", "French", "Classic"],
    source: "Pastry Chef", public: true
  },
  {
    title: "Macarons",
    description: "Delicate almond meringue cookies.",
    ingredients: [
      { name: "Almonds", quantity: 100, unit: "g" }, // Using ground almonds
      { name: "Sugar", quantity: 150, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "piece" }, // Using whites
      { name: "Cocoa Powder", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Whisk egg whites and sugar to stiff peaks.",
      "Fold in finely ground almonds and cocoa.",
      "Pipe onto a tray and let dry for 30 minutes.",
      "Bake at 150°C for 15 minutes."
    ],
    prepTime: 40, cookTime: 15, servings: 10, difficulty: "Hard",
    tags: ["Dessert", "French", "Baking"],
    source: "French Patisserie", public: true
  },
  {
    title: "Lemon Tart",
    description: "Zesty lemon curd in a crisp pastry shell.",
    ingredients: [
      { name: "Puff Pastry", quantity: 1, unit: "piece" },
      { name: "Lemon", quantity: 3, unit: "piece" },
      { name: "Eggs", quantity: 4, unit: "piece" },
      { name: "Sugar", quantity: 150, unit: "g" },
      { name: "Butter", quantity: 100, unit: "g" }
    ],
    instructions: [
      "Blind bake the tart shell.",
      "Whisk lemon juice, sugar, and eggs over heat.",
      "Whisk in butter until thick. Pour into shell.",
      "Chill for 2 hours before serving."
    ],
    prepTime: 20, cookTime: 20, servings: 8, difficulty: "Medium",
    tags: ["Dessert", "Fruit", "Zesty"],
    source: "Garden Tea", public: true
  },
  {
    title: "Panna Cotta",
    description: "Silky Italian cream dessert.",
    ingredients: [
      { name: "Milk", quantity: 500, unit: "ml" },
      { name: "Sugar", quantity: 50, unit: "g" },
      { name: "Vanilla Extract", quantity: 1, unit: "tsp" },
      { name: "Agar Agar", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Heat milk and sugar until simmering.",
      "Stir in agar agar and vanilla.",
      "Pour into molds and refrigerate for 4 hours.",
      "Serve with fresh berry sauce."
    ],
    prepTime: 10, cookTime: 5, servings: 4, difficulty: "Easy",
    tags: ["Dessert", "Italian", "Vegan"],
    source: "Milan Modern", public: true
  },
  {
    title: "Pavlova",
    description: "Meringue topped with cream and fruit.",
    ingredients: [
      { name: "Eggs", quantity: 4, unit: "piece" }, // Using whites
      { name: "Sugar", quantity: 200, unit: "g" },
      { name: "Cornmeal", quantity: 1, unit: "tsp" }, // Cornstarch substitute
      { name: "Blueberry", quantity: 100, unit: "g" }
    ],
    instructions: [
      "Whisk egg whites and sugar until glossy.",
      "Fold in cornstarch. Bake at 120°C for 1 hour.",
      "Let cool completely in the oven.",
      "Top with whipped cream and blueberries."
    ],
    prepTime: 20, cookTime: 60, servings: 6, difficulty: "Hard",
    tags: ["Dessert", "Light", "Fruit"],
    source: "Aussie Holiday", public: true
  },
  {
    title: "Churros",
    description: "Fried dough sticks coated in cinnamon sugar.",
    ingredients: [
      { name: "Water", quantity: 250, unit: "ml" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Wheat Flour", quantity: 150, unit: "g" },
      { name: "Sugar", quantity: 50, unit: "g" },
      { name: "Cinnamon", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Boil water and butter; stir in flour until a ball forms.",
      "Pipe dough into hot oil and fry until golden.",
      "Toss in cinnamon sugar while hot.",
      "Serve with chocolate dipping sauce."
    ],
    prepTime: 15, cookTime: 10, servings: 4, difficulty: "Medium",
    tags: ["Dessert", "Mexican", "Fried"],
    source: "Madrid Square", public: true
  },
  {
    title: "Chocolate Mousse",
    description: "Light and airy chocolate cream.",
    ingredients: [
      { name: "Chocolate Chips", quantity: 150, unit: "g" },
      { name: "Eggs", quantity: 3, unit: "piece" },
      { name: "Sugar", quantity: 30, unit: "g" },
      { name: "Butter", quantity: 20, unit: "g" }
    ],
    instructions: [
      "Melt chocolate and butter. Stir in yolks.",
      "Whisk egg whites and sugar to stiff peaks.",
      "Gently fold egg whites into chocolate.",
      "Chill for at least 3 hours."
    ],
    prepTime: 15, cookTime: 0, servings: 4, difficulty: "Medium",
    tags: ["Dessert", "French", "Chocolate"],
    source: "Bistro Classic", public: true
  },
  {
    title: "Baklava",
    description: "Layered pastry with nuts and honey syrup.",
    ingredients: [
      { name: "Phyllo Dough", quantity: 1, unit: "piece" },
      { name: "Walnuts", quantity: 200, unit: "g" },
      { name: "Butter", quantity: 150, unit: "g" },
      { name: "Honey", quantity: 100, unit: "ml" },
      { name: "Sugar", quantity: 50, unit: "g" }
    ],
    instructions: [
      "Layer phyllo and butter; add ground walnuts.",
      "Cut into diamonds and bake at 170°C for 45 minutes.",
      "Pour hot honey syrup over the hot pastry.",
      "Let cool completely before serving."
    ],
    prepTime: 40, cookTime: 45, servings: 12, difficulty: "Hard",
    tags: ["Dessert", "Middle Eastern", "Sweet"],
    source: "Istanbul Bazaar", public: true
  },
  {
    title: "Rice Pudding",
    description: "Comforting creamy rice dessert.",
    ingredients: [
      { name: "White Rice", quantity: 100, unit: "g" },
      { name: "Milk", quantity: 1, unit: "l" },
      { name: "Sugar", quantity: 50, unit: "g" },
      { name: "Cinnamon", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Simmer rice and milk for 40 minutes, stirring.",
      "Add sugar and cook for another 10 minutes.",
      "Serve warm or cold with a sprinkle of cinnamon."
    ],
    prepTime: 5, cookTime: 50, servings: 4, difficulty: "Easy",
    tags: ["Dessert", "Comfort-Food", "Classic"],
    source: "Family Kitchen", public: true
  },
  {
    title: "Fruit Tart",
    description: "Pastry filled with cream and topped with fresh fruit.",
    ingredients: [
      { name: "Puff Pastry", quantity: 1, unit: "piece" },
      { name: "Milk", quantity: 200, unit: "ml" },
      { name: "Eggs", quantity: 2, unit: "piece" }, // For pastry cream
      { name: "Strawberry", quantity: 100, unit: "g" },
      { name: "Blueberry", quantity: 50, unit: "g" }
    ],
    instructions: [
      "Bake the pastry shell until golden.",
      "Make pastry cream and fill the shell.",
      "Arrange fruit on top in a beautiful pattern.",
      "Glaze with honey and chill."
    ],
    prepTime: 30, cookTime: 15, servings: 6, difficulty: "Medium",
    tags: ["Dessert", "Fruit", "Baking"],
    source: "Summer Garden", public: true
  },

  // VEGAN (82-96)
  {
    title: "Lentil Stew",
    description: "Hearty and healthy lentil soup.",
    ingredients: [
      { name: "Lentils", quantity: 200, unit: "g" },
      { name: "Carrot", quantity: 2, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Vegetable Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Sauté onion and carrots in oil.",
      "Add lentils, tomatoes, and water.",
      "Simmer for 30 minutes until lentils are soft.",
      "Season with salt and pepper."
    ],
    prepTime: 10, cookTime: 30, servings: 4, difficulty: "Easy",
    tags: ["Vegan", "Soup", "Healthy"],
    source: "Green Living", public: true
  },
  {
    title: "Chickpea Curry",
    description: "Fragrant and spicy chickpea curry.",
    ingredients: [
      { name: "Chickpeas", quantity: 400, unit: "g" },
      { name: "Coconut Milk", quantity: 400, unit: "ml" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Curry Powder", quantity: 2, unit: "tbsp" },
      { name: "Spinach", quantity: 100, unit: "g" }
    ],
    instructions: [
      "Sauté onion and curry powder.",
      "Add chickpeas and coconut milk.",
      "Simmer for 15 minutes.",
      "Stir in spinach until wilted. Serve with rice."
    ],
    prepTime: 10, cookTime: 15, servings: 4, difficulty: "Easy",
    tags: ["Vegan", "Curry", "Protein"],
    source: "Mumbai Spice", public: true
  },
  {
    title: "Sweet Potato Tacos",
    description: "Roasted sweet potato and black bean tacos.",
    ingredients: [
      { name: "Sweet Potato", quantity: 2, unit: "piece" },
      { name: "Black Beans", quantity: 400, unit: "g" },
      { name: "Corn Tortilla", quantity: 8, unit: "piece" },
      { name: "Avocado", quantity: 1, unit: "piece" },
      { name: "Cilantro", quantity: 1, unit: "handful" }
    ],
    instructions: [
      "Roast sweet potato cubes until tender.",
      "Warm black beans with cumin.",
      "Fill tortillas with potatoes and beans.",
      "Top with avocado and cilantro."
    ],
    prepTime: 15, cookTime: 25, servings: 4, difficulty: "Easy",
    tags: ["Vegan", "Mexican", "Healthy"],
    source: "Healthy Tacos", public: true
  },
  {
    title: "Vegan Chili",
    description: "Spicy bean and vegetable chili.",
    ingredients: [
      { name: "Kidney Beans", quantity: 400, unit: "g" },
      { name: "Black Beans", quantity: 400, unit: "g" },
      { name: "Tomato", quantity: 800, unit: "g" },
      { name: "Bell Pepper", quantity: 2, unit: "piece" },
      { name: "Chili Powder", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Sauté peppers and onions in a pot.",
      "Add beans, tomatoes, and spices.",
      "Simmer for 45 minutes until thick.",
      "Serve with corn chips."
    ],
    prepTime: 15, cookTime: 45, servings: 6, difficulty: "Easy",
    tags: ["Vegan", "Spicy", "Hearty"],
    source: "Winter Warmth", public: true
  },
  {
    title: "Falafel",
    description: "Crispy fried chickpea balls.",
    ingredients: [
      { name: "Chickpeas", quantity: 400, unit: "g" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Parsley", quantity: 1, unit: "handful" },
      { name: "Cumin", quantity: 1, unit: "tsp" },
      { name: "Vegetable Oil", quantity: 500, unit: "ml" }
    ],
    instructions: [
      "Process chickpeas, garlic, and parsley into a paste.",
      "Form into small balls.",
      "Deep fry until brown and crispy.",
      "Serve in pita bread with tahini."
    ],
    prepTime: 20, cookTime: 10, servings: 4, difficulty: "Medium",
    tags: ["Vegan", "Appetizer", "Middle Eastern"],
    source: "Beirut Street", public: true
  },
  {
    title: "Zucchini Noodles with Pesto",
    description: "Low-carb vegan pasta alternative.",
    ingredients: [
      { name: "Zucchini", quantity: 3, unit: "piece" },
      { name: "Basil", quantity: 50, unit: "g" },
      { name: "Walnuts", quantity: 30, unit: "g" },
      { name: "Olive Oil", quantity: 50, unit: "ml" },
      { name: "Garlic", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Use a spiralizer to make zucchini noodles.",
      "Blend basil, walnuts, and oil to make pesto.",
      "Toss noodles with pesto in a warm pan for 2 minutes.",
      "Serve immediately."
    ],
    prepTime: 15, cookTime: 2, servings: 2, difficulty: "Easy",
    tags: ["Vegan", "Low-Carb", "Quick"],
    source: "Light Eats", public: true
  },
  {
    title: "Quinoa Salad",
    description: "Roasted vegetables with protein-rich quinoa.",
    ingredients: [
      { name: "Quinoa", quantity: 200, unit: "g" },
      { name: "Butternut Squash", quantity: 300, unit: "g" },
      { name: "Kale", quantity: 100, unit: "g" },
      { name: "Pomegranate", quantity: 50, unit: "g" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Cook quinoa and roast squash until tender.",
      "Massage kale with lemon juice and oil.",
      "Toss all ingredients together in a large bowl.",
      "Top with pomegranate seeds."
    ],
    prepTime: 15, cookTime: 25, servings: 4, difficulty: "Easy",
    tags: ["Vegan", "Salad", "Healthy"],
    source: "Modern Bowl", public: true
  },
  {
    title: "Mushroom Stroganoff",
    description: "Creamy mushroom sauce over pasta.",
    ingredients: [
      { name: "Mushroom", quantity: 400, unit: "g" },
      { name: "Coconut Milk", quantity: 200, unit: "ml" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Fusilli Pasta", quantity: 400, unit: "g" },
      { name: "Mustard Powder", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Sauté mushrooms and onions until brown.",
      "Add coconut milk and mustard; simmer for 5 minutes.",
      "Toss with cooked pasta.",
      "Garnish with parsley and serve."
    ],
    prepTime: 10, cookTime: 15, servings: 4, difficulty: "Easy",
    tags: ["Vegan", "Pasta", "Creamy"],
    source: "Russian Vegan", public: true
  },
  {
    title: "Cauliflower Steaks",
    description: "Thick roasted cauliflower slices.",
    ingredients: [
      { name: "Cauliflower", quantity: 1, unit: "piece" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" },
      { name: "Paprika", quantity: 1, unit: "tsp" },
      { name: "Turmeric", quantity: 0.5, unit: "tsp" },
      { name: "Garlic", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Cut cauliflower into 2cm thick slices.",
      "Brush with oil and spices.",
      "Roast at 200°C for 25 minutes, flipping once.",
      "Serve with a tahini drizzle."
    ],
    prepTime: 10, cookTime: 25, servings: 2, difficulty: "Easy",
    tags: ["Vegan", "Vegetable", "Roasted"],
    source: "Veggie Grill", public: true
  },
  {
    title: "Jackfruit Pulled Pork",
    description: "Vegan alternative to pulled pork using jackfruit.",
    ingredients: [
      { name: "Jackfruit", quantity: 400, unit: "g" },
      { name: "Baguette", quantity: 4, unit: "piece" }, // Bun substitute
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Apple Cider Vinegar", quantity: 1, unit: "tbsp" },
      { name: "Honey", quantity: 1, unit: "tbsp" } // Using honey substitute if available
    ],
    instructions: [
      "Shred jackfruit and sauté with onions.",
      "Add BBQ spices and vinegar; simmer for 20 minutes.",
      "Serve on toasted buns with coleslaw.",
      "Enjoy a meat-free BBQ classic."
    ],
    prepTime: 15, cookTime: 20, servings: 4, difficulty: "Medium",
    tags: ["Vegan", "Sandwich", "BBQ"],
    source: "Soul Food", public: true
  },
  {
    title: "Vegan Shepherd's Pie",
    description: "Lentil and vegetable pie topped with mashed potatoes.",
    ingredients: [
      { name: "Lentils", quantity: 200, unit: "g" },
      { name: "Potato", quantity: 500, unit: "g" },
      { name: "Carrot", quantity: 2, unit: "piece" },
      { name: "Pea", quantity: 100, unit: "g" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Make a lentil and veggie stew. Place in a baking dish.",
      "Mash boiled potatoes with oil and salt.",
      "Spread potatoes over the stew.",
      "Bake at 200°C for 20 minutes until peaked."
    ],
    prepTime: 30, cookTime: 30, servings: 6, difficulty: "Medium",
    tags: ["Vegan", "Hearty", "Baking"],
    source: "British Vegan", public: true
  },
  {
    title: "Buddha Bowl",
    description: "Balanced bowl with grains, greens, and protein.",
    ingredients: [
      { name: "Brown Rice", quantity: 200, unit: "g" },
      { name: "Chickpeas", quantity: 100, unit: "g" },
      { name: "Spinach", quantity: 1, unit: "handful" },
      { name: "Carrot", quantity: 1, unit: "piece" },
      { name: "Tahini", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Arrange rice, beans, and fresh veggies in a bowl.",
      "Drizzle with tahini and lemon juice.",
      "Top with seeds and enjoy a balanced meal."
    ],
    prepTime: 15, cookTime: 20, servings: 1, difficulty: "Easy",
    tags: ["Vegan", "Healthy", "Bowl"],
    source: "Zen Kitchen", public: true
  },
  {
    title: "Tempeh Stir-Fry",
    description: "Savory fermented soybean stir-fry.",
    ingredients: [
      { name: "Tempeh", quantity: 200, unit: "g" },
      { name: "Broccoli", quantity: 200, unit: "g" },
      { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
      { name: "Sesame Oil", quantity: 1, unit: "tbsp" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    instructions: [
      "Dice tempeh and stir-fry until brown.",
      "Add broccoli and garlic; cook for 5 minutes.",
      "Toss with soy sauce and sesame oil.",
      "Serve over brown rice."
    ],
    prepTime: 10, cookTime: 10, servings: 2, difficulty: "Easy",
    tags: ["Vegan", "Protein", "Stir-fry"],
    source: "Indonesian Delights", public: true
  },
  {
    title: "Vegan Lasagna",
    description: "Layered pasta with cashew cream and veggies.",
    ingredients: [
      { name: "Pasta Dough", quantity: 1, unit: "piece" }, // Lasagna sheets substitute
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Spinach", quantity: 200, unit: "g" },
      { name: "Cashews", quantity: 100, unit: "g" }, // For cream
      { name: "Mushroom", quantity: 200, unit: "g" }
    ],
    instructions: [
      "Blend soaked cashews to make a creamy sauce.",
      "Layer pasta, tomato sauce, spinach, and cashew cream.",
      "Repeat layers and bake at 180°C for 40 minutes."
    ],
    prepTime: 40, cookTime: 40, servings: 6, difficulty: "Hard",
    tags: ["Vegan", "Pasta", "Baked"],
    source: "Modern Vegan", public: true
  },
  {
    title: "Hummus Platter",
    description: "Chickpea dip served with veggies and bread.",
    ingredients: [
      { name: "Chickpeas", quantity: 400, unit: "g" },
      { name: "Tahini", quantity: 3, unit: "tbsp" },
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" },
      { name: "Pita Bread", quantity: 2, unit: "piece" }
    ],
    instructions: [
      "Blend chickpeas, tahini, lemon, and oil until smooth.",
      "Spread on a plate and drizzle with more oil.",
      "Serve with toasted pita and fresh veggies."
    ],
    prepTime: 15, cookTime: 0, servings: 4, difficulty: "Easy",
    tags: ["Vegan", "Appetizer", "Healthy"],
    source: "Mediterranean Eats", public: true
  },

  // FINAL MIX (97-100)
  {
    title: "Greek Salad",
    description: "Fresh Mediterranean salad with feta and olives.",
    ingredients: [
      { name: "Cucumber", quantity: 1, unit: "piece" },
      { name: "Tomato", quantity: 3, unit: "piece" },
      { name: "Feta", quantity: 100, unit: "g" },
      { name: "Onion", quantity: 0.5, unit: "piece" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Chop veggies into large chunks.",
      "Toss with oil and dried oregano.",
      "Top with a large block of feta cheese.",
      "Serve with crusty bread."
    ],
    prepTime: 10, cookTime: 0, servings: 2, difficulty: "Easy",
    tags: ["Mediterranean", "Salad", "Fresh"],
    source: "Greek Island", public: true
  },
  {
    title: "Roasted Chicken",
    description: "Whole roasted chicken with herbs.",
    ingredients: [
      { name: "Chicken Drumstick", quantity: 6, unit: "piece" }, // Whole chicken substitute
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Rosemary", quantity: 2, unit: "sprig" },
      { name: "Garlic", quantity: 4, unit: "clove" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    instructions: [
      "Rub chicken with butter, garlic, and herbs.",
      "Place in a roasting pan with lemon wedges.",
      "Roast at 200°C for 45 minutes until juices run clear.",
      "Let rest before serving."
    ],
    prepTime: 15, cookTime: 45, servings: 4, difficulty: "Medium",
    tags: ["Classic", "Meat", "Roasted"],
    source: "Sunday Dinner", public: true
  },
  {
    title: "Fish and Chips",
    description: "Crispy battered fish with thick-cut fries.",
    ingredients: [
      { name: "Cod", quantity: 400, unit: "g" },
      { name: "Potato", quantity: 4, unit: "piece" },
      { name: "Wheat Flour", quantity: 100, unit: "g" },
      { name: "Vegetable Oil", quantity: 1, unit: "l" },
      { name: "Salt", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Cut potatoes into chips and fry until golden.",
      "Make a batter with flour and water.",
      "Dip fish in batter and fry until crispy.",
      "Serve with salt and vinegar."
    ],
    prepTime: 20, cookTime: 20, servings: 2, difficulty: "Medium",
    tags: ["British", "Fish", "Fried"],
    source: "London Pub", public: true
  },
  {
    title: "Grilled Salmon",
    description: "Simple salmon fillets with asparagus.",
    ingredients: [
      { name: "Salmon", quantity: 2, unit: "piece" },
      { name: "Asparagus", quantity: 1, unit: "sprig" }, // Using sprig as bunch substitute
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Olive Oil", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Season salmon with salt and pepper.",
      "Grill salmon for 4 minutes per side.",
      "Toss asparagus in oil and grill until tender.",
      "Serve with lemon slices."
    ],
    prepTime: 10, cookTime: 10, servings: 2, difficulty: "Easy",
    tags: ["Healthy", "Fish", "Grilled"],
    source: "Ocean Grill", public: true
  }
];

// Dynamically generate the remaining recipes to reach 100
// Since we have 100 titles planned, I have included all of them above.
// Wait, let me check the count.
// Breakfast: 14
// Italian: 14 (15-28)
// Asian: 14 (29-42)
// Mexican: 14 (43-56)
// French: 10 (57-66)
// Desserts: 15 (67-81)
// Vegan: 15 (82-96)
// Final Mix: 4 (97-100)
// Total: 100. Perfect.

const seedRecipes = async () => {
  try {
    await connectDB();
    console.log("Database connected for seeding recipes...");

    // 1. Ensure Seed User exists
    let seedUser = await User.findOne({ email: "seeduser@example.com" });
    if (!seedUser) {
      seedUser = await User.create({
        name: "Seed User",
        email: "seeduser@example.com",
        password: "password123",
        role: 1
      });
      console.log("Created Seed User.");
    }
    const seedUserId = seedUser._id;

    // 2. Fetch all ingredients for mapping
    const allIngredients = await Ingredient.find({});
    const ingredientMap = {};
    allIngredients.forEach(ing => {
      ingredientMap[ing.name.toLowerCase()] = ing._id;
    });

    const fallbackIngId = allIngredients.length > 0 ? allIngredients[0]._id : null;
    if (!fallbackIngId) {
      throw new Error("No ingredients found in DB. Seed ingredients first!");
    }

    // 3. Clear existing recipes
    await Recipe.deleteMany({});
    console.log("Cleared existing recipes.");

    // 4. Map names to IDs and prepare for insertion
    const preparedRecipes = recipesData.map(r => {
      const mappedIngredients = r.ingredients.map(ing => {
        const id = ingredientMap[ing.name.toLowerCase()];
        if (!id) {
          console.warn(`Ingredient not found: ${ing.name}. Using fallback.`);
        }
        return {
          item: id || fallbackIngId,
          quantity: ing.quantity,
          unit: ing.unit
        };
      });

      const recipeId = new mongoose.Types.ObjectId();
      return {
        _id: recipeId,
        ...r,
        ingredients: mappedIngredients,
        author: seedUserId,
        original_author: seedUserId,
        original_recipe: recipeId, // Self-reference for original recipes
        source: r.source || "Original"
      };
    });

    // 5. Insert Many
    await Recipe.insertMany(preparedRecipes);
    console.log(`Successfully seeded ${preparedRecipes.length} recipes!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding recipes:", error);
    process.exit(1);
  }
};

seedRecipes();
